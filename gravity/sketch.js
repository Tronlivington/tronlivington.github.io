const config = {
  backgroundColour: "#0f0f0f",
  redrawBackground: false,
  uiColour: "rgba(0, 100, 220, 1.0)",
  hideUI: true,

  numParticles: 200,
  particleSpeed: 1.0,
  gravityStrength: 1.0,

  reactToAudio: true,
};

const ui = [];
let font;
let audioAnimator;
let audioRunning = false;

function preload() {
  font = loadFont("Roboto-Regular.ttf");
}

function setup() {
  config.hideUI = true;

  createCanvas(windowWidth, windowHeight, WEBGL);
  textSize(18);
  textFont(font);
  background(config.backgroundColour);

  // ui.push(new Slider("numParticles", 50, 500, 10));
  // ui.push(new Slider("gravityStrength", 0.1, 3.0, 0.1));

  if (config.hideUI) {
    ui.forEach((elem) => elem.hide());
  }

  audioAnimator = new AudioAnimator(0.8);
  initVisualizer();
}

function draw() {
  background(0);

  if (width != windowWidth || height != windowHeight) {
    resizeCanvas(windowWidth, windowHeight);
    if (visualizer) {
      initVisualizer(); // Reinitialize on resize
    }
  }

  ui.forEach((elem) => elem.update());

  if (!config.hideUI) {
    ui.forEach((elem) => elem.draw());
  }

  if (config.reactToAudio && audioAnimator) {
    audioAnimator.update();
  }

  // Main visualizer
  if (visualizer) {
    visualizer.update();
    visualizer.draw();
    if (!config.hideUI) {
      visualizer.drawUI();
    }
  }
}

const p2c = (r, angle) => ({
  x: r * cos(angle),
  y: r * sin(angle),
});

const oscillate = (prop, min, max, speed) => {
  setConfigValue(prop, map(Math.sin(speed * frameCount), -1, 1, min, max));
};

function mousePressed() {
  if (!audioRunning) {
    userStartAudio();
    audioRunning = true;
  }
}
