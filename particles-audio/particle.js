class Particle {

  constructor() {
    this.r = random(1, config.particleMaxRadius);
    this.d = this.r * 2;
    this.pos = createVector( random(this.r, width), random(this.r, height) );
    this.dir = createVector( random(-1, 1), random(-1, 1) );
    this.vel = p5.Vector.mult(this.dir, config.particleSpeed);
  }

  draw() {
    circle(this.pos.x, this.pos.y, this.d);
  }

  move() {
    this.checkWallCollision();
    this.vel = p5.Vector.mult(this.dir, config.particleSpeed);
    this.pos.add(this.vel);
  }

  checkWallCollision() {
    if ( (this.pos.x - this.r < 0 && this.vel.x < 0) || (this.pos.x + this.r > width && this.vel.x > 0) ) {
      this.dir.x *= -1;
    }
    if ( (this.pos.y - this.r < 0 && this.vel.y < 0) || (this.pos.y + this.r > height && this.vel.y > 0) ) {
      this.dir.y *= -1;
    }
  }

  connectToNearby(particles, maxDistSquared) {
    for (let particle of particles) {
      // if (this.pos.dist(particle.pos) < config.connectionDistance) {
      if (distSquared(this.pos, particle.pos) < maxDistSquared) {
        line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
      }
    }
  }

}


const distSquared = (v1, v2) => {
  let dx = v1.x - v2.x;
  let dy = v1.y - v2.y;
  return dx * dx + dy * dy;
}


function updateParticleCount() {
  const newParticles = config.particleCount - particles.length;
  if (newParticles > 0) {
    for (let i = 0; i < newParticles; i++) {
      particles.push(new Particle);
    }
  } else if (newParticles < 0) {
    particles.length = config.particleCount;
  }
}