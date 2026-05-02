(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.site-nav a');
  const yearElement = document.querySelector('#year');
  const revealElements = document.querySelectorAll('.reveal');

  // Set current year
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  function closeMenu() {
    if (!navToggle || !siteNav) return;
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('nav-open', isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  // Reveal on scroll
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-visible'));
  }

  // Terminal typing effect
  const terminalLines = document.querySelectorAll('.terminal-line');
  const terminalOutputs = document.querySelectorAll('.terminal-output');
  
  function animateTerminal() {
    const allElements = [];
    
    terminalLines.forEach((line, index) => {
      allElements.push({ el: line, type: 'line' });
      if (terminalOutputs[index]) {
        allElements.push({ el: terminalOutputs[index], type: 'output' });
      }
    });

    allElements.forEach((item, index) => {
      item.el.style.opacity = '0';
      item.el.style.transform = 'translateY(4px)';
    });

    allElements.forEach((item, index) => {
      setTimeout(() => {
        item.el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.el.style.opacity = '1';
        item.el.style.transform = 'translateY(0)';
      }, 200 + index * 150);
    });
  }

  // Run terminal animation after hero is visible
  const heroPanel = document.querySelector('.hero-panel');
  if (heroPanel && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(animateTerminal, 400);
          heroObserver.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    heroObserver.observe(heroPanel);
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      if (targetId === '#top') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
        return;
      }
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // Add active state to nav links based on scroll position
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNav() {
    const scrollY = window.pageYOffset;
    
    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');
      const navLink = document.querySelector(`.site-nav a[href="#${sectionId}"]`);
      
      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.style.color = 'var(--text)';
        } else {
          navLink.style.color = '';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();
})();
