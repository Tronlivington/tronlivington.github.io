const config = {
  backgroundColour: "#0f0f0f",
  redrawBackground: true,
  uiColour: "rgba(0, 100, 220, 1.0)",
  hideUI: true,

  numericVariable: 50,
  booleanVariable: false,

  reactToAudio: false,

};

const ui = [];
let font;
let audioAnimator;
let audioRunning = false;

function preload() {
  font = loadFont('Roboto-Regular.ttf');
}

function setup() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight, WEBGL);
  textSize(18);
  textFont(font);
  background(config.backgroundColour);

  // ui.push(new Slider("n", 1, 60, 1));
  // ui.push(new Checkbox("showRose"));


  if (config.hideUI) {
    ui.forEach((elem) => elem.hide());
  }

  // audioAnimator = new AudioAnimator(0.7);
  // audioAnimator.addProp("n", "highMid", 1, 50, 8);

}

function draw() {
  // orbitControl();

  if (config.redrawBackground) {
    if (width != windowWidth || height != windowHeight) {
      resizeCanvas(windowWidth, windowHeight);
    }
    background(config.backgroundColour);
  }

  ui.forEach((elem) => elem.update());

  if (!config.hideUI) {
    ui.forEach((elem) => elem.draw());
  }


  if (config.reactToAudio) {
    audioAnimator.update();
  }

  // CONTENTS

}

const p2c = (r, angle) => ({
  x: r * cos(angle),
  y: r * sin(angle),
});

const oscillate = (prop, min, max, speed) => {
  setConfigValue(prop, map(Math.sin(speed * frameCount), -1, 1, min, max));
}

function mousePressed() {
  if (!audioRunning) {
    userStartAudio();
    audioRunning = true;
  }
}