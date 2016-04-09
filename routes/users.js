var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var profsids = require('../profids.js');

var fs = require('fs');

/* GET users listing. */
router.get(/\/.*/, function(req, res, next) {
    console.log(req.url);
    
    console.log(profsids);
    var url = "http://polyratings.com/stats.phtml?profid=778";

    var data = {
        teacher:"John Alongi",
        department:"Mathematics Department at Cal Poly, SLO",
        totalEvals:53,
        overall:{
            mean:3.660,
            mode:4,
            stdDev:0.200,
        },
        presentation:{
            mean:3.660,
            mode:4,
            stdDev:0.200,
        },
        understandingness:{
            mean:3.660,
            mode:4,
            stdDev:0.200,
        },

    };
    data.photo = data.teacher.split(' ').join('') + ".jpg";
    data.cloud = data.teacher.split(' ').join('') + "Cloud.svg";
    data.cloud = "MammenKurtCloud.svg";
    console.log(data.cloud);

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            $ = cheerio.load(body);
            var tds = $('td');
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
            var temp = data.teacher.split(' ');
            var id = profsids(temp[1] + temp[0]);
            console.log(temp);
            console.log(id);

            res.send(data);

        }
    });


});


module.exports = router;
