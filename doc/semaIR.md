
# **Sema Intermediate Representation (Custom)**

## Synthesis
### oscbank
A bank of sinewave oscillators
```
oscbank(<freq_1>, <freq_2>, ..., <freq_n>);
oscbank(200, 300, 400, 500, 600);
```

### sawbank
A bank of saw oscillators
```
sawbank(<freq_1>, <freq_2>, ..., <freq_n>);
sawbank(200, 300, 400, 500, 600);
```

### amsynth
A simple Amplitude Modulation (bipolar, Ringmodulation) of 2 sinewave oscillators
```
amsynth(<carrier frequency in Hz>, <modulation frequency in Hz>);
amsynth(200, 300);
```

### fmsynth
A simple Frequency Modulation of a sinewave oscillators
```
fmsynth(<carrier frequency in Hz>, <frequency modulation ratio>, <frequency modulation depth>);
fmsynth(200, 2, 5);
```

## Sampling
### sample
Creates a sampler with a signal input, the sample plays when the input has a positive zero crossing
```
sample(<filename>, <trigger by positive zero-crossing>);
sample(\kick, impulse(4));
```

### loop
Creates a sampler that plays in a continuous loop
```
loop(<filename>, <playback speed>);
loop(\amenbreak, 0.8);
```

## Variables
A variable name can be made with the `#` and the `is` function

### constant
Store a constant in a variable
```
#bpm is constant(115)
sample(\kick, click(#bpm, 4));
```
### signal
Store the result of a signal processing chain for later usage
```
#sines is oscbank(200, 300, 400, 500, 600);
distort(#sines, 10);
```

## Effects
### distort
Tanh distortion
```
distort(<signal>, <distortion level 0 upwards>)
```
### delay
A delay effect with feedback added to the original signal
```
delay(<signal>, <delay time in ms>, <feedback 0-1>, <wet, optional, default=0.4>);
```

## Oscillators
### saw
A saw oscillator
```
saw(<frequenzy in Hz>, <initial phase 0-1, optional>);
saw(200, 0.5);
```
### sine
A sinewave oscillator
```
sine(<frequenzy in Hz>, <initial phase 0-1, optional>);
sine(200, 0.5);
```
### triangle
A triangle wave oscillator
```
triangle(<frequenzy in Hz>, <initial phase 0-1, optional>);
triangle(200, 0.5);
```
### square
A square wave oscillator
```
square(<frequenzy in Hz>, <initial phase 0-1, optional>);
square(200, 0.5);
```
### phasor
A phasor, rising from 0 to 1
```
phasor(<frequenzy in Hz>, <initial phase 0-1, optional>);
phasor(200, 0.5);
```
### phasor2
A phasor with configurable start and end levels
```
phasor(<frequenzy in Hz>, <start>, <end>, <initial phase 0-1, optional>);
phasor(200, -1, 1, 0.5);
```
### pulse
A pulse oscillator with modulatable phase width
```
pulse(<frequenzy in Hz>, <pulse width 0-1>, <initial phase 0-1, optional>);
pulse(200, 0.1, 0.5);
```
### impulse
An impulse generator, useful for triggering one-shot samples
```
impulse(<frequenzy in Hz>, <initial phase 0-1, optional>);
impulse(4, 0.5);
sample(\kick, impulse(2));
```
### sawn
An band limited saw wave oscillator
```
sawn(<frequenzy in Hz>, <initial phase 0-1, optional>);
sawn(200, 0.5);
```
### noise
An white noise generator
```
noise(<amplitude>);
noise(0.8);
```
### click
An impulse generator, with bpm as argument and a division and offset parameter
```
click(<beats per minute>, <bar division>, <offset in bar 0-1, optional>);
click(110, 4);
sample(\kick, click(110, 4));
```
### count
A counter signal for 1 bar, set the speed in bpm, start count and end count
```
count(<beats per minute>, <start>, <end>);
#bpm is constant(100);
sine(mul(count(#bpm, 2, 12), 100));
```

## Filters
### lopass
One pole lowpass filter
```
lopass(<signal>, <cutoff 0-1>);
```
### hipass
One pole highpass filter
```
hipass(<signal>, <cutoff 0-1>);
```
### lores
Resonant lowpass filter
```
lores(<signal>, <cutoff in Hz>, <resonance 0 upwards>);
```
### hires
Resonant lowpass filter
```
hires(<signal>, <cutoff in Hz>, <resonance 0 upwards>);
```

