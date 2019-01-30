function onReady() {
    $.getJSON("data/vcom.json", function (results) {
        for (const result of results) {
            console.log(`${result.code}-${result.sn}:${result.name}`);
        }
    });
}

$(document).ready(onReady);