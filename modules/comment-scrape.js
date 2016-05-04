var request = require('request');

module.exports = function scrape(id, callback){
    request('http://polyratings.com/eval.phtml?profid='+id, function(error, response, html) {
            var body = html.toString();
            var rag = new RegExp("<td valign=\"top\" width=\"79%\" align=\"left\">[^<]+</td>");
            var arr = (rag.exec(body));
            if (!arr){
                return callback("Error 404: Not Found.", null, id);
            }

            var words = [];
            for (var i = 0, l = arr.length; i<l;i+=1){
                arr[i] = arr[i].substring(arr[i].indexOf(">")+1, arr[i].indexOf("</td>")).replace("\n"," ").replace("&#039;"," ").replace("\t"," ").replace("&quot;"," ").replace(/[^a-zA-Z']/g," ");
                words = words.concat(arr[i].split(" "));
            }

            callback(null, words, id);
            //var dict = {};
            //for (var i = 0, l = words.length; i<l; i+=1){
            //    var word = words[i].toLowerCase();
            //    if (word !== "" && dict[word] === null){
            //        dict[word] = 1;
            //    } else {
            //        dict[word]++;
            //    }
            //}
            //var json = {};
            //var keyWords = ['boring','fun', 'easy', 'good', 'hard', 'dumb', 'sleep', 'useless', 'homework', 'hw'];
            //for (var str in dict){
            //    if (dict.hasOwnProperty(str)){
            //        if ((+dict[str] > 1 && str.length > 3) || keyWords.indexOf(str) > -1){
            //            json[str] = +dict[str];
            //        }
            //    }
            //}
            //callback(null,JSON.stringify(json),id);
});
};

