var express = require('express');
var router = express.Router();
var scrapeData = require('../modules/scrape-metadata.js');
var cache = require('../modules/cache.js');
var cloud = require('../modules/cloud.js');

// the extension calls this from PASS
router.use(function (req, res, next) {
    res.set('Access-Control-Allow-Origin', '*');
    next();
});

/* GET /users/DalbeyJohn */
router.get('/:teacher', function (req, res) {
    var teacher = req.params.teacher.replace(/[^a-zA-Z]/g, '');
    if (!teacher) return res.sendStatus(404);

    cache.get('teacher:' + teacher).then(function (data) {
        // redis remembers the card but someone cleaned out clouds/, make it again
        if (data && data.cloud !== 'UnknownCloud.svg' && !cloud.exists(data.key)) data = null;

        if (data) {
            console.log('found old data!');
            return res.json(data);
        }

        console.log('making new data');
        scrapeData(teacher, function (err, data) {
            if (err) return res.sendStatus(500);
            delete data.words;
            cache.set('teacher:' + teacher, data).catch(function () {});
            res.json(data);
        });
    }).catch(function () {
        res.sendStatus(500);
    });
});

module.exports = router;
