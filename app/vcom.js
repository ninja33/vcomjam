function renderMatchHTML(index, match) {
    let options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return `
        <div class="grouppanel">
            <div class="grouptitle">
                <div class="extend"><a href="#">Word List …</a></div>
                <div class="titletext">${match.time.toLocaleDateString('en-US', options)} | ${match.title}</div>
            </div>
            <div class="leftpanel">
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
            <div class="rightpanel">
                <div class="list-head">
                <div class="list-col list-col-pos">#</div><!--
                --><div class="list-col list-col-word">Word</div><!--
                --><div class="list-col list-col-pos">P</div><!--
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

function buildMatchs(results) {
    let matchs = [];
    for (const result of results) {
        let dashboard = {};
        let words = [];
        for (const member of result.members) {
            dashboard[member.mid] = { nickname: member.nickname.replace("Anonymous","(A)"), totalpoints: member.points, turnpoints: [] };
        }
        for (const [index, turn] of result.turns.entries()) {
            words[index] = { word: turn.word.word, pos: turn.word.pos, def: turn.word.def };
            for (const memberid in dashboard)
                dashboard[memberid].turnpoints[index] = 0;
            for (const answer of turn.answers) {
                dashboard[answer.who].turnpoints[index] = answer.points;
            }
        }
        matchs.push({ time: new Date(Number(result.now)), title: result.name, dashboard, words });
    }
    return matchs;
}

function populateDashboard(index, dashboard) {
    $('#dashboardbody-' + index).empty();
    sorted = Object.keys(dashboard).sort(function(x, y) { return dashboard[y].totalpoints - dashboard[x].totalpoints })
    for (memberid of sorted) {
        let row = '';
        row += `<div class="list-col list-col-name">${dashboard[memberid].nickname}</div>`;
        for (const turnpoint of dashboard[memberid].turnpoints)
            row += `<div class="list-col list-col-turn">${turnpoint}</div>`;
        row += `<div class="list-col list-col-total">${dashboard[memberid].totalpoints}</div>`;
        $('#dashboardbody-' + index).append(`<div class="list-member-row" data-index="${index}" data-memberid="${memberid}">${row}</div><hr>`);
    };

}

function populateWordlist(index, words) {
    $('#wordlistbody-' + index).empty();
    for ([idx, word] of words.entries()){
        let row = '';
        row += `<div class="list-col list-col-pos">${idx+1}</div>`;
        row += `<div class="list-col list-col-word">${word.word}</div>`;
        row += `<div class="list-col list-col-pos">${word.pos}</div>`;
        row += `<div class="list-col list-col-def">${word.def}</div>`;
        $('#wordlistbody-' + index).append(`<div id="m${index}-w${idx}" class="list-word-row">${row}</div><hr>`);
    };
}

function onMouseover(e){
    if (!e.originalEvent) return;
    $(e.currentTarget).toggleClass("highlight");
    const ds = e.currentTarget.dataset;
    const memberid = ds.memberid;
    const index = ds.index;
    points = matchs[index].dashboard[memberid].turnpoints;
    for ([idx,point] of points.entries()){
        if (point <= 0){
            $(`#m${index}-w${idx} .list-col-word`).toggleClass("wrongword")
        }
    }
}

function onClickextend(e){
    $(".container").toggleClass("width-600px");
    $(".leftpanel").toggleClass("width-100pc");
    $(".rightpanel").toggleClass("hidden");
}

function onReady() {
    $.getJSON("data/vcom.json", function(results) {
        matchs = buildMatchs(results).reverse();
        for ([index, match] of matchs.entries()) {
            $('#jamresults').append(renderMatchHTML(index, match))
            populateDashboard(index, match.dashboard);
            populateWordlist(index, match.words);
        };
        $(".list-member-row").hover(onMouseover);
        $(".extend").click(onClickextend);
        onClickextend();
    });
}

var matchs = [];
$(document).ready(onReady);