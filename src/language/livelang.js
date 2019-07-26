// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

var semaIR = require('./semaIR.js');
console.log(semaIR);

const moo = require("moo"); // this 'require' creates a node dependency

const lexer = moo.compile({
  separator:    /,/,
  paramEnd:     /\)/,
  paramBegin:   /\(/,
  variable:     /\#[a-zA-Z0-9]+/,
  string:       { match: /\\[a-zA-Z0-9]+/, lineBreaks: true, value: x => x.slice(1, x.length)},
  //string:       /\"[a-zA-Z0-9]+"/,
  //sample:       { match: /\\[a-zA-Z0-9]+/, lineBreaks: true, value: x => x.slice(1, x.length)},
  //stretch:       { match: /\@[a-zA-Z0-9]+/, lineBreaks: true, value: x => x.slice(1, x.length)},
  oscAddress:   /(?:\/[a-zA-Z0-9]+)+/,
  number:       /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
  semicolon:    /;/,
  apply:        /is/,
  funcName:     /[a-zA-Z][a-zA-Z0-9]*/,
  ws:           {match: /\s+/, lineBreaks: true},
});

var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["_", "Statement", "_"], "postprocess": d => ({ "@lang" : d[1] })},
    {"name": "Statement", "symbols": ["Expression", "_", (lexer.has("semicolon") ? {type: "semicolon"} : semicolon), "_", "Statement"], "postprocess": d => [{ "@spawn": d[0] }].concat(d[4])},
    {"name": "Statement", "symbols": ["Expression", "_", (lexer.has("semicolon") ? {type: "semicolon"} : semicolon)], "postprocess": d => [{"@sigOut": { "@spawn": d[0] }}]},
    {"name": "Expression", "symbols": [(lexer.has("funcName") ? {type: "funcName"} : funcName), "_", "ParameterList"], "postprocess": d=> semaIR.synth(d[0].value, d[2]["@params"])},
    {"name": "Expression", "symbols": [(lexer.has("stretch") ? {type: "stretch"} : stretch), "_", "ParameterList"], "postprocess": d => semaIR.synth("stretch", d[2]["@params"].concat([semaIR.str(d[0].value)]))},
    {"name": "Expression", "symbols": [(lexer.has("oscAddress") ? {type: "oscAddress"} : oscAddress)], "postprocess": d=> semaIR.synth("oscin", [semaIR.str(d[0].value),semaIR.num(-1)])},
    {"name": "Expression", "symbols": [(lexer.has("oscAddress") ? {type: "oscAddress"} : oscAddress), "_", "ParameterList"], "postprocess": d=> semaIR.synth("oscin", [semaIR.str(d[0].value),d[0]["@params"][2]])},
    {"name": "Expression", "symbols": [(lexer.has("variable") ? {type: "variable"} : variable), "_", (lexer.has("apply") ? {type: "apply"} : apply), "_", "Expression"], "postprocess": d => semaIR.setvar(d[0],d[4])},
    {"name": "ParameterList", "symbols": [(lexer.has("paramBegin") ? {type: "paramBegin"} : paramBegin), "Params", (lexer.has("paramEnd") ? {type: "paramEnd"} : paramEnd)], "postprocess": d => ({"paramBegin":d[0], "@params":d[1], "paramEnd":d[2]} )},
    {"name": "ParameterList", "symbols": [(lexer.has("paramBegin") ? {type: "paramBegin"} : paramBegin), (lexer.has("paramEnd") ? {type: "paramEnd"} : paramEnd)], "postprocess": d => ({"paramBegin":d[0], "@params": "", "paramEnd":d[1]} )},
    {"name": "Params", "symbols": ["ParamElement"], "postprocess": (d) => ([d[0]])},
    {"name": "Params", "symbols": ["ParamElement", "_", (lexer.has("separator") ? {type: "separator"} : separator), "_", "Params", "_"], "postprocess": d => [d[0]].concat(d[4])},
    {"name": "ParamElement", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": (d) => ({"@num":d[0]})},
    {"name": "ParamElement", "symbols": ["Expression"], "postprocess": id},
    {"name": "ParamElement", "symbols": [(lexer.has("variable") ? {type: "variable"} : variable)], "postprocess": (d) => semaIR.getvar(d[0])},
    {"name": "ParamElement", "symbols": [(lexer.has("paramBegin") ? {type: "paramBegin"} : paramBegin), "Params", (lexer.has("paramEnd") ? {type: "paramEnd"} : paramEnd)], "postprocess": (d) => ({"@list":d[1]})},
    {"name": "ParamElement", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": (d) => semaIR.str(d[0].value)},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [(lexer.has("ws") ? {type: "ws"} : ws)], "postprocess": id}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
