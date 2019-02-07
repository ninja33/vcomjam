function showMenu() {
    const menucontext = {
        title: "Vocabulary.com 单词争霸赛赛",
        menus: [
            { title: "显示比赛", image: "sport", input: true },
            { title: "保存数据", image: "save" },
            { title: "比赛规则", image: "rules" }
        ]
    };
    $("#menu").html(Handlebars.templates.menu(menucontext));
}

function showLadder(matches) {
    const laddercontext = {
        ladders: [
            { title: "当日夺冠排名", id: "matchesrank", rank: uptoThree(getMatchesRank(matches)) },
            { title: "当日总分排名", id: "pointsrank", rank: uptoThree(getPointsRank(matches)) },
            { title: "正确题数排名", id: "answersrank", rank: uptoThree(getAnswersRank(matches)) }
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
        populateMatches(matches)
    }
}

async function onReady() {
    showMenu();
    vcommatches = await vcomdata.loadJSONfile();
    //vcommatches = await vcomdata.loadDatabase();
    let event = vcommatches.map(match => match.datetime);
    let initialdate = (new Date(Math.max(...event))).toISOString().slice(0, 10);
    options = {
        locale: "zh",
        enable: event,
        defaultDate: initialdate,
        onChange: onDateChange
    }
    const fp = flatpickr("#jamdate", options);
    $("#jamdate").val(initialdate);
    onDateChange([new Date(initialdate)])
};

var vcommatches = [];
var matches = [];
var vcomdata = new VCOMData();
$(document).ready(utilAsync(onReady));