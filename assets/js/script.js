/*
 * INSIDETEC - SCRIPT PRINCIPAL
 *
 * Estrutura: Módulo App
 * Descrição: Encapsula toda a lógica do site para organização e robustez.
 *
 */

const App = {
    // Ponto de entrada da aplicação
    init: function() {
        this.log('Inicializando aplicação...');
        
        try { this.initNavigation(); } catch (e) { this.error('Falha ao inicializar a Navegação.', e); }
        try { this.initContactForm(); } catch (e) { this.error('Falha ao inicializar o Formulário de Contato.', e); }
        try { this.initScrollAnimations(); } catch (e) { this.error('Falha ao inicializar as Animações de Scroll.', e); }
        try { this.initStatsAnimation(); } catch (e) { this.error('Falha ao inicializar a Animação das Estatísticas.', e); }
        try { this.initUIExtras(); } catch (e) { this.error('Falha ao inicializar Extras da UI.', e); }
        
        this.log('Aplicação inicializada com sucesso.');
    },

    // =========================================================================
    // Módulos de Inicialização
    // =========================================================================

    initNavigation: function() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.querySelector('.navbar');
    const allLinks = document.querySelectorAll('a[href^="#"]');

    if (!navToggle || !navMenu || !navbar) {
        this.log('Componentes de navegação não encontrados nesta página.');
        return;
    }

    navToggle.addEventListener('click', () => {
        const isExpanded = navMenu.classList.toggle('active'); // toggle retorna true se a classe foi adicionada
        navToggle.classList.toggle('active');
        navToggle.setAttribute('aria-expanded', isExpanded); // ATUALIZA O ATRIBUTO ARIA
    });

    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.length > 1 && targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.getElementById(targetId.substring(1));
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
                }
            }
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false'); // ATUALIZA O ATRIBUTO ARIA
            }
        });
    });

    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        sections.forEach(section => {
            const activeLink = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                if (activeLink) activeLink.classList.add('active');
            }
        });

        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.backgroundColor = '#ffffff';
            navbar.style.backdropFilter = 'none';
        }
    }, { passive: true });
},

    initContactForm: function() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitButton = contactForm.querySelector('button[type="submit"]');
        let isFormValid = true;

        contactForm.querySelectorAll('[required]').forEach(field => {
            if (!this.helpers.validateField(field)) isFormValid = false;
        });

        if (!isFormValid) {
            this.helpers.showToast('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        const originalText = submitButton.textContent;
        submitButton.textContent = 'Enviando...';
        submitButton.disabled = true;

        const formData = {
            name: contactForm.name.value,
            email: contactForm.email.value,
            phone: contactForm.phone.value,
            service: contactForm.service.value,
            message: contactForm.message.value,
        };

        try {
            const response = await fetch('http://localhost:3000/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                this.helpers.showToast(result.message, 'success');
                contactForm.reset();
            } else {
                this.helpers.showToast(result.message, 'error');
            }
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error);
            this.helpers.showToast('Não foi possível conectar ao servidor. Tente novamente.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });

    contactForm.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('blur', () => this.helpers.validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) this.helpers.validateField(input);
        });
    });
},

    initScrollAnimations: function() {
        const elementsToAnimate = document.querySelectorAll('.service-card, .case-card, .testimonial-card, .feature-item');
        if (elementsToAnimate.length === 0) return;

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elementsToAnimate.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    },
    
    initStatsAnimation: function() {
        const stats = document.querySelectorAll('.stat-value');
        if (stats.length === 0) return;

        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    const finalValue = stat.textContent;
                    
                    if (finalValue.includes('+')) {
                        this.helpers.animateNumber(stat, 0, parseInt(finalValue), '+');
                    } else if (finalValue.includes('%')) {
                        this.helpers.animateNumber(stat, 0, parseInt(finalValue), '%');
                    } else {
                        this.helpers.animateNumber(stat, 0, parseInt(finalValue));
                    }
                    observer.unobserve(stat);
                }
            });
        }, { threshold: 0.8 });

        stats.forEach(stat => {
            stat.style.opacity = '0'; // Começa invisível
            statsObserver.observe(stat);
        });
    },

    initUIExtras: function() {
        const buttons = document.querySelectorAll('.btn');
        if (buttons.length === 0) return;
        
        buttons.forEach(button => {
            button.addEventListener('mousedown', function() {
                if (!this.disabled) this.style.transform = 'scale(0.97)';
            });
            button.addEventListener('mouseup', () => button.style.transform = 'scale(1)');
            button.addEventListener('mouseleave', () => button.style.transform = 'scale(1)');
        });
    },

    // =========================================================================
    // Funções Utilitárias (Helpers)
    // =========================================================================

    helpers: {
        showToast: function(message, type = 'success') {
            const toast = document.getElementById('toast');
            if (!toast) return;
            toast.textContent = message;
            toast.className = `toast ${type} show`;
            setTimeout(() => toast.classList.remove('show'), 4000);
        },

        validateField: function(field) {
            const value = field.value.trim();
            const isRequired = field.hasAttribute('required');
            let isValid = true;
            field.classList.remove('error');
            if (isRequired && !value) isValid = false;
            else if (field.type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) isValid = false;
            if (!isValid) field.classList.add('error');
            return isValid;
        },

        animateNumber: function(element, start, end, suffix = '') {
            const duration = 2000;
            const startTime = performance.now();
            const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

            function updateNumber(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const current = Math.floor(start + (end - start) * easeOutQuart(progress));
                element.textContent = current + suffix;
                element.style.opacity = '1';
                if (progress < 1) {
                    requestAnimationFrame(updateNumber);
                }
            }
            requestAnimationFrame(updateNumber);
        }
    },
    
    // =========================================================================
    // Funções de Logging
    // =========================================================================
    
    log: function(message) {
        console.log(`[App] ${message}`);
    },

    error: function(message, error) {
        console.error(`[App] ERROR: ${message}`, error);
    }
};

// Dispara a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => App.init());