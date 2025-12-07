// =============================================================================
// РОЗШИРЕНА АНІМАЦІЯ ФОНУ
// Ефекти: particles, fireflies, embers, dino_world, dna_flow, geometry
// =============================================================================

const bgAnimation = {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: null, y: null },
    effectName: 'particles', // Поточний ефект
    animationFrameId: null,

    init() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        // Події
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        window.addEventListener('resize', () => this.resize());

        // Запуск
        this.createParticles();
        this.animate();
    },

    // Метод для зміни ефекту ззовні
    setEffect(name) {
        this.effectName = name;
        this.createParticles(); // Перезапуск частинок під новий ефект
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    },

    createParticles() {
        this.particles = [];
        // Базова щільність
        let count = (window.innerWidth * window.innerHeight) / 9000;
        
        // Коригування кількості для різних ефектів
        if (this.effectName === 'dna_flow') count *= 2; 
        if (this.effectName === 'dino_world') count /= 2; // Менше емодзі, щоб не засмічувати
        if (this.effectName === 'geometry') count /= 1.5;

        const icons = ['🦕', '🦖', '🌿', '🦴', '🥚', '🌋', '🐾'];

        for (let i = 0; i < count; i++) {
            let p = {
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.5,
                speedY: (Math.random() - 0.5) * 0.5,
                opacity: Math.random() * 0.5 + 0.1,
                angle: Math.random() * Math.PI * 2, // Для обертання
                spinSpeed: (Math.random() - 0.5) * 0.02,
                icon: icons[Math.floor(Math.random() * icons.length)], // Для Dino World
                shapeType: Math.floor(Math.random() * 3) // 0=square, 1=triangle, 2=circle
            };

            // Налаштування під конкретні ефекти
            if (this.effectName === 'fireflies') {
                p.speedX = (Math.random() - 0.5) * 2;
                p.speedY = (Math.random() - 0.5) * 2;
            } else if (this.effectName === 'embers') {
                p.speedY = -(Math.random() * 1 + 0.5); // Тільки вгору
                p.size = Math.random() * 4 + 1;
            } else if (this.effectName === 'dino_world') {
                p.size = Math.random() * 20 + 10; // Великі емодзі
            } else if (this.effectName === 'dna_flow') {
                p.x = Math.random() * this.canvas.width;
                p.baseY = Math.random() * this.canvas.height; // Базова лінія для хвилі
                p.phase = Math.random() * Math.PI * 2; // Фаза хвилі
            }

            this.particles.push(p);
        }
    },

    drawParticle(p, r, g, b, isDark) {
        this.ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        this.ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
        this.ctx.lineWidth = 1.5;

        if (this.effectName === 'dino_world') {
            // Малюємо Емодзі
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.angle);
            this.ctx.font = `${p.size}px serif`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(p.icon, 0, 0);
            this.ctx.restore();
            return;
        }

        if (this.effectName === 'geometry') {
            // Малюємо геометричні фігури
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.angle);
            this.ctx.beginPath();
            if (p.shapeType === 0) { // Квадрат
                this.ctx.rect(-p.size*2, -p.size*2, p.size*4, p.size*4);
            } else if (p.shapeType === 1) { // Трикутник
                this.ctx.moveTo(0, -p.size*2);
                this.ctx.lineTo(p.size*2, p.size*2);
                this.ctx.lineTo(-p.size*2, p.size*2);
                this.ctx.closePath();
            } else { // Коло
                this.ctx.arc(0, 0, p.size*1.5, 0, Math.PI * 2);
            }
            this.ctx.stroke(); // Тільки контур
            this.ctx.restore();
            return;
        }

        // Стандартна кругла частинка для інших ефектів
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
    },

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const isDark = document.documentElement.classList.contains('dark');
        
        // Базові кольори
        let r = 100, g = 116, b = 139; // Slate (Light mode)
        if (isDark) { r = 245; g = 158; b = 11; } // Amber (Dark mode)

        // Специфічні кольори для ефектів
        if (this.effectName === 'fireflies' && !isDark) { r = 70; g = 150; b = 70; } // Зелені світлячки вдень
        if (this.effectName === 'dna_flow' && isDark) { r = 99; g = 102; b = 241; } // Indigo для ДНК в темряві

        for (let i = 0; i < this.particles.length; i++) {
            let p = this.particles[i];

            // --- ЛОГІКА РУХУ ---
            
            if (this.effectName === 'dna_flow') {
                // Рух хвилею
                p.x += 0.5; // Рух вправо
                p.phase += 0.02;
                // Синусоїда
                p.y = p.baseY + Math.sin(p.phase) * 50; 
                
                // З'єднання з сусідами (ефект спіралі)
                // Для простоти не з'єднуємо тут, щоб не перевантажувати
            } 
            else if (this.effectName === 'dino_world' || this.effectName === 'geometry') {
                p.x += p.speedX;
                p.y += p.speedY;
                p.angle += p.spinSpeed; // Обертання
            } 
            else if (this.effectName === 'fireflies') {
                p.angle += p.spinSpeed;
                p.x += Math.cos(p.angle) * 0.5;
                p.y += Math.sin(p.angle) * 0.5;
                p.opacity += Math.sin(Date.now() * 0.005 + p.x) * 0.01; // Мерехтіння
            } 
            else {
                // Standard & Embers
                p.x += p.speedX;
                p.y += p.speedY;
            }

            // --- ОБРОБКА КРАЇВ ЕКРАНУ ---
            if (p.x > this.canvas.width + 50) p.x = -50;
            if (p.x < -50) p.x = this.canvas.width + 50;
            
            if (this.effectName === 'embers') {
                if (p.y < -10) { p.y = this.canvas.height + 10; p.x = Math.random() * this.canvas.width; }
            } else {
                if (p.y > this.canvas.height + 50) p.y = -50;
                if (p.y < -50) p.y = this.canvas.height + 50;
            }

            // --- МАЛЮВАННЯ ---
            this.drawParticle(p, r, g, b, isDark);

            // --- З'ЄДНАННЯ ЛІНІЯМИ (Тільки для particles та geometry) ---
            if ((this.effectName === 'particles' || this.effectName === 'geometry') && this.mouse.x != null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const connectDist = 150;

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

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
};
