var express = require('express');
var router = express.Router();
var teachers = require('../modules/index-teachers.js');
var summary = require('./teachers.js').summary;

var colleges = {
    agriculture: { name: 'Agriculture, Food & Environmental Sciences', depts: ['AEPS', 'AGB', 'AGC', 'AGED', 'ASCI', 'BRAE', 'FSN', 'NR', 'WVIT'] },
    architecture: { name: 'Architecture & Environmental Design', depts: ['ARCH', 'ARCE', 'CM', 'CRP', 'LA'] },
    business: { name: 'Orfalea College of Business', depts: ['BUS', 'ECON', 'GSB'] },
    engineering: { name: 'Engineering', depts: ['AERO', 'BMED', 'CE', 'CPE', 'CSC', 'EE', 'ENGR', 'ENVE', 'IME', 'MATE', 'ME'] },
    liberalArts: { name: 'Liberal Arts', depts: ['ANT', 'ART', 'CD', 'CHIN', 'COMS', 'DANC', 'ENGL', 'ES', 'FR', 'GEOG', 'GER', 'GRC', 'HIST', 'ISLA', 'ITAL', 'JOUR', 'JPNS', 'MU', 'PHIL', 'POLS', 'PSY', 'RELS', 'SOC', 'SPAN', 'SS', 'TH', 'WGQS', 'WGS', 'WLC'] },
    scienceAndMath: { name: 'Science & Mathematics', depts: ['BIO', 'BOT', 'CHEM', 'DSCI', 'HLTH', 'KINE', 'LS', 'MATH', 'MCRO', 'MSCI', 'PHYS', 'PSC', 'STAT'] },
};

/* GET home page. */
router.get('/', function (req, res) {
    res.render('home');
});

router.get('/colleges/:college', function (req, res, next) {
    var college = colleges[req.params.college];
    if (!college) return next();
    teachers.ready.then(function () {
        var keys = Object.keys(teachers.profs).filter(function (k) {
            return college.depts.indexOf(teachers.profs[k].department) > -1;
        });
        keys.sort(function (a, b) { return teachers.profs[b].numEvals - teachers.profs[a].numEvals; });
        res.render('college', { college: college, list: keys.slice(0, 60).map(summary) });
    });
});

module.exports = router;
