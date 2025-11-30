// Music Visualizer with Stars and Particles

class Star {
  constructor(x, y, frequencyBand, scale = 1.0, hue = 0) {
    this.pos = createVector(x, y);
    this.frequencyBand = frequencyBand;
    this.scale = scale;
    this.baseRadius = 40;
    this.radius = this.baseRadius;
    this.mass = 0;
    this.targetMass = 0;
    this.massSmoothing = 0.1;
    this.strengthMultiplier = 100;
    this.hue = hue;

    // Track min/max for dynamic scaling
    this.minEnergy = 255;
    this.maxEnergy = 0;
  }

  update(energy) {
    // Decay min/max values gradually to prevent getting stuck
    let decayRate = 0.9999; // Decay factor (0.99 = slow decay)
    this.minEnergy = lerp(this.minEnergy, 255, 1 - decayRate); // Drift toward max (255)
    this.maxEnergy = lerp(this.maxEnergy, 0, 1 - decayRate); // Drift toward min (0)

    // Track min/max energy values
    this.minEnergy = min(this.minEnergy, energy);
    this.maxEnergy = max(this.maxEnergy, energy);

    // Apply dynamic scaling based on observed range
    let range = this.maxEnergy - this.minEnergy;
    let scaledEnergy;
    if (range > 5) {
      // Only scale if we have meaningful range
      scaledEnergy = map(energy, this.minEnergy, this.maxEnergy, 0, 255);
    } else {
      scaledEnergy = energy * this.scale;
    }
    scaledEnergy = constrain(scaledEnergy, 0, 255);

    // Map energy to mass (INVERTED: quiet = attract, loud = repel)
    // Low energy (0) = positive mass (attract), High energy (255) = negative mass (repel)
    this.targetMass = map(scaledEnergy, 0, 255, 10, -10);

    // Smooth mass transition
    this.mass = lerp(this.mass, this.targetMass, this.massSmoothing);

    // Visual size based on absolute energy
    this.radius = map(
      scaledEnergy,
      0,
      255,
      this.baseRadius * 0.5,
      this.baseRadius * 2
    );
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);

    // Switch to HSB mode with alpha support
    colorMode(HSB, 360, 100, 100, 100);

    // Soft glow effect
    let glowSize = this.radius * 0.99;
    for (let i = glowSize; i > 0; i -= 2) {
      let alpha = map(i, 0, glowSize, 25, 0);
      fill(this.hue, 80, 100, alpha);
      noStroke();
      circle(0, 0, i);
    }

    // Core star - small and semi-transparent
    fill(this.hue, 80, 100, 45);
    circle(0, 0, this.radius * 0.7);

    // Inner highlight - tiny bright center
    fill(this.hue, 40, 100, 70);
    circle(0, 0, this.radius * 0.1);

    colorMode(RGB);
    pop();
  }

  applyForce(particle) {
    let force = p5.Vector.sub(this.pos, particle.pos);
    let distance = force.mag();
    distance = constrain(distance, 10, 500);

    let strength =
      ((this.mass * 50) / (distance * distance)) * this.strengthMultiplier;
    force.setMag(strength);

    return force;
  }

  resetMinMax() {
    this.minEnergy = 255;
    this.maxEnergy = 0;
  }

  checkAbsorption(particle) {
    if (this.radius > this.baseRadius) return false; // Only absorb when attracting
    let d = p5.Vector.dist(this.pos, particle.pos);
    return d + this.baseRadius / 2.5 < this.radius;
  }

  shouldEmit() {
    // Emit when radius is large (high energy, repelling state)
    return this.radius > this.baseRadius * 1;
  }

  getEmissionCount() {
    const maxEmission = 100;
    // Number of particles to emit based on radius
    let normalized = map(
      this.radius,
      this.baseRadius * 1,
      this.baseRadius * 2,
      0,
      maxEmission
    );
    return floor(constrain(normalized, 0, maxEmission));
  }
}