## Communication with JS
### toJS
Creates a transducer for sending a signal to a javascript model
```
toJS(<polling frequency>, <index identifier>, <optional extra argument>);
```
### fromJS
Creates a transducer for receiving a signal from a javascript model
```
toJS(<polling frequency>, <index identifier>);
```

## Math Operations
### sah
Sample and hold
```
sah(<signal>, <resample and hold time in ms>);
```

### gt
Outputs 1 if $A > B$, otherwise 0
```
gt(<value/signal>, <value/signal>);
```
### lt
Outputs 1 if $A < B$, otherwise 0
```
lt(<value/signal>, <value/signal>);
```
### mod
return A modulo B
```
lt(<value/signal>, <value/signal>);
```
### add
$A + B$
```
add(<value/signal>, <value/signal>);
```
### sub
$A - B$
```
sub(<value/signal>, <value/signal>);
```
### mul
$A * B$
```
mul(<value/signal>, <value/signal>);
```
### div
$A / B$
```
div(<value/signal>, <value/signal>);
```
### pow
$A ^ B$
```
pow(<value/signal>, <value/signal>);
```
### abs
The absolute value of A
```
abs(<value/signal>);
```
### sum
Sums all parameters
```
sum(<x_1>, <x_2>, ..., <x_n>);
```
### prod
Product of all parameters
```
prod(<x_1>, <x_2>, ..., <x_n>);
```
### mix
Root Mean Square (RMS) of all parameters for an equal power mix of non-correlated sounds
```
mix(<x_1>, <x_2>, ..., <x_n>);
```

## Modulation
### env
ADSR envelope generator
Parameters:
 1. Input signal
 2. Attack
 3. Decay
 4. Sustain
 5. Release

## Mapping
### map
Map input into an exponential range, assuming bipolar source (between -1 and 1)
Parameters:
 1. Input signal
 2. Lower bound of destination range
 3. Upper bound of destination range
### mapu
Map input into an exponential range, assuming unipolar source (between 0 and 1)
Parameters:
 1. Input signal
 2. Lower bound of destination range
 3. Upper bound of destination range
### maplinb
Map input into a linear range, assuming bipolar source (between -1 and 1)
Parameters:
 1. Input signal
 2. Lower bound of destination range
 3. Upper bound of destination range
### maplinu
Map input into a linear range, assuming unipolar source (between 0 and 1)
Parameters:
 1. Input signal
 2. Lower bound of destination range
 3. Upper bound of destination range
### maplin
Map input into a linear range, specifying the range of the source
Parameters:
 1. Input signal
 2. Lower bound of source range
 3. Upper bound of source range
 4. Lower bound of destination range
 5. Upper bound of destination range
### scale
Map input into an exponential range, specifying the range of the source
Parameters:
 1. Input signal
 2. Lower bound of source range
 3. Upper bound of source range
 4. Lower bound of destination range
 5. Upper bound of destination range

<!-- ### flanger
Flanger
 1. Input signal
 2. Delay (ms)
 3. Feedback (0-1)
 4. Speed (Hz)
 5. Depth (0-1)
### chorus
Flanger
 1. Input signal
 2. Delay (ms)
 3. Feedback (0-1)
 4. Speed (Hz)
 5. Depth (0-1) -->
 
## Networking
### oscin
Receive and open sound control signal
 1. OSC address
 2. Index of the OSC data element to observe (-1 means all elements)

## Lexer and Parsing

# @lang
This is the top level node of the tree, and contains an array of branches

```
{ "@lang" : [branches]}
  ```
# @sigOut  

Output a signal from the signal engine
```
{"@sigOut": <branch>}
```

# @spawn
Execute a branch of a tree
```
{ "@spawn":<branch>}
```
# @num
```
{"@num":{value:val}}
```
# @str
```
{"@string":val}
```
# @setvar
Set a variable, with the output from a branch of the tree.
```
{"@setvar": {"@varname":<string>,"@varvalue":<branch>}};
```
# @getvar
Get a variable

```
{"@getvar":<string>}
```

# @sigp
@sigp represents a signal processor or signal generation.  It looks like this:

```
{"@sigp": {"@params":[params], "@func":<string>}}
```
It needs a function name, and an array of parameters.   You can use any of the options below:
