// redis in front of the scraper. if redis isn't running we just skip it.
var redis = require('redis');

var url = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
var client = redis.createClient({ url: url, socket: { reconnectStrategy: false } });
var up = false;

client.on('error', function () {});
client.connect().then(function () {
    up = true;
    console.log('redis connected at ' + url);
}).catch(function (err) {
    console.log('no redis at ' + url + ' (' + err.message + '), not caching');
});

async function get(key) {
    if (!up) return null;
    var data = await client.get(key);
    return data ? JSON.parse(data) : null;
}

async function set(key, value, seconds) {
    if (!up) return;
    await client.set(key, JSON.stringify(value), { EX: seconds || 24 * 60 * 60 });
}

module.exports = { get: get, set: set, client: client };
