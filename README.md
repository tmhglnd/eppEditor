# **MAIA - Audio Livecoding Language in the Browser**

*This language is forked from the [SEMA project](https://github.com/mimic-sussex/eppEditor) and it uses the [Maximilian.js](https://github.com/micknoise/Maximilian) audio engine for webaudio in the browser. SEMA is a Livecoding Language Design Platform created by the amazing team from the [MIMIC Project](https://mimicproject.com/about). Sema is a playground where you can rapid prototype mini-languages for live coding that integrate signal synthesis, machine learning and machine listening.*

MAIA has a grammar that focuses on readability and various extra functionalities in the sound engine then the original SEMA grammar. It has more abstracted functions (such as synths) and a few more 'musical' methods that generate rhythms.

## Dependencies

Sema requires the following dependencies to be installed:

 - [Chrome browser](https://www.google.com/chrome/) 
 - Node.js version 8.9 or higher
 - [NPM cli](https://docs.npmjs.com/cli/npm) OR [Yarn](https://yarnpkg.com/en/)
 
## How to build and run the Sema playground on your machine 

```sh
cd sema
yarn
yarn build
yarn dev
```

## Documentation

[MAIA API documentation](doc/maia_API_doc.md)

[Sema Intermediate Language](doc/semaIR.md)

[Data storage and loading](doc/Model_loading_storing.md)

[Maximilian DSP Library API](doc/maxi_API_doc.md)