const config = {
  damping: 0.3,   // Walls only
  maxBalls: 1000,
  maxSpeed: 5,
  enableGravity: false,
  gravity: [0, 1],
  enableCollision: false,
  spawnOnHold: true,
  spawnMode: 'randomDir',   // randomAcc, randomDir, popUp
};

const balls = [];
const ui = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {

  resizeCanvas(windowWidth, windowHeight);

  clear();

  balls.forEach( (ball, i) => {
    if (config.enableCollision) {
      ball.checkBallCollision(balls.slice(+i + 1));
    }
    ball.updatePhys();
    ball.draw();
  });

  if (config.spawnOnHold && mouseIsPressed) {
    balls.push(new Ball(createVector(mouseX, mouseY)));
  }

  while (balls.length > config.maxBalls) {
    balls.shift();
  }

}

function mousePressed() {
  balls.push(new Ball(createVector(mouseX, mouseY)));
}
