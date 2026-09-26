/**
 * Abbas IT Infrastructure & ITSM Architecture
 * Pure Vanilla JavaScript Client Engine
 * Fully compatible with direct Drag-and-Drop deployment on Cloudflare Pages
 */

(function () {
  'use strict';

  // Config
  const TELEGRAM_USERNAME = 'Abbas_IT_Consultant'; // Enterprise Telegram handle
  const CONTACT_EMAIL = 'contact@abbas-infra.com';

  // State
  let currentDirection = localStorage.getItem('site_dir') || 'rtl'; // Default RTL as per specifications

  document.addEventListener('DOMContentLoaded', () => {
    initDirection();
    initNavigation();
    initMobileMenu();
    initTelegramModal();
    initFilters();
    initContactForm();
    initCopyButtons();
    initTelemetryVisuals();
  });

  /* ---------------------------------------------------------
   * 1. RTL / LTR Direction Engine
   * --------------------------------------------------------- */
  function initDirection() {
    setDirection(currentDirection);

    const dirToggles = document.querySelectorAll('[data-action="toggle-dir"]');
    dirToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const newDir = currentDirection === 'rtl' ? 'ltr' : 'rtl';
        setDirection(newDir);
      });
    });
  }

  function setDirection(dir) {
    currentDirection = dir;
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('site_dir', dir);

    // Update label on toggles if present
    const dirLabels = document.querySelectorAll('.dir-label');
    dirLabels.forEach(el => {
      el.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
    });

    const dirBadges = document.querySelectorAll('.dir-badge');
    dirBadges.forEach(el => {
      el.textContent = dir.toUpperCase();
    });
  }

  /* ---------------------------------------------------------
   * 2. Navigation Highlighting
   * --------------------------------------------------------- */
  function initNavigation() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('header nav a, #mobile-nav a');

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      const isMatch = (
        (currentPath === '' || currentPath === 'index.html') && (href === 'index.html' || href === '#')
      ) || (
        currentPath.includes('about') && href.includes('about')
      ) || (
        (currentPath.includes('products') || currentPath.includes('case-studies')) && 
        (href.includes('products') || href.includes('case-studies'))
      ) || (
        currentPath.includes('contact') && href.includes('contact')
      );

      if (isMatch && (href !== '#' || currentPath === 'index.html' || currentPath === '')) {
        link.classList.add('bg-surface-container-high', 'text-on-surface', 'font-semibold');
        link.classList.remove('text-on-surface-variant');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  /* ---------------------------------------------------------
   * 3. Mobile Navigation Drawer
   * --------------------------------------------------------- */
  function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('mobile-menu');

    if (!toggleBtn || !menu) return;

    toggleBtn.addEventListener('click', () => {
      const isOpen = !menu.classList.contains('hidden');
      if (isOpen) {
        menu.classList.add('hidden');
        toggleBtn.setAttribute('aria-expanded', 'false');
      } else {
        menu.classList.remove('hidden');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close on navigation click
    const menuLinks = menu.querySelectorAll('a');
    menuLinks.forEach(l => l.addEventListener('click', () => {
      menu.classList.add('hidden');
    }));
  }

  /* ---------------------------------------------------------
   * 4. Telegram Ordering System & Modal
   * --------------------------------------------------------- */
  function initTelegramModal() {
    // Inject Telegram Modal HTML dynamically if not already in DOM
    if (!document.getElementById('telegramOrderModal')) {
      const modalHTML = `
        <div id="telegramOrderModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop modal-hidden" aria-modal="true" role="dialog">
          <div class="relative w-full max-w-xl bg-surface-container/95 border border-glass-border-hover rounded-2xl shadow-2xl p-6 sm:p-8 modal-container overflow-hidden">
            <!-- Ambient glow -->
            <div class="absolute -top-20 -right-20 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl pointer-events-none"></div>

            <!-- Modal Header -->
            <div class="flex items-center justify-between pb-4 border-b border-surface-variant mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-[#229ED9]/20 flex items-center justify-center text-[#229ED9]">
                  <span class="material-symbols-outlined text-[24px]">send</span>
                </div>
                <div>
                  <h3 class="font-headline-sm text-headline-sm font-bold text-text-primary">Telegram SOW & Consultation Order</h3>
                  <p class="font-label-technical text-label-technical text-text-muted text-xs">Direct encrypted dispatch to @${TELEGRAM_USERNAME}</p>
                </div>
              </div>
              <button id="closeTelegramModal" class="p-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-text-dim hover:text-text-primary transition-colors" type="button" aria-label="Close modal">
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <!-- Form -->
            <form id="telegramOrderForm" class="space-y-4">
              <div>
                <label class="block font-label-technical text-label-technical text-text-secondary uppercase mb-1.5">
                  <span class="text-primary">&gt;</span> Selected Package / Scope
                </label>
                <select id="tgServiceSelect" class="w-full bg-surface-container-lowest text-text-primary font-body-sm rounded-xl px-4 py-3 border border-glass-border focus:outline-none focus:border-primary-container">
                  <option value="GLPI 10 ITSM Architecture & Migration">GLPI 10 ITSM Architecture & Migration (Automated Discovery)</option>
                  <option value="Active Directory & IAM Hardening">Active Directory Hardening & Zero-Trust Migration</option>
                  <option value="Unified Infrastructure Observability (Zabbix/Grafana)">Unified Observability (Zabbix 6.4 + Grafana NOC)</option>
                  <option value="PaperCut MF & Fleet Consolidation">PaperCut MF & Secure Print Fleet Consolidation</option>
                  <option value="Fractional ITSM Technical Leadership">Fractional ITSM Technical Leadership / SOW Discovery</option>
                </select>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-label-technical text-label-technical text-text-secondary uppercase mb-1.5">
                    <span class="text-primary">&gt;</span> Node / Endpoint Scale
                  </label>
                  <select id="tgScaleSelect" class="w-full bg-surface-container-lowest text-text-primary font-body-sm rounded-xl px-4 py-3 border border-glass-border focus:outline-none focus:border-primary-container">
                    <option value="500 - 1,500 Nodes">500 - 1,500 Nodes</option>
                    <option value="1,500 - 5,000 Nodes (Enterprise)">1,500 - 5,000 Nodes (Enterprise)</option>
                    <option value="5,000+ Nodes (Multi-Entity)">5,000+ Nodes (Multi-Entity)</option>
                    <option value="Small / Pilot (< 500 Nodes)">Small / Pilot (&lt; 500 Nodes)</option>
                  </select>
                </div>
                <div>
                  <label class="block font-label-technical text-label-technical text-text-secondary uppercase mb-1.5">
                    <span class="text-primary">&gt;</span> Target Timeline
                  </label>
                  <select id="tgTimelineSelect" class="w-full bg-surface-container-lowest text-text-primary font-body-sm rounded-xl px-4 py-3 border border-glass-border focus:outline-none focus:border-primary-container">
                    <option value="Immediate (< 2 Weeks)">Immediate (&lt; 2 Weeks)</option>
                    <option value="Q3/Q4 Implementation">Q3/Q4 Implementation</option>
                    <option value="RFP / SOW Discovery Phase">RFP / SOW Discovery Phase</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block font-label-technical text-label-technical text-text-secondary uppercase mb-1.5">
                  <span class="text-primary">&gt;</span> Your Name / Enterprise Domain
                </label>
                <input type="text" id="tgClientName" placeholder="e.g. David Vance • Zenith Logistics EU" required class="w-full bg-surface-container-lowest text-text-primary font-body-sm rounded-xl px-4 py-3 border border-glass-border focus:outline-none focus:border-primary-container">
              </div>

              <div>
                <label class="block font-label-technical text-label-technical text-text-secondary uppercase mb-1.5">
                  <span class="text-primary">&gt;</span> Infrastructure Notes (Optional)
                </label>
                <textarea id="tgNotes" rows="2" placeholder="Mention legacy tools (e.g. ServiceNow, Windows 2012 R2, VMware clusters)..." class="w-full bg-surface-container-lowest text-text-primary font-body-sm rounded-xl px-4 py-3 border border-glass-border focus:outline-none focus:border-primary-container resize-none"></textarea>
              </div>

              <div class="pt-2 flex flex-col sm:flex-row gap-3">
                <button type="submit" class="flex-1 py-3.5 px-6 rounded-xl telegram-btn font-headline-sm text-body-sm font-semibold flex items-center justify-center gap-2">
                  <span class="material-symbols-outlined text-[20px]">send</span>
                  <span>Dispatch via Telegram</span>
                </button>
                <button type="button" id="copyTelegramPayload" class="py-3.5 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright text-text-primary font-label-technical text-xs flex items-center justify-center gap-1.5 transition-colors">
                  <span class="material-symbols-outlined text-[16px]">content_copy</span>
                  <span class="copy-label">Copy Payload</span>
                </button>
              </div>
            </form>

            <div class="mt-4 pt-3 border-t border-surface-variant text-center">
              <p class="font-label-technical text-[11px] text-text-dim">
                Direct Telegram Protocol • Verified SLA Reply in &lt; 24h • PVI Encrypted Standard
              </p>
            </div>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    const modal = document.getElementById('telegramOrderModal');
    const closeBtn = document.getElementById('closeTelegramModal');
    const orderForm = document.getElementById('telegramOrderForm');
    const copyPayloadBtn = document.getElementById('copyTelegramPayload');

    // Trigger handlers for all buttons intended for Telegram Ordering or Scoping
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-action="open-telegram"], .telegram-trigger, a[href="#telegram-order"]');
      if (trigger) {
        e.preventDefault();
        const packagePreselect = trigger.getAttribute('data-package');
        if (packagePreselect) {
          const select = document.getElementById('tgServiceSelect');
          if (select) {
            for (let option of select.options) {
              if (option.value.toLowerCase().includes(packagePreselect.toLowerCase()) || 
                  packagePreselect.toLowerCase().includes(option.value.toLowerCase())) {
                option.selected = true;
                break;
              }
            }
          }
        }
        openTelegramModal();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeTelegramModal);
    }

    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeTelegramModal();
      });
    }

    // Submit handler: Formats message and opens Telegram
    if (orderForm) {
      orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const payload = generateTelegramMessage();
        const tgURL = `https://t.me/${TELEGRAM_USERNAME}?text=${encodeURIComponent(payload)}`;
        window.open(tgURL, '_blank', 'noopener,noreferrer');
        showToast('Dispatching order to Telegram...');
        setTimeout(closeTelegramModal, 1200);
      });
    }

    // Copy Payload handler
    if (copyPayloadBtn) {
      copyPayloadBtn.addEventListener('click', () => {
        const payload = generateTelegramMessage();
        navigator.clipboard.writeText(payload).then(() => {
          const copyLabel = copyPayloadBtn.querySelector('.copy-label');
          if (copyLabel) copyLabel.textContent = 'Copied!';
          showToast('SOW Blueprint copied to clipboard');
          setTimeout(() => {
            if (copyLabel) copyLabel.textContent = 'Copy Payload';
          }, 2500);
        });
      });
    }
  }

  function openTelegramModal() {
    const modal = document.getElementById('telegramOrderModal');
    if (modal) {
      modal.classList.remove('modal-hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeTelegramModal() {
    const modal = document.getElementById('telegramOrderModal');
    if (modal) {
      modal.classList.add('modal-hidden');
      document.body.style.overflow = '';
    }
  }

  function generateTelegramMessage() {
    const service = document.getElementById('tgServiceSelect')?.value || 'Infrastructure Engagement';
    const scale = document.getElementById('tgScaleSelect')?.value || 'Not specified';
    const timeline = document.getElementById('tgTimelineSelect')?.value || 'Immediate';
    const client = document.getElementById('tgClientName')?.value || 'Prospective Enterprise Client';
    const notes = document.getElementById('tgNotes')?.value || 'None provided';

    return `🏛️ [ENTERPRISE SOW DISPATCH]
Client: ${client}
Discipline: ${service}
Scale: ${scale}
Timeline: ${timeline}
Notes: ${notes}
Timestamp: ${new Date().toISOString()}
Standard: ITIL v4 / RFC-2821
Via: Abbas IT Infrastructure Portal`;
  }

  /* ---------------------------------------------------------
   * 5. Interactive Case Study Filtering
   * --------------------------------------------------------- */
  function initFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const caseCards = document.querySelectorAll('.case-study-card');

    if (!filterTabs.length || !caseCards.length) return;

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.getAttribute('data-filter') || 'all';

        // Update active tab styles
        filterTabs.forEach(t => {
          t.classList.remove('bg-primary-container', 'text-on-primary', 'font-semibold');
          t.classList.add('bg-surface-container', 'text-text-muted');
        });
        tab.classList.remove('bg-surface-container', 'text-text-muted');
        tab.classList.add('bg-primary-container', 'text-on-primary', 'font-semibold');

        // Filter cards
        caseCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            card.style.display = '';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------------------------------------------------------
   * 6. Contact Form Dispatch
   * --------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('consultingInquiryForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitButton');
      const confirmation = document.getElementById('submitConfirmation');

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-70');
        submitBtn.innerHTML = `
          <span class="material-symbols-outlined animate-spin text-[20px]">sync</span>
          <span>Securing Transmission...</span>
        `;
      }

      setTimeout(() => {
        if (submitBtn) submitBtn.classList.add('hidden');
        if (confirmation) {
          confirmation.classList.remove('hidden');
          confirmation.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        showToast('Consultation inquiry dispatched successfully.');
      }, 1000);
    });

    // Telegram Direct Action in Contact page
    const tgContactBtn = document.getElementById('tgDirectDispatchBtn');
    if (tgContactBtn) {
      tgContactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openTelegramModal();
      });
    }
  }

  /* ---------------------------------------------------------
   * 7. Copy Buttons & Toasts
   * --------------------------------------------------------- */
  function initCopyButtons() {
    window.copyEmailAddress = function (button) {
      navigator.clipboard.writeText(CONTACT_EMAIL).then(() => {
        const textSpan = button.querySelector('.copy-text');
        const iconSpan = button.querySelector('.material-symbols-outlined');
        if (textSpan) textSpan.innerText = 'Copied to Clipboard';
        if (iconSpan) iconSpan.innerText = 'done';

        showToast(`Email copied: ${CONTACT_EMAIL}`);

        setTimeout(() => {
          if (textSpan) textSpan.innerText = 'Copy Address';
          if (iconSpan) iconSpan.innerText = 'content_copy';
        }, 2500);
      }).catch(() => {
        prompt('Copy email manually:', CONTACT_EMAIL);
      });
    };

    window.triggerDownloadNotification = function (btn) {
      const alertBox = document.getElementById('cv-alert');
      const originalText = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">refresh</span><span>Generating...</span>';
      btn.disabled = true;

      if (alertBox) {
        alertBox.classList.remove('hidden');
        alertBox.classList.add('flex');
      }

      setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check_circle</span><span>Downloaded</span>';
        if (alertBox) {
          alertBox.innerHTML = '<span class="material-symbols-outlined text-primary text-[18px]">check</span><span>Dossier successfully bundled. Ready for review.</span>';
        }
        showToast('Architectural Dossier PDF download initiated.');

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.disabled = false;
          if (alertBox) {
            alertBox.classList.add('hidden');
            alertBox.classList.remove('flex');
          }
        }, 3500);
      }, 1200);
    };

    window.setScope = function (buttonElement, scopeValue) {
      const hiddenInput = document.getElementById('projectTypeInput');
      if (hiddenInput) {
        hiddenInput.value = scopeValue;
      }

      const allButtons = document.querySelectorAll('#scopeSelectionGroup .scope-btn');
      allButtons.forEach(btn => {
        btn.classList.remove('bg-surface-container-high', 'text-on-surface');
        btn.classList.add('bg-surface-container-low', 'text-text-muted');
        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.classList.remove('text-primary');
          icon.classList.add('text-text-dim');
        }
      });

      buttonElement.classList.remove('bg-surface-container-low', 'text-text-muted');
      buttonElement.classList.add('bg-surface-container-high', 'text-on-surface');
      const activeIcon = buttonElement.querySelector('.material-symbols-outlined');
      if (activeIcon) {
        activeIcon.classList.remove('text-text-dim');
        activeIcon.classList.add('text-primary');
      }
    };
  }

  function initTelemetryVisuals() {
    // Sparkline or bar animation on scroll
    const bars = document.querySelectorAll('.sync-progress-bar');
    bars.forEach(bar => {
      setTimeout(() => {
        bar.style.width = '92%';
      }, 300);
    });
  }

  function showToast(message) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'fixed bottom-6 start-6 z-50 px-4 py-3 rounded-xl bg-surface-container-high border border-glass-border-hover text-text-primary text-body-sm shadow-2xl flex items-center gap-2.5 transition-all duration-300 opacity-0 translate-y-4';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="material-symbols-outlined text-primary text-[18px]">info</span><span>${message}</span>`;
    toast.classList.remove('opacity-0', 'translate-y-4');

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
    }, 3200);
  }

  // Expose global methods
  window.openTelegramModal = openTelegramModal;
  window.closeTelegramModal = closeTelegramModal;
  window.setDirection = setDirection;

})();
