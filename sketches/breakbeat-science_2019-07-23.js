//sequencer in the style of Nick Collins 
//Algoritmic Composition for Breakbeat Science

/* CopyPaste in livecode Editor
:kck:{{{{8}imp, {8, 0}fromJS}mul}\909b, 25}dist;
:sn:{{{8}imp, {8, 1}fromJS}mul}\909;
:hat:{{{8}imp, {8, 2}fromJS}mul}\909closed;
{:kck:, :sn:, :hat:}mix
*/

// Arrays with probabilities for every beat and instrument
let kck = [1, 0, 0.1, 0.3, 0.5];
let hat = [1, 0.3, 0.9, 1, 0, 0.8, 0];
let sn = [0, 0.1, 0.1, 0, 1, 0, 0, 0];

//an array that increments its counter for every instrument
let beatSteps = [0, 0, 0];

output = (id) => {
  let out;
  let rhythmArr;
  switch(id){
  	case 0:
      rhythmArr = kck.slice();
      break;
   	case 1:
      rhythmArr = sn.slice();
      break;
    case 2:
      rhythmArr = hat.slice();
      break;
  }
  out = probability_beat(rhythmArr, beatSteps[id]);
  //increment step of the correct id instrument
  beatSteps[id]++;
  console.log("id:", id, "beat:", out);
  return out;
}

probability_beat = (arr, stp) => {
  //take value from array
  let out = arr[stp % arr.length];
  //probability calculation and return
  return (out > Math.random()) ? 1 : 0;
}