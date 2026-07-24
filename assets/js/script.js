/* ==========================================================================
   Mae Montero â€” Portfolio interactions
   Scroll reveal, case-study routing/overlay, nav hide-on-scroll, cursor dot
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- ordered project slugs (for prev/next inside case studies) ---------- */
  var PROJECT_ORDER = [
    'parks-for-all',
    'p4p-kicks', 'repent', 'meow-mix', 'outlier', 'tripsitter', 'pretty-pickles', 'rise-n-shine', 'spring-swing',
    'clements-ad', 'wedding-contract', 'real-estate', 'solange', 'wedding-invite', 'postcard'
  ];

  var PROJECT_TITLES = {
    'parks-for-all': 'Parks For All',
    'p4p-kicks': 'P4P Kicks',
    'repent': 'Repent',
    'meow-mix': 'Meow Mix',
    'outlier': 'Outlier Studios',
    'tripsitter': 'Tripsitter',
    'pretty-pickles': 'Pretty Pickles',
    'rise-n-shine': "Rise n' Shine",
    'spring-swing': 'Spring Swing',
    'clements-ad': 'Clements Insurance Ad',
    'wedding-contract': 'Wedding Contract',
    'real-estate': 'Real Estate Flyer',
    'solange': 'Solange: Movement and Memory',
    'wedding-invite': 'Wedding Invitation',
    'postcard': 'Loyola Postcard'
  };

  document.addEventListener('DOMContentLoaded', function () {
    initCursor();
    initNavHide();
    initReveal();
    initHeroLines();
    initKineticHero();
    initCaseStudies();
  });

  /* ---------- custom cursor dot ---------- */
  function initCursor() {
    if (window.matchMedia && !window.matchMedia('(hover:hover)').matches) return;
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);

    var px = 0, py = 0, scale = 1;
    function applyTransform() {
      dot.style.transform = 'translate(' + px + 'px,' + py + 'px) translate(-50%,-50%) scale(' + scale + ')';
    }

    window.addEventListener('mousemove', function (e) {
      px = e.clientX; py = e.clientY;
      dot.classList.add('active');
      applyTransform();
    });

    document.querySelectorAll('a, button, .project-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { scale = 3; dot.classList.add('grow'); applyTransform(); });
      el.addEventListener('mouseleave', function () { scale = 1; dot.classList.remove('grow'); applyTransform(); });
    });
  }

  /* ---------- hide nav on scroll down, show on scroll up ---------- */
  function initNavHide() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;
    var lastY = window.scrollY;
    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y > lastY && y > 140) {
        nav.classList.add('nav-hidden');
      } else {
        nav.classList.remove('nav-hidden');
      }
      lastY = y;
    }, { passive: true });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var targets = document.querySelectorAll('.reveal, .category-head, .project-card');
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.classList.add('in-view'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- hero headline line reveal ---------- */
  function initHeroLines() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    requestAnimationFrame(function () {
      hero.classList.add('in-view');
    });
  }

  /* ---------- kinetic letter-pop headline ---------- */
  function initKineticHero() {
    var spans = document.querySelectorAll('.hero h1 .kinetic');
    if (!spans.length) return;
    var delayStep = 60; // ms between letters
    var i = 0;
    spans.forEach(function (span) {
      var text = span.getAttribute('data-text') || span.textContent;
      var frag = document.createDocumentFragment();
      for (var c = 0; c < text.length; c++) {
        var ch = text[c];
        if (ch === ' ') {
          frag.appendChild(document.createTextNode(' '));
          continue;
        }
        var el = document.createElement('span');
        el.className = 'ch';
        el.style.setProperty('--d', (i * delayStep) + 'ms');
        el.textContent = ch;
        frag.appendChild(el);
        i++;
      }
      span.textContent = '';
      span.appendChild(frag);
    });
  }

  /* ---------- case study overlay + hash routing ---------- */
  function initCaseStudies() {
    var openers = document.querySelectorAll('[data-open-case]');
    var studies = document.querySelectorAll('.case-study');
    if (!studies.length) return;

    openers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var slug = btn.getAttribute('data-open-case');
        openCase(slug, true);
      });
    });

    studies.forEach(function (cs) {
      var closeBtn = cs.querySelector('.cs-close');
      var backBtn = cs.querySelector('.cs-back');
      if (closeBtn) closeBtn.addEventListener('click', closeCase);
      if (backBtn) backBtn.addEventListener('click', closeCase);

      var prevBtn = cs.querySelector('.cs-nextprev .prev');
      var nextBtn = cs.querySelector('.cs-nextprev .next');
      var slug = cs.getAttribute('data-slug');
      var idx = PROJECT_ORDER.indexOf(slug);

      if (prevBtn) {
        var prevSlug = PROJECT_ORDER[(idx - 1 + PROJECT_ORDER.length) % PROJECT_ORDER.length];
        prevBtn.querySelector('.title').textContent = PROJECT_TITLES[prevSlug];
        prevBtn.addEventListener('click', function () { openCase(prevSlug, true); });
      }
      if (nextBtn) {
        var nextSlug = PROJECT_ORDER[(idx + 1) % PROJECT_ORDER.length];
        nextBtn.querySelector('.title').textContent = PROJECT_TITLES[nextSlug];
        nextBtn.addEventListener('click', function () { openCase(nextSlug, true); });
      }
    });

    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeCase();
    });

    window.addEventListener('hashchange', function () {
      var hash = window.location.hash.replace('#', '');
      if (hash && PROJECT_TITLES[hash]) {
        openCase(hash, false);
      } else {
        closeCase(false);
      }
    });

    // open directly if URL already has a project hash on load
    var initialHash = window.location.hash.replace('#', '');
    if (initialHash && PROJECT_TITLES[initialHash]) {
      openCase(initialHash, false);
    }

    function openCase(slug, pushHash) {
      var target = document.querySelector('.case-study[data-slug="' + slug + '"]');
      if (!target) return;
      studies.forEach(function (cs) { cs.classList.remove('is-open'); });
      target.classList.add('is-open');
      document.body.classList.add('cs-open');
      target.scrollTop = 0;
      if (pushHash) window.location.hash = slug;
      // trigger figure reveal
      target.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in-view'); });
    }

    function closeCase(updateHash) {
      studies.forEach(function (cs) { cs.classList.remove('is-open'); });
      document.body.classList.remove('cs-open');
      if (updateHash !== false && window.location.hash) {
        history.pushState('', document.title, window.location.pathname + window.location.search);
      }
    }
  }
})();
