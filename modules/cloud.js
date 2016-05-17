// word clouds. d3-cloud does the layout, @napi-rs/canvas measures the text
// (node-canvas 1.x was what we used before and it doesn't build anymore)
var fs = require('fs');
var path = require('path');
var cloudgen = require('d3-cloud');
var createCanvas = require('@napi-rs/canvas').createCanvas;

var CLOUD_DIR = path.join(__dirname, '..', 'clouds');
var width = 500;
var height = 500;

var keyWords = ['boring', 'fun', 'easy', 'good', 'hard', 'dumb', 'sleep', 'useless', 'homework', 'hw',
    'great', 'helpful', 'tests', 'labs', 'curve', 'funny', 'clear', 'confusing', 'awesome', 'avoid'];
var notKeyWords = ('is and but a was in the his her my of what to i he she it you that this for class ' +
    'with be are on not if have had will at so as they do all an or your me there his him her very ' +
    'about would just from get when can one more an really like also out up which much because ' +
    'some were has them their its it\'s don\'t i\'m he\'s she\'s didn\'t no by any than then only ' +
    'teacher professor prof take took taking course classes quarter even other what how who make ' +
    'way does did been being into well lot dont im hes shes doesn\'t doesnt isn\'t gets got go goes ' +
    'going we us our these those time first see say said know think thing things never ever always ' +
    'many most every each could should might need s t ll ve d re m').split(' ');

// words -> {word: count}, skipping the boring ones
function countWords(words) {
    var wordMap = {};
    words.forEach(function (word) {
        word = word.replace(/^'+|'+$/g, '').toLowerCase();
        if (word.length < 3 || notKeyWords.indexOf(word) > -1) return;
        if (/fuck|shit|bitch|cunt|retard/.test(word)) return; // keep it pg
        wordMap[word] = (wordMap[word] || 0) + 1;
    });
    return wordMap;
}

// words -> [{text, size}], biggest first
function parseWords(words, max) {
    return countsToSizes(countWords(words), max);
}

function countsToSizes(wordMap, max) {
    var list = Object.keys(wordMap).map(function (word) {
        var n = wordMap[word];
        if (keyWords.indexOf(word) > -1) n *= 3;
        return { text: word, count: n };
    });
    list.sort(function (a, b) { return b.count - a.count; });
    list = list.slice(0, max || 70);
    var top = list.length ? list[0].count : 1;
    return list.map(function (w) {
        return { text: w.text, size: Math.round(14 + 62 * Math.sqrt(w.count / top)) };
    });
}

// same cloud every time for the same prof
function seeded(str) {
    var s = 0;
    for (var i = 0; i < str.length; i++) s = (s * 31 + str.charCodeAt(i)) >>> 0;
    return function () {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
    };
}

var colors = ['#154734', '#3a7d44', '#bd8b13', '#5e6a71', '#1f6f50', '#8a6a1a'];

function generate(fileName, words, cb) {
    var random = seeded(fileName);
    cloudgen().size([width, height])
        .canvas(function () { return createCanvas(1, 1); })
        .words(words.map(function (w) { return { text: w.text, size: w.size }; }))
        .padding(3)
        .random(random)
        .rotate(function () { return random() < 0.25 ? 90 : 0; })
        .font('Impact')
        .fontSize(function (d) { return d.size; })
        .on('end', function (placed) {
            var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height +
                '" viewBox="0 0 ' + width + ' ' + height + '"><g transform="translate(' + width / 2 + ',' + height / 2 + ')">';
            placed.forEach(function (d, i) {
                svg += '<text text-anchor="middle" transform="translate(' + d.x + ',' + d.y + ')rotate(' + d.rotate + ')" ' +
                    'style="font-size:' + d.size + 'px;font-family:Impact,Haettenschweiler,\'Arial Narrow Bold\',sans-serif;fill:' +
                    colors[i % colors.length] + '">' + d.text + '</text>';
            });
            svg += '</g></svg>';
            fs.mkdirSync(CLOUD_DIR, { recursive: true });
            fs.writeFileSync(path.join(CLOUD_DIR, fileName + 'Cloud.svg'), svg);
            cb(null, fileName + 'Cloud.svg');
        })
        .start();
}

function exists(fileName) {
    return fs.existsSync(path.join(CLOUD_DIR, fileName + 'Cloud.svg'));
}

module.exports = {
    countWords: countWords,
    parseWords: parseWords,
    countsToSizes: countsToSizes,
    generate: generate,
    exists: exists,
};
