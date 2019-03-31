function showLadder(matches) {
    const laddercontext = {
        ladders: [
            { title: "Rank Top 3", id: "matchesrank", rank: uptoThree(getMatchesRank(matches)) },
            { title: "Total Points", id: "pointsrank", rank: uptoThree(getPointsRank(matches)) },
            { title: "Correct Answers", id: "answersrank", rank: uptoThree(getAnswersRank(matches)) }
        ]
    };
    $("#ladder").html(Handlebars.templates.ladder(laddercontext));
}

function getMatchesRank(matches) {
    let topcount = matches.map(m => {
        let sorted = Object.keys(m.dashboard).sort(function(x, y) {
            return m.dashboard[y].totalpoints - m.dashboard[x].totalpoints
        })
        return m.dashboard[sorted[0]].nickname;
    });
    let ranks = {};
    topcount.forEach(x => {
        ranks[x] = ranks[x] ? ranks[x] + 1 : 1;
    });
    return Object.keys(ranks).sort((x, y) => ranks[y] - ranks[x]).map(x => { return { "name": x, "number": ranks[x] } });

}

function getPointsRank(matches) {
    let ranks = matches.map(match => {
        let points = {};
        for (const key in match.dashboard)
            points[match.dashboard[key]['nickname']] = match.dashboard[key]['totalpoints']
        return points;
    });
    ranks = ranks.reduce((x, y) => mergeObject(x, y));
    return Object.keys(ranks).sort((x, y) => ranks[y] - ranks[x]).map(x => { return { "name": x, "number": ranks[x] } });
}

function getAnswersRank(matches) {
    let ranks = matches.map(match => {
        let answers = {};
        for (const key in match.dashboard)
            answers[match.dashboard[key]['nickname']] = match.dashboard[key]['turnpoints'].filter(x => x > 0).length;
        return answers;
    });
    ranks = ranks.reduce((x, y) => mergeObject(x, y));
    return Object.keys(ranks).sort((x, y) => ranks[y] - ranks[x]).map(x => { return { "name": x, "number": ranks[x] } });
}

function sortDashboard(dashboard) {
    let sorted = Object.keys(dashboard).sort(function(x, y) {
        return dashboard[y].totalpoints - dashboard[x].totalpoints
    })
    let sorteddashboard = [];
    for (const memberid of sorted) {
        let member = dashboard[memberid];
        sorteddashboard.push({ memberid, nickname: member.nickname, turnpoints: member.turnpoints, totalpoints: member.totalpoints });
    };
    return sorteddashboard;

}

function populateMatches(matches) {
    showLadder(matches);
    for (let match of matches) {
        match.sorted = sortDashboard(match.dashboard);
    };

    $('#matches').html(Handlebars.templates.matches({ matches }));
    $(".list-row-member").hover(onMouseover);
    $(".extend").click(onClickextend);
}

function onMouseover(e) {
    if (!e.originalEvent)
        return;
    $(e.currentTarget).toggleClass("highlight");
    const ds = e.currentTarget.dataset;
    const memberid = ds.memberid;
    const index = ds.index;
    if (!index) return;
    points = matches[index].dashboard[memberid].turnpoints;
    for ([idx, point] of points.entries()) {
        if (point <= 0) {
            $(`#m${index}-w${idx} .list-col-word`).toggleClass("wrongword")
        }
    }
}

function onClickextend(e) {
    if (!e.originalEvent) return;
    const index = e.currentTarget.dataset.index;
    $(`#wordlist-${index}`).toggleClass("hidden");
}

function onDateChange(datelist) {
    for (const day of datelist) {
        matches = vcommatches.filter(match => isSameDay(match.datetime, day));
        populateMatches(matches);
    }
}

function onEnterNumber(e) {
    if (e.which == 13) {
        $('#showresults').click();
        e.preventDefault();
    }
}

function onShowResults() {
    window.location.href = 'index.html?number=' + $('#jamnumber').val();
}

function onCopyAnswers() {
    function copyToClipboard(text) {
        let textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            let successful = document.execCommand('copy');
            let msg = successful ? 'successful' : 'unsuccessful';
            alert('Notice: Copying answers to clipboard was ' + msg);
        } catch (err) {
            alert('Notice: Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    }
    let list = '';
    document.querySelectorAll('[id^="wordlistbody"] .list-row-word').forEach(x => {
        list += x.querySelectorAll('.list-col-pos')[0].innerText + '\t';
        list += x.querySelector('.list-col-word').innerText + '\t';
        list += x.querySelectorAll('.list-col-pos')[1].innerText + '\t';
        list += x.querySelector('.list-col-def').innerText + '\n';
    });
    copyToClipboard(list);
}

async function onReady() {
    $('#jamnumber').keyup(onEnterNumber);
    $('#showresults').click(onShowResults);
    $('#copyanswers').click(onCopyAnswers);

    let url = new URL(window.location.href);
    let num = url.searchParams.get('number');
    if (!num) return;

    vcommatches = await vcomdata.loadVcomJams(num.split(','));
    if (!vcommatches || vcommatches.length == 0) return;

    $("#jamnumber").val(num);
    matches = vcommatches;
    populateMatches(matches);

};

var vcommatches = [];
var matches = [];
var vcomdata = new VCOMData();
$(document).ready(utilAsync(onReady));