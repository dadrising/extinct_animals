// =============================================================================
// РОЗШИРЕНА АНІМАЦІЯ ФОНУ v2.0
// Ефекти: particles, fireflies, embers, dino_world, dna_flow, geometry, asteroids
// =============================================================================

const bgAnimation = {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: null, y: null },
    effectName: 'particles',
    
    // Список доступних ефектів
    effects: ['particles', 'fireflies', 'embers', 'dino_world', 'dna_flow', 'geometry', 'asteroids'],
    
    animationFrameId: null,

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

        if (this.effectName === 'dna_flow') {
            // Для ДНК створюємо "пари" основ
            count = window.innerWidth / 30; // Кількість ланок
            for (let i = 0; i < count; i++) {
                this.particles.push({
                    x: i * 30, // Рівномірний розподіл по X
                    baseY: Math.random() * this.canvas.height, // Випадкова висота для різних ниток, якщо їх декілька
                    angle: i * 0.2, // Зсув фази для спіралі
                    speed: 0.02,
                    type: 'base_pair'
                });
            }
            return; // Спеціальний вихід для ДНК
        }

        if (this.effectName === 'asteroids') {
            count /= 2; // Менше об'єктів
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
                
                // Для нових ефектів
                depth: Math.random() * 0.5 + 0.5, // Глибина для паралаксу
                wobble: Math.random() * Math.PI * 2, // Для погойдування
                type: 'standard'
            };

            // Налаштування
            if (this.effectName === 'fireflies') {
                p.speedX = (Math.random() - 0.5) * 2;
                p.speedY = (Math.random() - 0.5) * 2;
            } 
            else if (this.effectName === 'embers') {
                p.speedY = -(Math.random() * 1 + 0.5);
                p.size = Math.random() * 4 + 1;
            } 
            else if (this.effectName === 'dino_world') {
                p.size = (Math.random() * 20 + 10) * p.depth; // Розмір залежить від глибини
                p.speedX = (Math.random() - 0.5) * 0.5 * p.depth; // Швидкість залежить від глибини
                p.speedY = (Math.random() - 0.5) * 0.5 * p.depth;
            }
            else if (this.effectName === 'asteroids') {
                // Створюємо або астероїд, або зірку
                if (Math.random() > 0.9) {
                    p.type = 'star'; // Падаюча зірка
                    p.x = Math.random() * this.canvas.width;
                    p.y = Math.random() * this.canvas.height * 0.5; // Тільки зверху
                    p.size = Math.random() * 2 + 1;
                    p.speedX = -4 - Math.random() * 4; // Швидко вліво
                    p.speedY = 2 + Math.random() * 4;  // Швидко вниз
                } else {
                    p.type = 'asteroid'; // Астероїд
                    p.icon = rocks[Math.floor(Math.random() * rocks.length)];
                    p.size = Math.random() * 15 + 5;
                    p.speedX = (Math.random() - 0.5) * 0.2;
                    p.speedY = (Math.random() - 0.5) * 0.2;
                }
            }

            this.particles.push(p);
        }
    },

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const isDark = document.documentElement.classList.contains('dark');
        
        let r = 100, g = 116, b = 139; // Slate
        if (isDark) { r = 245; g = 158; b = 11; } // Amber

        if (this.effectName === 'dna_flow') {
            this.animateDNA(r, g, b, isDark);
        } else {
            this.animateParticles(r, g, b, isDark);
        }

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    },

    // --- ЛОГІКА ДНК (Double Helix) ---
    animateDNA(r, g, b, isDark) {
        const centerY = this.canvas.height / 2;
        const amplitude = 60; // Висота спіралі
        
        // Колір ліній
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];
            
            // Рух
            p.angle += p.speed;
            
            // Позиції двох ниток
            const y1 = centerY + Math.sin(p.angle) * amplitude;
            const y2 = centerY + Math.sin(p.angle + Math.PI) * amplitude; // Зсув на 180 градусів
            
            // Колір (в темній темі - неоновий, в світлій - темний)
            const color = isDark ? `rgba(99, 102, 241, 0.6)` : `rgba(71, 85, 105, 0.6)`; // Indigo / Slate
            
            // 1. Малюємо перемичку (базову пару)
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, y1);
            this.ctx.lineTo(p.x, y2);
            this.ctx.strokeStyle = isDark ? `rgba(99, 102, 241, 0.2)` : `rgba(71, 85, 105, 0.2)`;
            this.ctx.stroke();

            // 2. Малюємо точки (нуклеотиди)
            // Верхня нитка
            this.ctx.beginPath();
            this.ctx.arc(p.x, y1, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = isDark ? '#818cf8' : '#334155';
            this.ctx.fill();
            
            // Нижня нитка
            this.ctx.beginPath();
            this.ctx.arc(p.x, y2, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = isDark ? '#c084fc' : '#475569';
            this.ctx.fill();
        }
    },

    // --- СТАНДАРТНА ЛОГІКА ЧАСТИНОК ---
    animateParticles(r, g, b, isDark) {
        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            if (this.effectName === 'asteroids') {
                if (p.type === 'star') {
                    // Падаюча зірка
                    p.x += p.speedX;
                    p.y += p.speedY;
                    p.opacity -= 0.005; // Згасає

                    // Малюємо хвіст
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p.x - p.speedX * 3, p.y - p.speedY * 3);
                    this.ctx.strokeStyle = isDark ? `rgba(255, 255, 255, ${p.opacity})` : `rgba(0,0,0, ${p.opacity})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.stroke();

                    // Скидання зірки
                    if (p.x < -50 || p.y > this.canvas.height + 50 || p.opacity <= 0) {
                        p.x = Math.random() * this.canvas.width + 200;
                        p.y = -50;
                        p.opacity = 1;
                    }
                    continue;
                } else {
                    // Астероїд
                    this.ctx.save();
                    this.ctx.translate(p.x, p.y);
                    this.ctx.rotate(p.angle);
                    this.ctx.font = `${p.size}px serif`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(p.icon, 0, 0);
                    this.ctx.restore();
                    
                    p.x += p.speedX;
                    p.y += p.speedY;
                    p.angle += p.spinSpeed;
                    
                    // Wrap edges
                    if (p.x > this.canvas.width + 20) p.x = -20;
                    if (p.x < -20) p.x = this.canvas.width + 20;
                    if (p.y > this.canvas.height + 20) p.y = -20;
                    if (p.y < -20) p.y = this.canvas.height + 20;
                    continue;
                }
            }

            // Стандартний рух для інших режимів
            if (this.effectName === 'dino_world') {
                p.x += p.speedX;
                p.y += p.speedY;
                // Плавне погойдування (sine wave wobble)
                p.wobble += 0.02;
                let wobbleY = Math.sin(p.wobble) * 0.5; 
                
                // Малювання Емодзі
                this.ctx.save();
                this.ctx.translate(p.x, p.y + wobbleY);
                this.ctx.rotate(p.angle + Math.sin(p.wobble) * 0.1); // Легкий нахил
                this.ctx.font = `${p.size}px serif`;
                // Тінь для об'єму
                this.ctx.shadowColor = "rgba(0,0,0,0.1)";
                this.ctx.shadowBlur = 5;
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(p.icon, 0, 0);
                this.ctx.restore();
            } 
            else if (this.effectName === 'geometry') {
                p.x += p.speedX;
                p.y += p.speedY;
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
            }
            else {
                // Particles / Fireflies / Embers
                if (this.effectName === 'fireflies') {
                    p.angle += p.spinSpeed;
                    p.x += Math.cos(p.angle) * 0.5;
                    p.y += Math.sin(p.angle) * 0.5;
                    p.opacity += Math.sin(Date.now() * 0.005 + p.x) * 0.01;
                } else {
                    p.x += p.speedX;
                    p.y += p.speedY;
                }

                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
                this.ctx.fill();
            }

            // Wrap edges (General)
            if (this.effectName === 'embers') {
                if (p.y < -10) { p.y = this.canvas.height + 10; p.x = Math.random() * this.canvas.width; }
            } else {
                if (p.x > this.canvas.width + 50) p.x = -50;
                if (p.x < -50) p.x = this.canvas.width + 50;
                if (p.y > this.canvas.height + 50) p.y = -50;
                if (p.y < -50) p.y = this.canvas.height + 50;
            }

            // Connections (Only for standard particles)
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
