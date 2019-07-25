var objectID = 0;




const oscMap = {
  '@sin': "sinewave",
  "@saw": "saw",
  "@square": "square",
  "@tri": "triangle",
  "@pha": "phasor"
};

const jsFuncMap = {
  'amsynth': {
    "setup":(o,p) => `${o} = new Module.maxiOsc();
        ${o}mod = new Module.maxiOsc();
        ${o}.phaseReset(${p.length>2 ? p[2].loop : 0.0});
        ${o}mod.phaseReset(${p.length>2 ? p[2].loop : 0.0});`,
    "loop":(o,p) => `${o}.sinewave(${p[0].loop})*${o}mod.sinewave(${p[1].loop})`},

  'rmsynth': {
      "setup":(o,p) => `${o} = new Module.maxiOsc();
          ${o}mod = new Module.maxiOsc();
          ${o}.phaseReset(${p.length>2 ? p[2].loop : 0.0});
          ${o}mod.phaseReset(${p.length>2 ? p[2].loop : 0.0});`,
      "loop":(o,p) => `${o}.sinewave(${p[0].loop})*${o}mod.sinewave(${p[0].loop}*${p[1].loop})`},

  'fmsynth': {
    "setup":(o,p) => `${o} = new Module.maxiOsc();
      ${o}mod = new Module.maxiOsc();
      ${o}.phaseReset(${p.length>3 ? p[1].loop : 0.0});
      ${o}mod.phaseReset(${p.length>3 ? p[1].loop : 0.0});`,
    "loop":(o,p) => `${o}.sinewave(${p[0].loop} + ${o}mod.sinewave(${p[0].loop} * ${p[1].loop}) * (${p[2].loop} * ${p[0].loop} * ${p[1].loop}))`},

  'oscbank': {
    "setup":(o,p) => 
    `${o} = [];
    for (let i=0; i<${p.length}; i++){
      ${o}[i] = new Module.maxiOsc(); }`,
    "loop":(o,p) => {let s=`(${o}[0].sinewave(${p[0].loop})`; for(let i=1; i < p.length; i++) s += `+${o}[${i}].sinewave(${p[i].loop})`; return s+")/"+`${p.length}`;}},

  'sawbank': {
    "setup":(o,p) => 
    `${o} = [];
    for (let i=0; i<${p.length}; i++){
      ${o}[i] = new Module.maxiOsc(); }`,
    "loop":(o,p) => {let s=`(${o}[0].saw(${p[0].loop})`; for(let i=1; i < p.length; i++) s += `+${o}[${i}].saw(${p[i].loop})`; return s+")/"+`${p.length}`;}},

  'click': {
    "setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>2 ? p[2].loop : 0.0});`, 
    "loop":(o,p)=>`${o}.impulse((${p[0].loop}/240)*${p[1].loop})`},

  'count': {
    "setup":(o,p)=>`${o} = new Module.maxiOsc(); 
      ${o}.phaseReset(${p.length>3 ? p[3].loop : 0.0});`,
    "loop":(o,p)=>`Math.floor(${o}.phasor(${p[0].loop}/240,${p[1].loop},${p[2].loop}))`},

  // 'select': {
  //   "setup":(o,p) => `${o} = new Module.maxiOsc();`, 
  //   "loop":(o,p) => {let s= `(`; for(let i=1; i < p.length-1; i++){ if(p[0].loop == i) { s=`${p[i].loop}`; return s;+")";}},

  'saw': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.saw(${p[0].loop})`},
  'sine': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.sinewave(${p[0].loop})`},
  'triangle': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.triangle(${p[0].loop})`},
  'phasor': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.phasor(${p[0].loop})`},
  'ph2': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>3 ? p[3].loop : 0.0});`, "loop":(o,p)=>`${o}.phasor(${p[0].loop},${p[1].loop},${p[2].loop})`},
  'square': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.square(${p[0].loop})`},
  'pulse': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>2 ? p[2].loop : 0.0});`, "loop":(o,p)=>`${o}.pulse(${p[0].loop},${p[1].loop})`},
  'impulse': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.impulse(${p[0].loop})`},
  'sawn': {"setup":(o,p)=>`${o} = new Module.maxiOsc(); ${o}.phaseReset(${p.length>1 ? p[1].loop : 0.0});`, "loop":(o,p)=>`${o}.sawn(${p[0].loop})`},
  'noise': {"setup":(o,p)=>`${o} = new Module.maxiOsc()`, "loop":(o,p)=>`${o}.noise()*${p[0].loop}`},

  'toFreq' : {"setup":(o,p)=>"", "loop":(o,p)=>`Math.pow(2, Math.floor(${p[0].loop}-69)/12) * 440`},
  'constant': {"setup":(o,p)=>"", "loop":(o,p)=>`${p[0].loop}`},
  
  'gt': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} > ${p[1].loop}) ? 1 : 0`},
  'lt': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} < ${p[1].loop}) ? 1 : 0`},
  'mod': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} % ${p[1].loop})`},
  'add': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} + ${p[1].loop})`},
  'mul': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} * ${p[1].loop})`},
  'sub': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} - ${p[1].loop})`},
  'div': {"setup":(o,p)=>"", "loop":(o,p)=>`(${p[0].loop} / ${p[1].loop})`},
  'pow': {"setup":(o,p)=>"", "loop":(o,p)=>`Math.pow(${p[0].loop},${p[1].loop})`},
  'abs': {"setup":(o,p)=>"", "loop":(o,p)=>`Math.abs(${p[0].loop})`},
  'sah':{"setup":(o,p)=>`${o} = new Module.maxiSampleAndHold();`, "loop":(o,p)=>`${o}.sah(${p[0].loop},${p[1].loop})`},
  'env': {"setup":(o,p)=>`${o} = new Module.maxiEnv();${o}.setAttack(${p[1].loop});${o}.setDecay(${p[2].loop});${o}.setSustain(${p[3].loop});${o}.setRelease(${p[4].loop})`, "loop":(o,p)=>`${o}.adsr(1,${p[0].loop})`},
  'sum': {"setup":(o,p)=>"", "loop":(o,p)=>{let s=`(${p[0].loop}`; for(let i=1; i < p.length; i++) s += `+${p[i].loop}`; return s+")";}},
  'mix': {"setup":(o,p)=>"", "loop":(o,p)=>{let s=`((${p[0].loop}`; for(let i=1; i < p.length; i++) s += `+${p[i].loop}`; return s+`)/Math.sqrt(${p.length}))`;}},
  'prod': {"setup":(o,p)=>"", "loop":(o,p)=>{let s=`(${p[0].loop}`; for(let i=1; i < p.length; i++) s += `*${p[i].loop}`; return s+")";}},
  'maplinb': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linlin(${p[0].loop}, -1, 1, ${p[1].loop}, ${p[2].loop})`},
  'maplinu': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linlin(${p[0].loop}, 0, 1, ${p[1].loop}, ${p[2].loop})`},
  'map': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linexp(${p[0].loop}, -1, 1, ${p[1].loop}, ${p[2].loop})`},
  'mapu': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linexp(${p[0].loop}, 0.0000001, 1, ${p[1].loop}, ${p[2].loop})`},
  'maplin': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linlin(${p[0].loop}, ${p[1].loop}, ${p[2].loop},${p[3].loop}, ${p[4].loop})`},
  'scale': {"setup":(o,p)=>"", "loop":(o,p)=>`Module.maxiMap.linexp(${p[0].loop}, ${p[1].loop}, ${p[2].loop},${p[3].loop}, ${p[4].loop})`},
  
  'distort': {"setup":(o,p)=>`${o} = new Module.maxiDistortion()`, "loop":(o,p)=>`${o}.atanDist(${p[0].loop},${p[1].loop})`},
  'flanger': {"setup":(o,p)=>`${o} = new Module.maxiFlanger()`, "loop":(o,p)=>`${o}.flange(${p[0].loop},${p[1].loop},${p[2].loop},${p[3].loop},${p[4].loop})`},
  'chorus': {"setup":(o,p)=>`${o} = new Module.maxiChorus()`, "loop":(o,p)=>`${o}.chorus(${p[0].loop},${p[1].loop},${p[2].loop},${p[3].loop},${p[4].loop})`},
  'lopass': {"setup":(o,p)=>`${o} = new Module.maxiFilter()`, "loop":(o,p)=>`${o}.lopass(${p[0].loop},${p[1].loop})`},
  'hipass': {"setup":(o,p)=>`${o} = new Module.maxiFilter()`, "loop":(o,p)=>`${o}.hipass(${p[0].loop},${p[1].loop})`},
  'lores': {"setup":(o,p)=>`${o} = new Module.maxiFilter()`, "loop":(o,p)=>`${o}.lores(${p[0].loop},${p[1].loop},${p[2].loop})`},
  'hires': {"setup":(o,p)=>`${o} = new Module.maxiFilter()`, "loop":(o,p)=>`${o}.hires(${p[0].loop},${p[1].loop},${p[2].loop})`},
  //>>> deprecated
  'toModel': {"setup":(o,p)=>`${o} = this.registerTransducer('testmodel', ${p[0].loop})`, "loop":(o,p)=>`${o}.send(${p[1].loop}, ${p[2].loop})`},
  'fromModel': {"setup":(o,p)=>`${o} = this.registerTransducer('testmodel', ${p[0].loop})`, "loop":(o,p)=>`${o}.receive(${p[1].loop})`},
  //<<< deprecated
  'toJS': {"setup":(o,p)=>`${o} = this.registerTransducer('${o}', ${p[0].loop})`, "loop":(o,p)=>`${o}.send(${p[1].loop}, ${p[2].loop})`},
  'fromJS': {"setup":(o,p)=>`${o} = this.registerTransducer('${o}', ${p[0].loop})`, "loop":(o,p)=>`${o}.receive(${p[1].loop})`},
  'adc': {"setup":(o,p)=>"", "loop":(o,p)=>`inputs[${p[0].loop}]`},
  
  'sample': {"setup":(o,p)=>`${o} = new Module.maxiSample();
                                  ${o}.setSample(this.getSampleBuffer(${p[0].loop}));`,
                                  "loop":(o,p)=>`(${o}.isReady() ? ${o}.playOnZX(${p[1].loop}) : 0.0)`},
  'loop': {"setup":(o,p)=>`${o} = new Module.maxiSample();
                                  ${o}.setSample(this.getSampleBuffer(${p[0].loop}));`,
                                  "loop":(o,p)=>`(${o}.isReady() ? ${o}.play(${p[1].loop}) : 0.0)`},
  
                                  'oscin':{"setup":(o,p)=>"", "loop":(o,p)=>`this.OSCTransducer(${p[0].loop},${p[1].loop})`},
  /*'stretch': {"setup":(o,p)=>`${o} = new Module.maxiSample();
                                  ${o}.setSample(this.getSampleBuffer(${p[0].loop}));
                                  ${o}stretch = new Module.maxiStretch();
                                  ${o}stretch.setSample(${o});
                                  `,
                                  // "loop":(o,p)=>`(${o}.isReady() ? ${o}stretch.play(${p[1].loop},${p[2].loop},${p[3].loop},${p[4].loop},0.0) : 0.0)`},
                                  "loop":(o,p)=>`${o}.isReady() ? ${o}stretch.play(${p[1].loop},${p[2].loop},${p[3].loop},${p[4].loop},${p[5].loop}) : 0.0`},
                                  // "loop":(o,p)=>`(0.0)`},
                                  // "loop":(o,p)=>`(${o}.isReady() ? 0.0 : 0.0)`},*/
  'delay': {
    "setup":(o,p)=>`${o} = new Module.maxiDelayline();
    ${o}wet = ${p.length>3 ? p[3].loop : 0.4}`,
    "loop":(o,p)=>`${p[0].loop} * (1 -${o}wet) + Math.tanh(${o}.dl(${p[0].loop},${p[1].loop}*44.1,${p[2].loop})) * ${o}wet`},
}

class IRToJavascript {

  static getNextID() {
    objectID = objectID > 9999 ? 0 : ++objectID;
    return objectID;
  }

  static emptyCode() {
    return {
      "setup": "",
      "loop": "",
      "paramMarkers": []
    };
  }

  static traverseTree(t, code, level) {
    // console.log(`DEBUG:IR:traverseTree: level: ${level}`);
    let attribMap = {
      '@lang': (ccode, el) => {
        // console.log("lang")
        // console.log(el);
        // console.log(ccode)
        let statements = [];
        el.map((langEl) => {
          let statementCode = IRToJavascript.traverseTree(langEl, IRToJavascript.emptyCode(), level);
          console.log("@lang: " + statementCode.loop);
          ccode.setup += statementCode.setup;
          ccode.loop += statementCode.loop;
          // ccode.paramMarkers
        });
        return ccode;
      },
      '@sigOut': (ccode, el) => {
        ccode = IRToJavascript.traverseTree(el, ccode, level);
        ccode.loop = `q.sigOut = ${ccode.loop};`;
        return ccode;
      },
      '@spawn': (ccode, el) => {
        ccode = IRToJavascript.traverseTree(el, ccode, level);
        ccode.loop += ";";
        return ccode;
      },
      '@sigp': (ccode, el) => {
        let paramMarkers = [{"s":el['paramBegin'], "e":el['paramEnd'], "l":level}]
        ccode.paramMarkers = ccode.paramMarkers.concat(paramMarkers);

        let functionName = el['@func'].value;
        let funcInfo = jsFuncMap[functionName];
        let objName = "q.u" + IRToJavascript.getNextID();

        let allParams=[];

        for (let p = 0; p < el['@params'].length; p++) {
          let params = IRToJavascript.emptyCode();
          params = IRToJavascript.traverseTree(el['@params'][p], params, level+1);
          // console.log(params);
          allParams[p] = params;
        }
        console.log(allParams);
        let setupCode = "";
        for (let param in allParams) {
          setupCode += allParams[param].setup;
          ccode.paramMarkers = ccode.paramMarkers.concat(allParams[param].paramMarkers);
        }
        ccode.setup += `${setupCode} ${funcInfo.setup(objName, allParams)};`;
        ccode.loop += `${funcInfo.loop(objName, allParams)}`;
        return ccode;
      },
      '@setvar': (ccode, el) => {
        let varValueCode = IRToJavascript.traverseTree(el['@varvalue'], IRToJavascript.emptyCode(), level+1);
        ccode.setup += varValueCode.setup;
        ccode.loop = `this.setvar(q, '${el['@varname']}', ${varValueCode.loop})`;
        return ccode;
      },
      '@getvar': (ccode, el) => {
        ccode.loop += `this.getvar(q, '${el.value}')`;
        return ccode;
      },
      '@string': (ccode, el) => {
        if (typeof el === 'string' || el instanceof String) {
          console.log("String: " + el);
          ccode.loop += `'${el}'`;
        } else {
          ccode = IRToJavascript.traverseTree(el, ccode, level);
        }
        return ccode;
      },
      '@num': (ccode, el) => {
        if (el.value) {
          ccode.loop += `${el.value}`;
        }
        //  else {
        //   ccode = IRToJavascript.traverseTree(el, ccode, level);
        // }
        return ccode;
      },
    }
    // console.log("Traverse")
    // console.log(t)
    if (Array.isArray(t)) {
      t.map((el) => {
        Object.keys(el).map((k) => {
          code = attribMap[k](code, el[k]);
        });
      })
    } else {
      Object.keys(t).map((k) => {
        // console.log(k);
        code = attribMap[k](code, t[k]);
      });
    }
    return code;
  }

  static treeToCode(tree) {
    // console.log(tree);
    let code = IRToJavascript.traverseTree(tree, IRToJavascript.emptyCode(), 0);
    code.setup = `() => {let q=this.newq(); ${code.setup}; return q;}`;
    code.loop = `(q, inputs) => {${code.loop} return q.sigOut;}`
    console.log(code.loop);
    // console.log(code.paramMarkers);
    return code;
  }

}

export default IRToJavascript;
