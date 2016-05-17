// warms up data/cache from polyratings.dev so the server doesn't have to.
//   node scrape.js              CSC and CPE profs
//   node scrape.js MATH EE      whatever departments you want
//   node scrape.js --sample     rebuild data/sample.json (the profs on demo/pass.html)
// one request at a time, half a second apart, cached for a week.
var fs = require('fs');
var path = require('path');
var polyratings = require('./modules/polyratings.js');
var teachers = require('./modules/index-teachers.js');
var fromProf = require('./modules/scrape-metadata.js').fromProf;

var args = process.argv.slice(2);

async function sample() {
    var html = fs.readFileSync(path.join(__dirname, 'demo', 'pass.html'), 'utf8');
    var names = [];
    html.replace(/<td>([A-Za-z'-]+,[A-Za-z'-]+)<\/td>/g, function (m, name) { names.push(name); });

    var out = { professors: [], cards: {} };
    for (var i = 0; i < names.length; i++) {
        var prof = teachers.find(names[i]);
        if (!prof) { console.log('not on polyratings: ' + names[i]); continue; }
        var card = fromProf(await polyratings.professor(prof.id));
        card.reviews = []; // just the numbers and word counts, not people's reviews
        out.professors.push(prof);
        out.cards[prof.id] = card;
        console.log('sampled ' + card.teacher);
    }
    fs.writeFileSync(path.join(__dirname, 'data', 'sample.json'), JSON.stringify(out, null, 1));
    console.log('wrote data/sample.json (' + out.professors.length + ' profs)');
}

async function departments(depts) {
    var list = await polyratings.allProfessors();
    var todo = list.filter(function (p) { return depts.indexOf(p.department) > -1; });
    console.log(todo.length + ' profs in ' + depts.join(', '));
    for (var i = 0; i < todo.length; i++) {
        await polyratings.professor(todo[i].id);
        if (i % 10 === 0) console.log(i + '/' + todo.length);
    }
    console.log('done, everything is in data/cache');
}

teachers.ready.then(function () {
    if (args[0] === '--sample') return sample();
    return departments(args.length ? args.map(function (d) { return d.toUpperCase(); }) : ['CSC', 'CPE']);
}).catch(function (err) {
    console.log('scrape failed: ' + err.message);
    process.exitCode = 1;
});
