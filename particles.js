document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("particles-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height;
  let particles = [];
  
  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    
    // Adjust particle count based on screen size
    const numParticles = Math.floor((width * height) / 10000);
    
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }
  }

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseout", () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener("resize", () => {
    init();
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      // Bounce off walls
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interaction (Repel)
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 2;
          const directionY = forceDirectionY * force * 2;
          
          this.x -= directionX;
          this.y -= directionY;
        }
      }

      this.x += this.vx;
      this.y += this.vy;
    }

    draw() {
      // We will grab the dynamic CSS variable color every frame so it updates on dark/light mode toggle
      const color = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#00e6a7";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.5;
      ctx.fill();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const color = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#00e6a7";
    
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
      
      // Draw lines between nearby particles
      for (let j = i; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          ctx.beginPath();
          ctx.strokeStyle = color;
          ctx.lineWidth = 0.5;
          ctx.globalAlpha = 1 - (distance / 120);
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }

  init();
  animate();
});
