var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");
var urls = {}

var name = "Staley";
var formurl = "http://polyratings.com/list.phtml";

request({uri: formurl, method: "POST", form: {name: name}}, function (error, response, body) {
   if(!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var hrefs = $("a");
      var profIds = {};
      var profNames = {};
      var profNamesIds = {};

      console.log(hrefs[2447].children[5].data);
      for(var i = 5; i < hrefs.length - 1; i++) {
         profNames[i - 5] = hrefs[i].children[0].data;
         profIds[i - 5] = hrefs[i].children[5].data;
      }
     
      profNamesIds[0] = profNames;
      profNamesIds[1] = profIds;
      console.log(profNamesIds[0][2442]);
   }
});
