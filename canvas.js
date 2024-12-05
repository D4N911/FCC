class CanvasBackground {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.heptagons = [];
      this.resizeCanvas();
      document.body.appendChild(this.canvas);
      this.initHeptagons();
      this.animate();
    }
  
    // pasarlos atras
    resizeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = 0;
      this.canvas.style.left = 0;
      this.canvas.style.zIndex = -1; 
    }
  
   
    
  
    // Generate metodo
    drawHeptagon(x, y, size) {
      const sides = 7;
      const angle = (Math.PI * 2) / sides;
      this.ctx.beginPath();
      for (let i = 0; i < sides; i++) {
        let angleShift = angle * i;
        let xPos = x + size * Math.cos(angleShift);
        let yPos = y + size * Math.sin(angleShift);
        if (i === 0) {
          this.ctx.moveTo(xPos, yPos);
        } else {
          this.ctx.lineTo(xPos, yPos);
        }
      }
      this.ctx.closePath();
      this.ctx.fill();
    }
  
    // crear los heptagonos
    initHeptagons() {
      const numHeptagons = 15; 
      for (let i = 0; i < numHeptagons; i++) {
        const size = Math.random() * 30 + 20; // 
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const dx = (Math.random() - 0.5) * 2; // Random x velocity
        const dy = (Math.random() - 0.5) * 2; // Random y velocity
        this.heptagons.push({ x, y, size, dx, dy });
      }
    }
  
    // animacion
    updateHeptagons() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Clear canvas on each frame
      this.heptagons.forEach(heptagon => {
        this.drawHeptagon(heptagon.x, heptagon.y, heptagon.size);
  
        // Update position for animation
        heptagon.x += heptagon.dx;
        heptagon.y += heptagon.dy;
  
        // Bounce off walls
        if (heptagon.x < 0 || heptagon.x > this.canvas.width) {
          heptagon.dx = -heptagon.dx;
        }
        if (heptagon.y < 0 || heptagon.y > this.canvas.height) {
          heptagon.dy = -heptagon.dy;
        }
      });
    }//fill
  
    // loop
    animate() {
      this.updateHeptagons();
      requestAnimationFrame(this.animate.bind(this)); // 
    }
  }
  
  // Initialize 
  const canvasBackground = new CanvasBackground();
  
  // rexise
  window.addEventListener('resize', () => {
    canvasBackground.resizeCanvas();
  });
  