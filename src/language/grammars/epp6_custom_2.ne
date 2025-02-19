
@{%
var semaIR = require('./semaIR.js');
console.log(semaIR);

const moo = require("moo"); // this 'require' creates a node dependency

const lexer = moo.compile({
  separator:    /,/,
  paramEnd:     /\)/,
  paramBegin:   /\(/,
  arrayBegin:   /\[/,
  arrayEnd:     /\]/,
  varStart:     /let/,
  varApply:     /be/,
  //apply:        /is/,
  //variable:     /\#[a-zA-Z0-9]+/,
  string:       { match: /\\[a-zA-Z0-9]+/, lineBreaks: true, value: x => x.slice(1, x.length)},
  //string:       /\"[a-zA-Z0-9]+"/,
  //sample:       { match: /\\[a-zA-Z0-9]+/, lineBreaks: true, value: x => x.slice(1, x.length)},
  //stretch:       { match: /\@[a-zA-Z0-9]+/, lineBreaks: true, value: x => x.slice(1, x.length)},
  oscAddress:   /(?:\/[a-zA-Z0-9]+)+/,
  number:       /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
  semicolon:    /;/,
  //funcName:     /[a-zA-Z][a-zA-Z0-9]*/,
  funcName:     { match: /[a-zA-Z][a-zA-Z0-9]*\(/, lineBreaks: false, value: x => x.slice(0, x.length-1)},
  variable:     /[a-zA-Z][a-zA-Z0-9]*/,
  ws:           {match: /\s+/, lineBreaks: true},
});

%}

# Pass your lexer object using the @lexer option
@lexer lexer

main -> _ Statement _                                         
{% d => ({ "@lang" : d[1] })  %}

Statement ->
  Expression _ %semicolon _ Statement 
  {% d => [{ "@spawn": d[0] }].concat(d[4]) %}
  |
  Expression _ %semicolon 
  {% d => [{"@sigOut": { "@spawn": d[0] }}] %}
  # | %hash . "\n"                                          
  # {% d => ({ "@comment": d[3] }) %}

Expression ->
  %funcName _ ParameterList
  {% d=> semaIR.synth(d[0].value, d[2]["@params"])%}
  |
  # %sample _ ParameterList
  # {% d => semaIR.synth("sampler", d[2]["@params"].concat([semaIR.str(d[0].value)]))%}
  # |
  %stretch _ ParameterList
  {% d => semaIR.synth("stretch", d[2]["@params"].concat([semaIR.str(d[0].value)]))%}
  |
  %oscAddress
  {% d=> semaIR.synth("oscin", [semaIR.str(d[0].value),semaIR.num(-1)])%}
  |
  %oscAddress _ ParameterList 
  {% d=> semaIR.synth("oscin", [semaIR.str(d[0].value),d[0]["@params"][2]])%}
  # |
  # %variable _ %apply _ Expression 
  # {% d => semaIR.setvar(d[0],d[4]) %}
  |
  %varStart _ %variable _ %varApply _ Expression 
  {% d => semaIR.setvar(d[2],d[6]) %}

ParameterList ->
  # THE OLD GRAMMAR ALWAYS CHECKED FOR PARAMETER BEGIN
  # %paramBegin Params %paramEnd
  # {% d => ({"paramBegin":d[0], "@params":d[1], "paramEnd":d[2]} ) %}
  # |
  # %paramBegin %paramEnd
  # {% d => ({"paramBegin":d[0], "@params": "", "paramEnd":d[1]} ) %}
  Params %paramEnd
  {% d => ({"paramBegin":"(", "@params":d[0], "paramEnd":d[1]} ) %}
  |
  %paramEnd
  {% d => ({"paramBegin":"(", "@params": "", "paramEnd":d[1]} ) %}


Params ->
  ParamElement                                                   
  {% (d) => ([d[0]]) %}
  |
  ParamElement _ %separator _ Params _                                        
  {% d => [d[0]].concat(d[4]) %}

ParamElement ->
  %number                                                     
  {% (d) => ({"@num":d[0]}) %}
  |
  Expression                                                  
  {% id %}
  |
  %variable                                                   
  {% (d) => semaIR.getvar(d[0]) %}
  |
  %paramBegin Params %paramEnd                               
  {%(d) => ({"@list":d[1]})%}
  |
  %string
  {% (d) => semaIR.str(d[0].value) %}

# Whitespace

_  -> wschar:*                                                
{% function(d) {return null;} %}
__ -> wschar:+                                                
{% function(d) {return null;} %}

wschar -> %ws                                                 {% id %}