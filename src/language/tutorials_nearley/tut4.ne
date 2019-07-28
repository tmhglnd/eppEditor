
@{%
var semaIR = require('./semaIR.js');
console.log(semaIR);

const moo = require("moo"); // this 'require' creates a node dependency

const lexer = moo.compile({
  sample:         /new sample/,
  synth:          /new synth/,
  word:           /[a-zA-Z][a-zA-Z0-9]*/,
  separator:      /->/,
  number:         /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
  ws:           {match: /\s+/, lineBreaks: true},
});

%}



# Pass your lexer object using the @lexer option
@lexer lexer

main -> _ Statement _                                         {% d => ({ "@lang" : d[1] })  %}

Statement ->
  %sample %ws SampleName %separator %number
  {% d => [{"@sigOut": { "@spawn": semaIR.synth('loop',[semaIR.num(d[4].value),semaIR.str(d[2])]) }}] %}
  |
  %synth %ws SynthName %separator %number
  {% d => [{"@sigOut": { "@spawn": semaIR.synth(semaIR.str(d[2]), semaIR.num(d[4].value)) }}] %}
  
SampleName -> (%word) {% d => d[0][0].value %}

SynthName -> (%word) {% d => d[0][0].value %}

# Whitespace

_  -> wschar:*                                                {% function(d) {return null;} %}
__ -> wschar:+                                                {% function(d) {return null;} %}

wschar -> %ws                                                 {% id %}
