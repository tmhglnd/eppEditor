
@{%
var semaIR = require('./semaIR.js');
console.log(semaIR);

const moo = require("moo"); // this 'require' creates a node dependency

const lexer = moo.compile({
  number:       /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
  sample:       /sample/,
  file:         /[a-zA-Z][a-zA-Z0-9]*/,
  ws:           {match: /\s+/, lineBreaks: true},
});

%}



# Pass your lexer object using the @lexer option
@lexer lexer

# this is where the parsing begins
main -> _ Statement _                                         {% d => ({ "@lang" : d[1] })  %}

Statement ->
  SampleName
  {% d => [{"@sigOut": { "@spawn": semaIR.synth('loop',[semaIR.num(1),semaIR.str(d[0])]) }}] %}

SampleName -> (%file) {% d => d[0][0].value %}

# Whitespace

_  -> wschar:*                                                {% function(d) {return null;} %}
__ -> wschar:+                                                {% function(d) {return null;} %}

wschar -> %ws                                                 {% id %}
