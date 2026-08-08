(function () {
  'use strict';

  var MOBILE_MQ = '(max-width: 767px)';
  var modal = null;
  var lastFocus = null;
  var copyLabel = 'Copy';
  var pendingHref = '';

  function formatTel(href) {
    var digits = String(href || '').replace(/[^\d]/g, '');
    if (digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1);
    if (digits.length === 10) {
      return digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6);
    }
    return String(href || '').replace(/^tel:/i, '');
  }

  function formatEmail(href) {
    return decodeURIComponent(String(href || '').replace(/^mailto:/i, '').split('?')[0]);
  }

  function contactHref() {
    var path = (window.location.pathname || '').replace(/\\/g, '/');
    if (path.indexOf('/services/') !== -1 || path.indexOf('/irrigation/') !== -1) {
      return '../contact.html';
    }
    return 'contact.html';
  }

  function ensureModal() {
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'phone-call-modal';
    modal.className = 'fixed inset-0 z-[100] hidden';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="absolute inset-0 bg-forest-950/70 backdrop-blur-sm" data-phone-backdrop></div>' +
      '<div class="relative z-10 min-h-full flex items-center justify-center p-4">' +
        '<div class="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="phone-modal-title" tabindex="-1" data-phone-dialog>' +
          '<div class="w-12 h-12 rounded-xl bg-forest-100 text-forest-700 flex items-center justify-center mb-5" data-phone-icon></div>' +
          '<h2 id="phone-modal-title" class="text-2xl font-extrabold text-forest-900 tracking-tight mb-2" data-phone-title></h2>' +
          '<p class="text-slate-600 leading-relaxed mb-6" data-phone-body></p>' +
          '<p class="text-sm font-semibold text-forest-600 uppercase tracking-widest mb-1" data-phone-label></p>' +
          '<p class="text-2xl sm:text-3xl font-extrabold text-forest-900 tracking-tight mb-6 break-all" data-phone-display></p>' +
          '<div class="flex flex-col sm:flex-row gap-3">' +
            '<button type="button" class="inline-flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-600 text-white font-semibold px-5 py-3 rounded-xl transition-colors" data-phone-copy>Copy</button>' +
            '<a href="#" class="inline-flex items-center justify-center gap-2 border border-forest-200 text-forest-700 hover:bg-forest-50 font-semibold px-5 py-3 rounded-xl transition-colors" data-phone-secondary></a>' +
          '</div>' +
          '<button type="button" class="mt-5 text-sm font-semibold text-slate-500 hover:text-forest-700 transition-colors" data-phone-close>Close</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);

    modal.querySelector('[data-phone-backdrop]').addEventListener('click', closeModal);
    modal.querySelector('[data-phone-close]').addEventListener('click', closeModal);

    modal.querySelector('[data-phone-secondary]').addEventListener('click', function (e) {
      var secondary = modal.querySelector('[data-phone-secondary]');
      var href = secondary.getAttribute('href') || '';
      if (href.indexOf('mailto:') === 0) {
        e.preventDefault();
        closeModal();
        window.location.href = href;
      }
    });

    modal.querySelector('[data-phone-copy]').addEventListener('click', function () {
      var value = modal.querySelector('[data-phone-display]').textContent;
      var btn = modal.querySelector('[data-phone-copy]');
      function markCopied() {
        btn.textContent = 'Copied!';
        window.setTimeout(function () { btn.textContent = copyLabel; }, 1800);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(markCopied).catch(function () {
          window.prompt('Copy this:', value);
        });
      } else {
        window.prompt('Copy this:', value);
      }
    });

    return modal;
  }

  function setIcon(kind) {
    var wrap = modal.querySelector('[data-phone-icon]');
    if (kind === 'email') {
      wrap.innerHTML =
        '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
          '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>' +
        '</svg>';
      return;
    }
    wrap.innerHTML =
      '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">' +
        '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>' +
      '</svg>';
  }

  function openModal(href) {
    var el = ensureModal();
    var secondary = el.querySelector('[data-phone-secondary]');
    pendingHref = href || '';

    if (pendingHref.indexOf('mailto:') === 0) {
      copyLabel = 'Copy email';
      setIcon('email');
      el.querySelector('[data-phone-title]').textContent = 'Send an email';
      el.querySelector('[data-phone-body]').textContent =
        'If a mail app doesn’t open, copy this address and paste it into Gmail, Outlook, or your phone.';
      el.querySelector('[data-phone-label]').textContent = 'Email';
      el.querySelector('[data-phone-display]').textContent = formatEmail(pendingHref);
      el.querySelector('[data-phone-copy]').textContent = copyLabel;
      secondary.textContent = 'Open email app';
      secondary.setAttribute('href', pendingHref);
    } else {
      copyLabel = 'Copy number';
      setIcon('phone');
      el.querySelector('[data-phone-title]').textContent = 'Call from your phone';
      el.querySelector('[data-phone-body]').textContent =
        'Phone calls work on mobile. Open this site on your phone and tap the number, or copy it and dial from any phone.';
      el.querySelector('[data-phone-label]').textContent = 'Phone';
      el.querySelector('[data-phone-display]').textContent = formatTel(pendingHref);
      el.querySelector('[data-phone-copy]').textContent = copyLabel;
      secondary.textContent = 'Email instead';
      secondary.setAttribute('href', contactHref());
    }

    el.classList.remove('hidden');
    el.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    var dialog = el.querySelector('[data-phone-dialog]');
    if (dialog) dialog.focus();
  }

  function closeModal() {
    if (!modal || modal.classList.contains('hidden')) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="tel:"], a[href^="mailto:"]');
    if (!link) return;
    if (window.matchMedia(MOBILE_MQ).matches) return;
    e.preventDefault();
    lastFocus = link;
    openModal(link.getAttribute('href'));
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();
