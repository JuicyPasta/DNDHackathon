var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var profsids = require('../modules/index-teachers.js');
var scraper = require('../modules/comment-scrape.js');
var redis = require('redis');
var fs = require('fs');

var redisEndpoint = '127.0.0.1';
var client = redis.createClient(6379, redisEndpoint, {no_ready_check: true});

var baseStatUrl = "http://polyratings.com/stats.phtml?profid=";

/* GET users listing. */
router.get(/\/.*/, function(req, res, next) {
    console.log("HI");
    var originalUrl = req.originalUrl;
    var teacher = originalUrl.split('/')[2];
    var profId = profsids.getId(teacher);


    if (!profId) {
        return res.send(500);
    }

    client.get(profId, (err, data) => {
        if (err) {
            res.send(500);
        } else if (data) {
            console.log("found old data!");
            res.send(data);
        } else {
            console.log("making new data");

            scrapeData(profId, (err, data) => {
                client.set(profId, data);
            });
        }
    });
});

function scrapeData(profId, cb) {
    var url = baseStatUrl + profId;
    var data = {
        found:false,
        id:profId,
        teacher: teacher,
        department:"unknown",
        totalEvals: "< 5",
        overall:{
            mean:"?",
            mode:"?",
            stdDev:"?",
        },
        presentation:{
            mean:"?",
            mode:"?",
            stdDev:"?",
        },
        understandingness:{
            mean:"?",
            mode:"?",
            stdDev:"?",
        },

        photo:"Unknown.jpg",
        cloud:"UnknownCloud.svg",

        grades: {
            "A":"0",
            "B":"0",
            "C":"0",
            "D":"0",
            "F":"0",
        },
    };

    if (fs.existsSync('./photos/' + data.teacher.split(' ').join('') + '.jpg')) {
        data.photo = data.teacher.split(' ').join('') + ".jpg";
        console.log("photo " + data.photo);
    }
    if (fs.existsSync('./clouds/' + data.teacher.split(' ').join('') + 'Cloud.svg')) {
        data.cloud = data.teacher.split(' ').join('') + "Cloud.svg";
        console.log("cloud " +data.cloud);
    }

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            $ = cheerio.load(body);
            var tds = $('td');
            if (tds[28] && tds[28].children[0].data.trim() !== undefined) {
                data.found = true;
                data.totalEvals = tds[28].children[0].data.trim();
                data.overall.mean = tds[30].children[0].data;
                data.overall.mode = tds[34].children[0].data;
                data.overall.stdDev = tds[36].children[0].data;

                data.presentation.mean = tds[40].children[0].data;
                data.presentation.mode = tds[44].children[0].data;
                data.presentation.stdDev = tds[46].children[0].data;

                data.understandingness.mean = tds[50].children[0].data;
                data.understandingness.mode = tds[54].children[0].data;
                data.understandingness.stdDev = tds[56].children[0].data;

                var deptSelect = $('font');
                data.department = deptSelect[3].children[0].data;
                data.teacher = deptSelect[2].children[0].data;
                console.log(data.teacher);

                var thing = $('u');

                var j = 3;
                while ((thing[j].children[0].data).indexOf("Receiving") > -1 && data.grades.hasOwnProperty(thing[j].children[0].data.split("'")[1])) {
                    data.grades[thing[j].children[0].data.split("'")[1]] = tds[28 + 11 * j].children[0].data;
                    j++;
                }
            }

            cb(null, data);

        } else {
            cb(error);
        }
    });

}

module.exports = router;
