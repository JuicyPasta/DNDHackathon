// pre-builds word clouds into clouds/ (the server also makes them on demand)
//   node scrape-clouds.js          CSC and CPE
//   node scrape-clouds.js MATH
var scrape = require('./modules/comment-scrape.js');
var teachers = require('./modules/index-teachers.js');
var cloud = require('./modules/cloud.js');

var depts = process.argv.slice(2).map(function (d) { return d.toUpperCase(); });
if (!depts.length) depts = ['CSC', 'CPE'];

teachers.ready.then(async function () {
    var keys = Object.keys(teachers.profs).filter(function (k) {
        return depts.indexOf(teachers.profs[k].department) > -1;
    });

    for (var i = 0; i < keys.length; i++) {
        var teacher = keys[i];
        await new Promise(function (done) {
            scrape(teachers.profs[teacher].id, function (err, words) {
                if (err) {
                    console.log('skipped ' + teacher + ': ' + err);
                    return done();
                }
                cloud.generate(teacher, cloud.parseWords(words), function () {
                    console.log('cloud generated for: ' + teacher);
                    done();
                });
            });
        });
    }
});
