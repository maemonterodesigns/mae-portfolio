/* ==========================================================================
   Mae Montero — Portfolio interactions
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
    initCaseStudies();
  });

  /* ---------- custom cursor dot ---------- */
  function initCursor() {
    if (window.matchMedia && !window.matchMedia('(hover:hover)').matches) return;
    var dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(dot);
    var raf = null, x = 0, y = 0, cx = 0, cy = 0;

    window.addEventListener('mousemove', function (e) {
      x = e.clientX; y = e.clientY;
      dot.classList.add('active');
      if (!raf) raf = requestAnimationFrame(render);
    });

    function render() {
      cx += (x - cx) * 0.35;
      cy += (y - cy) * 0.35;
      dot.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      if (Math.abs(x - cx) > 0.2 || Math.abs(y - cy) > 0.2) {
        raf = requestAnimationFrame(render);
      } else {
        raf = null;
      }
    }

    document.querySelectorAll('a, button, .project-card').forEach(function (el) {
      el.addEventListener('mouseenter', function () { dot.classList.add('grow'); });
      el.addEventListener('mouseleave', function () { dot.classList.remove('grow'); });
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
