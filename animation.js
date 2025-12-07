// =============================================================================
// РОЗШИРЕНА АНІМАЦІЯ ФОНУ v3.0
// Ефекти: particles, embers, dino_world, geometry, asteroids, spiral, snow, warp, matrix
// =============================================================================

const bgAnimation = {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: null, y: null },
    effectName: 'particles',
    
    // Оновлений список ефектів
    effects: ['particles', 'embers', 'dino_world', 'geometry', 'asteroids', 'spiral', 'snow', 'warp', 'matrix'],
    
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

        if (this.effectName === 'asteroids') count /= 2;
        if (this.effectName === 'warp') count = 200; // Фіксована кількість зірок
        if (this.effectName === 'snow') count *= 1.5; // Більше сніжинок

        if (this.effectName === 'matrix') {
            // Налаштування для Матриці
            this.cols = Math.floor(this.canvas.width / 20);
            this.yPos = Array(this.cols).fill(0);
            return;
        }

        const icons = ['🦕', '🦖', '🌿', '🦴', '🥚', '🌋', '🐾', '🌴', '🦟'];
        const rocks = ['🌑', '🌘', '☄️', '🪨'];

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
                
                // Для нових ефектів
                z: Math.random() * this.canvas.width, // Глибина для Warp
                radius: Math.random() * 200 + 50, // Для Spiral
                spiralAngle: Math.random() * Math.PI * 2,
                type: 'standard'
            };

            // Налаштування
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
                if (Math.random() > 0.9) {
                    p.type = 'star';
                    p.x = Math.random() * this.canvas.width;
                    p.y = Math.random() * this.canvas.height * 0.5;
                    p.size = Math.random() * 2 + 1;
                    p.speedX = -4 - Math.random() * 4;
                    p.speedY = 2 + Math.random() * 4;
                } else {
                    p.type = 'asteroid';
                    p.icon = rocks[Math.floor(Math.random() * rocks.length)];
                    p.size = Math.random() * 15 + 5;
                    p.speedX = (Math.random() - 0.5) * 0.2;
                    p.speedY = (Math.random() - 0.5) * 0.2;
                }
            }
            else if (this.effectName === 'snow') {
                p.speedY = Math.random() * 2 + 1; // Падіння вниз
                p.speedX = (Math.random() - 0.5) * 0.5; // Легкий вітер
                p.size = Math.random() * 3 + 2;
                p.opacity = Math.random() * 0.8 + 0.2;
            }

            this.particles.push(p);
        }
    },

    animate() {
        // Для Матриці та Warp потрібен ефект "шлейфу"
        if (this.effectName === 'matrix' || this.effectName === 'warp') {
            this.ctx.fillStyle = document.documentElement.classList.contains('dark') ? 'rgba(15, 23, 42, 0.1)' : 'rgba(248, 250, 252, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        const isDark = document.documentElement.classList.contains('dark');
        let r = 100, g = 116, b = 139; // Slate
        if (isDark) { r = 245; g = 158; b = 11; } // Amber

        // Спеціальні рендери
        if (this.effectName === 'matrix') {
            this.animateMatrix(isDark);
        } else if (this.effectName === 'warp') {
            this.animateWarp(isDark);
        } else {
            this.animateParticles(r, g, b, isDark);
        }

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    },

    // --- MATRIX EFFECT ---
    animateMatrix(isDark) {
        this.ctx.fillStyle = isDark ? '#0F0' : '#000'; // Зелений або Чорний
        this.ctx.font = '15px monospace';

        for (let i = 0; i < this.cols; i++) {
            const text = String.fromCharCode(Math.random() * 128);
            const x = i * 20;
            const y = this.yPos[i];

            this.ctx.fillText(text, x, y);

            if (y > this.canvas.height && Math.random() > 0.975) {
                this.yPos[i] = 0;
            } else {
                this.yPos[i] += 20;
            }
        }
    },

    // --- WARP SPEED EFFECT ---
    animateWarp(isDark) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        this.ctx.fillStyle = isDark ? '#FFF' : '#333';

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            
            // Рух на камеру (зменшення Z)
            p.z -= 10; // Швидкість польоту
            if (p.z <= 0) {
                p.z = this.canvas.width;
                p.x = Math.random() * this.canvas.width;
                p.y = Math.random() * this.canvas.height;
            }

            // Проекція 3D на 2D
            const sx = (p.x - cx) * (this.canvas.width / p.z) + cx;
            const sy = (p.y - cy) * (this.canvas.width / p.z) + cy;
            const size = (1 - p.z / this.canvas.width) * 4;

            this.ctx.beginPath();
            this.ctx.arc(sx, sy, size > 0 ? size : 0, 0, Math.PI * 2);
            this.ctx.fill();
        }
    },

    // --- STANDARD PARTICLES (Includes Spiral, Snow, etc.) ---
    animateParticles(r, g, b, isDark) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // --- SPIRAL LOGIC ---
            if (this.effectName === 'spiral') {
                p.spiralAngle += 0.01; // Обертання всієї галактики
                p.radius += Math.sin(p.spiralAngle) * 0.5; // Пульсація
                
                // Координати по спіралі
                p.currentX = cx + Math.cos(p.spiralAngle + p.angle) * p.radius;
                p.currentY = cy + Math.sin(p.spiralAngle + p.angle) * p.radius;
                
                // Малюємо
                this.ctx.beginPath();
                this.ctx.arc(p.currentX, p.currentY, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
                this.ctx.fill();
                continue; // Пропускаємо стандартний рух
            }

            // --- SNOW LOGIC ---
            if (this.effectName === 'snow') {
                p.y += p.speedY;
                p.x += Math.sin(p.y * 0.01) * 0.5; // Погойдування
                
                if (p.y > this.canvas.height) {
                    p.y = -10;
                    p.x = Math.random() * this.canvas.width;
                }
                
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${p.opacity})` : `rgba(100, 116, 139, ${p.opacity})`;
                this.ctx.fill();
                continue;
            }

            // --- ASTEROIDS LOGIC ---
            if (this.effectName === 'asteroids') {
                if (p.type === 'star') {
                    p.x += p.speedX; p.y += p.speedY; p.opacity -= 0.005;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p.x - p.speedX * 3, p.y - p.speedY * 3);
                    this.ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${p.opacity})` : `rgba(0,0,0, ${p.opacity})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();
                    if (p.x < -50 || p.y > this.canvas.height + 50 || p.opacity <= 0) {
                        p.x = Math.random() * this.canvas.width + 200; p.y = -50; p.opacity = 1;
                    }
                    continue;
                } else {
                    this.ctx.save();
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate(p.angle);
                    this.ctx.font = `${p.size}px serif`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(p.icon, 0, 0);
                    this.ctx.restore();
                    p.x += p.speedX; p.y += p.speedY; p.angle += p.spinSpeed;
                    if (p.x > this.canvas.width + 20) p.x = -20;
                    if (p.x < -20) p.x = this.canvas.width + 20;
                    if (p.y > this.canvas.height + 20) p.y = -20;
                    if (p.y < -20) p.y = this.canvas.height + 20;
                    continue;
                }
            }

            // --- STANDARD MOVEMENT (Embers, Particles, Geometry, Dino) ---
            p.x += p.speedX;
            p.y += p.speedY;

            // Wrap edges
            if (this.effectName === 'embers') {
                if (p.y < -10) { p.y = this.canvas.height + 10; p.x = Math.random() * this.canvas.width; }
            } else {
                if (p.x > this.canvas.width + 50) p.x = -50;
                if (p.x < -50) p.x = this.canvas.width + 50;
                if (p.y > this.canvas.height + 50) p.y = -50;
                if (p.y < -50) p.y = this.canvas.height + 50;
            }

            // Dino World specifics
            if (this.effectName === 'dino_world') {
                p.wobble += 0.02;
                let wobbleY = Math.sin(p.wobble) * 0.5;
                this.ctx.save();
                this.ctx.translate(p.x, p.y + wobbleY);
                this.ctx.rotate(p.angle + Math.sin(p.wobble) * 0.1);
                this.ctx.font = `${p.size}px serif`;
                this.ctx.shadowColor = "rgba(0,0,0,0.1)";
                this.ctx.shadowBlur = 5;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(p.icon, 0, 0);
                this.ctx.restore();
                continue;
            }

            // Geometry specifics
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
                    this.ctx.moveTo(0, -p.size);
                    this.ctx.lineTo(p.size, p.size);
                    this.ctx.lineTo(-p.size, p.size);
                    this.ctx.closePath();
                } else this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
                this.ctx.stroke();
                this.ctx.restore();
                continue;
            }

            // Basic Particles / Embers
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
            this.ctx.fill();

            // Connections
            if (this.effectName === 'particles' && this.mouse.x != null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${1 - distance / 120})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }
    }
};
