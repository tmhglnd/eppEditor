
# **MAIA - Audio Livecoding Language in the Browser**

*This language is forked from the [SEMA project](https://github.com/mimic-sussex/eppEditor) and it uses the [Maximilian.js](https://github.com/micknoise/Maximilian) audio engine for webaudio in the browser. SEMA is a Livecoding Language Design Platform created by the amazing team from the [MIMIC Project](https://mimicproject.com/about). Sema is a playground where you can rapid prototype mini-languages for live coding that integrate signal synthesis, machine learning and machine listening.*

MAIA is a livecoding mini-language with a grammar that focuses on readability and various extra functionalities in the sound engine other than the default SEMA grammar. It has more abstracted functions (such as synths) and a few more 'musical' methods that generate rhythms.

## Content

- Basic Language Usage
- Basic Oscillators
- Musical Generators
- Synthesis
- Sampling
- Variables
- Effects
- Communication with JS
- Math Operations
- Constants
- Modulation
- Mapping
- Networking
- Lexer and Parsing

## Basic Language Usage

All function calls start with `(`, end with `)` and the code line ends with a semicolon `;`.
```
sine(500);
```

A variable is created with the `#` sign, and a value is stored with the `is` operator. Variables can be re-used in other functions.
```
#lead is saw(500);
#bass is saw(125);
mix(#lead, #bass);
```

Functions can be nested to modulate other parameters.
```
sine(mul(sine(1), 500));
```
---
## Basic Oscillators
### sine
A sinewave oscillator. Provide the frequency as first argument, set the amplitude and phase with optional second and third argument.
```
sine(<frequenzy in Hz>, <amplitude - optional>, <initial phase 0-1, optional>);

sine(200, 0.5);
```
### saw
A saw oscillator. Provide the frequency as first argument, set the amplitude and phase with optional second and third argument.
```
saw(<frequenzy in Hz>, <amplitude - optional>, <initial phase 0-1, optional>);

saw(200, 0.5);
```
### sawn
An band limited saw wave oscillator. Provide the frequency as first argument, set the amplitude and phase with optional second and third argument.
```
sawn(<frequenzy in Hz>, <amplitude - optional>, <initial phase 0-1, optional>);

sawn(200, 0.5);
```
### triangle
A triangle wave oscillator. Provide the frequency as first argument, set the amplitude and phase with optional second and third argument.
```
triangle(<frequenzy in Hz>, <amplitude - optional>, <initial phase 0-1, optional>);

triangle(200, 0.5);
```
### square
A square wave oscillator. Provide the frequency as first argument, set the amplitude and phase with optional second and third argument.
```
square(<frequenzy in Hz>, <amplitude - optional>, <initial phase 0-1, optional>);

square(200, 0.5);
```
### phasor
A phasor, rising from 0 to 1.
```
phasor(<frequenzy in Hz>, <initial phase 0-1, optional>);

phasor(200, 0.5);
```
### phasir
A inverted phasor, falling from 1 to 0.
```
phasir(<frequenzy in Hz>, <initial phase 0-1, optional>);

phasir(200, 0.5);
```
### phasor2
A phasor with configurable start and end levels.
```
phasor(<frequenzy in Hz>, <start>, <end>, <initial phase 0-1, optional>);

phasor(200, -1, 1, 0.5);
```
### pulse
A pulse oscillator with modulatable phase width.
```
pulse(<frequenzy in Hz>, <pulse width 0-1>, <initial phase 0-1, optional>);

pulse(200, 0.1, 0.5);
```
### impulse
An impulse generator, useful for triggering one-shot samples.
```
impulse(<frequenzy in Hz>, <initial phase 0-1, optional>);

impulse(4, 0.5);

sample(\kick, impulse(2));
```
### noise
An white noise generator. Set the amplitude with an optional argument.
```
noise(<amplitude - optional>);

noise(0.8);
```

## Musical Generators

### click
An impulse generator, with bpm as argument, a division and offset parameter.
```
click(<beats per minute>, <bar division>, <offset in bar 0-1, optional>);

click(110, 4);

sample(\kick, click(110, 4));
```
### count
A counter signal for 1 bar, set the speed in bpm, start count and end count.
```
count(<beats per minute>, <start>, <end>);

count(110, 0, 16);

#bpm is constant(100);
sine(mul(count(#bpm, 2, 12), 100));
```
---
## Synthesis
### oscbank
A bank of sinewave oscillators. Phases of oscillators are positioned at random. Amplitude of total is divided by amount of oscillators to normalize amplitude.
```
oscbank(<freq_1>, <freq_2>, ..., <freq_n>);

oscbank(200, 300, 400, 500, 600);
```

### sawbank
A bank of saw-wave oscillators. Phases of oscillators are positioned at random. Amplitude of total is divided by amount of oscillators to normalize amplitude.
```
sawbank(<freq_1>, <freq_2>, ..., <freq_n>);

sawbank(200, 300, 400, 500, 600);
```

### squarebank
A bank of square-wave oscillators. Phases of oscillators are positioned at random. Amplitude of total is divided by amount of oscillators to normalize amplitude.
```
squarebank(<freq_1>, <freq_2>, ..., <freq_n>);

squarebank(200, 300, 400, 500, 600);
```

### trianglebank
A bank of triangle-wave oscillators. Phases of oscillators are positioned at random. Amplitude of total is divided by amount of oscillators to normalize amplitude. 
```
squarebank(<freq_1>, <freq_2>, ..., <freq_n>);

squarebank(200, 300, 400, 500, 600);
```

### amsynth
A simple Amplitude Modulation (bipolar, Ringmodulation) of 2 sinewave oscillators. Provide frequency for carrier and modulator oscillator.
```
amsynth(<carrier frequency in Hz>, <modulation frequency in Hz>);

amsynth(300, 400);
```

### fmsynth
A simple Frequency Modulation of a sinewave oscillators. Provide frequency for the carrier modulator, Harmonicity Ratio for modulation frequency and Modulation Index for depth.
```
fmsynth(<carrier frequency in Hz>, <harmonicity ratio>, <modulation index>);

fmsynth(200, 2, 5);
```
---
## Sampling
### sample
Creates a sampler to play a file from disk. The sample plays when the signal trigger has a positive zero crossing.
```
sample(<filename>, <trigger>);

sample(\kick, impulse(4));
```

### loop
Creates a sampler to play a file from disk. The file plays in a continuous loop. Provide playback speed.
```
loop(<filename>, <playback speed>);

loop(\amenbreak, 0.8);
```
---
## Variables
A variable name can be made with the `#` and the `is` function.

### constant
Store a constant in a variable
```
constant(<value>);

#bpm is constant(115);
sample(\kick, click(#bpm, 4));
```
### signal
Store the result of a signal processing chain for later usage.
```
#sines is oscbank(200, 300, 400, 500, 600);

distort(#sines, 10);
```
---
## Effects
### distort
A simple tanh distortion algorithm.
```
distort(<signal>, <distortion level 0 upwards>)

distort(sine(400), 200);
```
### delay
A delay effect with feedback added to the original signal
```
delay(<signal>, <delay time in ms>, <feedback 0-1>, <wet, optional, default=0.4>);
```

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
---
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
Resonant lowpass filter.
1. Input signal
2. Cutoff frequency in Hz (optional, default = 1000)
3. Resonance (optional, default = 1)
```
lores(<signal>, <cutoff>, <resonance>);
```
### hires
Resonant lowpass filter.
1. Input signal
2. Cutoff frequency in Hz (optional, default = 1000)
3. Resonance (optional, default = 1)
```
hires(<signal>, <cutoff>, <resonance>);
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
---
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

## Constants
The constants can be used in functions. All constants start with `_` followed by the constant name.
```
Pi                   : _pi | _π                   = 3.14159265359
Two Pi               : _twopi | _2π | _2pi | _tau = 6.28318530718
Euleurs number       : _e                         = 2.71828182846
Golden Ratio         : _phi | _gold               = 1.61803398875
Pythagoras' constant : _pyt | _sqrt2 | _s2        = 1.41421356237
``` 
A sinewave oscillator can therefor also be programmed by running a phasor multiplied by two pi radians trough a sin operator. The frequency of the phasor will determine the frequency of the sinewave.
```
sin(mul(phasor(220), _twopi));
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
---
## Mapping
### map
The most used mapping function, therefore easily accessible. Map input into an exponential range, assuming bipolar source (between -1 and 1).
```
map(<signal/value>, <low bound>, <high bound>);

map(sine(0.5), 100, 1000);
``` 
### mapu
Map input into an exponential range, assuming unipolar source (between 0 and 1).
```
mapu(<signal/value>, <low bound>, <high bound>);

mapu(phasor(0.5), 100, 1000);
``` 
### maplinb
Map input into a linear range, assuming bipolar source (between -1 and 1).
```
maplinb(<signal/value>, <low bound>, <high bound>);

maplinb(sine(0.5), 100, 1000);
``` 
### maplinu
Map input into a linear range, assuming unipolar source (between 0 and 1).
```
maplinu(<signal/value>, <low bound>, <high bound>);

maplinu(phasor(0.5), 100, 1000);
``` 
### maplin
Map input into a linear range, specifying the range of the source.
```
maplin(<signal/value>, <low input>, <high input>, <low bound>, <high bound>);

maplin(sine(0.5), 100, 1000);
``` 
### scale
Map input into an exponential range, specifying the range of the source
```
scale(<signal/value>, <low input>, <high input>, <low bound>, <high bound>);

map(sine(0.5), 100, 1000);
``` 
--- 
## Networking
### oscin
Receive an open sound control signal
 1. OSC address
 2. Index of the OSC data element to observe (-1 means all elements)

---