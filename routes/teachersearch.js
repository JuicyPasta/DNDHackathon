var express = require("express");
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var fs = require("fs");
var teachers = require("../profids.js");

router.get(/\/.*/, function (searchStr) {
      var matchedTeachers = {};
      var index = 0;
      
      searchStr = "Johnson";

      for(var i = 0; i < teachers.length; i++) {
       
         if(teachers[i].indexOf(searchStr) > -1) {
            matchedTeachers[index] = teachers[i];
            console.log(matchedTeachers[index]);
            index++;
         }
      }

      return matchedTeachers;
});

module.exports = router;
