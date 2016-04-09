var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");
var urls = {}

var polyform = "http://polyratings.com/search.phtml?";

request(polyform, function (error, response, body) {
   if(!err && resp.satusCode == 200) {
      var $ = cheerio.load(body);
      $('a.title', '#siteTable').each(function() {
      
         var url = this.attr('href');
         
         if(url.indexOf('') != -1) {
            urls.push(url);
         }
      });

      for(var i = 0; i < urls.length; i++) {
         request(urls[i]).pipe(fs.createWriteStream('' + i + ''));
      }
   }
});
