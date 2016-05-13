var scrape = require('./modules/comment-scrape.js');
var teachers = require('./modules/index-teachers.js');
var Canvas = require("canvas");
var cloudgen = require('d3-cloud');
var fs = require('fs');

var width = 500;
var height = 500;

var profs = teachers.profs;

for (var teacher in profs) {
    if (profs.hasOwnProperty(teacher)) {
        (function(teacher) {
            if (teacher[0] == 'A' && teacher [1] == 'n')
                scrape(profs[teacher], function (err, words, id) {
                    if (!err) {
                        generate(teacher, parseWords(words), function () {
                            console.log('cloud generated for: ' + teacher);
                        });
                    }
                });
        })(teacher);
    }
}

function parseWords(words) {
    var wordMap = {};
    var keyWords = ['boring','fun', 'easy', 'good', 'hard', 'dumb', 'sleep', 'useless', 'homework', 'hw'];
    var notKeyWords = ['', 'is', 'and', 'but', 'a', 'was', 'in', 'the', 'his', 'my', 'of', 'what'];
    var maxOccurance = 0;
    for (var i = 0, l = words.length; i < l; i++) {
        var word = words[i];
        if (notKeyWords.indexOf(word) < 0){
            var occurance = wordMap[word] | 0;

            if (keyWords.indexOf(word) >= 0) 
                occurances *= 5;

            maxOccurance = Math.max(occurance, maxOccurance);

            wordMap[word] = occurance + 1;
        }
    }

    var wordData = [];
    for (var word in wordMap) {
        if (wordMap.hasOwnProperty(word)) {
            var occurances = wordMap[word];
            wordData.push({text: word, size: 10 + 90 * (occurances / maxOccurance)});

        }
    }

    return wordData;
}

function generate(fileName, words, cb) {
    var writeStream = fs.createWriteStream(__dirname + '/clouds/' + fileName + '.png');
    //console.log(words);
    var canvas = new Canvas(width, height, 'svg');
    cloudgen().size([width, height])
        .canvas(function() { return canvas; })
        .words(words)
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", function () {
            canvas.pngStream().pipe(writeStream);
            cb(null, null);
        })
        .start();
}
