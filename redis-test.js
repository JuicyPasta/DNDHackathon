var endpoint = "extensiondata-001.p4b2ml.0001.usw1.cache.amazonaws.com";

var redis = require("redis"),
    client = redis.createClient(6379, endpoint, {no_ready_check: true});


client.on('connect', function () {
    console.log("connected!");
});

client.on('error', function (err) {
    console.log(err);
});

client.on('ready', function () {
    console.log("ready");
});

client.on('end', function () {
    console.log("end");
});

client.set("foo_rand000000000000", "OK");
 
// This will return a JavaScript String 
client.get("foo_rand000000000000", function (err, reply) {
    console.log(err);
        console.log(reply); // Will print `OK` 
});
 
// This will return a Buffer since original key is specified as a Buffer 
client.get(new Buffer("foo_rand000000000000"), function (err, reply) {
    console.log(err);
        console.log(reply); // Will print `<Buffer 4f 4b>` 
});

client.quit();

