/*
:esn1:{20,0}fromJS;
:esn2:{20,1}fromJS;
:esn3:{20,2}fromJS;
:kick:{{:esn1:}\909b,100}dist;
:hh:{{:esn2:}\909closed,1}dist;
:snare:{{:esn3:}\909,100}dist;
{:kick:,:hh:,:snare:}mix
*/

function tfToLalo(tfmat) {
    let laloMat = tfmat.dataSync();
      laloMat = array2mat(laloMat)
    laloMat = reshape(laloMat,tfmat.shape[0],tfmat.shape[1])
    return laloMat;
};
__________

//js
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
__________
esns = []
__________
esns[0] = makeESN(50,0.5,1.0)
__________
esns[1] = makeESN(50,0.99,1)
__________
esns[2] = makeESN(50,0.9,1)
__________

esns[0].calc(tf.tensor2d([[0]]))
esns[0].output.dataSync()

__________

output = (x) => {
//      console.log(x);
    esns[x].calc(tf.tensor2d([[0]]));
      let ot = esns[x].output.dataSync()[0];
    return ot;
}
__________