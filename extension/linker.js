var idList = {"Walters,Dirk":["682"]};
var ratings = {};

$('.row-white').click(clicked);
$('.row-gray').click(clicked);

$('.row-white').addClass("hoverable");
$('.row-gray').addClass("hoverable");

function toInsert(data) {
    var linkStr = data.id ? "http://polyratings.com/eval.phtml?profid=" + data.id : "https://www.google.com/search?q=" + data.teacher + " site:polyratings.com";

    var toRet = `
        <tr class='info'>
        <td colspan="100%">
        <div class="row info">
        <div class="col-md-2 profCard">
        <img class='pic' height='100px' width='100px' src="http://localhost:3000/` + data.photo + `">
        <br>
        <p class = "h3">

        ` + data.teacher + `
        </p>
        <p class = "h5">
        ` + data.department + `
        </p>
        Total Evaulations ` + data.totalEvals + `
        <br>
        <a href="` + linkStr + `"> Link to PolyRatings </a>
        </div>
        `;

        if (data.found) {
            toRet += `
                <div class="col-md-2 stat">
                <b class="h4">
                Overall stats
                </b>
                <br>
                Mean Rating: ` + data.overall.mean + `
                <br>
                Mode: ` + data.overall.mode + `
                <br>
                Std deviation: ` + data.overall.stdDev + `
                <br>
                <br>
                # of As: ` + data.grades.A + `
                <br>
                # of Bs: ` + data.grades.B + `
                <br>
                # of Cs: ` + data.grades.C + `
                <br>
                # of Ds: ` + data.grades.D + `
                <br>
                # of Fs: ` + data.grades.F + `
                <br>
                </div>
                <div class="col-md-2 stat">
                <b class="h4">
                Ability to present material
                </b>
                <br>
                Mean: ` + data.presentation.mean + `
                <br>
                Mode: ` + data.presentation.mode + `
                <br>
                Std deviation: ` + data.presentation.stdDev + `
                </div>

                <div class="col-md-2 stat">
                <b class="h4">
                Ability to understand
                </b>
                <br>
                Mean: ` + data.understandingness.mean + `
                <br>
                Mode: ` + data.understandingness.mode + `
                <br>
                Std deviation: ` + data.understandingness.stdDev + `
                <br>
                </div>
                `;
        }
        else {
            toRet += `
                <div class="col-md-6 stat">
                <b class="h2">
                Polyratings metadata not found
                </b>
                </div>
            `;
        }

    toRet += `
        <div class="col-md-3 wordCloud">
        <img class='cloud' src="http://localhost:3000/` + data.cloud + `">
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

    $.get("http://localhost:3000/users/" + fullName, function(data) {
        if (current.next().attr('class') == 'info') {
            current.next().remove();
        } else {
            var element = $(toInsert(data));
            current.after(element);
        }
    });
}

function normalizeName(name) {
    name = name.split(' ')[0];
    name = name.split(',').join('');
    return name;
}