class Particle {
  constructor(x, y, initialHue = 140) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(1, 4));
    this.acc = createVector(0, 0);
    this.baseMaxSpeed = 8;
    this.maxSpeed = 8;
    this.size = random(2, 5);
    this.hue = initialHue;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update(speedMultiplier = 1.0) {
    this.maxSpeed = this.baseMaxSpeed * speedMultiplier;
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  draw() {
    // Draw particle with HSB color
    colorMode(HSB, 360, 100, 100);
    fill(this.hue, 80, 100);
    noStroke();
    circle(this.pos.x, this.pos.y, this.size);
    colorMode(RGB);
  }
}

class MusicVisualizer {
  constructor() {
    this.stars = [];
    this.particles = [];
    this.numParticles = 4000;
    this.speedMultiplier = 1;
    this.rotationAngle = 0;
    this.rotateStars = true;

    // Create stars for each frequency band
    let bands = [
      { name: "bass", angle: 0, scale: 1.0 },
      {
        name: "lowMid",
        angle: TWO_PI / 5,
        scale: 1,
      },
      {
        name: "mid",
        angle: (TWO_PI * 2) / 5,
        scale: 1,
      },
      {
        name: "highMid",
        angle: (TWO_PI * 3) / 5,
        scale: 1,
      },
      {
        name: "treble",
        angle: (TWO_PI * 4) / 5,
        scale: 1,
      },
    ];

    let orbitRadius = min(width, height) * 0.35;
    bands.forEach((band, index) => {
      let x = cos(band.angle) * orbitRadius;
      let y = sin(band.angle) * orbitRadius;

      // Assign hue based on frequency band (0-300 to avoid wrapping back to red)
      let hue = map(index, 0, bands.length - 1, 0, 300);

      let star = new Star(x, y, band.name, band.scale, hue);
      star.initialAngle = band.angle;
      star.orbitRadius = orbitRadius;
      this.stars.push(star);
    });

    // Create particles
    for (let i = 0; i < this.numParticles; i++) {
      let x = random(-width / 2, width / 2);
      let y = random(-height / 2, height / 2);
      // Assign each initial particle a random star's hue
      let randomStar = random(this.stars);
      this.particles.push(new Particle(x, y, randomStar.hue));
    }
  }

  update() {
    if (!audioAnimator) return;

    // Calculate overall amplitude from all frequency bands
    let totalEnergy = 0;
    this.stars.forEach((star) => {
      totalEnergy += audioAnimator.energies[star.frequencyBand].curr;
    });
    let avgEnergy = totalEnergy / this.stars.length;

    // Map average energy to speed multiplier (0.5 to 3.0)
    // this.speedMultiplier = map(avgEnergy, 0, 255, 1, 3);

    // Update rotation based on amplitude
    let rotationSpeed = map(avgEnergy, 0, 255, 0.001, 0.01);
    if (this.rotateStars) {
      this.rotationAngle += rotationSpeed;
    }

    // Update stars with audio energy and rotate positions
    // Randomize star update order
    let shuffledStars = [...this.stars].sort(() => random() - 0.5);
    shuffledStars.forEach((star) => {
      let energy = audioAnimator.energies[star.frequencyBand].curr;
      star.update(energy);

      // Update star position based on rotation
      let currentAngle = star.initialAngle + this.rotationAngle;
      star.pos.x = cos(currentAngle) * star.orbitRadius;
      star.pos.y = sin(currentAngle) * star.orbitRadius;
    });

    // Apply forces to particles
    // Also check for absorption
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let particle = this.particles[i];

      // Check if particle should be absorbed by any star
      let absorbed = false;
      this.stars.forEach((star) => {
        if (star.checkAbsorption(particle)) {
          absorbed = true;
        }
      });

      if (absorbed) {
        this.particles.splice(i, 1);
        continue;
      }

      // Check if particle is offscreen
      let halfWidth = width / 2;
      let halfHeight = height / 2;
      if (
        particle.pos.x < -halfWidth ||
        particle.pos.x > halfWidth ||
        particle.pos.y < -halfHeight ||
        particle.pos.y > halfHeight
      ) {
        this.particles.splice(i, 1);
        continue;
      }

      this.stars.forEach((star, index) => {
        let force = star.applyForce(particle);
        particle.applyForce(force);
      });
      particle.update(this.speedMultiplier);
    }

