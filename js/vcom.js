function renderMatchHTML(index, match) {
    return `
        <div class="grouppanel">
            <div class="grouptitle">
                <div class="extend" data-index="${index}"><a href="javascript:void(0)" >Word List …</a></div>
                <div class="titletext">Title: ${match.title}</div>
            </div>
            <div id="dashboard" class="crosspanel">
                <div class="list-head">
                    <div class="list-col list-col-name">Member</div><!--
                    --><div class="list-col list-col-turn">1</div><!--
                    --><div class="list-col list-col-turn">2</div><!--
                    --><div class="list-col list-col-turn">3</div><!--
                    --><div class="list-col list-col-turn">4</div><!--
                    --><div class="list-col list-col-turn">5</div><!--
                    --><div class="list-col list-col-turn">6</div><!--
                    --><div class="list-col list-col-turn">7</div><!--
                    --><div class="list-col list-col-turn">8</div><!--
                    --><div class="list-col list-col-turn">9</div><!--
                    --><div class="list-col list-col-turn">10</div><!--
                    --><div class="list-col list-col-total">Total</div>
            </div>
                <div class="listwrapper">
                    <div id="dashboardbody-${index}" class="list-body"></div>
                </div>
            </div>
            <div id="wordlist-${index}" class="crosspanel hidden">
                <div class="list-head">
                <div class="list-col list-col-pos">#</div><!--
                --><div class="list-col list-col-word">Word</div><!--
                --><div class="list-col list-col-pos">…</div><!--
                --><div class="list-col list-col-def">Definition</div>
                </div>
                <div class="listwrapper">
                    <div id="wordlistbody-${index}" class="list-body"></div>
                </div>
            </div>
            <div class="clearfix"></div>    
        </div>
    `
}

function populateRanks(ranks, name) {
    $(`#${name}`).empty();
    let row = '';
    ranks = ranks.slice(0, 3);
    if (ranks.length < 3){
        let j = ranks.length;
        for (i = 0; i < 3 - j; i++)
            ranks.push({ name: "", number: "" });
    }

    for (const [index, rank] of ranks.entries())
        row += `
            <div class="list-row">
                <div class="list-col list-col-icon"><img class="icon" src="img/medal-${index}.png"></div>
                <div class="list-col list-col-name">${rank.name}</div>
                <div class="list-col list-col-turn">${rank.number}</div>
            </div>
            <hr>`
    $(`#${name}`).append(row);

}

function populateDashboard(index, dashboard) {
    $('#dashboardbody-' + index).empty();
    sorted = Object.keys(dashboard).sort(function(x, y) {
        return dashboard[y].totalpoints - dashboard[x].totalpoints
    })
    for (const memberid of sorted) {
        let row = '';
        row += `<div class="list-col list-col-name">${dashboard[memberid].nickname}</div>`;
        for (const turnpoint of dashboard[memberid].turnpoints)
            row += `<div class="list-col list-col-turn">${turnpoint}</div>`;
        row += `<div class="list-col list-col-total">${dashboard[memberid].totalpoints}</div>`;
        $('#dashboardbody-' + index).append(`<div class="list-row-member" data-index="${index}" data-memberid="${memberid}">${row}</div><hr>`);
    };

}

function populateWordlist(index, words) {
    $('#wordlistbody-' + index).empty();
    for ([idx, word] of words.entries()) {
        let row = '';
        row += `<div class="list-col list-col-pos">${idx + 1}</div>`;
        row += `<div class="list-col list-col-word">${word.word}</div>`;
        row += `<div class="list-col list-col-pos">${word.pos}</div>`;
        row += `<div class="list-col list-col-def">${word.def}</div>`;
        $('#wordlistbody-' + index).append(`<div id="m${index}-w${idx}" class="list-row-word">${row}</div><hr>`);
    };
}

function mergeObject(x, y) {
    for (const key in y) {
        if (x.hasOwnProperty(key))
            x[key] = x[key] + y[key];
        else
            x[key] = y[key];
    }
    return x;
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

function populateMatches(matches) {
    populateRanks(getMatchesRank(matches), "matchesrank");
    populateRanks(getPointsRank(matches), "pointsrank");
    populateRanks(getAnswersRank(matches), "answersrank");

    $('#matches').empty()
    for ([index, match] of matches.entries()) {
        $('#matches').append(renderMatchHTML(index, match))
        populateDashboard(index, match.dashboard);
        populateWordlist(index, match.words);
    };

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
        populateMatches(matches)
    }
}

async function onReady() {
    vcommatches = await vcomdata.loadJSONfile();
    //vcommatches = await vcomdata.loadDatabase();
    let event = vcommatches.map(match => match.datetime);
    initialdate = new Date(Math.max(...event));
    options = {
        locale: "zh",
        enable: event,
        defaultDate: initialdate.toISOString().slice(0, 10),
        onChange: onDateChange
    }
    const fp = flatpickr("#jamdate", options);
    $("#jamdate").val(initialdate.toISOString().slice(0, 10));
    onDateChange([initialdate])
};

var vcommatches = [];
var matches = [];
var vcomdata = new VCOMData();
$(document).ready(utilAsync(onReady));