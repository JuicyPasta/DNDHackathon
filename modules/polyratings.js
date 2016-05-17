// talks to the new PolyRatings (polyratings.dev). the old .phtml pages we used to
// scrape are gone, but the site has a public tRPC api now, so we just ask it nicely.
// everything gets cached to data/cache so we only hit it once per prof.
var fs = require('fs');
var path = require('path');

var API = process.env.POLYRATINGS_API || 'https://api-prod.polyratings.org/';
var CACHE_DIR = path.join(__dirname, '..', 'data', 'cache');
var MAX_AGE = 7 * 24 * 60 * 60 * 1000; // a week
var OFFLINE = !!process.env.OFFLINE;

// one request at a time, at least 500ms apart
var queue = Promise.resolve();
var lastRequest = 0;

function cachePath(name) {
    return path.join(CACHE_DIR, name.replace(/[^a-zA-Z0-9.-]/g, '_') + '.json');
}

function readCache(name, ignoreAge) {
    var file = cachePath(name);
    if (!fs.existsSync(file)) return null;
    if (!ignoreAge && Date.now() - fs.statSync(file).mtimeMs > MAX_AGE) return null;
    return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeCache(name, data) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    fs.writeFileSync(cachePath(name), JSON.stringify(data));
}

function call(procedure, input) {
    var url = API + procedure;
    if (input) url += '?input=' + encodeURIComponent(JSON.stringify(input));

    var job = queue.then(async function () {
        var wait = lastRequest + 500 - Date.now();
        if (wait > 0) await new Promise(function (r) { setTimeout(r, wait); });
        lastRequest = Date.now();

        var res = await fetch(url, {
            headers: { 'user-agent': 'mustang-marks (old hackathon project, local dev)' },
            signal: AbortSignal.timeout(20000),
        });
        if (!res.ok) throw new Error('polyratings said ' + res.status + ' for ' + procedure);
        var body = await res.json();
        return body.result.data;
    });
    queue = job.catch(function () {});
    return job;
}

async function cached(name, procedure, input) {
    var hit = readCache(name);
    if (hit) return hit;
    if (OFFLINE) {
        var stale = readCache(name, true);
        if (stale) return stale;
        throw new Error('offline and nothing cached for ' + name);
    }
    try {
        var data = await call(procedure, input);
        writeCache(name, data);
        return data;
    } catch (err) {
        // better old data than no data
        var old = readCache(name, true);
        if (old) return old;
        throw err;
    }
}

// every prof, no reviews (~1MB)
function allProfessors() {
    return cached('professors', 'professors.all');
}

// one prof with all the reviews
function professor(id) {
    return cached('prof-' + id, 'professors.get', { id: id });
}

module.exports = {
    allProfessors: allProfessors,
    professor: professor,
    readCache: readCache,
};
