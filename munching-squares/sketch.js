const config = {
  // bgColour: '#ffffff',
  bgColour: '#000000',
  // width: 1024,
  width: 1200,
  boxes: 64,
  spacing: 5,
};

const params = {
  n: 2
};

function setup() {
  createCanvas(config.width, config.width);
  background(config.bgColour);
}

let n = 0;
let increasing = true;
let prevStates = [];
function draw() {

  // background(config.bgColour);

  if (params.n >= config.boxes) increasing = false;
  if (params.n <= 0) increasing = true;
  params.n += increasing ? 1 : -1;

  let boxSize = floor(config.width / config.boxes);

  noStroke();
  // stroke(100);
  let hue = map(params.n, 0, config.boxes, 50, 360);
  colorMode(HSB);

  for (let i = 0; i < config.boxes; i++) {

    for (let j = 0; j < config.boxes; j++) {
      let state = false;
      if ( parseInt(i ^ j) < params.n ) {
        state = true
      }
      let prevState = prevStates[i + j * config.boxes];
      if (prevState === undefined || prevState != state) {
        if (state) {
          fill(hue, 255, 255);
        } else {
          // fill(220, 0, 0);
          fill(0, 0, 0);
        }
        // fill(colour);
        rect(
        // ellipse(
          i * boxSize,
          j * boxSize,
          boxSize - config.spacing
        );
      }
      prevStates[i + j * config.boxes] = state;
    }

  }

}