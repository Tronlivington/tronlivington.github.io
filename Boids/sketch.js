const config = {
  backgroundColour: "#0f0f0f",
  redrawBackground: true,
  uiColour: "rgba(0, 100, 220, 1.0)",
  hideUI: true,

  numericVariable: 50,
  booleanVariable: false,

  reactToAudio: true,

  // Boid properties
  numBoids: 300,
  maxSpeed: 10,
  maxForce: 0.4,
  separationRadius: 25,
  alignmentRadius: 50,
  cohesionRadius: 50,
  separationWeight: 1.5,
  alignmentWeight: 0.8,
  cohesionWeight: 0.9,
  boidSize: 6,
  boidHue: 180,
  showTrails: false,
  edgeMargin: 100,
  edgeForce: 1,
};

const ui = [];
let font;
let audioAnimator;
let audioRunning = false;
let boids = [];

function preload() {
  font = loadFont("Roboto-Regular.ttf");
}

function setup() {
  // createCanvas(windowWidth, windowHeight);
  createCanvas(windowWidth, windowHeight, WEBGL);
  textSize(18);
  textFont(font);
  background(config.backgroundColour);

  // Initialize boids
  for (let i = 0; i < config.numBoids; i++) {
    boids.push(
      new Boid(random(-width / 2, width / 2), random(-height / 2, height / 2))
    );
  }

  // Boid property sliders
  ui.push(new Slider("numBoids", 1, 500, 1));
  ui.push(new Slider("maxSpeed", 1, 20, 0.1));
  ui.push(new Slider("maxForce", 0.05, 15, 0.1));
  ui.push(new Slider("separationRadius", 10, 100, 1));
  ui.push(new Slider("alignmentRadius", 10, 150, 1));
  ui.push(new Slider("cohesionRadius", 10, 150, 1));
  ui.push(new Slider("separationWeight", 0, 5, 0.1));
  ui.push(new Slider("alignmentWeight", 0, 5, 0.1));
  ui.push(new Slider("cohesionWeight", 0, 5, 0.1));
  ui.push(new Slider("boidSize", 1, 15, 0.5));
  ui.push(new Slider("boidHue", 0, 360, 1));
  ui.push(new Slider("edgeMargin", 0, 300, 10));
  ui.push(new Slider("edgeForce", 0, 3, 0.1));
  ui.push(new Checkbox("showTrails"));

  if (config.hideUI) {
    ui.forEach((elem) => elem.hide());
  }

  audioAnimator = new AudioAnimator();

  audioAnimator.addProp("maxSpeed", "bass", 3, 20);
  audioAnimator.addProp("maxForce", "bass", 0.1, 10);
  audioAnimator.addProp("separationRadius", "lowMid", 1, 50);
  // audioAnimator.addProp("separationWeight", "mid", 0, 5);
  audioAnimator.addProp("boidSize", "amplitude", 3, 6);
  audioAnimator.addProp("boidHue", "treble", 0, 360);

  frameRate(120);
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

  // Draw UI text in 2D mode
  if (!config.hideUI) {
    push();
    // Reset to orthographic 2D coordinate system
    resetMatrix();
    ortho(-width / 2, width / 2, -height / 2, height / 2, 0, 1000);
    translate(-width / 2, -height / 2);
    ui.forEach((elem) => elem.draw());
    pop();
  }

  if (config.reactToAudio && audioRunning) {
    audioAnimator.update();
    // console.log(config.boidSize);
  }

  // CONTENTS
  // Update boid count if needed
  while (boids.length < config.numBoids) {
    boids.push(
      new Boid(random(-width / 2, width / 2), random(-height / 2, height / 2))
    );
  }
  while (boids.length > config.numBoids) {
    boids.pop();
  }

  // Update and display all boids
  let dt = deltaTime / 1000; // Convert to seconds
  for (let boid of boids) {
    boid.update(boids, dt);
    boid.show();
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
    console.log("Audio started");
  }
}
