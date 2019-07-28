
@{%
var semaIR = require('./semaIR.js');
console.log(semaIR);

const moo = require("moo"); // this 'require' creates a node dependency

const lexer = moo.compile({
  //comment:        /\/\/\w.+[^\n]/,
  separator:      /,/,
  paramEnd:       /\)/,
  paramBegin:     /\(/,
  pi:             /_pi|_π/,
  twopi:          /_twopi|_two_pi|_tau|_2π|_2pi/,
  e:              /_e/,
  phi:            /_phi|_gold/,
  sqrt2:          /_pyt|_sqrt2|_s2/,
  //arrayBegin:     /\[/,
  //arrayEnd:       /\]/,
  //varStart:       /let/,
  //varApply:       /be/,
  varApply:       /is|=/,
  variable:       /\#[a-zA-Z0-9]+/,
  string:         { match: /\\[a-zA-Z0-9]+/, lineBreaks: true, value: x => x.slice(1, x.length)},
  //string:       /\"[a-zA-Z0-9]+"/,
  //sample:       { match: /\\[a-zA-Z0-9]+/, lineBreaks: true, value: x => x.slice(1, x.length)},
  //stretch:       { match: /\@[a-zA-Z0-9]+/, lineBreaks: true, value: x => x.slice(1, x.length)},
  oscAddress:   /(?:\/[a-zA-Z0-9]+)+/,
  number:       /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
  semicolon:    /;/,
  funcName:     /[a-zA-Z][a-zA-Z0-9]*/,
  //funcName:     { match: /[a-zA-Z][a-zA-Z0-9]*\(/, lineBreaks: false, value: x => x.slice(0, x.length-1)},
  //variable:     /[a-zA-Z][a-zA-Z0-9]*/,
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
  %variable _ %varApply _ Expression 
  {% d => semaIR.setvar(d[0],d[4]) %}
  # %sample _ ParameterList
  # {% d => semaIR.synth("sampler", d[2]["@params"].concat([semaIR.str(d[0].value)]))%}
  # |
  # %stretch _ ParameterList
  # {% d => semaIR.synth("stretch", d[2]["@params"].concat([semaIR.str(d[0].value)]))%}
  # |
  # %oscAddress
  # {% d=> semaIR.synth("oscin", [semaIR.str(d[0].value),semaIR.num(-1)])%}
  # |
  # %oscAddress _ ParameterList 
  # {% d=> semaIR.synth("oscin", [semaIR.str(d[0].value),d[0]["@params"][2]])%}
  # |

ParameterList ->
  %paramBegin Params %paramEnd
  {% d => ({"paramBegin":d[0], "@params":d[1], "paramEnd":d[2]} ) %}
  |
  %paramBegin %paramEnd
  {% d => ({"paramBegin":d[0], "@params": "", "paramEnd":d[1]} ) %}

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
  |
  Constant
  {% (d) => ([d[0]]) %}
  # |
  # %list
  # {% (d) => semaIR.list(d[0].value) %}

Constant ->
  %pi
  {% (d) => (semaIR.num(3.14159265359)) %}
  |
  %twopi
  {% (d) => (semaIR.num(3.14159265359*2.0)) %}
  |
  %e
  {% (d) => (semaIR.num(2.71828182846)) %}
  |
  %phi
  {% (d) => (semaIR.num((1+Math.sqrt(5))/2)) %}
  |
  %sqrt2
  {% (d) => (semaIR.num(Math.sqrt(2))) %}
  

# Whitespace

_  -> wschar:*                                                
{% function(d) {return null;} %}
__ -> wschar:+                                                
{% function(d) {return null;} %}

wschar -> %ws                                                 {% id %}