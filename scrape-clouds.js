var scrape = require('./modules/comment-scrape.js');
var profIds = require('./modules/index-teachers.js');
var Canvas = require("canvas");
var cloudgen = require('d3-cloud');
var fs = require('fs');

profIds.init();
console.log(profIds);

var width = 250;
var height = 250;

var profs = profIds.profs;

for (var teacher in profs) {
    console.log(teacher);

    if (profs.hasOwnProperty(teacher)) {
        console.log(teacher);

        (function(teacher) {
            //if (teacher[0] == 'A')
            scrape(profs[teacher], function (err, data, id) {
                if (!err) {
                    cloud(teacher, data, function () {
                        console.log('cloud generated for: ' + teacher);
                    });
                }
            });
        })(teacher);
    }
}

function generate(fileName, words, cb) {
    var outStream = fs.createWriteStream(__dirname + '/clouds/' + fileName + '.png');
    var canvas = new Canvas(width,height);
    
    words = words.map(function(d) {
        return {text: d, size: 10 + Math.random() * 90};
    });

    cloudgen().size([width, height])
        .canvas(function() { return canvas;})
        .words(words)
        .padding(5)
        //        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", function () {
            canvas.pngStream().pipe(outStream);
            cb(null, null);
        })
    .start();
};
