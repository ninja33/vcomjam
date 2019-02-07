function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function utilAsync(func) {
    return function(...args) { func.apply(this, args) };
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

function uptoThree(arr) {
    arr = arr.slice(0, 3);
    if (arr.length < 3) {
        let j = arr.length;
        for (i = 0; i < 3 - j; i++)
            arr.push({ name: "", number: "" });
    }
    return arr;
}

Handlebars.registerHelper("math", function(lvalue, operator, rvalue) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    } [operator];
});