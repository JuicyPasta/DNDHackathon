var request = require('request');
var cheerio = require('cheerio');

module.exports = function (cb) {

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

    request(url, function (error, response, body) {
        if (err)
            return cb(error, null);
        if (response.statusCode != 200)
            return cb("http error", null);

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

            cb(null, data);
        }
    });
};
