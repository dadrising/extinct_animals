// =============================================================================
// НАЛАШТУВАННЯ v5.0 (Self-Replicating / Самовідтворення)
// =============================================================================

// ЦЕЙ ОБ'ЄКТ ЗМІНЮЄТЬСЯ АВТОМАТИЧНО ПРИ ЗБЕРЕЖЕННІ ФАЙЛУ
const DEFAULT_CONFIG = {
    "bg": {
        "density": 1,
        "speed": 1,
        "size": 1,
        "opacity": 0.5,
        "interaction": 1,
        "shape": "circle"
    },
    "hero": {
        "speed": 1,
        "size": 1,
        "transformPhase": 0,
        "effectType": "flash"
    },
    "effect": "particles"
};

const Settings = {
    // 1. Застосування налаштувань ДО запуску анімацій
    applyDefaults() {
        if (typeof DEFAULT_CONFIG === 'undefined') return;

        if (typeof bgAnimation !== 'undefined') {
            // Зливаємо дефолтні налаштування з збереженими
            bgAnimation.config = { ...bgAnimation.config, ...DEFAULT_CONFIG.bg };
            bgAnimation.effectName = DEFAULT_CONFIG.effect;
        }
        if (typeof HeroDino !== 'undefined') {
            HeroDino.config = { ...HeroDino.config, ...DEFAULT_CONFIG.hero };
        }
    },

    // 2. Ініціалізація UI
    init() {
        this.modal = document.getElementById('settings-modal');
        if (!this.modal) return;
        this.header = document.getElementById('settings-header');

        // Drag Logic
        this.isDragging = false; this.startX = 0; this.startY = 0; this.initialLeft = 0; this.initialTop = 0;
        if (this.header) {
            this.header.style.cursor = 'move';
            this.header.onmousedown = (e) => this.dragStart(e);
            window.onmouseup = () => this.dragEnd();
            window.onmousemove = (e) => this.drag(e);
        }

        // Elements
        this.select = document.getElementById('settings-effect-select');
        this.shapeSelect = document.getElementById('settings-shape-select');
        this.heroEffectSelect = document.getElementById('settings-hero-effect-select');

        this.bgDensitySlider = document.getElementById('slider-bg-density');
        this.bgSpeedSlider = document.getElementById('slider-bg-speed');
        this.bgSizeSlider = document.getElementById('slider-bg-size');
        this.bgOpacitySlider = document.getElementById('slider-bg-opacity');
        this.bgInteractSlider = document.getElementById('slider-bg-interact');

        this.heroSpeedSlider = document.getElementById('slider-hero-speed');
        this.heroSizeSlider = document.getElementById('slider-hero-size');
        this.heroPhaseSlider = document.getElementById('slider-hero-phase');

        // Labels
        this.bgDensityVal = document.getElementById('val-bg-density');
        this.bgSpeedVal = document.getElementById('val-bg-speed');
        this.bgSizeVal = document.getElementById('val-bg-size');
        this.bgOpacityVal = document.getElementById('val-bg-opacity');
        this.bgInteractVal = document.getElementById('val-bg-interact');
        this.heroSpeedVal = document.getElementById('val-hero-speed');
        this.heroSizeVal = document.getElementById('val-hero-size');
        this.heroPhaseVal = document.getElementById('val-hero-phase');

        this.updateUI();
    },

    dragStart(e) { this.isDragging = true; this.startX = e.clientX; this.startY = e.clientY; const rect = this.modal.getBoundingClientRect(); this.initialLeft = rect.left; this.initialTop = rect.top; },
    drag(e) { if (!this.isDragging) return; e.preventDefault(); const currentX = e.clientX - this.startX; const currentY = e.clientY - this.startY; this.modal.style.position = 'fixed'; this.modal.style.margin = '0'; this.modal.style.left = `${this.initialLeft + currentX}px`; this.modal.style.top = `${this.initialTop + currentY}px`; this.modal.style.transform = 'none'; },
    dragEnd() { this.isDragging = false; },
    open() { if (this.modal) { this.updateUI(); this.modal.classList.remove('hidden'); } },
    close() { if (this.modal) this.modal.classList.add('hidden'); },

    updateUI() {
        if (typeof bgAnimation !== 'undefined') {
            if(this.select) this.select.value = bgAnimation.effectName;
            if(this.shapeSelect) this.shapeSelect.value = bgAnimation.config.shape;
            if(this.bgDensitySlider) { this.bgDensitySlider.value = bgAnimation.config.density; this.bgDensityVal.innerText = bgAnimation.config.density + 'x'; }
            if(this.bgSpeedSlider) { this.bgSpeedSlider.value = bgAnimation.config.speed; this.bgSpeedVal.innerText = bgAnimation.config.speed + 'x'; }
            if(this.bgSizeSlider) { this.bgSizeSlider.value = bgAnimation.config.size; this.bgSizeVal.innerText = bgAnimation.config.size + 'x'; }
            if(this.bgOpacitySlider) { this.bgOpacitySlider.value = bgAnimation.config.opacity; this.bgOpacityVal.innerText = Math.round(bgAnimation.config.opacity * 100) + '%'; }
            if(this.bgInteractSlider) { this.bgInteractSlider.value = bgAnimation.config.interaction; this.bgInteractVal.innerText = bgAnimation.config.interaction + 'x'; }
        }
        if (typeof HeroDino !== 'undefined') {
            if(this.heroSpeedSlider) { this.heroSpeedSlider.value = HeroDino.config.speed; this.heroSpeedVal.innerText = HeroDino.config.speed + 's'; }
            if(this.heroSizeSlider) { this.heroSizeSlider.value = HeroDino.config.size; this.heroSizeVal.innerText = HeroDino.config.size + 'x'; }
            if(this.heroPhaseSlider) { this.heroPhaseSlider.value = HeroDino.config.transformPhase; this.heroPhaseVal.innerText = Math.round(HeroDino.config.transformPhase * 100) + '%'; }
            if(this.heroEffectSelect) this.heroEffectSelect.value = HeroDino.config.effectType;
        }
    },

    onChange() {
        if (typeof bgAnimation !== 'undefined') {
            const bgConfig = {
                density: this.bgDensitySlider ? parseFloat(this.bgDensitySlider.value) : 1.0,
                speed: this.bgSpeedSlider ? parseFloat(this.bgSpeedSlider.value) : 1.0,
                size: this.bgSizeSlider ? parseFloat(this.bgSizeSlider.value) : 1.0,
                shape: this.shapeSelect ? this.shapeSelect.value : 'circle',
                opacity: this.bgOpacitySlider ? parseFloat(this.bgOpacitySlider.value) : 0.5,
                interaction: this.bgInteractSlider ? parseFloat(this.bgInteractSlider.value) : 1.0
            };

            if(this.bgDensityVal) this.bgDensityVal.innerText = bgConfig.density + 'x';
            if(this.bgSpeedVal) this.bgSpeedVal.innerText = bgConfig.speed + 'x';
            if(this.bgSizeVal) this.bgSizeVal.innerText = bgConfig.size + 'x';
            if(this.bgOpacityVal) this.bgOpacityVal.innerText = Math.round(bgConfig.opacity * 100) + '%';
            if(this.bgInteractVal) this.bgInteractVal.innerText = bgConfig.interaction + 'x';

            if (this.select && bgAnimation.effectName !== this.select.value) {
                bgAnimation.setEffect(this.select.value);
            }
            bgAnimation.updateConfig(bgConfig);
        }

        if (typeof HeroDino !== 'undefined') {
            const heroConfig = {
                speed: this.heroSpeedSlider ? parseFloat(this.heroSpeedSlider.value) : 1.0,
                size: this.heroSizeSlider ? parseFloat(this.heroSizeSlider.value) : 1.0,
                transformPhase: this.heroPhaseSlider ? parseFloat(this.heroPhaseSlider.value) : 0.0,
                effectType: this.heroEffectSelect ? this.heroEffectSelect.value : 'flash'
            };

            if(this.heroSpeedVal) this.heroSpeedVal.innerText = heroConfig.speed + 's';
            if(this.heroSizeVal) this.heroSizeVal.innerText = heroConfig.size + 'x';
            if(this.heroPhaseVal) this.heroPhaseVal.innerText = Math.round(heroConfig.transformPhase * 100) + '%';

            HeroDino.updateConfig(heroConfig);
        }
    },

    // 3. ЗБЕРЕЖЕННЯ (Самовідтворення коду)
    saveConfig() {
        // Збираємо поточні налаштування з UI
        const currentConfig = {
            bg: {
                density: parseFloat(this.bgDensitySlider.value),
                speed: parseFloat(this.bgSpeedSlider.value),
                size: parseFloat(this.bgSizeSlider.value),
                opacity: parseFloat(this.bgOpacitySlider.value),
                interaction: parseFloat(this.bgInteractSlider.value),
                shape: this.shapeSelect.value
            },
            hero: {
                speed: parseFloat(this.heroSpeedSlider.value),
                size: parseFloat(this.heroSizeSlider.value),
                transformPhase: parseFloat(this.heroPhaseSlider.value),
                effectType: this.heroEffectSelect.value
            },
            effect: this.select.value
        };

        // Генерація вихідного коду нового файлу settings.js
        let fileContent = `// =============================================================================\n`;
        fileContent += `// НАЛАШТУВАННЯ v5.0 (Self-Replicating / Самовідтворення)\n`;
        fileContent += `// =============================================================================\n\n`;

        fileContent += `// ЦЕЙ ОБ'ЄКТ ЗМІНЮЄТЬСЯ АВТОМАТИЧНО ПРИ ЗБЕРЕЖЕННІ ФАЙЛУ\n`;
        fileContent += `const DEFAULT_CONFIG = ${JSON.stringify(currentConfig, null, 4)};\n\n`;

        fileContent += `const Settings = {\n`;

        // Магія: ми беремо код кожної функції з поточного об'єкта і записуємо його в рядок
        for (const key in this) {
            if (typeof this[key] === 'function') {
                fileContent += `    ${key}: ${this[key].toString()},\n`;
            }
        }

        fileContent += `};\n`;

        // Створення та завантаження файлу
        const blob = new Blob([fileContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'settings.js'; // Завантажуємо як settings.js, щоб замінити старий
        a.click();
        URL.revokeObjectURL(url);

        alert("Файл settings.js згенеровано!\n\nЗамініть старий файл settings.js цим новим файлом у папці вашого сайту, щоб зберегти налаштування назавжди.");
    },

    resetDefaults() {
        if(this.bgDensitySlider) this.bgDensitySlider.value = 1.0;
        if(this.bgSpeedSlider) this.bgSpeedSlider.value = 1.0;
        if(this.bgSizeSlider) this.bgSizeSlider.value = 1.0;
        if(this.bgOpacitySlider) this.bgOpacitySlider.value = 0.5;
        if(this.bgInteractSlider) this.bgInteractSlider.value = 1.0;
        if(this.select) this.select.value = 'particles';
        if(this.shapeSelect) this.shapeSelect.value = 'circle';

        if(this.heroSpeedSlider) this.heroSpeedSlider.value = 1.0;
        if(this.heroSizeSlider) this.heroSizeSlider.value = 1.0;
        if(this.heroPhaseSlider) this.heroPhaseSlider.value = 0.0;
        if(this.heroEffectSelect) this.heroEffectSelect.value = 'flash';

        this.onChange();
    }
};