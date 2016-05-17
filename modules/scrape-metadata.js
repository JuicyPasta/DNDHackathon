// everything the PASS card and the teacher page need for one prof
var fs = require('fs');
var path = require('path');
var polyratings = require('./polyratings.js');
var teachers = require('./index-teachers.js');
var cloud = require('./cloud.js');

var PHOTOS = path.join(__dirname, '..', 'photos');
var SAMPLE = path.join(__dirname, '..', 'data', 'sample.json');

function sampleCard(id) {
    if (!fs.existsSync(SAMPLE)) return null;
    var cards = JSON.parse(fs.readFileSync(SAMPLE, 'utf8')).cards;
    return cards[id] || null;
}

function fixed(n) {
    return typeof n === 'number' ? n.toFixed(2) : '?';
}

function blank(name) {
    return {
        found: false,
        id: null,
        key: name,
        teacher: name,
        department: 'unknown',
        totalEvals: '< 5',
        overall: { mean: '?' },
        presentation: { mean: '?' },
        understandingness: { mean: '?' },
        grades: { A: 0, B: 0, C: 0, D: 0, F: 0 },
        courses: [],
        tags: [],
        reviews: [],
        words: {},
        photo: 'Unknown.jpg',
        cloud: 'UnknownCloud.svg',
        link: 'https://www.google.com/search?q=' + encodeURIComponent(name + ' site:polyratings.dev'),
    };
}

function fromProf(prof) {
    var key = teachers.key(prof.lastName, prof.firstName);
    var data = blank(key);
    data.found = true;
    data.id = prof.id;
    data.teacher = prof.firstName + ' ' + prof.lastName;
    data.department = prof.department;
    data.totalEvals = prof.numEvals;
    data.overall.mean = fixed(prof.overallRating);
    data.presentation.mean = fixed(prof.materialClear);
    data.understandingness.mean = fixed(prof.studentDifficulties);
    data.courses = prof.courses || [];
    data.tags = Object.keys(prof.tags || {})
        .sort(function (a, b) { return prof.tags[b] - prof.tags[a]; })
        .filter(function (t) { return prof.tags[t] > 0; })
        .slice(0, 3);
    data.link = 'https://polyratings.dev/professor/' + prof.id;

    // cross listed classes (CPE 101 / CSC 101) show the same review twice
    var all = [];
    var seen = {};
    Object.keys(prof.reviews || {}).forEach(function (course) {
        prof.reviews[course].forEach(function (r) {
            if (seen[r.id]) return;
            seen[r.id] = true;
            // old reviews are ISO dates, new ones are "Sat Mar 22 2025 17:23:49 GMT+0000 (...)"
            var date = new Date(r.postDate);
            all.push({ course: course, grade: r.grade, text: r.rating, date: isNaN(date) ? r.postDate : date.toISOString() });
            if (data.grades.hasOwnProperty(r.grade)) data.grades[r.grade]++;
        });
    });
    all.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    // the short ones are mostly "BADD!!!111", skip those
    data.reviews = all.filter(function (r) { return r.text.length > 80; }).slice(0, 6);

    var words = [];
    all.forEach(function (r) {
        words = words.concat(r.text.replace(/&#039;/g, "'").replace(/[^a-zA-Z']/g, ' ').split(' '));
    });
    var counts = cloud.countWords(words);
    Object.keys(counts)
        .sort(function (a, b) { return counts[b] - counts[a]; })
        .slice(0, 80)
        .forEach(function (w) { data.words[w] = counts[w]; });
    return data;
}

function decorate(data, cb) {
    if (fs.existsSync(path.join(PHOTOS, data.key + '.jpg'))) data.photo = data.key + '.jpg';

    var sizes = cloud.countsToSizes(data.words);
    if (!data.found || !sizes.length) return cb(null, data);
    if (cloud.exists(data.key)) {
        data.cloud = data.key + 'Cloud.svg';
        return cb(null, data);
    }
    cloud.generate(data.key, sizes, function (err, file) {
        if (!err) data.cloud = file;
        cb(null, data);
    });
}

// name like "DalbeyJohn" -> cb(err, data)
module.exports = function (name, cb) {
    teachers.ready.then(function () {
        var prof = teachers.find(name);
        if (!prof) return decorate(blank(name), cb);

        polyratings.professor(prof.id).then(function (full) {
            decorate(fromProf(full), cb);
        }).catch(function (err) {
            console.log('no reviews for ' + name + ': ' + err.message);
            var card = sampleCard(prof.id);
            decorate(card || fromProf(prof), cb);
        });
    });
};

module.exports.fromProf = fromProf;