    // Emit particles from large stars
    shuffledStars.forEach((star) => {
      if (star.shouldEmit() && this.particles.length < this.numParticles) {
        let emitCount = star.getEmissionCount();
        let remainingSlots = this.numParticles - this.particles.length;
        emitCount = min(emitCount, remainingSlots); // Cap by available slots

        for (let i = 0; i < emitCount; i++) {
          // Calculate angle pointing toward center (opposite of star's position)
          let angleToCenter = atan2(-star.pos.y, -star.pos.x);

          // Random angle within 180 degrees facing the center (±90 degrees from center direction)
          const emissionAngleRange = PI / 1.5;
          let angle =
            angleToCenter + random(-emissionAngleRange, emissionAngleRange);
          let speed = random(5, 8);

          // Spawn particle at star's edge in the emission direction
          let offsetDist = star.radius - 15;
          let x = star.pos.x + cos(angle) * offsetDist;
          let y = star.pos.y + sin(angle) * offsetDist;

          // Particle belongs to the emitting star
          let newParticle = new Particle(x, y, star.hue);
          // Set velocity directly in the emission direction
          newParticle.vel.x = cos(angle) * speed;
          newParticle.vel.y = sin(angle) * speed;
          // Add star's current velocity to particle for smoother motion
          const starAngle = atan2(star.pos.y, star.pos.x);
          const starTangentialSpeed = this.rotationAngle * star.orbitRadius;
          newParticle.vel.x += -sin(starAngle) * starTangentialSpeed;
          newParticle.vel.y += cos(starAngle) * starTangentialSpeed;

          this.particles.push(newParticle);
        }
      }
    });
  }

  draw() {
    // Draw particles
    this.particles.forEach((particle) => particle.draw());

    // Draw stars
    this.stars.forEach((star) => star.draw());
  }

  resetScaling() {
    this.stars.forEach((star) => star.resetMinMax());
  }

  drawUI() {
    if (!audioAnimator || config.hideUI) return;

    push();
    // Reset transformations for UI - switch to 2D coordinates
    translate(-width / 2, -height / 2);

    let barWidth = 200;
    let barHeight = 20;
    let spacing = 30;
    let startX = 20;
    let startY = 20;
    let barOffsetX = 200; // Increased from 100 to give more space for text

    textAlign(LEFT, CENTER);
    textSize(14);

    // Calculate overall amplitude
    let totalEnergy = 0;
    this.stars.forEach((star) => {
      totalEnergy += audioAnimator.energies[star.frequencyBand].curr;
    });
    let avgEnergy = totalEnergy / this.stars.length;

    // Draw overall amplitude
    fill(255);
    noStroke();
    text(`Overall: ${floor(avgEnergy)}`, startX, startY);

    // Draw bar
    stroke(100);
    strokeWeight(1);
    noFill();
    rect(startX + barOffsetX, startY - barHeight / 2, barWidth, barHeight);

    // Fill bar
    let fillWidth = map(avgEnergy, 0, 255, 0, barWidth);
    noStroke();
    fill(150, 150, 255);
    rect(startX + barOffsetX, startY - barHeight / 2, fillWidth, barHeight);

    // Draw each frequency band
    colorMode(HSB, 360, 100, 100);
    this.stars.forEach((star, index) => {
      let yPos = startY + spacing * (index + 1);
      let energy = audioAnimator.energies[star.frequencyBand].curr;
      let scaledEnergy = constrain(energy * star.scale, 0, 255);

      // Label with min/max values
      fill(star.hue, 80, 100);
      noStroke();
      text(
        `${star.frequencyBand}: ${floor(scaledEnergy)} [${floor(
          star.minEnergy
        )}-${floor(star.maxEnergy)}]`,
        startX,
        yPos
      );

      // Draw bar outline
      stroke(100);
      strokeWeight(1);
      noFill();
      rect(startX + barOffsetX, yPos - barHeight / 2, barWidth, barHeight);

      // Fill bar
      let fillWidth = map(scaledEnergy, 0, 255, 0, barWidth);
      noStroke();
      fill(star.hue, 80, 100);
      rect(startX + barOffsetX, yPos - barHeight / 2, fillWidth, barHeight);
    });
    colorMode(RGB);

    pop();
  }
}

let visualizer;

function initVisualizer() {
  visualizer = new MusicVisualizer();
}
