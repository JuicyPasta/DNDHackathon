var input = document.getElementById('host');

chrome.storage.local.get({ host: 'http://localhost:3000/' }).then(function (o) {
    input.value = o.host;
});

document.getElementById('save').addEventListener('click', function () {
    var host = input.value.trim().replace(/\/?$/, '/');
    var origin = new URL(host).origin + '/*';
    // localhost is already allowed, anything else has to be asked for
    chrome.permissions.request({ origins: [origin] }).catch(function () { return false; }).then(function () {
        return chrome.storage.local.set({ host: host });
    }).then(function () {
        document.getElementById('saved').textContent = 'saved';
    });
});
