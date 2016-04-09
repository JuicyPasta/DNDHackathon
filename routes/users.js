var express = require('express');
var router = express.Router();
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res, next) {
    var url = "http://polyratings.com/stats.phtml?profid=778";

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body);
        }
    });

    res.render('index');
});

module.exports = router;
