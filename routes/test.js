var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");
var urls = {};

var name = "Johnson";
var formurl = "http://polyratings.com/search.phtml";

request({uri: formurl, method: "POST", form: {name: name}}, function (error, response, body) {
   if(!error && response.statusCode == 200) {
      var $ = cheerio.load(body);
      var url = $('header');
      console.log(url);
      var profids = {};

      if(url.indexOf("phtml") == -1) {
         profids.push(url.split("profid=")[1]);
      }
      else {
         var hrefs = $("a");
         for(var i = 0; i < hrefs.length; i++) {
            profids[i] = hrefs[i].children[0];
            console.log(hrefs[i]);
         }
      }
   }
});
