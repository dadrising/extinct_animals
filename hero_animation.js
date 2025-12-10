// =============================================================================
// ЛОГІКА ГЕРОЯ v5.0 (Mega Effects Pack)
// =============================================================================

const HeroDino = {
    emojis: [
        '🦖', '🦕', '🦎', '🐍', '🐢', '🐊', '🦈', '🐋', '🐬', '🐟',
        '🐠', '🐡', '🐙', '🐚', '🦀', '🦞', '🦂', '🦅', '🦆', '🦇',
        '🦣', '🦥', '🐅', '🦏', '🦍', '🦫', '🦓', '🐕', '🐂', '🐎'
    ],

    config: {
        speed: 1.0,
        size: 1.0,
        transformPhase: 0.0,
        effectType: 'flash'
    },

    intervalId: null,
    timeoutId: null,

    init() {
        const heroElement = document.getElementById('hero-dino');
        if (!heroElement) return;

        heroElement.onclick = () => {
            if (typeof bgAnimation !== 'undefined') bgAnimation.nextEffect();
        };

        if (typeof UserConfig !== 'undefined' && UserConfig.hero) {
            this.config = { ...this.config, ...UserConfig.hero };
        }

        this.applySettings();
    },

    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.applySettings();
    },

    applySettings() {
        const heroElement = document.getElementById('hero-dino');
        if (!heroElement) return;

        if (this.timeoutId) clearTimeout(this.timeoutId);
        if (this.intervalId) clearInterval(this.intervalId);

        heroElement.style.fontSize = `${6 * this.config.size}rem`;

        // Скидання анімації стрибка
        heroElement.style.animation = 'none';
        heroElement.offsetHeight;
        heroElement.style.animation = `bounce ${this.config.speed}s infinite`;

        const durationMs = this.config.speed * 1000;
        const delay = durationMs * this.config.transformPhase;

        this.timeoutId = setTimeout(() => {
            this.changeEmojiWithEffect(heroElement);
            this.intervalId = setInterval(() => {
                this.changeEmojiWithEffect(heroElement);
            }, durationMs);
        }, delay);
    },

    changeEmojiWithEffect(element) {
        // Скидаємо попередні переходи
        element.style.transition = 'none';

        // --- ВИБІР ЕФЕКТУ ---
        switch (this.config.effectType) {
            // Нові ефекти
            case 'flip': // Сальто (3D оберт)
                element.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                element.style.transform = 'rotateY(360deg) scale(1.2)';
                break;

            case 'blur': // Туман (розмиття і зникнення)
                element.style.transition = 'filter 0.2s ease, opacity 0.2s ease';
                element.style.filter = 'blur(10px)';
                element.style.opacity = '0.5';
                break;

            case 'neon': // Неон (яскраве світіння)
                element.style.transition = 'text-shadow 0.1s ease, transform 0.1s ease';
                element.style.textShadow = '0 0 10px #fff, 0 0 20px #fff, 0 0 30px #ff00de, 0 0 40px #ff00de';
                element.style.transform = 'scale(1.1)';
                break;

            case 'wobble': // Желе (тряска)
                element.style.transition = 'transform 0.3s cubic-bezier(.36,.07,.19,.97)';
                element.style.transform = 'rotate(-15deg) scale(1.3) skewX(10deg)';
                break;

            case 'zoom': // Суперзум (наїзд камери)
                element.style.transition = 'transform 0.2s ease-in';
                element.style.transform = 'scale(0.1)'; // Зменшується в нуль, потім виростає новим
                break;

            // Старі ефекти
            case 'spin':
                element.style.transition = 'transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55)';
                element.style.transform = 'rotate(360deg) scale(1.2)';
                break;

            case 'glitch':
                element.style.transition = 'all 0.1s steps(3)';
                element.style.transform = 'skewX(20deg) scale(1.1)';
                element.style.filter = 'contrast(200%) hue-rotate(90deg) drop-shadow(4px 4px 0px red)';
                break;

            case 'squeeze':
                element.style.transition = 'transform 0.2s ease-out';
                element.style.transform = 'scale(1.5, 0.5)';
                break;

            case 'fade':
                element.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                element.style.opacity = '0.2';
                element.style.transform = 'scale(0.8) translateY(-20px)';
                break;

            case 'flash':
            default:
                element.style.transition = `filter 0.2s ease, text-shadow 0.2s ease, transform 0.2s ease`;
                element.style.filter = "brightness(1.5) contrast(1.5) drop-shadow(0 0 10px yellow)";
                element.style.textShadow = "0 0 25px rgba(255, 215, 0, 1)";
                element.style.transform = `scale(1.1)`;
                break;
        }

        // Зміна символу
        const randomEmoji = this.emojis[Math.floor(Math.random() * this.emojis.length)];
        // Невелика затримка для ефекту 'zoom', щоб символ змінився, коли він невидимий
        if (this.config.effectType === 'zoom') {
            setTimeout(() => { element.innerText = randomEmoji; }, 100);
        } else {
            element.innerText = randomEmoji;
        }

        // Скидання ефекту (повернення до норми)
        const resetTime = (this.config.effectType === 'spin' || this.config.effectType === 'flip') ? 400 : 200;

        setTimeout(() => {
            // Для обертання скидаємо без анімації, щоб не крутився назад
            if (this.config.effectType === 'spin' || this.config.effectType === 'flip') {
                element.style.transition = 'none';
                // Важливо: для 3D flip треба скинути transform
                element.style.transform = (this.config.effectType === 'flip') ? 'rotateY(0deg) scale(1.0)' : 'rotate(0deg) scale(1.0)';
            } else {
                element.style.transition = 'all 0.3s ease-out';
                element.style.filter = "none";
                element.style.textShadow = "none";
                element.style.transform = "scale(1.0)";
                element.style.opacity = "1";
            }
        }, resetTime);
    }
};