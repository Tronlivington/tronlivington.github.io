const config = {
  backgroundColour: "#0f0f0f",
  redrawBackground: false,
  uiColour: "rgba(0, 100, 220, 1.0)",
  hideUI: true,

  // numParticles: 3000,
  // particleSpeed: 1.0,
  // gravityStrength: 1.0,

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
  frameRate(35);
  // frameRate(120);

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

  // Check if clicking on control sliders
  if (visualizer && !config.hideUI) {
    let barWidth = 200;
    let barHeight = 20;
    let spacing = 30;
    let startX = 20;
    let startY = 20;
    let barOffsetX = 200;

    let mx = mouseX;
    let my = mouseY;

    // Particle count slider
    let particleControlY = startY + spacing * (visualizer.stars.length + 2);

    if (
      mx >= startX + barOffsetX &&
      mx <= startX + barOffsetX + barWidth &&
      my >= particleControlY - barHeight / 2 &&
      my <= particleControlY + barHeight / 2
    ) {
      let newCount = floor(
        map(mx - (startX + barOffsetX), 0, barWidth, 500, 15000)
      );
      visualizer.numParticles = constrain(newCount, 500, 15000);
    }

    // Framerate slider
    let framerateControlY = particleControlY + spacing;
    if (
      mx >= startX + barOffsetX &&
      mx <= startX + barOffsetX + barWidth &&
      my >= framerateControlY - barHeight / 2 &&
      my <= framerateControlY + barHeight / 2
    ) {
      let newFR = floor(map(mx - (startX + barOffsetX), 0, barWidth, 24, 144));
      setTargetFrameRate(newFR);
    }
  }
}

function mouseDragged() {
  // Same logic as mousePressed for dragging
  if (visualizer && !config.hideUI) {
    let barWidth = 200;
    let barHeight = 20;
    let spacing = 30;
    let startX = 20;
    let startY = 20;
    let barOffsetX = 200;

    let mx = mouseX;
    let my = mouseY;

    let particleControlY = startY + spacing * (visualizer.stars.length + 2);
    if (
      mx >= startX + barOffsetX &&
      mx <= startX + barOffsetX + barWidth &&
      my >= particleControlY - barHeight / 2 &&
      my <= particleControlY + barHeight / 2
    ) {
      let newCount = floor(
        map(mx - (startX + barOffsetX), 0, barWidth, 500, 15000)
      );
      visualizer.numParticles = constrain(newCount, 500, 15000);
    }

    let framerateControlY = particleControlY + spacing;
    if (
      mx >= startX + barOffsetX &&
      mx <= startX + barOffsetX + barWidth &&
      my >= framerateControlY - barHeight / 2 &&
      my <= framerateControlY + barHeight / 2
    ) {
      let newFR = floor(map(mx - (startX + barOffsetX), 0, barWidth, 24, 144));
      setTargetFrameRate(newFR);
    }
  }
}
