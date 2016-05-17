// make sure redis is up: REDIS_URL=redis://127.0.0.1:6379 node redis-test.js
var redis = require("redis");

var client = redis.createClient({ url: process.env.REDIS_URL || "redis://127.0.0.1:6379" });

client.on('error', function (err) {
    console.log("ERR:");
    console.log(err.message);
    process.exit(1);
});

(async function () {
    await client.connect();
    console.log("connected!");

    await client.set("test", "OK");
    console.log(await client.get("test")); // OK
    console.log(await client.get("not there")); // null

    await client.del("test");
    await client.quit();
})();
