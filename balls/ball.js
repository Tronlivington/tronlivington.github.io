class Ball {

  grav = [0, 1];
  initialVel = 15;
  radius = 40;
  mass = 40;

  constructor(pos) {
    this.pos = pos;

    switch(config.spawnMode) {
      case 'randomAcc':
        this.vel = createVector(0, 0);
        this.acc = p5.Vector.random2D();
        break;
      case 'randomDir':
        this.vel = p5.Vector.random2D().mult(random(0.1, config.maxSpeed));
        this.acc = createVector(0, 0);
        break;
      case 'popUp':
          this.vel = createVector( this.initialVel * (0.5 - Math.random()), -this.initialVel );
          this.acc = createVector(0, 0);
          break;
    }

  }

  draw() {
    fill(255);
    circle(this.pos.x, this.pos.y, 2 * this.radius);
  }

  updatePhys() {
    if (config.enableGravity) {
      this.vel.add(config.gravity);
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.checkWallCollision();
  }

  checkWallCollision() {
    if ( (this.pos.x - this.radius < 0 && this.vel.x < 0) || (this.pos.x + this.radius > width && this.vel.x > 0) ) {
      this.vel.x *= -1;
      // this.vel.x -= this.vel.x * config.damping;
    }
    if ( (this.pos.y - this.radius < 0 && this.vel.y < 0) || (this.pos.y + this.radius > height && this.vel.y > 0) ) {
      this.vel.y *= -1;
      // this.vel.y -= this.vel.y * config.damping;
    }
  }

  collide(partner) {
    const u1 = this.vel;
    const u2 = partner.vel;
    const m1 = this.mass;
    const m2 = partner.mass;
    this.vel = ( p5.Vector.mult(u1, (m1 - m2)).add(p5.Vector.mult(u2, 2 * m2)) ).div(m1 + m2);
    partner.vel = ( p5.Vector.mult(u2, (m2 - m1)).add(p5.Vector.mult(u1, 2 * m1)) ).div(m1 + m2);
  }

  checkBallCollision(partners) {
    partners.forEach( partner => {
      if (this.pos.dist(partner.pos) < this.radius + partner.radius) {
        this.collide(partner);
      }
    });
  }
}