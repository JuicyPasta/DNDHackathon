var idList = {"Walters,Dirk":["682"]};
var ratings = {};

walk(document.body);

$('.row-white').click(clicked);
$('.row-gray').click(clicked);

$('.row-white').addClass("hoverable");
$('.row-gray').addClass("hoverable");

function toInsert(data) {
	var linkStr;
	if (data.id) {
		linkStr = "http://polyratings.com/eval.phtml?profid= + data.id";
	}
	else {
		linkStr = "https://www.google.com/search?q=" + data.teacher + " site:polyratings.com";
	}
    var toRet = `
        <tr class='info'>
        <td colspan="100%">
        <div class="row info no-height">
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
        </div>

        <div class="col-md-2 stat">
        <b>
        Overall stats
        </b>
        <br>
        mean ` + data.overall.mean + `
        <br>
        mode ` + data.overall.mode + `
        <br>
        standard deviation ` + data.overall.stdDev + `
        <br>
        </div>
        <div class="col-md-2 stat">
        <b>
        Ability to present material
        </b>
        <br>
        mean ` + data.presentation.mean + `
        <br>
        mode ` + data.presentation.mode + `
        <br>
        standard deviation ` + data.presentation.stdDev + `
        </div>

        <div class="col-md-2 stat">
        <b>
        Ability to understand
        </b>
        <br>
        mean ` + data.understandingness.mean + `
        <br>
        mode ` + data.understandingness.mode + `
        <br>
        standard deviation ` + data.understandingness.stdDev + `
        <br>
        </div>

        <div class="col-md-3 wordCloud">
            <img class='cloud' src="http://localhost:3000/` + data.cloud + `">
        </div>

        </div>
        </td>
        </tr>
		<tr>
		<a href="http://polyratings.com/eval.phtml?profid=` + linkStr + `">
			Link to PolyRatings 
		</a>
		
		</tr>`;

    return toRet;
};


function clicked() {
    var current = $(this);
    var fullName = current.children()[4].innerText;
    console.log("fullname is " + fullName);
    fullName = fullName.split(' ')[0];
    fullName = fullName.split(',').join('');
    console.log("fullname is " + fullName);

    $.get( "http://localhost:3000/users/" + fullName, function( data ) {
        if (current.next().attr('class') == 'info') {
            current.next().remove();
        } else {
            var element = $(toInsert(data));
            current.after(element);
        }

    });
}

$().after(function() {
    return "<div>" + this.className + "</div>";
});

function walk(node) {

    var rowWhite = $('.row-white');
    var rowGray = $('.row-gray');

    console.log(rowWhite);

}

function handleName(textNode)
{
    var name = textNode.nodeValue;
    var pos = name.indexOf(' ');
    if (pos > 0 )
    {
        name = name.substring(0,name.lastIndexOf(' '));
    }
    if (name in idList)
    {
        var cNode = document.createElement("a");
        cNode.setAttribute("href", "http://polyratings.com/eval.phtml?profid="+ idList[name]);
        cNode.setAttribute("target","_blank");
        var parent = textNode.parentNode;
        parent.replaceChild(cNode,textNode);
        cNode.appendChild(textNode);
        getSetRating(idList[name], textNode);
    }
    else if (name.split(" | Units:").length == 2)
    {
        name = name.split(" ")[0].toLowerCase();
        var cNode = document.createElement("a");
        cNode.setAttribute("href", "http://catalog.calpoly.edu/coursesaz/" + name);
        cNode.setAttribute("target","_blank");
        cNode.setAttribute("style","color: white");
        var parent = textNode.parentNode;
        parent.replaceChild(cNode,textNode);
        cNode.appendChild(textNode);
    }
    else if (name.split(",").length == 2)
    {
        var cNode = document.createElement("a");
        cNode.setAttribute("href", "https://www.google.com/search?q=" + name + " site:polyratings.com");
        cNode.setAttribute("target","_blank");
        var parent = textNode.parentNode;
        parent.replaceChild(cNode,textNode);
        cNode.appendChild(textNode);
    }

}
function getSetRating(id, node){
    if (id in ratings)
    {
        node.nodeValue = node.nodeValue + ratings[id];
        return;
    }
    var xmlhttp;
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange=function()
    {
        if (xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            if (xmlhttp.responseText != null){
                var i = xmlhttp.responseText.indexOf("Cumulative GPA:");
                var end = xmlhttp.responseText.indexOf(" evaluation");
                var rating = xmlhttp.responseText.substring(i+16,i+20);
                var numRates = "";
                if (end > 0) numRates = xmlhttp.responseText.substring(i+31,end);
                ratings[id] = " (" + rating + " [" + numRates + "])";
                node.nodeValue = node.nodeValue + ratings[id];
            }
        }
    };
    xmlhttp.open("GET","http://polyratings.com/eval.phtml?profid="+ id,true);
    xmlhttp.send();
}
