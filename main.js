(function () {
  'use strict';

  /* ---------- Language (English / বাংলা) ---------- */
  var STR = window.HR_STRINGS || { en: {}, bn: {} };
  var KEY = 'hr-lang';
  var lang = 'en';

  function t(key) { return (STR[lang] && STR[lang][key]) || STR.en[key] || key; }

  function detect() {
    var q = /[?&]lang=(en|bn)\b/.exec(location.search);
    if (q) return q[1];
    try { var s = localStorage.getItem(KEY); if (s === 'en' || s === 'bn') return s; } catch (e) {}
    return (navigator.language || '').toLowerCase().indexOf('bn') === 0 ? 'bn' : 'en';
  }

  var changeHooks = [];
  function applyLang(l, save) {
    lang = l;
    document.documentElement.lang = l;
    document.querySelectorAll('[data-i18n]').forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-i18n-ph')); });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) { el.alt = t(el.getAttribute('data-i18n-alt')); });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    document.querySelectorAll('[data-i18n-meta]').forEach(function (el) { el.setAttribute('content', t(el.getAttribute('data-i18n-meta'))); });
    document.title = t('meta.title');
    var btn = document.getElementById('langBtn');
    btn.textContent = l === 'bn' ? 'English' : 'বাংলা';
    btn.setAttribute('lang', l === 'bn' ? 'en' : 'bn');
    var hidden = document.getElementById('siteLang');
    if (hidden) hidden.value = l;
    document.getElementById('yr').textContent = new Date().getFullYear().toLocaleString(l === 'bn' ? 'bn-BD' : 'en-US', { useGrouping: false });
    if (save) { try { localStorage.setItem(KEY, l); } catch (e) {} }
    changeHooks.forEach(function (fn) { fn(); });
  }

  document.getElementById('langBtn').addEventListener('click', function () {
    applyLang(lang === 'en' ? 'bn' : 'en', true);
  });

  /* ---------- Mobile nav ---------- */
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  /* ---------- Client logo slider (seamless marquee) ---------- */
  var track = document.getElementById('logosTrack');
  if (track) {
    var originals = Array.prototype.slice.call(track.children);
    // repeat the set enough times to always fill the screen; animation moves exactly one set
    var sets = 2;
    for (var s = 1; s < sets; s++) {
      originals.forEach(function (li) {
        var c = li.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        track.appendChild(c);
      });
    }
  }

  /* ---------- Recommendation carousel ---------- */
  (function () {
    var wrap = document.getElementById('reco');
    var trackEl = document.getElementById('recoTrack');
    var dotsEl = document.getElementById('recoDots');
    var slides = trackEl.children, n = slides.length, i = 0, timer = null;
    var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

    function buildDots() {
      dotsEl.innerHTML = '';
      for (var k = 0; k < n; k++) {
        var d = document.createElement('button');
        d.type = 'button';
        d.setAttribute('aria-label', t('r.go') + ' ' + (k + 1));
        (function (idx) { d.addEventListener('click', function () { go(idx, true); }); })(k);
        dotsEl.appendChild(d);
      }
      mark();
    }
    function mark() {
      Array.prototype.forEach.call(dotsEl.children, function (d, k) {
        d.classList.toggle('on', k === i);
        d.setAttribute('aria-current', k === i ? 'true' : 'false');
      });
      Array.prototype.forEach.call(slides, function (sl, k) { sl.setAttribute('aria-hidden', k === i ? 'false' : 'true'); });
    }
    function go(k, user) {
      i = (k + n) % n;
      trackEl.style.transform = 'translateX(' + (-100 * i) + '%)';
      mark();
      if (user) restart();
    }
    function restart() { stop(); if (!reduce) timer = setInterval(function () { go(i + 1); }, 6500); }
    function stop() { if (timer) { clearInterval(timer); timer = null; } }

    document.getElementById('recoPrev').addEventListener('click', function () { go(i - 1, true); });
    document.getElementById('recoNext').addEventListener('click', function () { go(i + 1, true); });
    wrap.addEventListener('mouseenter', stop);
    wrap.addEventListener('mouseleave', restart);
    wrap.addEventListener('focusin', stop);
    wrap.addEventListener('focusout', restart);
    wrap.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(i - 1, true);
      if (e.key === 'ArrowRight') go(i + 1, true);
    });
    // swipe on touch devices
    var x0 = null;
    wrap.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; stop(); }, { passive: true });
    wrap.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1), true); else restart();
      x0 = null;
    });

    changeHooks.push(buildDots);
    buildDots();
    restart();
  })();

  /* ---------- Forms ---------- */
  var form = document.getElementById('contactForm');
  var status = form.querySelector('.form__status');

  // Quick-quote hero form: copy values into the main contact form, then scroll
  document.getElementById('quickForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var q = e.target;
    ['from', 'to', 'vehicle'].forEach(function (n) {
      var src = q.elements[n], dst = form.elements[n];
      if (!src || !dst) return;
      dst.value = src.value; // option values are the same English strings in both forms
    });
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    setTimeout(function () { form.elements.name.focus({ preventScroll: true }); }, 600);
  });

  // Contact form -> Formspree (emails the address configured in your Formspree dashboard)
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.className = 'form__status';
    status.textContent = '';

    var bad = false;
    ['name', 'phone'].forEach(function (n) {
      var el = form.elements[n];
      var empty = !el.value.trim();
      el.classList.toggle('invalid', empty);
      if (empty) bad = true;
    });
    var email = form.elements.email;
    if (email.value && !/^\S+@\S+\.\S+$/.test(email.value)) { email.classList.add('invalid'); bad = true; }
    else email.classList.remove('invalid');

    if (bad) { status.classList.add('err'); status.textContent = t('m.fill'); return; }
    if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
      status.classList.add('err');
      status.textContent = t('m.nocfg');
      return;
    }

    var btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = t('m.sending');

    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (r) {
        if (!r.ok) throw new Error('Request failed');
        form.reset();
        document.getElementById('siteLang').value = lang;
        status.classList.add('ok');
        status.textContent = t('m.ok');
      })
      .catch(function () {
        status.classList.add('err');
        status.textContent = t('m.fail');
      })
      .finally(function () { btn.disabled = false; btn.textContent = t('c.send'); });
  });

  applyLang(detect(), false);
})();
