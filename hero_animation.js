// =============================================================================
// ЛОГИКА ГЛАВНОГО ГЕРОЯ (ПРЫГАЮЩИЙ ДИНОЗАВР)
// =============================================================================

const HeroDino = {
    // Список эмодзи для превращения
    emojis: [
        '🦖', '🦕', '🦎', '🐍', '🐢', '🐊', '🦈', '🐋', '🐬', '🐟',
        '🐠', '🐡', '🐙', '🐚', '🦀', '🦞', '🦂', '🦅', '🦆', '🦇',
        '🦣', '🦥', '🐅', '🦏', '🦍', '🦫', '🦓', '🐕', '🐂', '🐎'
    ],
    
    intervalId: null,

    init() {
        const heroElement = document.getElementById('hero-dino');
        if (!heroElement) return;

        // 1. Настройка клика (смена фона)
        heroElement.onclick = () => {
            if (typeof bgAnimation !== 'undefined') {
                bgAnimation.nextEffect();
            }
        };

        // 2. Синхронизация анимации
        // Сбрасываем и повторно запускаем анимацию, чтобы гарантировать старт с 0%
        heroElement.style.animation = 'none';
        heroElement.offsetHeight; /* trigger reflow (перезапуск) */
        heroElement.style.animation = 'bounce 1s infinite'; // Заданная анимация

        // Очищаем предыдущий интервал, если init вызван повторно
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }

        // 3. Запуск смены эмодзи (МГНОВЕННО, при касании земли - 0ms)
        this.changeEmojiWithEffect(heroElement);
        
        this.intervalId = setInterval(() => {
            this.changeEmojiWithEffect(heroElement);
        }, 1000); // Повторяем ровно через 1 секунду (следующее приземление)
    },

    changeEmojiWithEffect(element) {
        // --- 1. Эффект превращения (начинается в 0ms) ---
        // Добавляем фильтр (яркость/контраст) и тень для вспышки
        element.style.transition = "filter 0.2s ease-in-out, text-shadow 0.2s ease-in-out, transform 0.2s ease-in-out";
        
        // Вспышка и тень при ударе о землю
        element.style.filter = "brightness(1.5) contrast(1.5) drop-shadow(0 0 10px yellow)";
        element.style.textShadow = "0 0 25px rgba(255, 215, 0, 1)"; 
        element.style.transform = "scale(1.1)"; // Чуть увеличим при ударе

        // --- 2. Смена животного ---
        const randomEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        element.innerText = randomEmoji;

        // --- 3. Убираем эффект (через 300мс, когда он уже начал подниматься) ---
        setTimeout(() => {
            element.style.filter = "none";
            element.style.textShadow = "none";
            element.style.transform = "scale(1.0)";
        }, 300);
    }
};
