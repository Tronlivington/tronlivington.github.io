
let minBranchLength = 3;

// let maxBranches = 1025;
let maxBranches = 513;

let branchAngleSlider, branchLengthRatioSlider;


const config = {
  backgroundColour: "#0f0f0f",
  redrawBackground: true,
  uiColour: "rgba(0, 100, 220, 1.0)",
  hideUI: false,

  numericVariable: 50,
  booleanVariable: false,

  reactToAudio: true,

  rotate: false,

  initialBranchLength: 150,
  branchAngle: 1,
  branchLengthRatio: 0.67,
  treeCount: 4,
  hue: 0,

  angleDivergence: 0,
  lengthDivergence: 0,
  spawnChance: 1,
};


const ui = [];
let t = 0;
let a = 0;

let audioAnimator;
let audioRunning = false;


let rootStart, rootEnd;

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB);

  ui.push(new Slider("branchAngle", 0, PI, 0.01));
  ui.push(new Slider("branchLengthRatio", 0, 0.75, 0.01));
  ui.push(new Slider("treeCount", 1, 4, 1));
  ui.push(new Checkbox("reactToAudio"));
  ui.push(new Checkbox("rotate"));

  ui.push(new Slider("angleDivergence", 0, PI, 0.01));
  ui.push(new Slider("lengthDivergence", 0, 1, 0.01));
  ui.push(new Slider("spawnChance", 0, 1, 0.01));


  if (config.hideUI) {
    ui.forEach((elem) => elem.hide());
  }

  audioAnimator = new AudioAnimator(0.7);
  audioAnimator.addProp("branchLengthRatio", "bass", 0, 0.75);
  audioAnimator.addProp("hue", "lowMid", 0, 360);
  audioAnimator.addProp("branchAngle", "mid", PI, 0);
  // audioAnimator.addProp("lengthDivergence", "highMid", 0, 1);
  // audioAnimator.addProp("spawnChance", "treble", 0.3, 1);

  rootStart = createVector(-config.initialBranchLength/2, 0);
  rootEnd = createVector(config.initialBranchLength/2, 0);

}


function draw() {

  resizeCanvas(windowWidth, windowHeight);
  background(config.backgroundColour);

  if (!config.hideUI) {
    ui.forEach((elem) => elem.draw());
  }

  translate(width/2, height/2);

  if (config.reactToAudio) {
    audioAnimator.update();
  }


  if (config.animateConnectionHue) {
    animateOscillator("hue", 1, 360, 2);
  }
  t += 0.001;


  let tree = new Tree(rootStart, rootEnd, config.branchAngle, config.branchLengthRatio);

  stroke(config.hue, 255, 255, 1);
  tree.show();
  if (config.treeCount > 1) {
    rotate(PI);
    tree.show();
  }
  if (config.treeCount > 2) {
    rotate(HALF_PI);
    tree.show();
  }
  if (config.treeCount > 3) {
    rotate(PI);
    tree.show();
  }

  ui.forEach((elem) => elem.update());

}


const animateOscillator = (valueName, min, max, speed) => {
  setConfigValue(valueName, map(Math.sin(speed * t), -1, 1, min, max));
};
