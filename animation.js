// =============================================================================
// РОЗШИРЕНА АНІМАЦІЯ ФОНУ v3.1 (Fixed)
// Ефекти: particles, embers, dino_world, geometry, asteroids, spiral, snow, warp, matrix, dna_flow
// =============================================================================

const bgAnimation = {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: null, y: null },
    effectName: 'particles',
    
    // Повний список ефектів
    effects: ['particles', 'embers', 'dino_world', 'geometry', 'asteroids', 'spiral', 'snow', 'warp', 'matrix', 'dna_flow'],
    
    animationFrameId: null,
    cols: 0, // Для матриці
    yPos: [], // Для матриці

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

    setEffect(name) {
        this.effectName = name;
        this.createParticles();
    },

    nextEffect() {
        const currentIndex = this.effects.indexOf(this.effectName);
        const nextIndex = (currentIndex + 1) % this.effects.length;
        const nextEffectName = this.effects[nextIndex];
        this.setEffect(nextEffectName);
        
        const select = document.getElementById('animation-select');
        if(select) select.value = nextEffectName;
        
        return nextEffectName;
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    },

    createParticles() {
        this.particles = [];
        let count = (window.innerWidth * window.innerHeight) / 9000;

        // Спеціальні налаштування кількості
        if (this.effectName === 'asteroids') count /= 3;
        if (this.effectName === 'warp') count = 200; 
        if (this.effectName === 'snow') count *= 2; 

        // Ініціалізація Матриці
        if (this.effectName === 'matrix') {
            this.cols = Math.floor(this.canvas.width / 20);
            this.yPos = Array(this.cols).fill(0);
            return;
        }

        // Ініціалізація ДНК
        if (this.effectName === 'dna_flow') {
            // Створюємо пари точок для подвійної спіралі
            count = Math.ceil(this.canvas.width / 40) + 5; // Кількість ланок + запас
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: i * 40, 
                    y: this.canvas.height / 2,
                    angle: i * 0.3, // Крок спіралі
                    speed: 0.02,
                    type: 'base_pair'
                });
            }
            return;
        }

        const icons = ['🦕', '🦖', '🌿', '🦴', '🥚', '🌋', '🐾', '🌴', '🦟'];
        const rocks = ['🌑', '🌘', '☄️', '🪨', '🪐'];

        for (let i = 0; i < count; i++) {
            let p = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1,
                angle: Math.random() * Math.PI * 2,
                spinSpeed: (Math.random() - 0.5) * 0.02,
                icon: icons[Math.floor(Math.random() * icons.length)],
                shapeType: Math.floor(Math.random() * 3),
                depth: Math.random() * 0.5 + 0.5,
                wobble: Math.random() * Math.PI * 2,
                z: Math.random() * this.canvas.width, // Warp depth
                radius: Math.random() * 200 + 50, // Spiral radius
                spiralAngle: Math.random() * Math.PI * 2,
                type: 'standard'
            };

            // Налаштування швидкостей
            if (this.effectName === 'embers') {
                p.speedY = -(Math.random() * 1 + 0.5);
                p.size = Math.random() * 4 + 1;
            } 
            else if (this.effectName === 'dino_world') {
                p.size = (Math.random() * 20 + 10) * p.depth;
                p.speedX = (Math.random() - 0.5) * 0.5 * p.depth;
                p.speedY = (Math.random() - 0.5) * 0.5 * p.depth;
            }
            else if (this.effectName === 'asteroids') {
                // 10% - падаючі зірки, 90% - астероїди
                if (Math.random() > 0.9) {
                    p.type = 'star';
                    p.x = Math.random() * this.canvas.width;
                    p.y = Math.random() * this.canvas.height * 0.5;
                    p.size = Math.random() * 2 + 1;
                    p.speedX = -5 - Math.random() * 5; 
                    p.speedY = 3 + Math.random() * 3;  
                } else {
                    p.type = 'asteroid';
                    p.icon = rocks[Math.floor(Math.random() * rocks.length)];
                    p.size = Math.random() * 15 + 10;
                    p.speedX = (Math.random() - 0.5) * 0.3;
                    p.speedY = (Math.random() - 0.5) * 0.3;
                }
            }
            else if (this.effectName === 'snow') {
                p.speedY = Math.random() * 1.5 + 0.5; 
                p.speedX = (Math.random() - 0.5) * 0.5;
                p.size = Math.random() * 3 + 2;
                p.opacity = Math.random() * 0.8 + 0.2;
            }

            this.particles.push(p);
        }
    },

    animate() {
        // Ефект шлейфу для деяких режимів
        if (['matrix', 'warp', 'asteroids'].includes(this.effectName)) {
            this.ctx.fillStyle = document.documentElement.classList.contains('dark') ? 'rgba(15, 23, 42, 0.2)' : 'rgba(248, 250, 252, 0.2)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        const isDark = document.documentElement.classList.contains('dark');
        let r = 100, g = 116, b = 139; // Slate
        if (isDark) { r = 245; g = 158; b = 11; } // Amber

        // Вибір методу рендерингу
        switch (this.effectName) {
            case 'matrix': this.animateMatrix(isDark); break;
            case 'warp': this.animateWarp(isDark); break;
            case 'dna_flow': this.animateDNA(isDark); break;
            default: this.animateParticles(r, g, b, isDark); break;
        }

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    },

    // --- MATRIX ---
    animateMatrix(isDark) {
        this.ctx.fillStyle = isDark ? '#0F0' : '#000';
        this.ctx.font = '15px monospace';
        for (let i = 0; i < this.cols; i++) {
            const text = String.fromCharCode(Math.random() * 128);
            const x = i * 20;
            const y = this.yPos[i];
            this.ctx.fillText(text, x, y);
            if (y > this.canvas.height && Math.random() > 0.975) this.yPos[i] = 0;
            else this.yPos[i] += 20;
        }
    },

    // --- WARP ---
    animateWarp(isDark) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        this.ctx.fillStyle = isDark ? '#FFF' : '#333';
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            p.z -= 10;
            if (p.z <= 0) {
                p.z = this.canvas.width;
                p.x = Math.random() * this.canvas.width;
                p.y = Math.random() * this.canvas.height;
            }
            const sx = (p.x - cx) * (this.canvas.width / p.z) + cx;
            const sy = (p.y - cy) * (this.canvas.width / p.z) + cy;
            const size = (1 - p.z / this.canvas.width) * 4;
            if (size > 0) {
                this.ctx.beginPath();
                this.ctx.arc(sx, sy, size, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
    },

    // --- DNA FLOW ---
    animateDNA(isDark) {
        const centerY = this.canvas.height / 2;
        const amplitude = 80; 
        
        this.ctx.lineWidth = 2;
        // Колір "перемичок"
        this.ctx.strokeStyle = isDark ? `rgba(99, 102, 241, 0.3)` : `rgba(71, 85, 105, 0.3)`;

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            p.angle += p.speed; // Обертання

            const y1 = centerY + Math.sin(p.angle) * amplitude;
            const y2 = centerY + Math.sin(p.angle + Math.PI) * amplitude;

            // Перемичка
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, y1);
            this.ctx.lineTo(p.x, y2);
            this.ctx.stroke();

            // Точки (Нуклеотиди)
            this.ctx.beginPath();
            this.ctx.arc(p.x, y1, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = isDark ? '#818cf8' : '#334155'; // Indigo / Slate
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.arc(p.x, y2, 5, 0, Math.PI * 2);
            this.ctx.fillStyle = isDark ? '#c084fc' : '#475569'; // Purple / Slate
            this.ctx.fill();
        }
    },

    // --- GENERAL PARTICLES ---
    animateParticles(r, g, b, isDark) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // 1. ASTEROIDS & STARS
            if (this.effectName === 'asteroids') {
                if (p.type === 'star') {
                    p.x += p.speedX; p.y += p.speedY; p.opacity -= 0.01;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p.x - p.speedX * 4, p.y - p.speedY * 4); // Довгий хвіст
                    this.ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${p.opacity})` : `rgba(0,0,0, ${p.opacity})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                    // Reset star
                    if (p.x < -100 || p.y > this.canvas.height + 100 || p.opacity <= 0) {
                        p.x = Math.random() * this.canvas.width + 300; 
                        p.y = Math.random() * this.canvas.height * 0.5 - 200; 
                        p.opacity = 1;
                    }
                } else {
                    // Астероїд
                    p.x += p.speedX; p.y += p.speedY; p.angle += p.spinSpeed;
                    this.ctx.save();
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate(p.angle);
                    this.ctx.font = `${p.size}px serif`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(p.icon, 0, 0);
                    this.ctx.restore();
                    // Wrap edges
                    if (p.x > this.canvas.width + 50) p.x = -50;
                    if (p.x < -50) p.x = this.canvas.width + 50;
                    if (p.y > this.canvas.height + 50) p.y = -50;
                    if (p.y < -50) p.y = this.canvas.height + 50;
                }
                continue;
            }

            // 2. SPIRAL
            if (this.effectName === 'spiral') {
                p.spiralAngle += 0.005; 
                p.radius += Math.sin(p.spiralAngle * 2) * 0.2; 
                const sx = cx + Math.cos(p.spiralAngle + p.angle) * p.radius;
                const sy = cy + Math.sin(p.spiralAngle + p.angle) * p.radius;
                
                this.ctx.beginPath();
                this.ctx.arc(sx, sy, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
                this.ctx.fill();
                continue;
            }

            // 3. SNOW
            if (this.effectName === 'snow') {
                p.y += p.speedY;
                p.x += Math.sin(p.y * 0.01) * 0.5;
                if (p.y > this.canvas.height) { p.y = -10; p.x = Math.random() * this.canvas.width; }
                
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${p.opacity})` : `rgba(150, 160, 180, ${p.opacity})`;
                this.ctx.fill();
                continue;
            }

            // 4. STANDARD MOVEMENT (Dino, Geometry, Particles, Embers)
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap logic
            if (this.effectName === 'embers') {
                if (p.y < -20) { p.y = this.canvas.height + 20; p.x = Math.random() * this.canvas.width; }
            } else {
                if (p.x > this.canvas.width + 50) p.x = -50;
                if (p.x < -50) p.x = this.canvas.width + 50;
                if (p.y > this.canvas.height + 50) p.y = -50;
                if (p.y < -50) p.y = this.canvas.height + 50;
            }

            // Dino Draw
            if (this.effectName === 'dino_world') {
                p.wobble += 0.02;
                this.ctx.save();
                this.ctx.translate(p.x, p.y + Math.sin(p.wobble)*2);
                this.ctx.rotate(p.angle + Math.sin(p.wobble)*0.1);
                this.ctx.font = `${p.size}px serif`;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(p.icon, 0, 0);
                this.ctx.restore();
                continue;
            }

            // Geometry Draw
            if (this.effectName === 'geometry') {
                p.angle += p.spinSpeed;
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.angle);
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
                this.ctx.lineWidth = 1.5;
                if (p.shapeType === 0) this.ctx.rect(-p.size, -p.size, p.size*2, p.size*2);
                else if (p.shapeType === 1) {
                    this.ctx.moveTo(0, -p.size); this.ctx.lineTo(p.size, p.size); this.ctx.lineTo(-p.size, p.size); this.ctx.closePath();
                } else this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.restore();
                continue;
            }

            // Standard Particles & Embers Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
            this.ctx.fill();

            // Connections
            if (this.effectName === 'particles' && this.mouse.x != null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < 120) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${1 - d/120})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }
    }
};
