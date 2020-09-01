class Particle {

  constructor() {
    this.r = random(1, config.particleMaxRadius);
    this.pos = createVector( random(this.r, width), random(this.r, height) );
    this.dir = createVector( random(-1, 1), random(-1, 1) );
    this.vel = p5.Vector.mult(this.dir, config.particleSpeed);
  }

  draw() {
    noStroke();
    colorMode(HSB);
    fill(config.particleHue, config.particleSaturation, config.particleBrightness);
    if (config.showParticles) {
      circle(this.pos.x, this.pos.y, this.r * 2);
    }
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

  connectToNearby(particles) {
    for (let particle of particles) {
      if (this.pos.dist(particle.pos) < config.connectionDistance) {
        if (config.connectionHue != 0) {
          colorMode(HSB);
          stroke(config.connectionHue, 100, 100);
        } else {
          stroke(config.connectionStroke);
        }


        line(this.pos.x, this.pos.y, particle.pos.x, particle.pos.y);
      }
    }
  }

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