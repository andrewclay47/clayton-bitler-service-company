(function () {
  'use strict';

  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.location.protocol === 'file:') return;
  if (/\/admin(\.html)?$/i.test(window.location.pathname || '')) return;
  if (navigator.webdriver) return;
  if (/bot|crawl|spider|slurp|facebookexternalhit|preview/i.test(navigator.userAgent || '')) return;

  var API = 'https://counterapi.com/api';
  var NS = String(window.location.hostname || 'local').replace(/^www\./i, '');
  var UNIQUE_KEY = 'cb-analytics-unique';
  var UNIQUE_DAY_KEY = 'cb-analytics-unique-day';

  function todayKey() {
    try {
      return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Chicago',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).format(new Date());
    } catch (err) {
      return new Date().toISOString().slice(0, 10);
    }
  }

  function pageKey() {
    var path = String(window.location.pathname || '/').replace(/\\/g, '/');
    var repo = '/clayton-bitler-service-company';
    if (path === repo || path.indexOf(repo + '/') === 0) {
      path = path.slice(repo.length) || '/';
    }
    path = path.replace(/\/+$/, '') || '/';
    if (path === '/' || path === '/index.html') return 'home';
    path = path.replace(/^\//, '').replace(/\.html$/i, '');
    return path.replace(/\//g, '-') || 'home';
  }

  function deviceType() {
    var ua = navigator.userAgent || '';
    if (/iPad|Tablet|PlayBook/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      return 'tablet';
    }
    if (/Mobi|Android|iPhone|iPod/i.test(ua)) return 'mobile';
    return 'desktop';
  }

  function trafficSource() {
    var ref = document.referrer || '';
    if (!ref) return 'direct';
    var host = '';
    try {
      host = new URL(ref).hostname.replace(/^www\./i, '').toLowerCase();
    } catch (err) {
      return 'other';
    }
    var here = NS.toLowerCase();
    if (!host || host === here) return 'direct';
    if (host === 'google.com' || host.indexOf('google.') === 0 || host.indexOf('.google.') !== -1) return 'google';
    if (/bing\.|yahoo\.|duckduckgo\.|baidu\./.test(host)) return 'search';
    if (/instagram\./.test(host)) return 'instagram';
    if (/facebook\.|fb\.com|fbclid/.test(host)) return 'facebook';
    if (/yelp\./.test(host)) return 'yelp';
    if (/nextdoor\.|twitter\.|x\.com|linkedin\.|tiktok\./.test(host)) return 'social';
    return 'other';
  }

  function hit(action, key) {
    var url =
      API +
      '/' +
      encodeURIComponent(NS) +
      '/' +
      encodeURIComponent(action) +
      '/' +
      encodeURIComponent(key);
    try {
      fetch(url, { mode: 'cors', cache: 'no-store', keepalive: true }).catch(function () {});
    } catch (err) {
      var img = new Image();
      img.src = url;
    }
  }

  var day = todayKey();
  hit('pageview', 'all');
  hit('pageview', pageKey());
  hit('day', day);
  hit('device', deviceType());
  hit('source', trafficSource());

  try {
    if (!window.localStorage.getItem(UNIQUE_KEY)) {
      window.localStorage.setItem(UNIQUE_KEY, '1');
      hit('visitor', 'unique');
    }
    if (window.localStorage.getItem(UNIQUE_DAY_KEY) !== day) {
      window.localStorage.setItem(UNIQUE_DAY_KEY, day);
      hit('visitor-day', day);
    }
  } catch (err) {
    // Private mode — still count page views above.
  }

  document.addEventListener(
    'click',
    function (event) {
      var link = event.target && event.target.closest ? event.target.closest('a') : null;
      if (!link || !link.href) return;
      if (/^tel:/i.test(link.href)) hit('click', 'phone');
      if (/^mailto:/i.test(link.href)) hit('click', 'email');
    },
    true
  );
})();
