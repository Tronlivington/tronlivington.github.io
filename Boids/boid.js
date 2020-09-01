class Boid {
  constructor() {
    this.pos = createVector(random(0, width), random(0, height));
    this.vel = p5.Vector.random2D();
  }

  update() {
    // let flockCentroid = getFlockCentroid(boids);
    let dirToCentroid = p5.Vector.sub(flockCentroid, this.pos);
    this.vel = dirToCentroid.normalize();

    this.pos.add(this.vel);
  }

  show() {
    stroke(255);
    let endPoint = p5.Vector.add(this.pos, this.vel)
    line(this.pos.x, this.pos.y, endPoint.x, endPoint.y);
  }
}

const getFlockCentroid = (flock) => {
  let centroid = flock[0].pos.copy();
  let flockMass = 1;
  for (let i = 1; i < flock.length; i++) {
    let boid = flock[i];
    let dir = p5.Vector.sub(boid.pos, centroid);
    centroid.x += dir.x / flockMass;
    centroid.y += dir.y / flockMass;
    flockMass++;
  }
  circle(centroid.x, centroid.y, 10, 10);

  return createVector(mouseX, mouseY);
  return centroid;
}