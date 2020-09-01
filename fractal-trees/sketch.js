
let minBranchLength = 3;
let initialBranchLength = 150;

let maxBranches = 800;

let branchAngle = 1;
let branchLengthRatio = 0.67;

let branchAngleSlider, branchLengthRatioSlider;

let rootStart, rootEnd;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  branchAngleSlider = createSlider(0, PI, branchAngle, 0.01);
  branchLengthRatioSlider = createSlider(0, 0.75, branchLengthRatio, 0.01);

  rootStart = createVector(-initialBranchLength/2, 0);
  rootEnd = createVector(initialBranchLength/2, 0);

}

let t = 0;
function draw() {
  translate(width/2, height/2);
  rotate(t);
  t += 0.01;

  branchAngle = branchAngleSlider.value();
  branchLengthRatio = branchLengthRatioSlider.value();
  background(5);

  let tree1 = new Tree(rootStart, rootEnd);
  tree1.show();
  let tree2 = new Tree(rootEnd, rootStart);
  tree2.show();

  rotate(HALF_PI);
  tree1.show();
  tree2.show();
  
}