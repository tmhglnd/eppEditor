
@{%
var semaIR = require('./semaIR.js');
console.log(semaIR);

const moo = require("moo"); // this 'require' creates a node dependency

// three words specified in the lexer (click, convol1, heart)
const lexer = moo.compile({
  number:       /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
  sample:       /sample/,
  file:         /[a-zA-Z][a-zA-Z0-9]*/,
  ws:           {match: /\s+/, lineBreaks: true},
});

%}



# Pass your lexer object using the @lexer option
@lexer lexer

main -> _ Statement _                                         {% d => ({ "@lang" : d[1] })  %}

# | => means OR, click or convol1 or heart
Statement ->
# %click
# {% d => [{"@sigOut": { "@spawn": semaIR.synth('loop',[semaIR.num(1),semaIR.str('click')]) }}] %}
# |
# %convol1
# {% d => [{"@sigOut": { "@spawn": semaIR.synth('loop',[semaIR.num(1),semaIR.str('convol1')]) }}] %}
# |
# %heart
# {% d => [{"@sigOut": { "@spawn": semaIR.synth('loop',[semaIR.num(1),semaIR.str('heart')]) }}] %}
# |
%sample %ws %file %ws %number
{% d => [{"@sigOut": { "@spawn": semaIR.synth('loop',[semaIR.num(d[4].value),semaIR.str(d[2].value)]) }}] %}

# Whitespace

_  -> wschar:*                                                {% function(d) {return null;} %}
__ -> wschar:+                                                {% function(d) {return null;} %}

wschar -> %ws                                                 {% id %}
