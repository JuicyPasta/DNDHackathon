var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");
var urls = {};

var formurl = "http://polyratings.com/list.phtml";
var profs = {};

request(formurl, function (error, response, body) {
   if(!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var hrefs = $("a");
      var profIds = {};
      console.log(hrefs[5].attribs.href);
      for(var i = 5; i < hrefs.length - 1; i++) {
        var name = hrefs[i].children[0].data; 
        name = name.split(', ');
        name = name.join('');

         profs[name] = hrefs[i].attribs.href.split("=")[1];
      }
   }
});

profs.GerfenJeffrey = 946;
profs.MammenKurt = 970;
module.exports = function getId(name) {
    return profs[name];
};
