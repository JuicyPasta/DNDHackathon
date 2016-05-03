var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");
var scrape = require('./scraper');
var cloud = require('./generateCloud');
var urls = {};

var formurl = "http://polyratings.com/list.phtml";
var profs = {};

request(formurl, function (error, response, body) {
    if(!error && response.statusCode == 200) {
        var $ = cheerio.load(body);
        var hrefs = $("a");
        var profIds = {};
        //console.log(hrefs[5].attribs.href);
        for(var i = 5; i < hrefs.length - 1; i++) {
            var name = hrefs[i].children[0].data; 
            name = name.split(', ');
            name = name.join('');

            profs[name] = hrefs[i].attribs.href.split("=")[1];
        }
    }

    // corrections
    profs.GerfenJeffrey = 946;
    profs.MammenKurt = 970;
    profs.KearnsTimothy = 334;
    profs.JaniMeera = 4056;

    for (var teacher in profs) {
        if (profs.hasOwnProperty(teacher)) {
            console.log(teacher);

            (function(teacher) {
                if (teacher[0] == 'A')
                scrape(profs[teacher], function (err, data, id) {
                    if (!err) {
                        cloud(teacher, data, function () {
                            console.log('cloud generated for: ' + teacher);
                        });
                    }
                });
            })(teacher);

        }
    }

});


module.exports = function getId(name) {
    return profs[name];
};
