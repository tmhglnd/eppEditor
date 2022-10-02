let kck = [1, 0, 0, 0];
let hat = [0, 1];
let sn = [0, 0, 1, 0];
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
}//probability_beat()

// A euclidean rhythm generator. Generates values of 0 and 1
// Distributed based on the common denominator after division
var pattern, counts, remainders;

function euclid(steps, beats, rot){
	steps = Math.max(1, Math.floor(steps));
	beats = Math.min(steps, Math.max(1, Math.floor(beats)));
	rot = Math.floor((rot==null) ? 0 : rot);

	pattern = [];
	counts = [];
	remainders = [];
	var level = 0;
	var divisor = steps - beats;

	remainders.push(beats);

	while (remainders[level] > 1){
		counts.push(Math.floor(divisor / remainders[level]));
		remainders.push(divisor % remainders[level]);
		
		divisor = remainders[level];
        level++;
	}
    counts.push(divisor);
    build(level);

	return rotate(pattern, rot + pattern.indexOf(1));
}//euclid()

function build(l){
	var level = l;

	if (level == -1){
			pattern.push(0);
	} else if (level == -2){
			pattern.push(1);
	} else {
		for (var i = 0; i < counts[level]; i++){
			build(level-1);
		}
		if (remainders[level] != 0){
			build(level-2);
		}
	}
}//build()

// rotate an array in a certain direction
// 1 = rotate right, -1 = rotate left
function rotate(arr, rot){
	var outList = new Array(arr.length);
	if (rot === void(0)){ rot = 0; } //default
	for (var i = 0; i < arr.length; i++){
		outList[i] = arr[mod((i - rot), arr.length)]
	}
	return outList;
}//rotate()

// Return the remainder after division
// Works also in the negative direction
function mod(v, mod){
   return ((v % mod) + mod) % mod;
}//mod()

kck = euclid(13, 2);
hat = euclid(11, 7);
sn = euclid(15, 3);
