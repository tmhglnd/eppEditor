
@{%
var semaIR = require('./semaIR.js');
console.log(semaIR);

const moo = require("moo"); // this 'require' creates a node dependency

// symbols in the language for the lexer
// /click/ => literal matching defined as click:
const lexer = moo.compile({
  click:          /click/,
  ws:           {match: /\s+/, lineBreaks: true},
});

%}



# Pass your lexer object using the @lexer option
@lexer lexer

# Statement will be replaced based on the symbol from the lexer
main -> _ Statement _                                         
# {% d => d %}
# {% d => ({ "@lang" : d[1] })  %}
# Similar to short-hand function above
{% function(d){ return ({ "@lang" : d[1] }) } %}

# Statement can only be %click. 
Statement ->
      %click
      {% d => [{"@sigOut": { "@spawn": semaIR.synth('loop',[semaIR.num(1),semaIR.str('click')]) }}] %}

# Whitespace

_  -> wschar:*                                                {% function(d) {return null;} %}
__ -> wschar:+                                                {% function(d) {return null;} %}

wschar -> %ws                                                 {% id %}

# in terminal run to generate grammar: $ nearleyc tut1.ne -o livelang.js
# in terminal test: $ nearley-test ./livelang.js --input 'click'
# returns =>
# Parse results: 
# [ { '@lang':
#      [ { '@sigOut':
#           { '@spawn':
#              { '@sigp':
#                 { '@params': [ { '@num': { value: 1 } }, { '@string': 'click' } ],
#                   '@func': { value: 'loop' } } } } } ] } ]