const config = {
  // bgColour: '#ffffff',
  bgColour: "#000000",
  bgRedraw: false,
  width: 1030,
  onStroke: 0,
  offStroke: 50,
  strokeWeight: 1,
};

const params = {
  n: 1,
  speed: 0.01,
  boxes: 64,
  spacing: 5,
};

let t;
let prevStates = [];


function setup() {
  createCanvas(config.width, config.width);
  background(config.bgColour);
  t = 3*PI/2;
}

function draw() {
  if (config.bgRedraw) background(config.bgColour);

  params.n = floor(((params.boxes + 1) * (sin(t) + 1)) / 2);
  t += params.speed;

  let boxSize = floor(config.width / params.boxes);

  strokeWeight(config.strokeWeight);
  let hue = map(params.n, 0, params.boxes, 50, 360);
  colorMode(HSB);

  for (let i = 0; i < params.boxes; i++) {
    for (let j = 0; j < params.boxes; j++) {
      let state = false;
      if (parseInt(i ^ j) < params.n) {
        state = true;
      }
      let prevState = prevStates[i + j * params.boxes];
      if (prevState === undefined || prevState != state) {
        if (state) {
          fill(hue, 255, 255);
          stroke(config.onStroke);
        } else {
          // fill(220, 0, 0);
          fill(0, 0, 0);
          stroke(config.offStroke);
        }
        // fill(colour);
        rect(
          // ellipse(
          i * boxSize + params.spacing,
          j * boxSize + params.spacing,
          boxSize - params.spacing
        );
      }
      prevStates[i + j * params.boxes] = state;
    }
  }
}
