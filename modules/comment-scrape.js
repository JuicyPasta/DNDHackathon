var polyratings = require('./polyratings.js');

// pulls every review for a prof and splits it into words for the word cloud
module.exports = function scrape(id, callback) {
    polyratings.professor(id).then(function (prof) {
        var words = [];
        Object.keys(prof.reviews || {}).forEach(function (course) {
            prof.reviews[course].forEach(function (review) {
                var text = review.rating
                    .replace(/&#039;/g, "'")
                    .replace(/&quot;/g, ' ')
                    .replace(/[^a-zA-Z']/g, ' ')
                    .toLowerCase();
                words = words.concat(text.split(' '));
            });
        });
        if (!words.length) return callback('Error 404: Not Found.', null, id);
        callback(null, words, id);
    }).catch(function (err) {
        callback(err.message, null, id);
    });
};
