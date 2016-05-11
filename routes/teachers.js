var express = require('express');
var router = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var teachersearch = require('../modules/index-teachers.js').getId;

var fs = require('fs');

router.get('/LorraineDonegan.html', function(req, res, next) {
   res.render('LorraineDonegan');
});

router.post('/teacherQuery/:search', function(req, res, next) {
   console.log("received teacher query in teachers.js");
   var teacherMap = teachersearch(req.params.searchString);
    // console.log(teacherMap);
   var matchTeachers = { };
   var teachers = Object.keys(teacherMap);
   var searchString = req.params.search;
   // console.log("lenght of teachgers is " + teachers.length);
   for (teacherNdx = 0; teacherNdx < teachers.length; teacherNdx++) {
      // console.log("teacherNdx is " + teacherNdx);
      var teacherName = teachers[teacherNdx];
      // console.log("teacher name is " + teacherName);
      // console.log("lower case name is " + teacherName.toLowerCase());
      // console.log("lower case search string is " + searchString.toLowerCase());
      // console.log("checking if teacher |" + teacherName.toLowerCase() + "| contains " + searchString.toLowerCase());
      if (teacherName.toLowerCase().indexOf(searchString.toLowerCase()) > -1) {
         // console.log(teacherName);
         matchTeachers[teacherName] = teacherMap[teacherName];
         
      }
   }
   // console.log('in teahcerQuery map is ' + teacherMap);
   console.log("FINAL MATTCH TEACHERS IS " + matchTeachers);
   res.send(matchTeachers);
});


module.exports = router;
