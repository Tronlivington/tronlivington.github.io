
let minBranchLength = 3;
let initialBranchLength = 200;

let branchAngle = 1;
let branchLengthRatio = 0.67;


let branchAngleSlider, branchLengthRatioSlider;

function setup() {
  createCanvas(700, 700);
  colorMode(HSB);

  branchAngleSlider = createSlider(0, PI, branchAngle, 0.01);
  branchLengthRatioSlider = createSlider(0, 0.75, branchLengthRatio, 0.01);
}

function draw() {

  branchAngle = branchAngleSlider.value();
  branchLengthRatio = branchLengthRatioSlider.value();

  background(5);
  translate(width/2, height);
  branch(initialBranchLength);
  
}

function branch(length) {
  let hue = map(length, minBranchLength, initialBranchLength, 0, 255);
  stroke(hue, 255, 255, 1);
  line(0, 0, 0, -length);

  if (length > minBranchLength) {
    let nextBranchLength = length * branchLengthRatio;
    translate(0, -length);
    push();
    rotate(branchAngle);
    branch(nextBranchLength);
    pop();
    rotate(-branchAngle);
    branch(nextBranchLength);
  }
}