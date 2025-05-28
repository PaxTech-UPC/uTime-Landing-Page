const i18n = {
    currentLang: 'es',
    translations: {},

    async loadTranslations(lang) {
        try {
            // Cambia la URL para cargar las traducciones de manera remota
            const response = await fetch(`./locales/${lang}.json`);
            if (!response.ok) throw new Error(`No se pudo cargar el archivo de idioma: ${lang}`);
            this.translations = await response.json();
            this.currentLang = lang;
            this.translatePage();
        } catch (error) {
            console.error("Error al cargar las traducciones:", error);
        }
    },

    translatePage() {
        // Traducir todos los elementos con data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(key);
            if (translation !== null && translation !== undefined) {
                if (el.placeholder !== undefined && el.tagName === 'INPUT') {
                    el.placeholder = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        // Actualizar botones específicos que no usan data-i18n
        const signInBtn = document.getElementById('sign-in-btn');
        const registerBtn = document.getElementById('register-btn');
        const langBtn = document.querySelector('[data-toggle-lang]');

        if (signInBtn) {
            signInBtn.textContent = this.getNestedTranslation('nav.signIn');
        }
        if (registerBtn) {
            registerBtn.textContent = this.getNestedTranslation('nav.register');
        }
        if (langBtn) {
            langBtn.textContent = this.getNestedTranslation('nav.language');
        }
    },

    getNestedTranslation(key) {
        return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : key, this.translations);
    },

    toggleLanguage() {
        const newLang = this.currentLang === 'es' ? 'en' : 'es';
        this.loadTranslations(newLang);
    }
};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    i18n.loadTranslations('es');  // Cargar traducciones de español por defecto

    const langBtn = document.querySelector('[data-toggle-lang]');
    if (langBtn) {
        langBtn.addEventListener('click', () => i18n.toggleLanguage());
    }
});
