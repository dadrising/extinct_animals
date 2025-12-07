// =============================================================================
// ЛОГІКА АНІМАЦІЇ ФОНУ (Time Particles, Fireflies, Embers)
// =============================================================================

// ЗМІНІТЬ ЦЕ ЗНАЧЕННЯ ДЛЯ ВИБОРУ АНІМАЦІЇ: 'particles', 'fireflies', 'embers'
let currentEffect = 'embers'; 

const bgAnimation = {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: null, y: null },
    isActive: true,

    init() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        window.addEventListener('resize', () => this.resize());
        
        this.createParticles();
        this.animate();
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    },

    createParticles() {
        this.particles = [];
        const count = (window.innerWidth * window.innerHeight) / 9000;
        
        for (let i = 0; i < count; i++) {
            // Base particle object
            let p = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.5 + 0.1,
                speedX: 0,
                speedY: 0,
                // Specific props for fireflies/embers
                angle: Math.random() * Math.PI * 2,
                spinSpeed: Math.random() * 0.05 - 0.025
            };

            // Set speeds based on effect
            if (currentEffect === 'particles') {
                p.speedX = (Math.random() * 1 - 0.5) * 0.5;
                p.speedY = (Math.random() * 1 - 0.5) * 0.5;
            } else if (currentEffect === 'fireflies') {
                p.speedX = Math.random() * 1 - 0.5;
                p.speedY = Math.random() * 1 - 0.5;
                p.size = Math.random() * 3 + 1; // Bigger for glow
            } else if (currentEffect === 'embers') {
                p.speedX = (Math.random() * 0.5 - 0.25);
                p.speedY = -(Math.random() * 1 + 0.5); // Move UP
                p.size = Math.random() * 4 + 1;
            }

            this.particles.push(p);
        }
    },

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const isDark = document.documentElement.classList.contains('dark');
        
        // Colors
        let r, g, b;
        if (currentEffect === 'embers' || (currentEffect === 'fireflies' && isDark)) {
            // Gold/Amber/Fire color
            r = 245; g = 158; b = 11; 
        } else if (currentEffect === 'fireflies' && !isDark) {
            // Greenish for light mode fireflies? Or just dark slate
            r = 70; g = 150; b = 70; 
        } else {
            // Standard Particles
            if (isDark) { r = 245; g = 158; b = 11; } 
            else { r = 100; g = 116; b = 139; }
        }

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // --- UPDATE POSITION ---
            if (currentEffect === 'fireflies') {
                // Organic movement
                p.angle += p.spinSpeed;
                p.x += Math.cos(p.angle) * 0.5;
                p.y += Math.sin(p.angle) * 0.5;
                // Pulsating opacity
                p.opacity += Math.sin(Date.now() * 0.005 + p.x) * 0.01;
                if(p.opacity < 0.1) p.opacity = 0.1;
                if(p.opacity > 0.8) p.opacity = 0.8;
            } else {
                p.x += p.speedX;
                p.y += p.speedY;
            }

            // --- WRAP AROUND ---
            if (p.x > this.canvas.width) p.x = 0;
            if (p.x < 0) p.x = this.canvas.width;
            
            if (currentEffect === 'embers') {
                // Embers disappear at top and reset at bottom
                if (p.y < -10) {
                    p.y = this.canvas.height + 10;
                    p.x = Math.random() * this.canvas.width;
                }
            } else {
                if (p.y > this.canvas.height) p.y = 0;
                if (p.y < 0) p.y = this.canvas.height;
            }

            // --- DRAW ---
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
            this.ctx.fill();

            // --- CONNECTIONS (Only for 'particles' mode) ---
            if (currentEffect === 'particles' && this.mouse.x != null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const connectDist = 120;

                if (distance < connectDist) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${1 - distance / connectDist})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(() => this.animate());
    }
};
