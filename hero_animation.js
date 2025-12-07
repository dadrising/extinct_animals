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
        // Сбрасываем CSS анимацию, чтобы таймер JS и прыжки CSS начались одновременно с 0
        heroElement.style.animation = 'none';
        heroElement.offsetHeight; /* trigger reflow (перезапуск) */
        heroElement.style.animation = ''; // Возвращаем animate-bounce

        // 3. Запуск смены эмодзи (СРАЗУ, в момент касания земли/начала цикла)
        this.changeEmojiWithEffect(heroElement);
        
        this.intervalId = setInterval(() => {
            this.changeEmojiWithEffect(heroElement);
        }, 1000); // 1000ms = длительность одного прыжка animate-bounce
    },

    changeEmojiWithEffect(element) {
        // Эффект превращения:
        // Добавляем фильтр (яркость/контраст) и легкое увеличение, не сбивая прыжок
        element.style.transition = "filter 0.2s ease-in-out, text-shadow 0.2s ease-in-out";
        
        // Вспышка и тень при ударе о землю
        element.style.filter = "brightness(1.5) hue-rotate(90deg)";
        element.style.textShadow = "0 0 20px rgba(255, 215, 0, 0.8)"; 

        // Смена животного
        const randomEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        element.innerText = randomEmoji;

        // Убираем эффект через 300мс (когда он уже летит вверх)
        setTimeout(() => {
            element.style.filter = "none";
            element.style.textShadow = "none";
        }, 300);
    }
};
