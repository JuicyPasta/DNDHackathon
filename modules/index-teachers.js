var fs = require("fs");
var request = require('request');
var cheerio = require('cheerio');

var formurl = "http://polyratings.com/list.phtml";
var profs = {};

function init() {
    request(formurl, function (error, response, body) {
        if(!error && response.statusCode == 200) {
            var hrefs = cheerio.load(body)("a");
            var profIds = {};

            for(var i = 5; i < hrefs.length - 1; i++) {
                var name = hrefs[i].children[0].data.split(', ').join('');
                profs[name] = hrefs[i].attribs.href.split("=")[1];
            }
        }

        // corrections
        profs.GerfenJeffrey = 946;
        profs.MammenKurt = 970;
        profs.KearnsTimothy = 334;
        profs.JaniMeera = 4056;
    });
}

module.exports = { 
    getId: function getId(name) { return profs[name]; },
    profs: profs, 
    init: init,
};
