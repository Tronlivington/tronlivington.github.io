class Boid {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = p5.Vector.random2D();
    this.velocity.setMag(random(2, 4));
    this.acceleration = createVector();
    this.trail = [];
    this.maxTrailLength = 20;
  }

  // Update the boid's position based on flocking behavior
  update(boids, dt = 1 / 60) {
    // Calculate flocking forces
    let separation = this.separate(boids);
    let alignment = this.align(boids);
    let cohesion = this.cohesion(boids);
    let edgeRepulsion = this.avoidEdges();

    // Apply weights from config
    separation.mult(config.separationWeight);
    alignment.mult(config.alignmentWeight);
    cohesion.mult(config.cohesionWeight);
    edgeRepulsion.mult(config.edgeForce);

    // Apply forces
    this.applyForce(separation);
    this.applyForce(alignment);
    this.applyForce(cohesion);
    this.applyForce(edgeRepulsion);

    // Update velocity and position with deltaTime
    // Scale forces by dt for frame-rate independence
    let scaledAcceleration = p5.Vector.mult(this.acceleration, dt * 60);
    this.velocity.add(scaledAcceleration);
    this.velocity.limit(config.maxSpeed);

    // Scale velocity by dt
    let scaledVelocity = p5.Vector.mult(this.velocity, dt * 60);
    this.position.add(scaledVelocity);
    this.acceleration.mult(0);

    // Update trail
    if (config.showTrails) {
      this.trail.push(this.position.copy());
      if (this.trail.length > this.maxTrailLength) {
        this.trail.shift();
      }
    } else {
      this.trail = [];
    }

    // Wrap around edges
    this.edges();
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  // Separation: steer to avoid crowding local flockmates
  separate(boids) {
    let steering = createVector();
    let total = 0;
    const separationRadiusSq =
      config.separationRadius * config.separationRadius;

    for (let other of boids) {
      if (other === this) continue;

      // Use squared distance to avoid sqrt
      let dx = this.position.x - other.position.x;
      let dy = this.position.y - other.position.y;
      let dSq = dx * dx + dy * dy;

      if (dSq < separationRadiusSq && dSq > 0) {
        let diff = createVector(dx, dy);
        diff.div(dSq); // Weight by squared distance
        steering.add(diff);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(config.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(config.maxForce);
    }

    return steering;
  }

  // Alignment: steer towards the average heading of local flockmates
  align(boids) {
    let steering = createVector();
    let total = 0;
    const alignmentRadiusSq = config.alignmentRadius * config.alignmentRadius;

    for (let other of boids) {
      if (other === this) continue;

      // Use squared distance to avoid sqrt
      let dx = this.position.x - other.position.x;
      let dy = this.position.y - other.position.y;
      let dSq = dx * dx + dy * dy;

      if (dSq < alignmentRadiusSq) {
        steering.add(other.velocity);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.setMag(config.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(config.maxForce);
    }

    return steering;
  }

  // Cohesion: steer to move towards the average position of local flockmates
  cohesion(boids) {
    let steering = createVector();
    let total = 0;
    const cohesionRadiusSq = config.cohesionRadius * config.cohesionRadius;

    for (let other of boids) {
      if (other === this) continue;

      // Use squared distance to avoid sqrt
      let dx = this.position.x - other.position.x;
      let dy = this.position.y - other.position.y;
      let dSq = dx * dx + dy * dy;

      if (dSq < cohesionRadiusSq) {
        steering.add(other.position);
        total++;
      }
    }

    if (total > 0) {
      steering.div(total);
      steering.sub(this.position);
      steering.setMag(config.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(config.maxForce);
    }

    return steering;
  }

  // Apply repulsion force when near edges
  avoidEdges() {
    let steering = createVector();
    let margin = config.edgeMargin;

    // Check distance from each edge (in WEBGL mode, center is at 0,0)
    let distLeft = this.position.x - -width / 2;
    let distRight = width / 2 - this.position.x;
    let distTop = this.position.y - -height / 2;
    let distBottom = height / 2 - this.position.y;

    // Repel from left edge
    if (distLeft < margin) {
      let force = map(distLeft, 0, margin, config.maxSpeed, 0);
      steering.add(createVector(force, 0));
    }
    // Repel from right edge
    if (distRight < margin) {
      let force = map(distRight, 0, margin, config.maxSpeed, 0);
      steering.add(createVector(-force, 0));
    }
    // Repel from top edge
    if (distTop < margin) {
      let force = map(distTop, 0, margin, config.maxSpeed, 0);
      steering.add(createVector(0, force));
    }
    // Repel from bottom edge
    if (distBottom < margin) {
      let force = map(distBottom, 0, margin, config.maxSpeed, 0);
      steering.add(createVector(0, -force));
    }

    if (steering.mag() > 0) {
      steering.setMag(config.maxSpeed);
      steering.sub(this.velocity);
      steering.limit(config.maxForce);
    }

    return steering;
  }

  // Wrap around edges of canvas (fallback for boids that escape)
  edges() {
    if (this.position.x > width / 2) {
      this.position.x = -width / 2;
      this.trail = [];
    } else if (this.position.x < -width / 2) {
      this.position.x = width / 2;
      this.trail = [];
    }

    if (this.position.y > height / 2) {
      this.position.y = -height / 2;
      this.trail = [];
    } else if (this.position.y < -height / 2) {
      this.position.y = height / 2;
      this.trail = [];
    }
  }

  // Draw the boid
  show() {
    // Draw trail
    if (config.showTrails && this.trail.length > 1) {
      noFill();
      colorMode(HSB, 360, 100, 100);
      stroke(config.boidHue, 80, 100);
      strokeWeight(1);
      beginShape();
      for (let pos of this.trail) {
        vertex(pos.x, pos.y);
      }
      endShape();
      colorMode(RGB, 255);
    }

    // Draw boid as a triangle pointing in direction of velocity
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading());

    colorMode(HSB, 360, 100, 100);
    fill(config.boidHue, 80, 100);
    noStroke();
    colorMode(RGB, 255);

    // Triangle shape
    beginShape();
    vertex(config.boidSize, 0);
    vertex(-config.boidSize, -config.boidSize / 2);
    vertex(-config.boidSize, config.boidSize / 2);
    endShape(CLOSE);

    pop();
  }
}
