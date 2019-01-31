function renderMatchHTML(index, match) {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return `
        <div class="grouppanel">
            <div class="grouptitle">
                <span>每日比赛结果 | Time: ${match.time.toLocaleDateString('zh-CN', options)} | Title: ${match.title}</span>
                <span class="option-helps"><a href="#" target="_blank">…</a></span>
            </div>
            <div class="leftpanel">
                <div class="list-head">
                    <span class="list-col list-col-name">Member</span><!--
                    --><span class="list-col list-col-turn">1</span><!--
                    --><span class="list-col list-col-turn">2</span><!--
                    --><span class="list-col list-col-turn">3</span><!--
                    --><span class="list-col list-col-turn">4</span><!--
                    --><span class="list-col list-col-turn">5</span><!--
                    --><span class="list-col list-col-turn">6</span><!--
                    --><span class="list-col list-col-turn">7</span><!--
                    --><span class="list-col list-col-turn">8</span><!--
                    --><span class="list-col list-col-turn">9</span><!--
                    --><span class="list-col list-col-turn">10</span><!--
                    --><span class="list-col list-col-total">Total</span>
            </div>
                <div class="listwrapper">
                    <div id="dashboardbody-${index}" class="list-body"></div>
                </div>
            </div>
            <div class="rightpanel">
                <div class="list-head">
                    <span class="list-col list-col-word">Word</span><span class="list-col list-col-pos">Pos.</span><span class="list-col list-col-def">Def.</span>
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
            dashboard[member.mid] = { nickname: member.nickname, totalpoints: member.points, turnpoints: [] };
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
    sorted.forEach(memberid => {
        let row = '';
        row += `<span class="list-col list-col-name">${dashboard[memberid].nickname}</span>`;
        for (const turnpoint of dashboard[memberid].turnpoints)
            row += `<span class="list-col list-col-turn">${turnpoint}</span>`;
        row += `<span class="list-col list-col-total">${dashboard[memberid].totalpoints}</span>`;
        $('#dashboardbody-' + index).append($(`<div class="list-row">${row}</div>`));
    });

}

function populateWordlist(index, words) {
    $('#wordlistbody-' + index).empty();
    words.forEach(word => {
        let row = '';
        row += `<span class="list-col list-col-word">${word.word}</span>`;
        row += `<span class="list-col list-col-pos">${word.pos}</span>`;
        row += `<span class="list-col list-col-def">${word.def}</span>`;
        $('#wordlistbody-' + index).append($(`<div class="list-row">${row}</div>`));
    });
}

function onReady() {
    $.getJSON("data/vcom.json", function(results) {
        let matchs = buildMatchs(results);
        for ([index, match] of matchs.reverse().entries()) {
            $('#jamresults').append(renderMatchHTML(index, match))
            populateDashboard(index, match.dashboard);
            populateWordlist(index, match.words);
        };
    });
}

$(document).ready(onReady);