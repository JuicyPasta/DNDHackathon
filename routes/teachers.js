var express = require('express');
var router = express.Router();
var teachers = require('../modules/index-teachers.js');
var scrapeData = require('../modules/scrape-metadata.js');

function summary(key) {
    var p = teachers.profs[key];
    return {
        key: key,
        name: p.firstName + ' ' + p.lastName,
        department: p.department,
        rating: p.overallRating,
        totalEvals: p.numEvals,
    };
}

router.post('/teacherQuery/:search', function (req, res) {
    teachers.ready.then(function () {
        res.json(teachers.search(req.params.search, 8).map(summary));
    });
});

router.get('/:teacher.html', function (req, res, next) {
    scrapeData(req.params.teacher, function (err, data) {
        if (err) return next(err);
        if (!data.found) return next();
        res.render('teacher', { t: data });
    });
});

router.summary = summary;
module.exports = router;
