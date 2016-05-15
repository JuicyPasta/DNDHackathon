var endpoint = "127.0.0.1";

var redis = require("redis"),
    client = redis.createClient(6379, endpoint, {no_ready_check: true});


client.on('connect', function () {
    console.log("connected!");
});

client.on('error', function (err) {
    console.log("ERR:");
    console.log(err);
});

client.set("test", "OK");

// This will return a JavaScript String 
client.get("test", function (err, reply) {
    console.log(reply); // Will print `OK` 
});

client.get("not there", function (err, reply) {
    console.log(err);
    console.log(reply);
});


client.quit();
