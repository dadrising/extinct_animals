// =============================================================================
// ЛОГІКА АНІМАЦІЇ ФОНУ (Time Particles)
// =============================================================================

const bgAnimation = {
    canvas: null,
    ctx: null,
    particles: [],
    mouse: { x: null, y: null },
    isActive: true,

    init() {
        this.canvas = document.getElementById('bg-canvas');
        
        // Перевірка на існування канвасу (щоб уникнути помилок)
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        // Відстеження миші
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        
        // Реакція на зміну розміру вікна
        window.addEventListener('resize', () => this.resize());
        
        // Створення частинок
        this.createParticles();
        this.animate();
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles(); // Перестворюємо для правильної щільності
    },

    createParticles() {
        this.particles = [];
        // Щільність: більше частинок на великих екранах (площа / 9000)
        const count = (window.innerWidth * window.innerHeight) / 9000;
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5, // Випадковий розмір
                speedX: (Math.random() * 1 - 0.5) * 0.5, // Повільний рух по X
                speedY: (Math.random() * 1 - 0.5) * 0.5, // Повільний рух по Y
                opacity: Math.random() * 0.5 + 0.1 // Різна прозорість
            });
        }
    },

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Визначаємо колір залежно від теми (читаємо клас 'dark' з HTML)
        const isDark = document.documentElement.classList.contains('dark');
        
        // Темна тема: Янтарне світіння (Amber). Світла тема: Пилинки (Slate/Dust).
        const particleColor = isDark ? '245, 158, 11' : '100, 116, 139'; 
        const connectionColor = isDark ? '245, 158, 11' : '148, 163, 184';

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Рух
            p.x += p.speedX;
            p.y += p.speedY;

            // Зациклення країв (якщо вилетів за екран, з'являється з іншого боку)
            if (p.x > this.canvas.width) p.x = 0;
            if (p.x < 0) p.x = this.canvas.width;
            if (p.y > this.canvas.height) p.y = 0;
            if (p.y < 0) p.y = this.canvas.height;

            // Малювання частинки
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
            this.ctx.fill();

            // З'єднання з мишкою (Інтерактивний ефект)
            if (this.mouse.x != null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const connectDist = 120; // Радіус з'єднання

                if (distance < connectDist) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${connectionColor}, ${1 - distance / connectDist})`;
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
