document.addEventListener('DOMContentLoaded', () => {
    // 1. Mouse Glow Effect (with mouseleave handling to hide, only on hover-capable devices)
    const cursor = document.querySelector('.cursor-glow');
    
    if (cursor && window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.display = 'block';
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.addEventListener('mouseleave', () => {
            cursor.style.display = 'none';
        });
    } else if (cursor) {
        // Disable on touch screens
        cursor.style.display = 'none';
    }

    // 2. Copy Email to Clipboard
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const emailCode = copyBtn.parentElement.querySelector('code').innerText;
            navigator.clipboard.writeText(emailCode).then(() => {
                const originalText = copyBtn.innerText;
                copyBtn.innerText = 'Copied!';
                copyBtn.style.background = 'var(--primary)';
                copyBtn.style.color = '#030712';

                setTimeout(() => {
                    copyBtn.innerText = originalText;
                    copyBtn.style.background = 'transparent';
                    copyBtn.style.color = 'var(--text-muted)';
                }, 2000);
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        });
    }

    // 3. Scroll Intersection Observer for General Cards & Timelines
    const revealOnScrollOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealOnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, revealOnScrollOptions);

    // Track both cards and timeline items for scroll reveals
    const itemsToReveal = document.querySelectorAll('.card, .timeline-item');
    itemsToReveal.forEach(item => {
        // Initialize style before intersection observer triggers
        item.style.opacity = '0';
        item.style.transform = 'translateY(25px)';
        item.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        
        revealOnScrollObserver.observe(item);
    });

    // Helper class injection for active scroll reveal
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = '.revealed { opacity: 1 !important; transform: translateY(0) !important; }';
    document.head.appendChild(styleSheet);

    // 4. Skills Progress Loader (Triggers width fill when section comes in view)
    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.progress');
                    progressBars.forEach(bar => {
                        const targetWidth = bar.getAttribute('data-width');
                        bar.style.width = targetWidth;
                    });
                    // Once animated, we don't need to observe it again
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        skillsObserver.observe(skillsSection);
    }

    // 5. Smooth Scroll adjustments for internal anchor links (with nav offset)
    const navHeight = document.querySelector('nav').offsetHeight;
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
