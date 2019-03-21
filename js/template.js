(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['ladder'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"middlepanel\">\r\n    <div class=\"grouppanel\">\r\n        <div class=\"grouptitle\">\r\n            <div class=\"titletext\">"
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\r\n        </div>\r\n        <div class=\"crosspanel\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.rank : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </div>\r\n    </div>\r\n</div>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <div class=\"list-row\">\r\n                <div class=\"list-col list-col-icon\"><img class=\"icon\" src=\"img/medal-"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + ".png\"></div>\r\n                <div class=\"list-col list-col-name\">"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</div>\r\n                <div class=\"list-col list-col-turn\">"
    + alias4(((helper = (helper = helpers.number || (depth0 != null ? depth0.number : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"number","hash":{},"data":data}) : helper)))
    + "</div>\r\n            </div>\r\n            <hr>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.ladders : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "<div class=\"clearfix\"></div>\r\n";
},"useData":true});
templates['matches'] = template({"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"grouppanel\">\r\n    <div class=\"grouptitle\">\r\n        <div class=\"extend\" data-index=\""
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\"><a href=\"javascript:void(0)\" >Word List …</a></div>\r\n        <div class=\"titletext\">Title: "
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\r\n    </div>\r\n    <div id=\"dashboard\" class=\"crosspanel\">\r\n        <div class=\"list-head\">\r\n            <div class=\"list-col list-col-name\">Member</div><!--\r\n            --><div class=\"list-col list-col-turn\">1</div><!--\r\n            --><div class=\"list-col list-col-turn\">2</div><!--\r\n            --><div class=\"list-col list-col-turn\">3</div><!--\r\n            --><div class=\"list-col list-col-turn\">4</div><!--\r\n            --><div class=\"list-col list-col-turn\">5</div><!--\r\n            --><div class=\"list-col list-col-turn\">6</div><!--\r\n            --><div class=\"list-col list-col-turn\">7</div><!--\r\n            --><div class=\"list-col list-col-turn\">8</div><!--\r\n            --><div class=\"list-col list-col-turn\">9</div><!--\r\n            --><div class=\"list-col list-col-turn\">10</div><!--\r\n            --><div class=\"list-col list-col-total\">Total</div>\r\n    </div>\r\n        <div class=\"listwrapper\">\r\n            <div id=\"dashboardbody-"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"list-body\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.sorted : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\r\n        </div>\r\n    </div>\r\n    <div id=\"wordlist-"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"crosspanel hidden\">\r\n        <div class=\"list-head\">\r\n        <div class=\"list-col list-col-pos\">#</div><!--\r\n        --><div class=\"list-col list-col-word\">Word</div><!--\r\n        --><div class=\"list-col list-col-pos\">…</div><!--\r\n        --><div class=\"list-col list-col-def\">Definition</div>\r\n        </div>\r\n        <div class=\"listwrapper\">\r\n            <div id=\"wordlistbody-"
    + alias4(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"list-body\">\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.words : depth0),{"name":"each","hash":{},"fn":container.program(5, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"clearfix\"></div>    \r\n</div>\r\n";
},"2":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=helpers.helperMissing, alias4="function";

  return "                <div class=\"list-row-member\" data-index=\""
    + alias1(container.lambda((container.data(data, 1) && container.data(data, 1).index), depth0))
    + "\" data-memberid=\""
    + alias1(((helper = (helper = helpers.memberid || (depth0 != null ? depth0.memberid : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"memberid","hash":{},"data":data}) : helper)))
    + "\">\r\n                    <div class=\"list-col list-col-name\">"
    + alias1(((helper = (helper = helpers.nickname || (depth0 != null ? depth0.nickname : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"nickname","hash":{},"data":data}) : helper)))
    + "</div><div class=\"list-col list-col-turns\">\r\n                    "
    + ((stack1 = helpers.each.call(alias2,(depth0 != null ? depth0.turnpoints : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n                    </div><div class=\"list-col list-col-total\">"
    + alias1(((helper = (helper = helpers.totalpoints || (depth0 != null ? depth0.totalpoints : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"totalpoints","hash":{},"data":data}) : helper)))
    + "</div>\r\n                </div><hr>\r\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "<div class=\"list-col list-col-turn\">"
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "</div>";
},"5":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var helper, alias1=container.escapeExpression, alias2=depth0 != null ? depth0 : (container.nullContext || {}), alias3=helpers.helperMissing, alias4="function";

  return "                <div id=\"m"
    + alias1(container.lambda((container.data(data, 1) && container.data(data, 1).index), depth0))
    + "-w"
    + alias1(((helper = (helper = helpers.index || (data && data.index)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"index","hash":{},"data":data}) : helper)))
    + "\" class=\"list-row-word\"><!--\r\n                --><div class=\"list-col list-col-pos\">"
    + alias1((helpers.math || (depth0 && depth0.math) || alias3).call(alias2,(data && data.index),"+",1,{"name":"math","hash":{},"data":data}))
    + "</div><!--\r\n                --><div class=\"list-col list-col-word\">"
    + alias1(((helper = (helper = helpers.word || (depth0 != null ? depth0.word : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"word","hash":{},"data":data}) : helper)))
    + "</div><!--\r\n                --><div class=\"list-col list-col-pos\">"
    + alias1(((helper = (helper = helpers.pos || (depth0 != null ? depth0.pos : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"pos","hash":{},"data":data}) : helper)))
    + "</div><!--\r\n                --><div class=\"list-col list-col-def\">"
    + alias1(((helper = (helper = helpers.def || (depth0 != null ? depth0.def : depth0)) != null ? helper : alias3),(typeof helper === alias4 ? helper.call(alias2,{"name":"def","hash":{},"data":data}) : helper)))
    + "</div>\r\n                </div><hr>\r\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.matches : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true,"useDepths":true});
templates['menu'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"middlepanel\">\r\n        <div class=\"menuitem\">\r\n            <div class=\"list-col list-col-icon\">\r\n                <img class=\"icon\" src=\"img/"
    + alias4(((helper = (helper = helpers.image || (depth0 != null ? depth0.image : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"image","hash":{},"data":data}) : helper)))
    + ".png\">\r\n            </div>\r\n            <div class=\"list-col\">"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.input : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\r\n        </div>\r\n    </div>\r\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "<input type=\"text\" id=\"jamdate\">";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {});

  return "<div class=\"grouppanel\">\r\n    <div class=\"grouptitle\">\r\n        <div class=\"titletext\">"
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\r\n    </div>\r\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.menus : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <div class=\"clearfix\"></div>\r\n</div>\r\n";
},"useData":true});
})();