/* Your State Archetype quiz.
   Everything runs in the visitor's browser. Nothing is stored or sent; only the
   summary in the Calendly link leaves the page, and only if they click Book. */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  var CALENDLY = 'https://calendly.com/dirdara/on-demand';
  var PHASES = ['About you', 'Your pattern', 'The cost', "What you've tried", "What's next"];
  var ROMAN = ['I', 'II', 'III', 'IV', 'V'];
  var GLOW = [['72%', '18%'], ['28%', '22%'], ['78%', '70%'], ['22%', '76%'], ['55%', '12%']];
  var WEEKS_PER_QUARTER = 13;

  /* ---------------------------------------------------------------- data */
  var ARCH = {
    aftershock: {
      name: 'The Aftershock',
      line: "The moment ends. The damage doesn't.",
      shows: [
        'A lost deal or a tense call follows you for the rest of the day, sometimes the rest of the week.',
        'You replay it, second-guess yourself, and the next calls get harder.',
        "When things go well you're unstoppable, which makes the crashes feel even worse."
      ],
      happening: 'Your brain matches the setback to every past failure it has on file and forces a hard shift into a compromised state. In that state, the math changes: protecting yourself is worth more than executing. The setback lasted a minute. The state lasts days.',
      changes: "You don't stop having bad moments. You shorten the time between them and your next good one, from days to minutes.",
      cs: { name: 'Ryan', role: 'Founder, Recruitment Agency', img: 'assets/img/ryan.jpg', id: 'ryan',
            title: 'Eliminated Multi-Day "Ruts" and Achieved a 30X Return on Investment',
            line: 'Used to lose days to ruts after bad deals. Had his best year on record and a 30X return on the coaching.' }
    },
    stall: {
      name: 'The Stall',
      line: "You know exactly what to do. You just can't make yourself start.",
      shows: [
        'The important task is right there, and you\'re on your phone, in your inbox, or "researching."',
        "Busy days, but the needle-moving work doesn't move.",
        "You've blamed it on discipline, and bought more systems to fix it."
      ],
      happening: "In the two seconds before you start, your brain runs the numbers and decides the task isn't worth the discomfort. That isn't laziness. It's a state calling the shots before you consciously decide anything.",
      changes: 'We work on that two-second window, so starting stops feeling like a fight.',
      cs: { name: 'Arthur', role: 'Independent Contractor, SaaS Provider', img: 'assets/img/clients/arthur.jpg', id: 'arthur',
            title: 'Ended a 3-Month Sales Freeze with 14 Days of Uninterrupted Cold Calls',
            line: 'Went from three months of zero outreach to two straight weeks of daily cold calls.' }
    },
    robot: {
      name: 'The Robot',
      line: 'Always on. Never actually off.',
      shows: [
        "You're productive, maybe very productive, but your brain is still working at dinner.",
        'Downtime feels like falling behind, so even rest turns into work.',
        "You're squeezing out the last few percent and paying for it in energy."
      ],
      happening: "Your nervous system has learned that not producing is a threat, so it never powers down. That works, until it doesn't. It's running the engine without coolant.",
      changes: "You keep the drive and get the off switch back, so the hours you work count more and the hours you don't are actually yours.",
      cs: { name: 'Amit', role: 'Professional, Accounting', img: 'assets/img/clients/amit.jpg', id: 'amit',
            title: 'Reclaimed Genuine Curiosity and Exited a 12-Year Career Rut',
            line: 'Left a draining 12-year job and got back the ability to enjoy life outside a spreadsheet.' }
    },
    absorber: {
      name: 'The Absorber',
      line: "Everyone else's state becomes yours.",
      shows: [
        "A client's frown, a team member's mood, or a tense room changes how you show up.",
        'You over-deliver, undercharge, or cave to keep people happy.',
        'Switching roles, founder to parent, client to client, leaves you drained in both.'
      ],
      happening: "Your brain treats other people's displeasure as a threat to manage, so it pulls you into their state instead of holding your own.",
      changes: 'You learn to hold your own state under pressure, and to switch cleanly between roles.',
      cs: { name: 'Stephane', role: 'Founder, Marketing Agency', img: 'assets/img/clients/stephane.jpg', id: 'stephane',
            title: 'Doubled Monthly Revenue from $5k to $10k by Neutralizing People-Pleasing',
            line: 'Stopped doing free work and went from $5k months to his first $10k month.' }
    }
  };

  var WHY = {
    'Books or podcasts': ['Books and podcasts', 'You learned it in a calm, focused state, then the forgetting curve took over. Most of it is gone within days unless it\'s practiced.'],
    'Online courses': ['Online courses', 'You learned it in a calm, focused state, then the forgetting curve took over. Most of it is gone within days unless it\'s practiced.'],
    'Workshops or seminars': ['Workshops and seminars', "A breakthrough in an inspired, offsite state doesn't transfer to the high-pressure state at your desk. Different state, different brain."],
    'Retreats': ['Retreats', "A breakthrough in an inspired, offsite state doesn't transfer to the high-pressure state at your desk. Different state, different brain."],
    'Therapy': ['Therapy', "Great for understanding the pattern. But insight from Thursday's session doesn't reach Monday's difficult call, because it was learned in a different state."],
    'Coaching or mentoring': ['Coaching and mentoring', "Great for understanding the pattern. But insight from a weekly session doesn't reach Monday's difficult call, because it was learned in a different state."],
    'Meditation apps': ['Meditation apps', 'Calm on a cushion is a different state from calm on a tense call. The skill stays where you learned it.'],
    'Productivity systems': ['Productivity systems', "Systems organize the work, but they can't change the state you do it from. When the state goes, the system is the first thing to go."],
    'Willpower: challenges, strict routines, pushing through': ['Willpower and challenges', 'Forcing through is running the engine without coolant. It works for a day, a week, a month, then the engine blows.'],
    'Nothing yet': ['Nothing yet', "Good news: there's no failed fix to unlearn."]
  };

  // How each "what else does it cost you" answer reads on the report, as a clear negative
  var LOSS_PHRASE = {
    'Energy by the end of the day': 'Drained by the end of the day',
    'Sleep': 'Lost sleep',
    'Time with family or friends': 'Not enough time with family or friends',
    'Deals or revenue': 'Lost deals and revenue',
    'Confidence': 'Shaken confidence',
    'Health': 'Health taking a hit',
    'Enjoying the business': 'Not enjoying the business',
    'Feeling close to burnout': 'Close to burnout'
  };

  var GAIN_PHRASE = {
    'Time with family': 'time with family',
    'Switch off in the evenings': 'switching off in the evenings',
    'Weekends that are actually off': 'weekends that are actually off',
    'More vacations': 'more vacations',
    'Grow the business': 'growing the business',
    'Health and fitness': 'your health and fitness',
    'Hobbies': 'your hobbies',
    'Rest': 'real rest'
  };

  function opt(label, extra) {
    var o = { label: label, value: label };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }
  function opts(list) { return list.map(function (l) { return opt(l); }); }

  var QUESTIONS = [
    { id: 'role', phase: 0, type: 'single', title: 'Which best describes <em>you</em>?',
      options: opts(['Founder, flying solo', 'Founder or co-founder with a small team', 'Corporate professional', 'Launching, or about to launch, a business']).concat([opt('Something else', { other: true })]) },
    { id: 'industry', phase: 0, type: 'single', layout: 'chips', title: 'What <em>industry</em> are you in?',
      options: opts(['Recruitment', 'Professional services', 'Marketing or agency', 'SaaS or tech', 'Finance', 'Consulting', 'Health, wellness or therapy', 'Real estate']).concat([opt('Something else', { other: true })]) },
    { id: 'years', phase: 0, type: 'single', layout: 'chips', title: 'How long have you been <em>doing this</em>?',
      options: opts(['Under a year', '1 to 3 years', '3 to 10 years', '10+ years']) },

    { id: 'moment', phase: 1, type: 'single', title: 'Which moment costs you the <em>most</em>?',
      options: [
        opt("When something goes wrong, a lost deal or a bad call, I'm off for the rest of the day, or longer.", { arch: 'aftershock', short: 'One setback throws off my whole day' }),
        opt("I know exactly what I should be doing, and I still can't make myself start.", { arch: 'stall', short: "I can't make myself start" }),
        opt("I can't switch off. Evenings, weekends, my brain is still at work.", { arch: 'robot', short: "I can't switch off" }),
        opt("Pushback, other people's moods, or switching roles knocks me off my game.", { arch: 'absorber', short: "Other people's reactions knock me off my game" })
      ] },
    { id: 'next', phase: 1, type: 'single', title: 'When that moment hits, what usually happens <em>next</em>?',
      options: [
        opt('I overthink it and lose my momentum and motivation.', { arch: 'aftershock' }),
        opt('I drift into busy work: checking email, updating the CRM, scrolling LinkedIn.', { arch: 'stall' }),
        opt('I grab my phone and scroll, or find another way to distract myself.', { arch: 'stall' }),
        opt('I push harder and pile more onto my plate.', { arch: 'robot' }),
        opt('I give in to keep the peace: say yes, discount, or over-deliver.', { arch: 'absorber' })
      ] },
    { id: 'week', phase: 1, type: 'single', title: 'Which sounds most like your <em>typical week</em>?',
      options: [
        opt('"One bad call can wreck my whole week."', { arch: 'aftershock' }),
        opt('"I\'m busy all day, but the important things don\'t move."', { arch: 'stall' }),
        opt('"I\'m productive, but I can\'t switch off at the end of the day."', { arch: 'robot' }),
        opt('"I spend half my energy managing everyone else\'s reactions."', { arch: 'absorber' })
      ] },
    { id: 'freq', phase: 1, type: 'single', title: 'How often does this pattern <em>show up</em>?',
      options: [opt('A couple of times a month', { n: 0.5 }), opt('About once a week', { n: 1 }), opt('A few times a week', { n: 3 }), opt('Most days', { n: 5 }), opt('Several times a day', { n: 8 })] },
    { id: 'recovery', phase: 1, type: 'single', title: "When it does, how long until you're back at your <em>best</em>?",
      options: [opt('A few minutes', { n: 0.1 }), opt('About an hour', { n: 1 }), opt('A few hours', { n: 3 }), opt('The rest of the day', { n: 5 }), opt('A day or more', { n: 8 })] },
    { id: 'check', phase: 1, type: 'check' },

    { id: 'rate', phase: 2, type: 'money', title: "What's an hour of your focused work <em>worth</em>?" },
    { id: 'costs', phase: 2, type: 'multi', title: 'What else does it <em>cost</em> you?', help: 'Pick any that apply.',
      options: opts(['Energy by the end of the day', 'Sleep', 'Time with family or friends', 'Deals or revenue', 'Confidence', 'Health', 'Enjoying the business', 'Feeling close to burnout']) },

    { id: 'tried', phase: 3, type: 'multi', min: 1, title: 'What have you tried to <em>fix it</em>?', help: 'Pick any that apply.',
      options: opts(['Books or podcasts', 'Online courses', 'Workshops or seminars', 'Retreats', 'Therapy', 'Coaching or mentoring', 'Meditation apps', 'Productivity systems', 'Willpower: challenges, strict routines, pushing through']).concat([opt('Nothing yet', { exclusive: true })]) },
    { id: 'outcome', phase: 3, type: 'single', skipIf: triedNothing, title: 'What happened when you <em>tried it</em>?',
      options: opts(['It worked for a week or two, then fizzled out.', "I couldn't figure out how to apply it to my situation.", 'It seemed to fix the problem, but the problem came back.', "It didn't really change anything."]) },
    { id: 'spent', phase: 3, type: 'single', layout: 'chips', skipIf: triedNothing, title: 'Roughly how much have you spent trying to <em>fix this pattern</em>?',
      options: opts(['Under $1k', '$1k to $5k', '$5k to $20k', '$20k+', 'Rather not say']) },

    { id: 'wants', phase: 4, type: 'multi', min: 1, max: 3, title: 'If you got those hours back, what would you <em>do</em> with them?', help: 'Pick up to 3.',
      options: opts(['Time with family', 'Switch off in the evenings', 'Weekends that are actually off', 'More vacations', 'Grow the business', 'Health and fitness', 'Hobbies', 'Rest']).concat([opt('Something else', { other: true })]) },
    { id: 'importance', phase: 4, type: 'scale', title: 'How important is solving this in the <em>next 90 days</em>?' },
    { id: 'year', phase: 4, type: 'single', title: "If nothing has changed a year from now, what does that <em>mean</em> for you?",
      options: opts(["It's fine, I can live with it.", "It's frustrating, but manageable.", 'It would seriously hold me back.', "I don't want to imagine it."]) }
  ];
  var TOTAL_QUESTIONS = QUESTIONS.filter(function (q) { return q.type !== 'check'; }).length;

  function triedNothing() { return (answers.tried || []).indexOf('Nothing yet') !== -1; }

  /* --------------------------------------------------------------- state */
  var answers = {};
  var other = {};
  var history = [];
  var current = 'intro';
  var stage = document.getElementById('stage');
  var dots = document.querySelector('.phase-dots');
  var ambient = document.querySelector('.ambient');

  PHASES.forEach(function (p) {
    var li = document.createElement('li');
    li.setAttribute('aria-label', p);
    dots.appendChild(li);
  });

  /* ------------------------------------------------------------- helpers */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }
  function hoursText(n) { return n === 1 ? '1 hour' : Math.round(n).toLocaleString('en-US') + ' hours'; }
  function q(id) { for (var i = 0; i < QUESTIONS.length; i++) if (QUESTIONS[i].id === id) return QUESTIONS[i]; }
  function qIndex(id) { for (var i = 0; i < QUESTIONS.length; i++) if (QUESTIONS[i].id === id) return i; return -1; }
  function optionOf(id, value) {
    var list = q(id).options || [];
    for (var i = 0; i < list.length; i++) if (list[i].value === value) return list[i];
  }
  function questionNumber(id) {
    var n = 0;
    for (var i = 0; i < QUESTIONS.length; i++) {
      if (QUESTIONS[i].type !== 'check') n++;
      if (QUESTIONS[i].id === id) return n;
    }
    return n;
  }
  function labelWithOther(id, value) {
    return value === 'Something else' && other[id] ? other[id] : value;
  }

  function calcHours() {
    var f = optionOf('freq', answers.freq), r = optionOf('recovery', answers.recovery);
    if (!f || !r) return 0;
    return Math.max(1, Math.min(40, Math.round(f.n * r.n)));
  }
  function hoursPerWeek() { return answers.check != null ? answers.check : calcHours(); }

  function archetype() {
    var score = { aftershock: 0, stall: 0, robot: 0, absorber: 0 };
    ['moment', 'next', 'week'].forEach(function (id) {
      var o = optionOf(id, answers[id]);
      if (o) score[o.arch]++;
    });
    var first = (optionOf('moment', answers.moment) || {}).arch || 'aftershock';
    var best = first;
    Object.keys(score).forEach(function (k) { if (score[k] > score[best]) best = k; });
    return best;
  }

  /* ------------------------------------------------------------ navigation */
  function nextId(fromId) {
    var i = fromId === 'intro' ? 0 : qIndex(fromId) + 1;
    for (; i < QUESTIONS.length; i++) {
      if (!QUESTIONS[i].skipIf || !QUESTIONS[i].skipIf()) return QUESTIONS[i].id;
    }
    return 'report';
  }
  function go(id, push) {
    if (push !== false && current) history.push(current);
    current = id;
    render();
  }
  function advance() { go(nextId(current)); }
  function back() {
    if (!history.length) return;
    current = history.pop();
    render();
  }
  function restart() {
    answers = {}; other = {}; history = [];
    if (location.hash) history_replace('');
    go('intro', false);
  }
  function history_replace(hash) {
    try { window.history.replaceState(null, '', location.pathname + (hash ? '#' + hash : '')); } catch (e) { /* ignore */ }
  }

  /* --------------------------------------------------------------- render */
  function render() {
    var isReport = current === 'report';
    document.body.classList.toggle('report-mode', isReport);

    var phase = -1;
    if (current !== 'intro' && !isReport && current !== 'shared') phase = q(current).phase;
    Array.prototype.forEach.call(dots.children, function (li, i) {
      li.className = i < phase ? 'done' : (i === phase ? 'current' : '');
    });
    var glow = GLOW[Math.max(0, phase)];
    ambient.style.setProperty('--gx', glow[0]);
    ambient.style.setProperty('--gy', glow[1]);

    if (current === 'intro') stage.innerHTML = introHTML(null);
    else if (current === 'shared') stage.innerHTML = introHTML(sharedType);
    else if (isReport) stage.innerHTML = reportHTML();
    else stage.innerHTML = questionHTML(q(current));

    bind();
    window.scrollTo(0, 0);
    var h = stage.querySelector('[data-focus]');
    if (h) h.focus({ preventScroll: true });
  }

  function eyebrow(question) {
    return '<div class="q-eyebrow"><span class="phase">Phase ' + ROMAN[question.phase] + ' &middot; <b>' + PHASES[question.phase] + '</b></span>' +
      (question.type === 'check' ? '' : '<span class="count">' + questionNumber(question.id) + ' / ' + TOTAL_QUESTIONS + '</span>') + '</div>' +
      patternReminder(question);
  }
  // Once they've picked their main pattern (Q4), keep it in view so "this pattern" always has a referent
  function patternReminder(question) {
    if (qIndex(question.id) <= qIndex('moment')) return '';
    var o = optionOf('moment', answers.moment);
    if (!o) return '';
    return '<p class="pattern-pill"><span>Your pattern</span>' + esc(o.short) + '</p>';
  }
  function actions(opts) {
    opts = opts || {};
    return '<div class="q-actions">' +
      '<button type="button" class="back-btn" data-back>&larr; Back</button>' +
      (opts.next ? '<button type="button" class="btn btn-light" data-next' + (opts.disabled ? ' disabled' : '') + '>' + (opts.label || 'Continue') + ' <span class="arrow" aria-hidden="true">&rarr;</span></button>' : '') +
      '</div>';
  }

  function introHTML(shared) {
    var top = '<div class="orb" aria-hidden="true"></div>';
    var sharedBlock = '';
    if (shared) {
      var a = ARCH[shared];
      sharedBlock = '<div class="shared-card"><div class="q-eyebrow" style="justify-content:flex-start;margin-bottom:8px"><span class="phase">Someone shared their result</span></div>' +
        '<p class="q-title" style="font-size:clamp(1.6rem,3.4vw,2.2rem);margin:0">' + a.name + '</p>' +
        '<p style="margin:6px 0 0;color:var(--sage-200);font-family:var(--font-display);font-style:italic">' + a.line + '</p>' +
        '<ul>' + a.shows.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul></div>';
    }
    return '<section class="screen intro">' + top +
      '<div class="q-eyebrow"><span class="phase">Your State Archetype &middot; <b>about 4 minutes</b></span></div>' +
      sharedBlock +
      '<h1 class="q-title" tabindex="-1" data-focus>' + (shared ? 'What&rsquo;s <em>your</em> State Archetype?' : 'Your hardest moments aren&rsquo;t random. <em>They follow a pattern.</em>') + '</h1>' +
      '<p class="q-help">16 quick questions to discover your State Archetype: the state that takes over when things get hard, what it&rsquo;s costing you every quarter, and why the fixes you&rsquo;ve tried haven&rsquo;t stuck.</p>' +
      '<button type="button" class="btn btn-light" data-start>Find my State Archetype <span class="arrow" aria-hidden="true">&rarr;</span></button>' +
      '<div class="intro-meta"><span>16 questions</span><span>About 4 minutes</span><span>Your answers stay on your device</span></div>' +
      '</section>';
  }

  function questionHTML(qq) {
    var h = '<section class="screen">' + eyebrow(qq);
    if (qq.type === 'check') return h + checkHTML() + '</section>';

    h += '<h1 class="q-title" tabindex="-1" data-focus>' + qq.title + '</h1>';
    if (qq.help) h += '<p class="q-help">' + qq.help + '</p>';

    if (qq.type === 'single') {
      var sel = answers[qq.id];
      if (qq.layout === 'chips') {
        h += '<div class="chips">' + qq.options.map(function (o) {
          return '<button type="button" class="chip-opt" data-opt="' + esc(o.value) + '" aria-pressed="' + (sel === o.value) + '">' + esc(o.label) + '</button>';
        }).join('') + '</div>';
      } else {
        h += '<div class="options">' + qq.options.map(function (o, i) {
          return '<button type="button" class="opt" data-opt="' + esc(o.value) + '" aria-pressed="' + (sel === o.value) + '"><span class="key" aria-hidden="true">' + String.fromCharCode(65 + i) + '</span><span>' + esc(o.label) + '</span></button>';
        }).join('') + '</div>';
      }
      var hasOther = qq.options.some(function (o) { return o.other; });
      if (hasOther) {
        h += '<div class="other-wrap' + (sel === 'Something else' ? ' show' : '') + '"><label class="visually-hidden" for="other-' + qq.id + '">Tell us more</label>' +
          '<input class="text-input" id="other-' + qq.id + '" type="text" maxlength="80" placeholder="Type your answer" value="' + esc(other[qq.id] || '') + '"></div>';
      }
      h += actions({ next: sel === 'Something else', label: 'Continue' });
    }

    if (qq.type === 'multi') {
      var picked = answers[qq.id] || [];
      h += '<div class="chips">' + qq.options.map(function (o) {
        var on = picked.indexOf(o.value) !== -1;
        var full = qq.max && picked.length >= qq.max && !on;
        return '<button type="button" class="chip-opt" data-multi="' + esc(o.value) + '" aria-pressed="' + on + '"' + (full ? ' disabled' : '') + '>' + esc(o.label) + '</button>';
      }).join('') + '</div>';
      if (qq.options.some(function (o) { return o.other; })) {
        h += '<div class="other-wrap' + (picked.indexOf('Something else') !== -1 ? ' show' : '') + '"><label class="visually-hidden" for="other-' + qq.id + '">Tell us more</label>' +
          '<input class="text-input" id="other-' + qq.id + '" type="text" maxlength="60" placeholder="What would you do with the time?" value="' + esc(other[qq.id] || '') + '"></div>';
      }
      if (qq.max) h += '<p class="pick-note">' + picked.length + ' of ' + qq.max + ' picked</p>';
      h += actions({ next: true, disabled: picked.length < (qq.min || 0) });
    }

    if (qq.type === 'scale') {
      var v = answers[qq.id];
      h += '<div class="scale">';
      for (var n = 1; n <= 10; n++) h += '<button type="button" class="opt" data-scale="' + n + '" aria-pressed="' + (v === n) + '" aria-label="' + n + ' out of 10">' + n + '</button>';
      h += '</div><div class="scale-ends"><span>1 &middot; It can wait</span><span>10 &middot; It has to change now</span></div>';
      h += actions();
    }

    if (qq.type === 'money') h += moneyHTML();
    return h + '</section>';
  }

  function moneyHTML() {
    var yearly = answers.rateMode === 'yearly';
    var val = yearly ? (answers.yearly || '') : (answers.rate || '');
    return '<div class="money-row">' +
      '<div class="money-field"><span class="cur" aria-hidden="true">$</span>' +
      '<label class="visually-hidden" for="money-input">' + (yearly ? 'Yearly income in dollars' : 'Value of an hour in dollars') + '</label>' +
      '<input class="num-input" id="money-input" type="number" inputmode="decimal" min="1" step="1" placeholder="' + (yearly ? '120000' : '200') + '" value="' + esc(val) + '">' +
      '<span class="suffix">' + (yearly ? 'a year' : 'an hour') + '</span></div>' +
      (yearly ? '' : '<div class="quick-picks">' + [50, 100, 200, 500].map(function (n) { return '<button type="button" class="chip-opt" data-pick="' + n + '">$' + n + '</button>'; }).join('') + '</div>') +
      '</div>' +
      (yearly ? '<p class="fine">We&rsquo;ll divide it by 2,000 working hours: <span data-yearly-out>' + (answers.yearly ? money(answers.yearly / 2000) + ' an hour' : '') + '</span></p>' : '') +
      '<div class="alt-links">' +
      (yearly ? '<button type="button" class="link-btn" data-mode="hourly">I&rsquo;ll enter an hourly value instead</button>'
              : '<button type="button" class="link-btn" data-mode="yearly">I don&rsquo;t bill hourly. Work it out from my yearly income.</button>') +
      '<button type="button" class="link-btn" data-skip>Skip this one</button></div>' +
      '<p class="fine">Just for your calculation. It never leaves your device.</p>' +
      actions({ next: true, disabled: !(Number(val) > 0) });
  }

  function checkHTML() {
    var h = hoursPerWeek();
    return '<h1 class="q-title" tabindex="-1" data-focus>That&rsquo;s about <em><span data-hours-word>' + hoursText(h) + '</span> a week</em> spent below your best.</h1>' +
      '<p class="q-help">Does that sound right? Adjust it if it feels off. Most people are surprised it&rsquo;s this high.</p>' +
      '<div class="big-number" aria-hidden="true"><span data-hours-num>' + h + '</span><small>hours / week</small></div>' +
      '<label class="visually-hidden" for="hours-range">Hours per week below your best</label>' +
      '<input class="range" id="hours-range" type="range" min="1" max="40" step="1" value="' + h + '">' +
      '<div class="range-ends"><span>1</span><span>40</span></div>' +
      actions({ next: true, label: 'That&rsquo;s about right' });
  }

  /* --------------------------------------------------------------- report */
  function reportHTML() {
    var key = archetype(), a = ARCH[key];
    var hpw = hoursPerWeek();
    var rate = answers.rate || null;
    var qHours = hpw * WEEKS_PER_QUARTER;
    var qMoney = rate ? qHours * rate : null;
    var halfHours = Math.round(qHours / 2);
    var costs = answers.costs || [];
    var wants = (answers.wants || []).map(function (w) { return labelWithOther('wants', w); });
    var tried = answers.tried || [];
    var imp = answers.importance || 5;

    // 1. Result
    var h = '<div class="report">' +
      '<section class="result-hero">' +
      '<div class="eyebrow">Your State Archetype</div>' +
      '<h1 class="rh-name" tabindex="-1" data-focus>' + a.name + '</h1>' +
      '<p class="rh-line">' + a.line + '</p>' +
      '<div class="rh-grid"><div><h3>How it shows up</h3><ul>' + a.shows.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ul></div>' +
      '<div><h3>What&rsquo;s actually happening</h3><p>' + a.happening + '</p><h3 style="margin-top:20px">What changes</h3><p>' + a.changes + '</p></div></div>' +
      '<div class="reframe"><strong>This was never about working more hours.</strong> It&rsquo;s about getting more out of the hours you already work.</div>' +
      '</section>';

    // 2. Quarter visual: two cycles, the same quarter on repeat (red) or a new one (green), with a choice between them
    var MINUS = '&minus;';
    var lossHours = Math.round(qHours).toLocaleString('en-US');
    h += '<section><div class="report-section-head"><div class="eyebrow with-rule">What it&rsquo;s costing you</div>' +
      '<h2>The same quarter, on repeat. <span class="hl">Or a new one.</span></h2></div>' +
      '<div class="timeline">' +
      '<div class="loop-label tl-loss-label">Next quarter, if nothing changes</div>' +
      '<div class="loop tl-loss-loop">' + loopSVG('loss') +
      '<div class="loop-inner"><span class="stat-big">' + MINUS + lossHours + ' hrs</span>' +
      (qMoney ? '<span class="stat-big">' + MINUS + money(qMoney) + '</span>' : '') +
      '<span class="per">lost every quarter</span></div></div>' +
      (costs.length ? '<ul class="loss-list tl-loss-list">' + costs.map(function (c) { return '<li>' + esc(LOSS_PHRASE[c] || c) + '</li>'; }).join('') + '</ul>' : '<div class="tl-loss-list"></div>') +
      '<div class="tl-loss-choice"><button type="button" class="btn btn-sm btn-keep" data-keep>I&rsquo;ll keep the pattern</button>' +
      '<p class="keep-note" role="status"></p></div>' +

      '<p class="tl-now">It&rsquo;s time to choose</p>' +

      '<div class="loop-label gain tl-gain-label">Next quarter, what&rsquo;s possible</div>' +
      '<div class="loop gain tl-gain-loop">' + loopSVG('gain') +
      '<div class="loop-inner"><span class="stat-big">+' + halfHours.toLocaleString('en-US') + ' hrs</span>' +
      (rate ? '<span class="stat-big">+' + money(halfHours * rate) + '</span>' : '') +
      '<span class="per">back, getting even half</span></div></div>' +
      (wants.length ? '<ul class="gain-chips tl-gain-list">' + wants.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>' : '<div class="tl-gain-list"></div>') +
      '<div class="tl-gain-choice"><a class="btn btn-primary btn-sm" href="' + calendlyURL(key, hpw, qMoney) + '" target="_blank" rel="noopener">I want my time back <span class="arrow" aria-hidden="true">&rarr;</span></a></div>' +
      '</div>' +
      '<p class="formula">' + hpw + ' hrs/week' + (rate ? ' &times; ' + money(rate) + '/hr' : '') + ' &times; ' + WEEKS_PER_QUARTER + ' weeks, based on your answers. What&rsquo;s possible assumes you get back even half.</p>' +
      '</section>';

    // 3. Why it didn't stick
    var seen = {}, cards = [];
    tried.forEach(function (t) {
      var w = WHY[t]; if (!w || seen[w[1]]) return; seen[w[1]] = true; cards.push(w);
    });
    h += '<section><div class="report-section-head"><div class="eyebrow with-rule">What you&rsquo;ve tried</div>' +
      '<h2>' + (triedNothing() ? 'A clean slate.' : 'Why it didn&rsquo;t stick.') + '</h2>' +
      (answers.outcome ? '<p>You said: &ldquo;' + esc(answers.outcome) + '&rdquo; You&rsquo;re not alone in that, and there&rsquo;s a reason for it.</p>' : '') +
      '</div>' +
      '<div class="why-grid">' + cards.map(function (c) { return '<div class="why-card"><h3>' + c[0] + '</h3><p>' + c[1] + '</p></div>'; }).join('') + '</div>' +
      ((answers.spent === '$5k to $20k' || answers.spent === '$20k+') ? '<p class="spent-note">You&rsquo;ve already invested <strong>' + esc(answers.spent) + '</strong> in fixes that faded. That&rsquo;s not a discipline problem. It&rsquo;s a state problem.</p>' : '') +
      '<div class="difference"><p><strong>What&rsquo;s different here:</strong> up to 900 live repetitions in 3 months, 5 to 60 seconds each, right at your desk, in the exact state where the problem happens.</p>' +
      '<div class="stat-tiles"><div class="stat-tile"><strong>5 to 60s</strong><span>per practice</span></div><div class="stat-tile"><strong>5 to 10x</strong><span>a day, at your desk</span></div><div class="stat-tile"><strong>&lt; 5 min</strong><span>total per day</span></div><div class="stat-tile"><strong>900</strong><span>live reps in 3 months</span></div></div></div>' +
      '</section>';

    // 4. Someone like you
    var cs = a.cs;
    h += '<section><div class="report-section-head"><div class="eyebrow with-rule">Someone like you</div><h2>It&rsquo;s been done before.</h2></div>' +
      '<div class="match-card"><img src="' + cs.img + '" alt="' + cs.name + '" width="84" height="84">' +
      '<div><div class="case-meta">' + cs.name + ' &nbsp;|&nbsp; ' + cs.role + '</div><h3>' + cs.title + '</h3><p>' + cs.line + '</p></div></div>' +
      '</section>';

    // 5. Call to action
    var costLine = qMoney ? '<strong>' + money(qMoney) + ' and ' + Math.round(qHours) + ' hours</strong>' : '<strong>' + Math.round(qHours) + ' hours</strong>';
    var gain = wants.length ? (GAIN_PHRASE[answers.wants[0]] || esc(wants[0])) : '';
    var msg;
    if (imp >= 8) {
      msg = 'You said this is a <strong>' + imp + ' out of 10</strong>. It&rsquo;s costing you about ' + costLine + ' a quarter' + (gain ? ', and it&rsquo;s keeping you from <strong>' + gain + '</strong>' : '') + '. Is now the right time to fix this for good?';
    } else if (imp >= 5) {
      msg = 'You rated this a <strong>' + imp + ' out of 10</strong>: important, not urgent. At this rate it costs you another ' + costLine + ' by the end of next quarter. One call can show you what changing it would take.';
    } else {
      msg = 'It may not feel urgent. Here&rsquo;s what it&rsquo;s costing anyway: ' + costLine + ' a quarter. One call can change the trajectory of this for good.';
    }
    var yearLine = (answers.year === 'It would seriously hold me back.' || answers.year === "I don't want to imagine it.")
      ? '<p class="lead-in">You said a year of this would seriously hold you back. You don&rsquo;t have to wait a year to change it.</p>' : '';

    h += '<section><div class="closing">' +
      '<p class="lead-in">' + msg + '</p>' + yearLine +
      '<p class="big">Stop living at the whim of your biology. Take control of your state.</p>' +
      '<a class="btn btn-light" href="' + calendlyURL(key, hpw, qMoney) + '" target="_blank" rel="noopener">Book your free consultation <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
      '<p style="margin-top:16px;font-size:.9rem">Your results summary is added to the booking, so we can get straight to it.</p>' +
      '</div>' +
      '<div class="after-cta">' +
      '<button type="button" class="btn btn-outline btn-sm" data-restart-report>Retake the quiz</button>' +
      '<button type="button" class="btn btn-outline btn-sm" data-share="' + key + '">Share your archetype</button>' +
      '<p class="share-status" role="status"></p>' +
      '<div class="share-fallback"><label class="visually-hidden" for="share-link">Share link</label><input id="share-link" type="text" readonly value="' + shareURL(key) + '"></div>' +
      '</div></section>' +
      '<p class="disclaimer">This quiz is a reflection tool, not a medical or psychological assessment.</p>' +
      '</div>';
    return h;
  }

  function loopSVG(kind) {
    // A circle of two arrowed arcs. Loss runs counterclockwise (the same quarter repeating);
    // gain runs clockwise (a new cycle). Each SVG gets its own marker id.
    var id = 'ah-' + kind, color = kind === 'gain' ? 'var(--green-700)' : 'var(--loss)';
    var arcs = kind === 'gain'
      ? ['M22.1 135.7 A140 140 0 0 1 297.9 135.7', 'M297.9 184.3 A140 140 0 0 1 22.1 184.3']
      : ['M297.9 135.7 A140 140 0 0 0 22.1 135.7', 'M22.1 184.3 A140 140 0 0 0 297.9 184.3'];
    return '<svg viewBox="0 0 320 320" aria-hidden="true"><defs><marker id="' + id + '" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">' +
      '<path d="M0 0 L10 5 L0 10 z" fill="' + color + '" stroke="none"/></marker></defs>' +
      arcs.map(function (d) { return '<path d="' + d + '" marker-end="url(#' + id + ')"/>'; }).join('') + '</svg>';
  }

  function shareURL(key) { return location.origin + '/quiz#' + key; }

  function calendlyURL(key, hpw, qMoney) {
    var parts = ['State Archetype: ' + ARCH[key].name, '~' + hpw + ' hrs/week below their best'];
    if (qMoney) parts.push('~' + money(qMoney) + '/quarter');
    if (answers.role) parts.push('Role: ' + labelWithOther('role', answers.role));
    if (answers.industry) parts.push('Industry: ' + labelWithOther('industry', answers.industry));
    if (answers.years) parts.push('Years: ' + answers.years);
    if (answers.tried) parts.push('Tried: ' + answers.tried.join(', '));
    if (answers.spent) parts.push('Spent: ' + answers.spent);
    if (answers.importance) parts.push('Importance: ' + answers.importance + '/10');
    return CALENDLY + '?a1=' + encodeURIComponent(parts.join(' | '));
  }

  /* ---------------------------------------------------------------- events */
  function bind() {
    var start = stage.querySelector('[data-start]');
    if (start) start.addEventListener('click', function () { history_replace(''); go(nextId('intro')); });

    var backBtn = stage.querySelector('[data-back]');
    if (backBtn) backBtn.addEventListener('click', back);

    var qq = q(current);
    var nextBtn = stage.querySelector('[data-next]');

    // Single choice: pick and move on (unless it's "Something else", which asks for text first)
    stage.querySelectorAll('[data-opt]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-opt');
        answers[qq.id] = v;
        stage.querySelectorAll('[data-opt]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        var o = optionOf(qq.id, v);
        if (o && o.other) {
          render();
          var inp = stage.querySelector('.text-input'); if (inp) inp.focus();
          return;
        }
        if (qq.id === 'freq' || qq.id === 'recovery') delete answers.check;
        setTimeout(advance, 220);
      });
    });

    // Multi choice
    stage.querySelectorAll('[data-multi]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-multi');
        var list = (answers[qq.id] || []).slice();
        var o = optionOf(qq.id, v);
        var i = list.indexOf(v);
        if (i !== -1) list.splice(i, 1);
        else if (o.exclusive) list = [v];
        else {
          list = list.filter(function (x) { var ox = optionOf(qq.id, x); return !(ox && ox.exclusive); });
          if (!qq.max || list.length < qq.max) list.push(v);
        }
        answers[qq.id] = list;
        var y = window.scrollY;
        render();
        window.scrollTo(0, y);
        if (o.other && list.indexOf(v) !== -1) { var inp = stage.querySelector('.text-input'); if (inp) inp.focus(); }
      });
    });

    // "Something else" text
    var txt = stage.querySelector('.text-input');
    if (txt) {
      txt.addEventListener('input', function () { other[qq.id] = txt.value.trim(); });
      txt.addEventListener('keydown', function (e) { if (e.key === 'Enter' && nextBtn && !nextBtn.disabled) nextBtn.click(); });
    }

    // Scale
    stage.querySelectorAll('[data-scale]').forEach(function (b) {
      b.addEventListener('click', function () {
        answers[qq.id] = Number(b.getAttribute('data-scale'));
        stage.querySelectorAll('[data-scale]').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        setTimeout(advance, 220);
      });
    });

    // Money
    var mi = stage.querySelector('#money-input');
    if (mi) {
      var yearly = answers.rateMode === 'yearly';
      var sync = function () {
        var n = Number(mi.value);
        if (yearly) {
          answers.yearly = n > 0 ? n : null;
          answers.rate = n > 0 ? Math.round(n / 2000) : null;
          var out = stage.querySelector('[data-yearly-out]');
          if (out) out.textContent = n > 0 ? money(n / 2000) + ' an hour' : '';
        } else {
          answers.rate = n > 0 ? n : null;
        }
        if (nextBtn) nextBtn.disabled = !(n > 0);
      };
      mi.addEventListener('input', sync);
      mi.addEventListener('keydown', function (e) { if (e.key === 'Enter' && nextBtn && !nextBtn.disabled) nextBtn.click(); });
      stage.querySelectorAll('[data-pick]').forEach(function (b) {
        b.addEventListener('click', function () { mi.value = b.getAttribute('data-pick'); sync(); });
      });
      stage.querySelectorAll('[data-mode]').forEach(function (b) {
        b.addEventListener('click', function () { answers.rateMode = b.getAttribute('data-mode'); answers.rate = null; answers.yearly = null; render(); var m = stage.querySelector('#money-input'); if (m) m.focus(); });
      });
      var skip = stage.querySelector('[data-skip]');
      if (skip) skip.addEventListener('click', function () { answers.rate = null; answers.yearly = null; advance(); });
    }

    // Check-in slider
    var range = stage.querySelector('#hours-range');
    if (range) {
      range.addEventListener('input', function () {
        var n = Number(range.value);
        answers.check = n;
        stage.querySelector('[data-hours-num]').textContent = n;
        stage.querySelector('[data-hours-word]').textContent = hoursText(n);
      });
      if (answers.check == null) answers.check = Number(range.value);
    }

    if (nextBtn) nextBtn.addEventListener('click', function () {
      if (qq && qq.type === 'single' && answers[qq.id] === 'Something else' && !other[qq.id]) { var t = stage.querySelector('.text-input'); if (t) t.focus(); return; }
      advance();
    });

    // Report actions
    var keep = stage.querySelector('[data-keep]');
    if (keep) keep.addEventListener('click', function () {
      var hpw = hoursPerWeek(), qh = Math.round(hpw * WEEKS_PER_QUARTER), r = answers.rate;
      stage.querySelector('.keep-note').innerHTML = 'Fair enough. Then next quarter looks like this one: <strong>&minus;' + qh.toLocaleString('en-US') + ' hours' +
        (r ? ' and &minus;' + money(qh * r) : '') + '</strong>. If that changes, booking is one click away.';
    });
    var again = stage.querySelector('[data-restart-report]');
    if (again) again.addEventListener('click', restart);
    var share = stage.querySelector('[data-share]');
    if (share) share.addEventListener('click', function () {
      var url = shareURL(share.getAttribute('data-share'));
      var status = stage.querySelector('.share-status');
      var fallback = function () {
        var box = stage.querySelector('.share-fallback'); box.classList.add('show');
        var inp = box.querySelector('input'); inp.focus(); inp.select();
        status.textContent = 'Copy this link to share your archetype (no personal numbers are included).';
      };
      try {
        navigator.clipboard.writeText(url).then(function () {
          status.textContent = 'Link copied. It shows your archetype only, with no personal numbers.';
        }, fallback);
      } catch (e) { fallback(); }
    });
  }

  /* --------------------------------------------------------- page controls */
  document.querySelector('[data-restart]').addEventListener('click', restart);
  var motionBtn = document.querySelector('[data-motion]');
  function setMotion(reduce) {
    document.documentElement.classList.toggle('reduce-motion', reduce);
    motionBtn.setAttribute('aria-pressed', reduce);
    motionBtn.textContent = reduce ? 'Motion reduced' : 'Reduce motion';
    try { localStorage.setItem('quizReduceMotion', reduce ? '1' : '0'); } catch (e) { /* ignore */ }
  }
  var savedMotion = null;
  try { savedMotion = localStorage.getItem('quizReduceMotion'); } catch (e) { /* ignore */ }
  setMotion(savedMotion === '1' || (savedMotion === null && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches));
  motionBtn.addEventListener('click', function () { setMotion(!document.documentElement.classList.contains('reduce-motion')); });

  // Number keys pick options (A = 1, B = 2...) on single-choice screens
  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    var n = parseInt(e.key, 10);
    if (!n) return;
    var btns = stage.querySelectorAll('[data-opt], [data-scale]');
    if (stage.querySelector('[data-scale]')) { if (btns[n - 1]) btns[n - 1].click(); return; }
    if (btns[n - 1]) btns[n - 1].click();
  });

  /* ----------------------------------------------------------------- start */
  var sharedType = location.hash.slice(1);
  if (ARCH[sharedType]) go('shared', false);
  else go('intro', false);
})();
