var request = require('request');
var cheerio = require('cheerio');

var url = "http://polyratings.com/stats.phtml?profid=778";

request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        //console.log(body);
        $ = cheerio.load(body);
        var thing = $('font');
        //console.log(thing);
        //console.log("overall statistics");
        //console.log("Total evaluations: " + thing[28].children[0].data);
        //console.log("Mean: " + thing[30].children[0].data);
        //console.log("Mode: " + thing[34].children[0].data);
        //console.log("Standard Deviation: " + thing[36].children[0].data);

        //console.log("ability to present material");
        //console.log("Mean: " + thing[40].children[0].data);
        //console.log("Mode: " + thing[44].children[0].data);
        //console.log("Standard Deviation: " + thing[46].children[0].data);

        //console.log("ability to present material");
        //console.log("Mean: " + thing[50].children[0].data);
        //console.log("Mode: " + thing[54].children[0].data);
        //console.log("Standard Deviation: " + thing[56].children[0].data);

        for (var i = 0; i < 100; i++) {
            if (thing[i] && thing[i].children && thing[i].children.length > 0) {
                console.log(i + ' ' + thing[i].children[0].data);
            }
        }
    }
});
