// =============================================================================
// АНІМАЦІЯ ФОНУ v6.0 (More Settings)
// =============================================================================

const bgAnimation = {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: null, y: null },
    effectName: 'particles',

    // ГЛОБАЛЬНІ НАСТРОЙКИ
    config: {
        density: 1.0,
        speed: 1.0,
        size: 1.0,
        shape: 'circle',
        connect: true,
        // НОВІ:
        opacity: 0.5,       // Базова прозорість
        interaction: 1.0    // Радіус реакції на мишу
    },

    effects: ['particles', 'embers', 'dino_world', 'geometry', 'asteroids', 'spiral', 'snow', 'warp', 'matrix', 'dna_flow'],
    animationFrameId: null,
    cols: 0, yPos: [],

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

        if (typeof UserConfig !== 'undefined' && UserConfig.bg) {
            this.config = { ...this.config, ...UserConfig.bg };
            this.effectName = UserConfig.effect || 'particles';
        }

        this.createParticles();
        this.animate();
    },

    setEffect(name) {
        this.effectName = name;
        this.createParticles();
        const settingsSelect = document.getElementById('settings-effect-select');
        if(settingsSelect) settingsSelect.value = name;
        const navSelect = document.getElementById('animation-select');
        if(navSelect) navSelect.value = name;
    },

    nextEffect() {
        const currentIndex = this.effects.indexOf(this.effectName);
        const nextIndex = (currentIndex + 1) % this.effects.length;
        this.setEffect(this.effects[nextIndex]);
        return this.effects[nextIndex];
    },

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.createParticles();
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    },

    createParticles() {
        this.particles = [];
        let count = ((window.innerWidth * window.innerHeight) / 9000) * this.config.density;

        if (this.effectName === 'asteroids') count /= 3;
        if (this.effectName === 'warp') count = 200 * this.config.density;
        if (this.effectName === 'snow') count *= 2;

        if (this.effectName === 'matrix') {
            this.cols = Math.floor(this.canvas.width / 20);
            this.yPos = Array(this.cols).fill(0);
            return;
        }

        if (this.effectName === 'dna_flow') {
            count = Math.ceil(this.canvas.width / 40) + 5;
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: i * 40, y: this.canvas.height / 2, angle: i * 0.3,
                    speed: 0.02 * this.config.speed, type: 'base_pair'
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
                size: (Math.random() * 2 + 1) * this.config.size,
                speedX: ((Math.random() - 0.5) * 0.5) * this.config.speed,
                speedY: ((Math.random() - 0.5) * 0.5) * this.config.speed,
                // Використовуємо налаштування прозорості
                opacity: (Math.random() * 0.5 + 0.1) * this.config.opacity,
                angle: Math.random() * Math.PI * 2,
                spinSpeed: ((Math.random() - 0.5) * 0.02) * this.config.speed,
                icon: icons[Math.floor(Math.random() * icons.length)],
                shape: this.config.shape === 'mixed'
                    ? ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)]
                    : this.config.shape,
                depth: Math.random() * 0.5 + 0.5,
                wobble: Math.random() * Math.PI * 2,
                z: Math.random() * this.canvas.width,
                radius: (Math.random() * 200 + 50) * this.config.size,
                spiralAngle: Math.random() * Math.PI * 2,
                type: 'standard'
            };

            if (p.opacity > 1) p.opacity = 1;

            if (this.effectName === 'embers') {
                p.speedY = -(Math.random() + 0.5) * this.config.speed;
                p.size = (Math.random() * 4 + 1) * this.config.size;
            } else if (this.effectName === 'dino_world') {
                p.size = ((Math.random() * 20 + 10) * p.depth) * this.config.size;
            } else if (this.effectName === 'asteroids') {
                if (Math.random() > 0.9) {
                    p.type = 'star';
                    p.x = Math.random() * this.canvas.width;
                    p.y = Math.random() * this.canvas.height * 0.5;
                    p.speedX = (-5 - Math.random() * 5) * this.config.speed;
                    p.speedY = (3 + Math.random() * 3) * this.config.speed;
                } else {
                    p.type = 'asteroid';
                    p.icon = rocks[Math.floor(Math.random() * rocks.length)];
                    p.size = (Math.random() * 15 + 10) * this.config.size;
                }
            } else if (this.effectName === 'snow') {
                p.speedY = (Math.random() * 1.5 + 0.5) * this.config.speed;
                p.size = (Math.random() * 3 + 2) * this.config.size;
            }

            this.particles.push(p);
        }
    },

    animate() {
        if (['matrix', 'warp', 'asteroids'].includes(this.effectName)) {
            this.ctx.fillStyle = document.documentElement.classList.contains('dark') ? 'rgba(15, 23, 42, 0.2)' : 'rgba(248, 250, 252, 0.2)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }

        const isDark = document.documentElement.classList.contains('dark');
        let r = 100, g = 116, b = 139;
        if (isDark) { r = 245; g = 158; b = 11; }

        switch (this.effectName) {
            case 'matrix': this.animateMatrix(isDark); break;
            case 'warp': this.animateWarp(isDark); break;
            case 'dna_flow': this.animateDNA(isDark); break;
            default: this.animateParticles(r, g, b, isDark); break;
        }

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    },

    // --- RENDERERS ---
    animateMatrix(isDark) {
        this.ctx.fillStyle = isDark ? '#0F0' : '#000';
        // Opacity affects font visibility slightly or color
        this.ctx.globalAlpha = this.config.opacity;
        this.ctx.font = `${15 * this.config.size}px monospace`;
        for (let i = 0; i < this.cols; i++) {
            const text = String.fromCharCode(Math.random() * 128);
            const x = i * 20; const y = this.yPos[i];
            this.ctx.fillText(text, x, y);
            if (y > this.canvas.height && Math.random() > 0.975) this.yPos[i] = 0;
            else this.yPos[i] += 20 * this.config.speed;
        }
        this.ctx.globalAlpha = 1.0;
    },
    animateWarp(isDark) {
        const cx = this.canvas.width / 2; const cy = this.canvas.height / 2;
        this.ctx.fillStyle = isDark ? '#FFF' : '#333';
        this.ctx.globalAlpha = this.config.opacity;
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            p.z -= 10 * this.config.speed;
            if (p.z <= 0) { p.z = this.canvas.width; p.x = Math.random() * this.canvas.width; p.y = Math.random() * this.canvas.height; }
            const sx = (p.x - cx) * (this.canvas.width / p.z) + cx;
            const sy = (p.y - cy) * (this.canvas.width / p.z) + cy;
            const size = ((1 - p.z / this.canvas.width) * 4) * this.config.size;
            if (size > 0) { this.ctx.beginPath(); this.ctx.arc(sx, sy, size, 0, Math.PI * 2); this.ctx.fill(); }
        }
        this.ctx.globalAlpha = 1.0;
    },
    animateDNA(isDark) {
        const centerY = this.canvas.height / 2;
        const amplitude = 80 * this.config.size;
        this.ctx.lineWidth = 2 * this.config.size;
        this.ctx.strokeStyle = isDark ? `rgba(99, 102, 241, ${0.3 * this.config.opacity})` : `rgba(71, 85, 105, ${0.3 * this.config.opacity})`;
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            p.angle += p.speed;
            const y1 = centerY + Math.sin(p.angle) * amplitude;
            const y2 = centerY + Math.sin(p.angle + Math.PI) * amplitude;
            this.ctx.beginPath(); this.ctx.moveTo(p.x, y1); this.ctx.lineTo(p.x, y2); this.ctx.stroke();
            this.ctx.beginPath(); this.ctx.arc(p.x, y1, 5 * this.config.size, 0, Math.PI * 2);
            this.ctx.fillStyle = isDark ? `rgba(129, 140, 248, ${this.config.opacity})` : `rgba(51, 65, 85, ${this.config.opacity})`; this.ctx.fill();
            this.ctx.beginPath(); this.ctx.arc(p.x, y2, 5 * this.config.size, 0, Math.PI * 2);
            this.ctx.fillStyle = isDark ? `rgba(192, 132, 252, ${this.config.opacity})` : `rgba(71, 85, 105, ${this.config.opacity})`; this.ctx.fill();
        }
    },
    animateParticles(r, g, b, isDark) {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        const interactionRadius = 150 * this.config.interaction;

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // ... Movement Logic (Standard) ...
            if (this.effectName === 'asteroids') { /* ... */
                if (p.type === 'star') {
                    p.x += p.speedX; p.y += p.speedY; p.opacity -= 0.01;
                    this.ctx.beginPath(); this.ctx.moveTo(p.x, p.y); this.ctx.lineTo(p.x - p.speedX * 4, p.y - p.speedY * 4);
                    this.ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${p.opacity})` : `rgba(0,0,0, ${p.opacity})`;
                    this.ctx.lineWidth = 2 * this.config.size;
                    this.ctx.stroke();
                    if (p.x < -100 || p.y > this.canvas.height + 100 || p.opacity <= 0) { p.x = Math.random() * this.canvas.width + 300; p.y = -50; p.opacity = 1; }
                } else {
                    this.ctx.save(); this.ctx.translate(p.x, p.y); this.ctx.rotate(p.angle);
                    this.ctx.font = `${p.size}px serif`; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle';
                    this.ctx.globalAlpha = this.config.opacity;
                    this.ctx.fillText(p.icon, 0, 0);
                    this.ctx.globalAlpha = 1.0;
                    this.ctx.restore();
                    p.x += p.speedX; p.y += p.speedY; p.angle += p.spinSpeed;
                    if (p.x > this.canvas.width + 50) p.x = -50; if (p.x < -50) p.x = this.canvas.width + 50;
                    if (p.y > this.canvas.height + 50) p.y = -50; if (p.y < -50) p.y = this.canvas.height + 50;
                }
                continue;
            }
            if (this.effectName === 'spiral') {
                p.spiralAngle += 0.005 * this.config.speed;
                p.radius += Math.sin(p.spiralAngle * 2) * 0.2;
                const sx = cx + Math.cos(p.spiralAngle + p.angle) * p.radius;
                const sy = cy + Math.sin(p.spiralAngle + p.angle) * p.radius;
                this.ctx.beginPath(); this.drawShape(sx, sy, p.size, p.shape);
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * this.config.opacity})`; this.ctx.fill();
                continue;
            }
            if (this.effectName === 'snow') {
                p.y += p.speedY; p.x += Math.sin(p.y * 0.01) * 0.5;
                if (p.y > this.canvas.height) { p.y = -10; p.x = Math.random() * this.canvas.width; }
                this.ctx.beginPath(); this.drawShape(p.x, p.y, p.size, 'circle');
                this.ctx.fillStyle = isDark ? `rgba(255, 255, 255, ${p.opacity * this.config.opacity})` : `rgba(150, 160, 180, ${p.opacity * this.config.opacity})`;
                this.ctx.fill();
                continue;
            }

            // Standard Movement
            if (this.effectName !== 'dino_world') {
                p.x += p.speedX; p.y += p.speedY;
                if (p.x > this.canvas.width + 50) p.x = -50; if (p.x < -50) p.x = this.canvas.width + 50;
                if (p.y > this.canvas.height + 50) p.y = -50; if (p.y < -50) p.y = this.canvas.height + 50;
            } else {
                p.wobble += 0.02 * this.config.speed;
                this.ctx.save(); this.ctx.translate(p.x, p.y + Math.sin(p.wobble)*2); this.ctx.rotate(p.angle + Math.sin(p.wobble)*0.1);
                this.ctx.font = `${p.size}px serif`; this.ctx.textAlign = 'center'; this.ctx.textBaseline = 'middle';
                this.ctx.globalAlpha = this.config.opacity;
                this.ctx.fillText(p.icon, 0, 0);
                this.ctx.globalAlpha = 1.0;
                this.ctx.restore();
                continue;
            }

            // Draw Geometry/Particles
            if (this.effectName === 'geometry') {
                p.angle += p.spinSpeed;
                this.ctx.save(); this.ctx.translate(p.x, p.y); this.ctx.rotate(p.angle);
                this.ctx.beginPath();
                this.drawShape(0, 0, p.size, p.shape);
                this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * this.config.opacity})`;
                this.ctx.lineWidth = 1.5; this.ctx.stroke(); this.ctx.restore();
            } else {
                this.ctx.beginPath();
                this.drawShape(p.x, p.y, p.size, p.shape);
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity * this.config.opacity})`;
                this.ctx.fill();
            }

            // Connections
            if (this.config.connect && this.effectName === 'particles' && this.mouse.x != null) {
                const dx = p.x - this.mouse.x; const dy = p.y - this.mouse.y;
                const d = Math.sqrt(dx*dx + dy*dy);
                if (d < interactionRadius) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(1 - d/interactionRadius) * this.config.opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        }
    },

    drawShape(x, y, size, shape) {
        if (shape === 'circle') this.ctx.arc(x, y, size, 0, Math.PI * 2);
        else if (shape === 'square') this.ctx.rect(x - size, y - size, size * 2, size * 2);
        else if (shape === 'triangle') {
            this.ctx.moveTo(x, y - size); this.ctx.lineTo(x + size, y + size); this.ctx.lineTo(x - size, y + size); this.ctx.closePath();
        } else if (shape === 'star') {
            for (let i = 0; i < 5; i++) {
                this.ctx.lineTo(Math.cos((18 + i * 72) / 180 * Math.PI) * size + x, -Math.sin((18 + i * 72) / 180 * Math.PI) * size + y);
                this.ctx.lineTo(Math.cos((54 + i * 72) / 180 * Math.PI) * (size / 2) + x, -Math.sin((54 + i * 72) / 180 * Math.PI) * (size / 2) + y);
            }
            this.ctx.closePath();
        }
    }
};