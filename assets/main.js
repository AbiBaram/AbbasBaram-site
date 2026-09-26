/**
 * Split Horizon Folio — Zero-Build Vanilla JavaScript Engine
 * Handles RTL layout direction, dual theme switching (Dark DevSign / Light Alexandria),
 * interactive 3D parallax effects, product filtering, and instant Telegram ordering.
 */

(function () {
  'use strict';

  // --- 1. CONFIGURATION & STATE ---
  const STATE = {
    theme: localStorage.getItem('folio_theme') || 'dark',
    direction: localStorage.getItem('folio_dir') || 'rtl', // RTL English default as requested
    telegramUsername: 'AlexandriaAdhamDev', // Default telegram username/bot
    activePortrait: 'dual-cyber' // 'dual-cyber' or 'executive-holo'
  };

  const PORTRAIT_URLS = {
    'dual-cyber': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYq0Xm11wlH3p_ZhrNfIq7DB-bd-rJZMzCiXazy9jv2R6l_njgs7WbLPLHp0QJp3E2tqK2Yzq0Z8oe-RcxtwOdbybyMGvcKwn_7Ucy4hSHBf3mzHHQgBlFa1ReePrPg0CdTiTQ4NNB6jBB3CVmMWVCtJDxjrWNfqjblSaCKe5XmTl1dUiLn1EsR1Ziutsm9lXyPEY3CmxnPKPjXgzMWtY4fav40mrAKpN00x4IOeiwDimLf571ApxR',
    'executive-holo': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHghvDrFiJPk9UziQv8M2tDOJ_9sB2_l0qIZkWazW-7g6h0qFn1iBLximJouzy60d-gNi3MIhhETEFkvak9xxMo5AiLf3lWqZO9Pj6AbfS3UiD8-Ow4ThnoZ4-m9aB7tK9QpuoHg7fxSN23z1KAfMI1ytMQiVhgUZbs8Bfyx8yuA1XcdbdkVQ2N97tBxSkqc-OVb0bcnkNTGqWlw6462NcMz7HBJkrgFLXbarhX6xJ1VXIE9azzAzbTOrdzNLU2bsrGQ'
  };

  // --- 2. INITIALIZATION ---
  function init() {
    applyDirection(STATE.direction);
    applyTheme(STATE.theme);
    setupNavigation();
    setupThemeToggle();
    setupDirectionToggle();
    setupPortraitSwitcher();
    setupParallaxEffects();
    setupTelegramOrdering();
    setupProductFiltering();
    setupContactForm();
  }

  // --- 3. DIRECTION (RTL / LTR) ENGINE ---
  function applyDirection(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('folio_dir', dir);
    STATE.direction = dir;

    const dirBtn = document.getElementById('dir-toggle-btn');
    if (dirBtn) {
      dirBtn.textContent = dir === 'rtl' ? 'RTL' : 'LTR';
      dirBtn.title = dir === 'rtl' ? 'Current: RTL (Click to switch to LTR)' : 'Current: LTR (Click to switch to RTL)';
      if (dir === 'rtl') {
        dirBtn.classList.add('active');
      } else {
        dirBtn.classList.remove('active');
      }
    }
  }

  function setupDirectionToggle() {
    const dirBtn = document.getElementById('dir-toggle-btn');
    if (dirBtn) {
      dirBtn.addEventListener('click', () => {
        const nextDir = STATE.direction === 'rtl' ? 'ltr' : 'rtl';
        applyDirection(nextDir);
        showToast(`Layout switched to ${nextDir.toUpperCase()}`);
      });
    }
  }

  // --- 4. THEME (DARK / LIGHT) ENGINE ---
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('folio_theme', theme);
    STATE.theme = theme;

    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      const icon = themeBtn.querySelector('.material-symbols-outlined') || themeBtn;
      icon.textContent = theme === 'dark' ? 'light_mode' : 'dark_mode';
      themeBtn.title = theme === 'dark' ? 'Switch to Light Editorial Theme' : 'Switch to Dark Obsidian Theme';
    }
  }

  function setupThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextTheme = STATE.theme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        showToast(`Theme switched to ${nextTheme === 'dark' ? 'Dark Obsidian' : 'Light Editorial'}`);
      });
    }
  }

  // --- 5. NAVIGATION & MOBILE DRAWER ---
  function setupNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
      } else if (href && !href.startsWith('#')) {
        link.classList.remove('active');
      }
    });

    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileDrawer = document.getElementById('mobile-drawer');

    if (mobileMenuBtn && mobileDrawer) {
      mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileDrawer.classList.toggle('open');
        mobileMenuBtn.innerHTML = isOpen 
          ? '<span class="material-symbols-outlined">close</span>' 
          : '<span class="material-symbols-outlined">menu</span>';
      });

      // Close drawer on link click
      mobileDrawer.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileDrawer.classList.remove('open');
          mobileMenuBtn.innerHTML = '<span class="material-symbols-outlined">menu</span>';
        });
      });
    }
  }

  // --- 6. PORTRAIT HERO SWITCHER ---
  function setupPortraitSwitcher() {
    const portraitImg = document.getElementById('hero-portrait-img');
    const switchBtns = document.querySelectorAll('[data-portrait]');

    if (!portraitImg || switchBtns.length === 0) return;

    switchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-portrait');
        if (PORTRAIT_URLS[target]) {
          portraitImg.style.opacity = '0.4';
          setTimeout(() => {
            portraitImg.src = PORTRAIT_URLS[target];
            portraitImg.style.opacity = '1';
          }, 150);

          switchBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          STATE.activePortrait = target;
        }
      });
    });
  }

  // --- 7. 3D PARALLAX & AMBIENT SPOTLIGHT ---
  function setupParallaxEffects() {
    const spotDesigner = document.getElementById('spotlight-designer');
    const spotCoder = document.getElementById('spotlight-coder');
    const avatarCard = document.getElementById('split-avatar-card');

    window.addEventListener('mousemove', (e) => {
      const x = e.clientX;
      const y = e.clientY;
      const w = window.innerWidth;

      // Ambient spotlight drift
      if (spotDesigner && spotCoder) {
        spotDesigner.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        spotCoder.style.transform = `translate(${-(w - x) * 0.25}px, ${y * 0.25}px)`;
      }

      // 3D Avatar Tilt
      if (avatarCard) {
        const rect = avatarCard.getBoundingClientRect();
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;
        const angleX = (y - cardY) / 35;
        const angleY = (cardX - x) / 35;
        avatarCard.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
      }
    });

    if (avatarCard) {
      avatarCard.addEventListener('mouseleave', () => {
        avatarCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      });
    }

    // 3D Card tilt for project cards
    document.querySelectorAll('.product-card, .discipline-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        card.style.transform = `perspective(1000px) rotateX(${-y / 30}deg) rotateY(${x / 30}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // --- 8. TELEGRAM ORDERING ENGINE ---
  function setupTelegramOrdering() {
    const modalBackdrop = document.getElementById('telegram-modal-backdrop');
    if (!modalBackdrop) return;

    const closeBtn = document.getElementById('modal-close-btn');
    const openTelegramBtn = document.getElementById('open-telegram-btn');
    const copyPayloadBtn = document.getElementById('copy-payload-btn');
    const payloadPreview = document.getElementById('telegram-payload-preview');

    // Inputs inside modal
    const productSelect = document.getElementById('tg-product');
    const scopeSelect = document.getElementById('tg-scope');
    const clientNameInput = document.getElementById('tg-client-name');
    const clientHandleInput = document.getElementById('tg-client-handle');
    const budgetSelect = document.getElementById('tg-budget');
    const timelineSelect = document.getElementById('tg-timeline');
    const notesInput = document.getElementById('tg-notes');
    const usernameInput = document.getElementById('tg-username');

    function generatePayload() {
      const product = productSelect ? productSelect.value : 'Custom Solution';
      const scope = scopeSelect ? scopeSelect.value : 'End-to-End';
      const name = clientNameInput && clientNameInput.value.trim() ? clientNameInput.value.trim() : 'Anonymous Client';
      const handle = clientHandleInput && clientHandleInput.value.trim() ? clientHandleInput.value.trim() : 'N/A';
      const budget = budgetSelect ? budgetSelect.value : '$5,000 - $15,000';
      const timeline = timelineSelect ? timelineSelect.value : '2-4 Weeks';
      const notes = notesInput && notesInput.value.trim() ? notesInput.value.trim() : 'Please initiate dialogue regarding technical architecture.';

      return `🚀 NEW ORDER & DISPATCH SIGNAL
━━━━━━━━━━━━━━━━━━━━━
📦 Product/Service: ${product}
🎯 Scope: ${scope}
👤 Client Name: ${name}
💬 Telegram / Email: ${handle}
💰 Budget Range: ${budget}
⏱ Desired Timeline: ${timeline}
━━━━━━━━━━━━━━━━━━━━━
📝 Project Brief:
${notes}
━━━━━━━━━━━━━━━━━━━━━
Sent via Split Horizon Portfolio (Edge Deployment)`;
    }

    function updatePreview() {
      const payload = generatePayload();
      if (payloadPreview) {
        payloadPreview.textContent = payload;
      }
    }

    // Attach real-time input listeners to update preview
    [productSelect, scopeSelect, clientNameInput, clientHandleInput, budgetSelect, timelineSelect, notesInput].forEach(el => {
      if (el) {
        el.addEventListener('input', updatePreview);
        el.addEventListener('change', updatePreview);
      }
    });

    // Open Telegram App action
    if (openTelegramBtn) {
      openTelegramBtn.addEventListener('click', () => {
        const payload = generatePayload();
        const targetUsername = usernameInput && usernameInput.value.trim() ? usernameInput.value.trim().replace('@', '') : STATE.telegramUsername;
        const telegramUrl = `https://t.me/${targetUsername}?text=${encodeURIComponent(payload)}`;
        window.open(telegramUrl, '_blank');
        showToast('Redirecting to Telegram with pre-filled order...');
      });
    }

    // Copy Payload action
    if (copyPayloadBtn) {
      copyPayloadBtn.addEventListener('click', () => {
        const payload = generatePayload();
        navigator.clipboard.writeText(payload).then(() => {
          showToast('Order payload copied to clipboard!');
        }).catch(() => {
          showToast('Payload ready for Telegram transmission.');
        });
      });
    }

    // Open modal triggers (Buttons with class .trigger-telegram-order)
    document.querySelectorAll('.trigger-telegram-order').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const presetProduct = btn.getAttribute('data-product');
        const presetScope = btn.getAttribute('data-scope');

        if (productSelect && presetProduct) {
          productSelect.value = presetProduct;
        }
        if (scopeSelect && presetScope) {
          scopeSelect.value = presetScope;
        }

        updatePreview();
        modalBackdrop.classList.add('open');
      });
    });

    // Close modal
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modalBackdrop.classList.remove('open');
      });
    }

    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) {
        modalBackdrop.classList.remove('open');
      }
    });

    // ESC key closes modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) {
        modalBackdrop.classList.remove('open');
      }
    });
  }

  // --- 9. PRODUCT FILTERING ---
  function setupProductFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('[data-category]');

    if (filterBtns.length === 0 || productCards.length === 0) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-filter');

        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        productCards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category || cardCat.includes(category)) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // --- 10. CONTACT FORM HANDLER ---
  function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    // Scope button radio selection
    const scopeLabels = contactForm.querySelectorAll('.scope-btn');
    scopeLabels.forEach(label => {
      const radio = label.querySelector('input[type="radio"]');
      if (radio) {
        label.addEventListener('click', () => {
          scopeLabels.forEach(l => l.classList.remove('active'));
          label.classList.add('active');
          radio.checked = true;
        });
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

      if (submitBtn) {
        submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Transmitting Signal...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Signal Received by Edge';
          submitBtn.style.background = 'var(--accent-emerald)';
        }
        showToast('Message transmitted to Amsterdam / Paris edge cluster! SLA: < 12h');
        contactForm.reset();

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
          }
        }, 3500);
      }, 1000);
    });
  }

  // --- 11. TOAST HELPER ---
  function showToast(message) {
    let toast = document.getElementById('folio-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'folio-toast';
      toast.className = 'toast-msg';
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
