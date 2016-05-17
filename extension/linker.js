$('.row-white').click(clicked);
$('.row-gray').click(clicked);

$('.row-white').addClass("hoverable");
$('.row-gray').addClass("hoverable");

function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

function toInsert(data, host) {
    var toRet = `
        <tr class='info'>
        <td colspan="100%">
        <div class="row info">
        <div class="col-md-2 profCard">
        <img class='pic' height='100px' width='100px' src="` + host + esc(data.photo) + `">
        <br>
        <p class = "h3">
        ` + esc(data.teacher) + `
        </p>
        <p class = "h5">
        ` + esc(data.department) + `
        </p>
        Total Evaulations ` + esc(data.totalEvals) + `
        <br>
        <a href="` + esc(data.link) + `" target="_blank"> Link to PolyRatings </a>
        </div>
        `;

        if (data.found) {
            toRet += `
                <div class="col-md-2 stat">
                <b class="h4">
                Overall stats
                </b>
                <br>
                Mean Rating: ` + esc(data.overall.mean) + ` / 4
                <br>
                <br>
                # of As: ` + esc(data.grades.A) + `
                <br>
                # of Bs: ` + esc(data.grades.B) + `
                <br>
                # of Cs: ` + esc(data.grades.C) + `
                <br>
                # of Ds: ` + esc(data.grades.D) + `
                <br>
                # of Fs: ` + esc(data.grades.F) + `
                <br>
                </div>
                <div class="col-md-2 stat">
                <b class="h4">
                Ability to present material
                </b>
                <br>
                Mean: ` + esc(data.presentation.mean) + ` / 4
                <br>
                <br>
                <b class="h4">
                Ability to understand
                </b>
                <br>
                Mean: ` + esc(data.understandingness.mean) + ` / 4
                </div>
                `;
        }
        else {
            toRet += `
                <div class="col-md-4 stat">
                <b class="h2">
                Polyratings metadata not found
                </b>
                </div>
            `;
        }

    toRet += `
        <div class="col-md-3 wordCloud">
        <img class='cloud' src="` + host + esc(data.cloud) + `">
        </div>

        </div>
        </td>

        </tr>
        `;

    return toRet;
};

function clicked() {
    var current = $(this);
    var fullNameReg = current.children()[4].innerText;
    var fullNameNote = current.children()[3].innerText;

    var fullName = normalizeName(isNaN(fullNameReg) ? fullNameReg : fullNameNote);

    if (current.next().attr('class') == 'info') {
        current.next().remove();
        return;
    }

    chrome.runtime.sendMessage({ type: 'lookup', name: fullName }, function (resp) {
        if (!resp || resp.error) {
            console.log('mustang marks: ' + (resp ? resp.error : 'no answer') + ', is the server running?');
            return;
        }
        if (current.next().attr('class') != 'info') {
            current.after($(toInsert(resp.data, resp.host)));
        }
    });
}

function normalizeName(name) {
    name = name.trim().replace(/,\s+/g, ',').split(' ')[0];
    name = name.split(',').join('');
    return name;
}
