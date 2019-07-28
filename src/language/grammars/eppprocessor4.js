// Generated automatically by nearley, version 2.16.0
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const moo = require("moo"); // this 'require' creates a node dependency

const lexer = moo.compile({
  separator:      /,/,
  paramEnd:       /}/,
  paramBegin:     /{/,
  oscAddress:     /(?:\/[a-zA-Z0-9]+)+/,
  sample:         /(?:\\[a-zA-Z0-9]+)+/,
  add:            /\+/,
  mult:           /\*/,
  div:            /\//,
  dot:            /\./,
  hash:           /\#/,
  hyphen:         /\-/,
  ndash:          /\–/,
  mdash:          /\—/,
  comma:          /\,/,
  colon:          /\:/,
  semicolon:      /\;/,
  split:          /\<:/,
  merge:          /\:>/,
  tilde:          /\~/,
  funcName:       /[a-zA-Z][a-zA-Z0-9]*/,
  number:         /[-+]?[0-9]*\.?[0-9]+/,
  ws:             {match: /\s+/, lineBreaks: true},
});
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "main", "symbols": ["_", "Statement", "_"], "postprocess": d => ( { "@lang": d[1] } )},
    {"name": "Statement", "symbols": ["Expression", "_", (lexer.has("semicolon") ? {type: "semicolon"} : semicolon), "_", "Statement"], "postprocess": d => [{ "@spawn": d[0] }].concat(d[4])},
    {"name": "Statement$ebnf$1$subexpression$1", "symbols": ["_", (lexer.has("semicolon") ? {type: "semicolon"} : semicolon)]},
    {"name": "Statement$ebnf$1", "symbols": ["Statement$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "Statement$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Statement", "symbols": ["Expression", "Statement$ebnf$1"], "postprocess": d => [{ "@spawn": d[0] }]},
    {"name": "Statement", "symbols": [(lexer.has("hash") ? {type: "hash"} : hash), /./, {"literal":"\n"}], "postprocess": d => ( { "@comment": d[3] } )},
    {"name": "Expression", "symbols": [(lexer.has("paramBegin") ? {type: "paramBegin"} : paramBegin), "Params", (lexer.has("paramEnd") ? {type: "paramEnd"} : paramEnd), (lexer.has("funcName") ? {type: "funcName"} : funcName)], "postprocess": d => ( { "@synth": { "@params":d[1], "@jsfunc":d[3], "paramBegin":d[0], "paramEnd":d[2]}} )},
    {"name": "Expression", "symbols": [(lexer.has("paramBegin") ? {type: "paramBegin"} : paramBegin), "Params", (lexer.has("paramEnd") ? {type: "paramEnd"} : paramEnd), (lexer.has("sample") ? {type: "sample"} : sample)], "postprocess": d => ( { "@sample": { "@params":d[1], "@filename":d[3]} })},
    {"name": "Expression", "symbols": [(lexer.has("paramBegin") ? {type: "paramBegin"} : paramBegin), "Params", (lexer.has("paramEnd") ? {type: "paramEnd"} : paramEnd), (lexer.has("oscAddress") ? {type: "oscAddress"} : oscAddress)], "postprocess": d => ( { "@oscreceiver": { "@params":d[1], "@oscaddr":d[3], "paramBegin":d[0], "paramEnd":d[2]} } )},
    {"name": "Expression", "symbols": [(lexer.has("oscAddress") ? {type: "oscAddress"} : oscAddress)], "postprocess": d => ( { "@oscreceiver": { "@params":{}, "@oscaddr":d[0]} } )},
    {"name": "Params$subexpression$1", "symbols": [(lexer.has("number") ? {type: "number"} : number)]},
    {"name": "Params", "symbols": ["Params$subexpression$1"], "postprocess": d => ([ { "@num":d[0][0]}] )},
    {"name": "Params", "symbols": [(lexer.has("number") ? {type: "number"} : number), (lexer.has("separator") ? {type: "separator"} : separator), "Params"], "postprocess": d => ([ { "@num": d[0]}].concat(d[2]) )},
    {"name": "Params", "symbols": ["Expression"], "postprocess": d => ([ { "@num":d[0]}])},
    {"name": "Params", "symbols": ["Expression", (lexer.has("separator") ? {type: "separator"} : separator), "Params"], "postprocess": d => ([ { "@num": d[0]}].concat(d[2]) )},
    {"name": "Params", "symbols": [(lexer.has("paramBegin") ? {type: "paramBegin"} : paramBegin), "Params", (lexer.has("paramEnd") ? {type: "paramEnd"} : paramEnd)], "postprocess": d => ([ { "@list":d[1]} ])},
    {"name": "Params", "symbols": [(lexer.has("paramBegin") ? {type: "paramBegin"} : paramBegin), "Params", (lexer.has("paramEnd") ? {type: "paramEnd"} : paramEnd), (lexer.has("separator") ? {type: "separator"} : separator), "Params"], "postprocess": d => ([ { "@list":d[1]} ].concat(d[4]) )},
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
