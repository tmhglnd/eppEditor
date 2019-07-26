
# **MAIA - Audio Livecoding Language in the Browser**

*This language is forked from the [SEMA project](https://github.com/mimic-sussex/eppEditor) and it uses the [Maximilian.js](https://github.com/micknoise/Maximilian) audio engine for webaudio in the browser. SEMA is a Livecoding Language Design Platform created by the amazing team from the [MIMIC Project](https://mimicproject.com/about). Sema is a playground where you can rapid prototype mini-languages for live coding that integrate signal synthesis, machine learning and machine listening.*

MAIA is a livecoding mini-language with a grammar that focuses on readability and various extra functionalities in the sound engine other than the default SEMA grammar. It has more abstracted functions (such as synths) and a few more 'musical' methods that generate rhythms. MAIA is the result my work during the MIMIC Artists Summer Workshop at Sussex University.

## Changes and Additions to the SEMA language

### The grammer
- Start variables with `#`, store to variable with `is`
- Use `(` and `)` for functions, close line with `;`
- Store a constant value with `constant()`
```
#freq is constant(500);
#sound is sine(#freq);
mul(#sound, 0.5);
```
### Quick synthesis
- Use `amsynth`, `fmsynth`, `oscbank`, `sawbank`, `squarebank`, `trianglebank` for fast access to audio synthesis functions
```
oscbank(400, 500, 600, 700);
fmsynth(220, 2, 5);
amsynth(314, 628);
```

### Global synced rhythm
- Set a global variable for bpm and use it in combination with the `click` function to generate rhythmical patterns to trigger samples. The `click` function takes 3 arguments, bpm value, bar division and beat offset (0-1).
```
#bpm is constant(103);
#kc is sample(\kick, click(#bpm, 2));
#sn is sample(\snare, click(#bpm, 1, 0.5));
#ht is sample(\hat, click(#bpm, 4, 0.5));
mul(sum(#kc, #sn, #ht), 0.5);
```

### Additional Text window
- Use the additional text window on the right side of the screen for communication with the audience by writing comments during the performance.
- Explain your train of thought.

## Documentation

For a complete list of functions see the documentation below.

[Maia API documentation](doc/maia_API_doc.md)

[Sema Intermediate Language](doc/semaIR.md)

[Data storage and loading](doc/Model_loading_storing.md)

[Maximilian DSP library API](doc/maxi_API_doc.md)

[Sema Default Grammar](doc/LiveCodingAPI_defaultGrammar.md) - *Not used, overwritten by the Maia grammar*

## Dependencies

Sema requires the following dependencies to be installed:

 - [Chrome browser](https://www.google.com/chrome/) 
 - Node.js version 8.9 or higher
 - [NPM cli](https://docs.npmjs.com/cli/npm) OR [Yarn](https://yarnpkg.com/en/)
 
## Install

How to build and run the Sema playground on your machine 

```sh
cd sema
yarn
yarn build
yarn dev
```