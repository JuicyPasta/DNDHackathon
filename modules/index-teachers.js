// builds the name -> prof lookup. keys look like "DalbeyJohn" which is what the
// extension sends over (PASS shows "Dalbey,John").
var fs = require('fs');
var path = require('path');
var polyratings = require('./polyratings.js');

var profs = {};
var SAMPLE = path.join(__dirname, '..', 'data', 'sample.json');

function key(last, first) {
    return (last + first).replace(/[^a-zA-Z]/g, '');
}

function add(list) {
    list.forEach(function (p) {
        profs[key(p.lastName, p.firstName)] = p;
    });
}

function loadSample() {
    if (!fs.existsSync(SAMPLE)) return false;
    add(JSON.parse(fs.readFileSync(SAMPLE, 'utf8')).professors);
    return true;
}

var ready = polyratings.allProfessors().then(function (list) {
    add(list);
    console.log('indexed ' + list.length + ' teachers from polyratings');
}).catch(function (err) {
    console.log("couldn't get the teacher list (" + err.message + '), using data/sample.json');
    loadSample();
});

// exact match first, then "Kearns,Timothy" vs "Kearns, Tim" type stuff
function find(name) {
    if (!name) return null;
    var wanted = name.replace(/[^a-zA-Z]/g, '');
    if (profs[wanted]) return profs[wanted];

    var lower = wanted.toLowerCase();
    var best = null;
    Object.keys(profs).forEach(function (k) {
        var p = profs[k];
        var last = p.lastName.replace(/[^a-zA-Z]/g, '').toLowerCase();
        var first = p.firstName.replace(/[^a-zA-Z]/g, '').toLowerCase();
        if (lower.indexOf(last) !== 0) return;
        var rest = lower.slice(last.length);
        if (rest && (first.indexOf(rest) === 0 || rest.indexOf(first) === 0)) {
            if (!best || p.numEvals > best.numEvals) best = p;
        }
    });
    return best;
}

function getId(name) {
    var p = find(name);
    return p ? p.id : undefined;
}

function search(str, limit) {
    var words = str.toLowerCase().split(/\s+/).filter(Boolean);
    var hits = [];
    Object.keys(profs).forEach(function (k) {
        var p = profs[k];
        var hay = (p.firstName + ' ' + p.lastName + ' ' + p.department + ' ' + p.courses.join(' ')).toLowerCase();
        if (words.every(function (w) { return hay.indexOf(w) > -1; })) hits.push(k);
    });
    hits.sort(function (a, b) { return profs[b].numEvals - profs[a].numEvals; });
    return hits.slice(0, limit || 10);
}

module.exports = {
    getId: getId,
    find: find,
    search: search,
    key: key,
    profs: profs,
    ready: ready,
};
