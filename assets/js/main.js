(function () {
  document.documentElement.classList.remove('no-js');

  // Mobile navigation
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        mobileNav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  // Testimonial carousel
  document.querySelectorAll('[data-carousel]').forEach(function (root) {
    var track = root.querySelector('.carousel-track');
    var slides = Array.prototype.slice.call(root.querySelectorAll('.carousel-slide'));
    var prev = root.querySelector('[data-prev]');
    var next = root.querySelector('[data-next]');
    var dotsWrap = root.querySelector('.carousel-dots');
    var index = 0;

    var dots = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show testimonial ' + (i + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () { go(i); });
      dotsWrap.appendChild(b);
      return b;
    });

    function go(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-100 * index) + '%)';
      slides.forEach(function (s, n) {
        s.setAttribute('aria-hidden', n === index ? 'false' : 'true');
        s.querySelectorAll('a, button').forEach(function (el) { el.tabIndex = n === index ? 0 : -1; });
      });
      dots.forEach(function (d, n) { d.setAttribute('aria-current', n === index ? 'true' : 'false'); });
    }

    prev.addEventListener('click', function () { go(index - 1); });
    next.addEventListener('click', function () { go(index + 1); });
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') go(index - 1);
      if (e.key === 'ArrowRight') go(index + 1);
    });

    // Swipe on touch screens
    var startX = null;
    track.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    });

    go(0);
  });

  // Forgetting-curve chart (science page)
  var chart = document.querySelector('[data-forgetting-chart]');
  if (chart) buildForgettingChart(chart);

  function buildForgettingChart(wrap) {
    var svg = wrap.querySelector('svg');
    var NS = 'http://www.w3.org/2000/svg';
    var W = 560, H = 310, m = { t: 34, r: 20, b: 44, l: 46 };
    var iw = W - m.l - m.r, ih = H - m.t - m.b;
    var DAYS = 14;

    // Illustrative model, not measured data.
    // Workshop: one big dose on day 0, then steep exponential decay toward ~10%.
    function workshop(d) { return 10 + 90 * Math.exp(-d / 0.9); }
    // Micro-practice: small daily reps; each rep tops retention back up and decay slows as it consolidates.
    function practice(d) {
      var day = Math.floor(d), frac = d - day;
      var peak = Math.min(96, 55 + day * 4.2);
      var floor = Math.min(92, peak - 14 / (1 + day * 0.6));
      return floor + (peak - floor) * Math.exp(-frac * 3);
    }

    var x = function (d) { return m.l + (d / DAYS) * iw; };
    var y = function (v) { return m.t + ih - (v / 100) * ih; };

    function el(name, attrs, parent) {
      var n = document.createElementNS(NS, name);
      for (var k in attrs) n.setAttribute(k, attrs[k]);
      (parent || svg).appendChild(n);
      return n;
    }

    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);

    var grid = el('g', { 'class': 'chart-grid' });
    var axis = el('g', { 'class': 'chart-axis' });
    [0, 25, 50, 75, 100].forEach(function (v) {
      el('line', { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v) }, grid);
      var t = el('text', { x: m.l - 10, y: y(v) + 4, 'text-anchor': 'end' }, axis);
      t.textContent = v + '%';
    });
    [[0, 'Day 1'], [7, 'Week 1'], [14, 'Week 2']].forEach(function (p) {
      var t = el('text', { x: x(p[0]), y: H - m.b + 22, 'text-anchor': p[0] === 0 ? 'start' : (p[0] === DAYS ? 'end' : 'middle') }, axis);
      t.textContent = p[1];
    });
    var yt = el('text', { x: m.l - 40, y: 12, 'class': 'axis-title' }, axis);
    yt.textContent = 'Retained';

    function path(fn, step) {
      var d = '';
      for (var i = 0; i <= DAYS; i += step) d += (i === 0 ? 'M' : 'L') + x(i).toFixed(1) + ' ' + y(fn(i)).toFixed(1);
      return d;
    }
    var pPath = path(practice, 0.05);
    el('path', { d: pPath + 'L' + x(DAYS) + ' ' + y(0) + 'L' + x(0) + ' ' + y(0) + 'Z', 'class': 'area-practice' });
    el('path', { d: pPath, 'class': 'line-practice' });
    el('path', { d: path(workshop, 0.05), 'class': 'line-workshop' });

    // Direct labels at line ends
    var l1 = el('text', { x: x(DAYS) - 4, y: y(practice(DAYS)) - 12, 'text-anchor': 'end', 'class': 'chart-label' });
    l1.textContent = 'Daily micro-practice';
    var l2 = el('text', { x: x(DAYS) - 4, y: y(workshop(DAYS)) - 10, 'text-anchor': 'end', 'class': 'chart-label' });
    l2.textContent = 'Weekend workshop';

    // Hover layer
    var cross = el('line', { y1: m.t, y2: m.t + ih, 'class': 'chart-crosshair' });
    var dotP = el('circle', { r: 5, 'class': 'chart-dot', fill: 'var(--green-700)', opacity: 0 });
    var dotW = el('circle', { r: 5, 'class': 'chart-dot', fill: 'var(--clay)', opacity: 0 });
    var hit = el('rect', { x: m.l, y: m.t, width: iw, height: ih, 'class': 'chart-hit' });
    var tip = wrap.querySelector('.chart-tooltip');

    function show(evt) {
      var rect = svg.getBoundingClientRect();
      var px = (evt.clientX - rect.left) * (W / rect.width);
      var d = Math.max(0, Math.min(DAYS, ((px - m.l) / iw) * DAYS));
      d = Math.round(d * 4) / 4;
      var vp = practice(d), vw = workshop(d);
      cross.setAttribute('x1', x(d)); cross.setAttribute('x2', x(d)); cross.style.opacity = 1;
      dotP.setAttribute('cx', x(d)); dotP.setAttribute('cy', y(vp)); dotP.setAttribute('opacity', 1);
      dotW.setAttribute('cx', x(d)); dotW.setAttribute('cy', y(vw)); dotW.setAttribute('opacity', 1);
      var dayLabel = 'Day ' + (Math.floor(d) + 1);
      tip.innerHTML = '<b>' + dayLabel + '</b>' +
        '<span class="k" style="background:var(--sage-200)"></span>Micro-practice: ' + Math.round(vp) + '%<br>' +
        '<span class="k" style="background:#e7b796"></span>Workshop: ' + Math.round(vw) + '%';
      tip.style.left = (x(d) / W * rect.width) + 'px';
      tip.style.top = (y(Math.max(vp, vw)) / H * rect.height) + 'px';
      tip.style.opacity = 1;
    }
    function hide() {
      cross.style.opacity = 0; dotP.setAttribute('opacity', 0); dotW.setAttribute('opacity', 0); tip.style.opacity = 0;
    }
    hit.addEventListener('mousemove', show);
    hit.addEventListener('mouseleave', hide);
    hit.addEventListener('touchstart', function (e) { show(e.touches[0]); }, { passive: true });
    hit.addEventListener('touchmove', function (e) { show(e.touches[0]); }, { passive: true });
    hit.addEventListener('touchend', hide);
  }
})();
