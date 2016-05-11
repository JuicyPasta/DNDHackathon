var scrape = require('./modules/comment-scrape.js');
var teachers = require('./modules/index-teachers.js');
var Canvas = require("canvas");
var cloudgen = require('d3-cloud');
var fs = require('fs');

var width = 250;
var height = 250;

var profs = teachers.profs;

for (var teacher in profs) {
    if (profs.hasOwnProperty(teacher)) {
        (function(teacher) {
            if (teacher[0] == 'A' && teacher [1] == 'n')
            scrape(profs[teacher], function (err, data, id) {
                if (!err) {
                    generate(teacher, data, function () {
                        console.log('cloud generated for: ' + teacher);
                    });
                }
            });
        })(teacher);
    }
}

function generate(fileName, wordMap, cb) {
    var outStream = fs.createWriteStream(__dirname + '/clouds/' + fileName + '.png');
    var canvas = new Canvas(width,height);
    
    var words = [];

    for (var word in wordMap) {
        var curWord = {text: word, size: 10 + wordMap[word] * 20};
        words.push(curWord);
    }
    //console.log(words);

    var colors = ['#3498DB', '#1478BB', '#00589B', '#54A8FB', '#74C8FF'];

    cloudgen().size([width, height])
        .canvas(function() { return canvas;})
        .words(words)
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })

        .on("end", function () {
            canvas.pngStream().pipe(outStream);
            cb(null, null);
        })
    .start();
};
