var fs = require("fs");
var request = require('sync-request');
var cheerio = require('cheerio');

var formurl = "http://polyratings.com/list.phtml";
var profs = {};

var response = request('GET', formurl);
var body = response.body.toString('utf8');

if(response && response.statusCode == 200) {
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


function getId(name) { return profs[name]; }

module.exports = { 
    getId: getId,
    profs: profs,
};
