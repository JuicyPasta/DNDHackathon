// search box on every page. hits /teachers/teacherQuery/:search as you type
function stars(rating) {
    var html = '';
    for (var i = 0; i < 4; i++) {
        html += "<img src='/images/star.png' class='star" + (i < Math.round(rating) ? '' : ' dim') + "'>";
    }
    return html;
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

$(function () {
    var timer;
    var results = [];

    function open() {
        $('#mainSearch').css('border-radius', '10px 0px 0px 0px');
        $('#searchResults').slideDown(150);
    }

    function close() {
        $('#searchResults').slideUp(150, function () {
            $('#mainSearch').css('border-radius', '10px 0 0 10px');
        });
    }

    function search() {
        var searchVal = $('#mainSearch').val().trim();
        if (!searchVal) {
            results = [];
            return close();
        }
        $.post('/teachers/teacherQuery/' + encodeURIComponent(searchVal), function (data) {
            if ($('#mainSearch').val().trim() !== searchVal) return;
            results = data;
            $('#searchResultsList').empty();
            if (!data.length) {
                $('#searchResultsList').append("<li class='none'>nobody, try a last name or a class like CPE 357</li>");
            }
            data.forEach(function (t) {
                $('#searchResultsList').append(
                    "<li><a href='/teachers/" + t.key + ".html'><div class='teacherName'>" + escapeHtml(t.name) + '</div></a>' +
                    "<div class='teacherMeta'>" + stars(t.rating) +
                    '<span> (' + t.totalEvals + ') / </span><span style="font-style: italic;">' + escapeHtml(t.department) + '</span></div></li>');
            });
            open();
        });
    }

    $('#mainSearch').on('input', function () {
        clearTimeout(timer);
        timer = setTimeout(search, 120);
    });

    $('#mainSearch').keydown(function (e) {
        if (e.which === 13 && results.length) window.location = '/teachers/' + results[0].key + '.html';
    });

    $('#searchButton').click(function () {
        if (results.length) window.location = '/teachers/' + results[0].key + '.html';
        else search();
    });

    $('#mainSearch').click(function () {
        if (results.length) open();
    });

    $(document).click(function (event) {
        if (!$(event.target).closest('#searchGroup').length) close();
    });
});
