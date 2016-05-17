// MV3 content scripts can't just $.get another origin anymore, so the lookup
// goes through here. the server is wherever you ran `npm start`.
var DEFAULT_HOST = 'http://localhost:3000/';

function getHost() {
    return chrome.storage.local.get({ host: DEFAULT_HOST }).then(function (o) {
        return o.host.replace(/\/?$/, '/');
    });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.type !== 'lookup') return;

    getHost().then(function (host) {
        return fetch(host + 'users/' + encodeURIComponent(msg.name))
            .then(function (res) {
                if (!res.ok) throw new Error('server said ' + res.status);
                return res.json();
            })
            .then(function (data) {
                sendResponse({ host: host, data: data });
            });
    }).catch(function (err) {
        sendResponse({ error: err.message });
    });

    return true; // answering async
});
