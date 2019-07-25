/*
#bpm is constant(115);
#esn1 is fromJS(11, 0);
#esn2 is fromJS(11, 1);
#esn3 is fromJS(22, 2);

#bss is lores(saw(120), map(triangle(5), 50, 3500), 1);

#fm is fmsynth(80, map(#esn2, 0.5, 10), map(#esn1, 1, 6));
#fm2 is fmsynth(160, map(#esn3, 3, 3), sine(0.3));
#ns is lores(mul(sah(noise(1), 2), sine(0.1)), map(#esn3, 500, 6000), 1);

#kck is mul(lores(sample(\kick, click(#bpm, 4)), 1000, 1), 3);
#ht is sample(\hat, click(#bpm, 4, 0.5));

#master is sum(#fm, #fm2, #ns, #kck, #ht, #bss);

mul(#master, 0);
*/

// ECHO STATE NETWORK ALGORITHM

function tfToLalo(tfmat) {
    let laloMat = tfmat.dataSync();
      laloMat = array2mat(laloMat)
    laloMat = reshape(laloMat,tfmat.shape[0],tfmat.shape[1])
    return laloMat;
};

makeESN = (nodes,leak,alpha) => {
  let esn = {};
  esn.N = nodes;
  esn.NOut = 1;
  esn.NIn = 1;
  esn.x = tf.randomUniform([esn.N,1]);
  esn.density=0.2
  mask = tf.multinomial(tf.tensor([1.0-esn.density,esn.density]),esn.N*esn.N).reshape([esn.N,esn.N])
  esn.res = tf.mul(mask, tf.randomNormal([esn.N,esn.N]),-1,1)
  let resLalo = tfToLalo(esn.res);
  maxEig = eigs(resLalo).v;
  esn.res = tf.div(esn.res, tf.scalar(maxEig * alpha));
  esn.win = tf.randomUniform([esn.N,esn.NIn]);
  esn.wout = tf.randomUniform([esn.NOut,esn.N]);
  esn.output = tf.zeros([esn.Nout])
  esn.leakRate = tf.scalar(leak);
  esn.leakRateInv = tf.sub(tf.scalar(1.0), esn.leakRate);
  esn.leakRateInv.dataSync()
  esn.xold = tf.clone(esn.x);
  esn.calc = (invalues) => {
    console.log(invalues);
    tf.tidy(() => {
        tf.dispose(esn.xold);
        esn.xold = esn.x;
        let xnew =  tf.add(tf.matMul(esn.res, esn.x), 
                           tf.matMul(esn.win, invalues));
        xnew = tf.add(tf.mul(tf.tanh(xnew), esn.leakRate), tf.mul(tf.tanh(esn.xold), esn.leakRateInv));    
        esn.x = tf.keep(xnew);
        let newOutput = tf.keep(tf.matMul(esn.wout, esn.x));
        tf.dispose(esn.output);
        esn.output = tf.keep(newOutput);
        return 0;
    });
  };
  return esn;
}

esns = [];
__________

esns[0] = makeESN(1100, 3.5, 1.0);
__________
esns[1] = makeESN(50, 1.9, 1.0);
__________
esns[2] = makeESN(1500, 0.2, 1.0);
__________

esns[0].calc(tf.tensor2d([[0]]))
esns[0].output.dataSync()
__________

output = (x) => {
  console.log(x);
  esns[x].calc(tf.tensor2d([[0]]));
  let ot = esns[x].output.dataSync()[0];
  return ot;
}