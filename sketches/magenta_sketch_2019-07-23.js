let model = new mm.MusicRNN('/melody_rnn');
let sequence = [];
let pitchStep = 0;
let beatStep = 0;

// make a custom beat consisting of 0's and 1's
let beat = [1, 0, 0, 1, 0, 1, 0];

toPulseTrain = (arr) => {
  let out = [];
  for (let i=0; i<arr.length; i++){
    out.push(arr[i]);
    out.push(0);
  }
  return out;
}

model.initialize();

input = (id, amt) => {
  let seedSeq = {
    notes: [
      {pitch: 60, quantizedStartStep: 0, quantizedEndStep: 1}
    ],
    quantizationInfo: { stepsPerQuarter: 4 },
    totalQuantizedSteps: 1
  };
  model.continueSequence(seedSeq, amt, 1.6).then(result => {
    sequence = [];
	console.log("res", sequence);
    let pitch = 60;
    for (let i=0 ; i<amt ; i++) {
  	  for (let note of result.notes) {
    	if (note.quantizedStartStep <= i && note.quantizedEndStep > i) {
      	  pitch = note.pitch;
    	}
      }
  	  sequence.push(pitch);
	}
    console.log("seq", sequence);
  });
};

output = (id) => {
  let out;
  switch(id){
    case 0: 
    	let pitch = sequence[beatStep % sequence.length];
  		out = 440 * Math.pow(2, (pitch - 69) / 12);
      	console.log("id:", id, "freq:", out);
      	break;
    case 1:
      	out = beat[beatStep % beat.length];
      	beatStep++;
      	console.log("id:", id, "beat:", out);
  }
  return out;
}

beat = toPulseTrain(beat);
