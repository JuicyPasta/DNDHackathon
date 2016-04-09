var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index');
});

router.get('/teacher/.*fly$/', function(req, res, next) {
    console.log('/.*fly$/');

    res.render('index', { title: 'Express' });
});

module.exports = router;
