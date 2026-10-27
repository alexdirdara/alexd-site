/* Your State Archetype, version 2: a character quiz.
   20 questions (15 "how often" statements + 5 scenarios), scored across five archetypes.
   Everything runs in the visitor's browser; only the Calendly link carries a summary. */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  var CALENDLY = 'https://calendly.com/dirdara/on-demand';
  var ORDER = ['avery', 'bailey', 'parker', 'morgan', 'drew'];

  /* ------------------------------------------------------------- emblems */
  var RINGS = '<circle class="ring" cx="60" cy="60" r="56"/><circle class="ring-gold" cx="60" cy="60" r="50"/>';
  var EMBLEM = {
    // Phone with a notification and signal waves: always reachable
    avery: '<rect class="ln" x="46" y="32" width="28" height="50" rx="6"/><path class="ln" d="M55 75 h10"/>' +
      '<circle class="fill-gold" cx="73" cy="34" r="6"/>' +
      '<path class="ln-soft" d="M37 46 A 17 17 0 0 0 37 70"/><path class="ln-soft" d="M29 40 A 25 25 0 0 0 29 76"/>' +
      '<path class="ln-soft" d="M83 46 A 17 17 0 0 1 83 70"/><path class="ln-soft" d="M91 40 A 25 25 0 0 1 91 76"/>',
    // Honeycomb: four cells ticked off around the important one, still waiting in the middle
    bailey: '<polygon class="ln-soft" points="49.61,30 60,36 60,48 49.61,54 39.22,48 39.22,36"/>' +
      '<polygon class="ln-soft" points="70.39,30 80.78,36 80.78,48 70.39,54 60,48 60,36"/>' +
      '<polygon class="ln-soft" points="49.61,66 60,72 60,84 49.61,90 39.22,84 39.22,72"/>' +
      '<polygon class="ln-soft" points="70.39,66 80.78,72 80.78,84 70.39,90 60,84 60,72"/>' +
      '<path class="ln" style="stroke-width:2.5" d="M45.1 42.5 l3 3 l6 -6.5"/><path class="ln" style="stroke-width:2.5" d="M65.9 42.5 l3 3 l6 -6.5"/>' +
      '<path class="ln" style="stroke-width:2.5" d="M45.1 78.5 l3 3 l6 -6.5"/><path class="ln" style="stroke-width:2.5" d="M65.9 78.5 l3 3 l6 -6.5"/>' +
      '<polygon class="ln-gold" style="stroke-dasharray:4 4" points="60,48 70.39,54 70.39,66 60,72 49.61,66 49.61,54"/>' +
      '<polygon class="fill-gold" points="60,54 61.53,57.9 65.71,58.15 62.47,60.8 63.53,64.85 60,62.6 56.47,64.85 57.53,60.8 54.29,58.15 58.47,57.9"/>',
    // Speech bubble with a heart, and a little extra polish
    parker: '<path class="ln" d="M36 34 h48 a8 8 0 0 1 8 8 v24 a8 8 0 0 1 -8 8 h-26 l-10 10 v-10 h-12 a8 8 0 0 1 -8 -8 v-24 a8 8 0 0 1 8 -8 z"/>' +
      '<path class="fill-gold" d="M60 63 C 50 56, 47 49, 52 45 C 55 43, 58 44, 60 47 C 62 44, 65 43, 68 45 C 73 49, 70 56, 60 63 Z"/>' +
      '<path class="ln-soft" d="M97 20 v12 M91 26 h12"/><path class="ln-soft" d="M22 84 v8 M18 88 h8"/>',
    // Three masks, one in front
    morgan: '<ellipse class="mask" cx="42" cy="61" rx="15" ry="19"/><path class="ln-soft" d="M32 58 q3 -2.5 6 0"/>' +
      '<ellipse class="mask" cx="78" cy="61" rx="15" ry="19"/><path class="ln-soft" d="M82 58 q3 -2.5 6 0"/>' +
      '<ellipse class="mask-front" cx="60" cy="55" rx="16" ry="20"/>' +
      '<path class="ln" d="M51 51 q3.5 -3 7 0"/><path class="ln" d="M62 51 q3.5 -3 7 0"/><path class="ln-gold" d="M54 63 q6 5 12 0"/>',
    // A small stack, then a bigger one, with the money arcing over
    drew: '<path class="coin" d="M30 64 v16 a13 4.5 0 0 0 26 0 v-16"/><ellipse class="coin" cx="43" cy="64" rx="13" ry="4.5"/><path class="ln-soft" d="M30 72 a13 4.5 0 0 0 26 0"/>' +
      '<path class="coin" d="M64 42 v38 a13 4.5 0 0 0 26 0 v-38"/><ellipse class="coin" cx="77" cy="42" rx="13" ry="4.5"/>' +
      '<path class="ln-soft" d="M64 51 a13 4.5 0 0 0 26 0"/><path class="ln-soft" d="M64 60 a13 4.5 0 0 0 26 0"/><path class="ln-soft" d="M64 69 a13 4.5 0 0 0 26 0"/>' +
      '<path class="ln-gold" d="M40 56 C 38 34, 56 24, 70 30"/><path class="ln-gold" d="M61 26 L70 30 L64 37"/>',
    // Infinity: the joke result for anyone who scored zero everywhere
    frankie: '<path class="ln-gold" d="M60 60 C 51 47, 31 46, 31 60 C 31 74, 51 73, 60 60 C 69 47, 89 46, 89 60 C 89 74, 69 73, 60 60 Z"/>'
  };
  function emblem(key, label) {
    return '<svg class="emblem" viewBox="0 0 120 120"' + (label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true"') + '>' + RINGS + EMBLEM[key] + '</svg>';
  }

  /* --------------------------------------------------------------- content */
  var ARCH = {
    avery: {
      name: 'All Access Avery', short: 'Avery',
      tag: 'Always reachable. 24/7.',
      intro: 'You’re the one everyone can count on. The catch: even at the dinner table, your head is in your inbox.',
      signs: ['Your phone is always within arm’s reach', 'You draft replies in your head on days off', 'You scan for what might be breaking while you’re away'],
      strengths: ['People and clients can count on you, and you care about things going well', 'You notice problems early, before they get expensive', 'You take ownership instead of passing things off'],
      limits: ['Switching off feels unsafe, so rest makes you more anxious', 'Your family and friends never get all of you', 'The business becomes fully dependent on your availability'],
      trait: { name: 'Calm Radar', text: 'You keep your expert eye on what the business needs, while staying in a regulated state. You catch what matters without being on call for everything, so you’re fully present at the dinner table and still the first to know when something actually needs you.' },
      obstacle: [
        'You’re the person people count on, and you catch problems early.',
        'But when there are unread emails in your inbox, your system flips into alert mode, and <strong>staying available starts to feel like the only safe option.</strong> One two-second notification can keep you on guard for the whole evening or weekend.',
        'Your discipline and your boundaries are fine. <strong>What keeps you from shutting off in the evening is the state you’re in when you get that notification.</strong> Learn to return to a regulated state on demand, and rest comes back under your control.'
      ],
      strategies: [
        ['Notifications off after work', 'Remove the trigger.', 'Fewer interruptions, and easy to start.', 'It works until the day you’re expecting an important email and check “just once” at 7:40 PM. That “just once” repeats every day after.'],
        ['Meditation practice', 'If I can calm myself down, I won’t need to check my phone.', 'You find real peace on the cushion. It feels like it’s working.', 'The calm from the cushion gets replaced by anxiety at the first sign of trouble.'],
        ['Setting boundaries', 'Clients know evenings are only for emergencies.', 'You build time off directly into your business.', 'You’re relaxed at first. Eventually the silence makes you anxious, and you find work to do anyway.']
      ],
      contrast: [
        ['Turning off notifications breaks as soon as you need them on again.', 'You practice a 30-second reset for that exact moment, so you’re in control instead of the compulsion.'],
        ['The calm from the cushion vanishes at the first sign of trouble.', 'We build that calm in the actual place where the discomfort shows up: at your desk, with your phone.'],
        ['As long as silence feels uncomfortable, the boundaries fade.', 'We work with your state in the 2 seconds when the discomfort hits, so you can bring yourself back.']
      ]
    },
    bailey: {
      name: 'Busy Bee Bailey', short: 'Bailey',
      tag: 'Busy all day. Still no new clients.',
      intro: 'You’re comparing three new CRMs while the leads already in yours sit untouched. You’re busy, organized, and still behind on the one thing that matters.',
      signs: ['You clean up your inbox or CRM before an important call', 'Your to-do list is done, but the big task isn’t', 'You feel a knot in your stomach, then a sudden urge to organize'],
      strengths: ['You get a lot done and rarely sit still', 'Your systems, details and follow-ups are in great shape', 'You have a lot of energy and keep moving'],
      limits: ['The task that would grow your business keeps getting pushed back', 'Tension before important work sends you to easier tasks', 'A full day doesn’t mean you made progress'],
      trait: { name: 'Steady Closer', text: 'You can sit with the discomfort of the important task and do it first. Your organizing skills then back up that work instead of replacing it.' },
      obstacle: [
        'You keep things moving, and your systems and follow-ups are in great shape.',
        'But when it’s time for the important task (the sales call, the ask, the follow-up), tension kicks in and <strong>your system reaches for something easier.</strong> You can push through for a while, then one awkward silence or rejection sends you back to your inbox for the rest of the day, or the week.',
        'You know what to do and how to do it. <strong>What gets in the way is the state you’re in right before the important task starts.</strong> Learn to settle that state, and the important work goes first, with your organizing skills backing it up.'
      ],
      strategies: [
        ['Productivity books and time blocking', 'If I plan my day right, I’ll do the hard task first.', 'A clear plan, and a fresh start that feels great.', 'You made the plan feeling calm on Sunday night. At 8:55 on Monday, you open the CRM “just to prep,” and the morning is gone.'],
        ['Sales training or a workshop', 'If I knew what to say, it wouldn’t feel so hard.', 'Real skills and scripts you can use.', 'You know exactly what to say, and your stomach still drops when the phone starts ringing.'],
        ['A business coach or accountability group', 'If someone’s checking in, I’ll do it.', 'The calls get made while someone’s watching.', 'It works the week of the check-in. Alone on a Wednesday afternoon, the urge to tidy something comes right back.']
      ],
      contrast: [
        ['Calm Sunday-night you made the plan. Tense Monday-morning you opens the CRM.', 'A 10-second practice at 8:55 gets you into a state where the call feels doable.'],
        ['You know the script, and your stomach still drops when the phone rings.', 'We work on that drop in your stomach, since you already know the words.'],
        ['Accountability works while someone’s watching. Alone on a Wednesday, the tidying wins.', 'The change happens inside you, so it works on a Wednesday afternoon with nobody watching.']
      ]
    },
    parker: {
      name: 'People Pleaser Parker', short: 'Parker',
      tag: 'Everyone’s happy. Except your margins.',
      intro: 'A client sounds a little off, and suddenly there’s a discount, a free extra, and a fifth round of edits on work that was done weeks ago.',
      signs: ['You replay a client’s tone of voice for hours', 'Your first instinct is to offer a discount or a bonus', 'You send version five when version one was fine'],
      strengths: ['You read people faster than most', 'Clients feel heard and cared for', 'You hold a high standard for your work'],
      limits: ['You discount or add free work when a client seems unhappy', 'You keep polishing long after the work is good enough', 'Your mood depends on whether people seem happy with you'],
      trait: { name: 'Quiet Reader', text: 'You still read people and know what they need, without feeling responsible for their feelings. Your relationships with family, clients and vendors get better, and your prices and boundaries stop depending on someone’s mood.' },
      obstacle: [
        'You read people faster than most, and your clients can feel it.',
        'But when a client sounds off or an email comes back short, your system treats it like a threat, and <strong>you end up discounting, adding free work, or polishing one more round.</strong> One “ok, thanks” can throw off your whole afternoon.',
        'Your pricing and your confidence are fine on paper. <strong>What changes your decisions is the state you’re in the moment someone seems unhappy.</strong> Learn to come back to calm in that moment, and your decisions stay yours instead of following your client’s mood.'
      ],
      strategies: [
        ['Therapy', 'Understand why I need to be liked so much.', 'Real insight, and a safe place to talk it through.', 'The calm from Thursday’s session doesn’t make it to Monday at 9:05, when a client sounds upset and you’re alone at your desk.'],
        ['A pricing or negotiation course', 'If I know how to hold my price, I won’t cave.', 'Clear scripts, and a pricing policy you believe in.', 'The policy says no discounts. Then the client sounds disappointed, and you offer “just this once” before the call ends.'],
        ['Confidence books and affirmations', 'If I feel confident, I’ll act confident.', 'You start the day feeling strong.', 'The confidence from 7 AM lasts until the first client pushes back at 10:15. Then you’re redoing the proposal for free.']
      ],
      contrast: [
        ['The insight from Thursday’s session doesn’t reach Monday at 9:05.', 'We practice for Monday at 9:05, at your desk, right when the client sounds upset.'],
        ['The course gave you a policy. Then their voice drops and you offer “just this once.”', 'We work on the moment their voice drops, so you keep the policy you wrote.'],
        ['The 7 AM confidence lasts until the first pushback at 10:15.', 'You reset in the moment of pushback itself, so you hold your ground when it counts.']
      ]
    },
    morgan: {
      name: 'Million Mask Morgan', short: 'Morgan',
      tag: 'Every role. All at once.',
      intro: 'Parent, founder, HR, accounting and client services, often before lunch. You’re short on boundaries more than time, and the work you love gets whatever’s left.',
      signs: ['You switch roles many times before lunch', 'You say yes to interruptions in the middle of a task', 'You can’t remember the last time you focused on one thing for hours'],
      strengths: ['You can step into almost any role', 'You’re resourceful and rarely stuck', 'Everyone knows you’ll handle it'],
      limits: ['You never get deep enough into anything to enjoy it', 'Without boundaries, everything ends up on your plate', 'Switching all day leaves you worn out'],
      trait: { name: 'Fluid Focus', text: 'You still move easily between roles, but you do it on purpose. You choose which mask to put on, protect time for deep work, and give each role your full attention instead of what’s left over.' },
      obstacle: [
        'You’re versatile and resourceful, the one who always gets it handled.',
        'But when an interruption comes in (a client message, a kid at the door, a team question), your system treats it as urgent, <strong>you say yes, and you switch masks again.</strong> One interruption can wreck a well-planned morning, and the rest of the week looks the same.',
        'A better calendar won’t fix this on its own. <strong>What decides it is the state you’re in when someone needs you mid-task.</strong> Learn to stay steady in that moment, and you choose your roles instead of getting pulled into them.'
      ],
      strategies: [
        ['Time blocking and planner apps', 'Give every role its own time slot.', 'A clear structure, and some protected time for deep work.', '9 AM says deep work. At 9:20 a client emergency and a kid at the door show up together, and the plan is gone.'],
        ['A mentor or mastermind group', 'Learn how other founders juggle it all.', 'Great advice from people who’ve been there: delegate, say no, protect your mornings.', 'You leave every session with a great plan. By Tuesday, three people need you at once and you’re back to switching masks.'],
        ['Hiring help', 'Fewer roles on my plate.', 'Real relief, and fewer masks to wear.', 'You hire the help and still jump in to “just do it quickly.” The first “it’ll only take a minute” still gets a yes.']
      ],
      contrast: [
        ['9 AM says deep work. 9:20 brings a client emergency and a kid at the door.', 'You practice a 10-second reset for the interruption itself, so you choose which mask to put on.'],
        ['The advice makes sense on the call, then falls apart on a busy Tuesday.', 'We practice in the moment the pressure hits, so the advice still works on a busy Tuesday.'],
        ['You hired help and still say yes to “it’ll only take a minute.”', 'We practice a calm “give me 20 minutes,” so saying not now stops feeling like letting someone down.']
      ]
    },
    drew: {
      name: 'Double Downer Drew', short: 'Drew',
      tag: 'One more tool, and this time it’ll work.',
      intro: 'You spent $20k on marketing to avoid cold calls. Now another $30k tool feels easier than admitting a few weeks of calls might have brought in ten clients for free.',
      signs: ['You buy another tool when the last one didn’t deliver', 'You say “that’s how we did it at my old job”', 'You avoid looking closely at what a purchase actually earned'],
      strengths: ['You’re loyal, disciplined and you follow through', 'You’re willing to invest in growth', 'You trust proven methods and don’t chase every shiny thing'],
      limits: ['When something misses, you spend more instead of changing course', 'Admitting a purchase didn’t work feels embarrassing', 'Trying something new feels riskier than repeating what you know'],
      trait: { name: 'Clear-Eyed Investor', text: 'You keep your commitment and your willingness to invest, and you can look at results honestly and change course early. You test small, learn fast, and put money behind what’s working.' },
      obstacle: [
        'You’re loyal, disciplined and willing to invest in growth.',
        'But when something you paid for doesn’t deliver, admitting it feels like a judgment on you, so <strong>you spend more instead of changing course.</strong> You make good decisions for months, then one look at an invoice or a dashboard locks you into a choice that costs more than the first one.',
        'Your judgment is fine. <strong>What decides it is the state you’re in when you look at the results.</strong> Learn to stay steady in that moment, and you change course early, before the bill gets bigger.'
      ],
      strategies: [
        ['A course on the tool you bought', 'If I learn it properly, it’ll pay off.', 'Real skills, and the tool might actually start working.', 'You get better at the tool, but the real question, “did the first $10k work?”, isn’t in the course.'],
        ['A bigger agency or consultant', 'The first one wasn’t enough, so go bigger.', 'Real expertise and new ideas.', 'It’s a bigger bet, made from the same place. The more you’ve spent, the harder it is to say “that didn’t work.”'],
        ['A mentor from your old industry', 'Ask someone who’s done it before.', 'Proven advice from someone you trust.', 'It worked for them with a team, a brand and a budget behind it. Following it more closely feels safe and keeps results flat.']
      ],
      contrast: [
        ['The course teaches the tool, and never asks if the first $10k worked.', 'We work on the state that makes that question hard to ask, so you can ask it early.'],
        ['The bigger agency is a bigger bet, made from the same place.', 'You look at the numbers from a steady state and decide based on results, before the next invoice.'],
        ['Following the old playbook more closely feels safe and keeps results flat.', 'You stay steady enough to test something new on a small scale, and keep only what works.']
      ]
    }
  };

  // Section 1: interleaved so the scoring isn't obvious. Never/Rarely/Sometimes/Often = 0/1/2/3.
  var STATEMENTS = [
    ['avery', 'Your work phone buzzes at the family dinner table. You have to check it <em>right now</em>.'],
    ['bailey', 'You’ve gone through 8 cold calls or DMs that went nowhere. The 9th starts to feel <em>impossible</em>.'],
    ['parker', 'Your favorite client sent you a calendar invite for tomorrow morning with no context. You spend the whole day <em>worrying about it</em>.'],
    ['morgan', 'Sales, marketing, accounting and being a parent. You have to <em>do it all</em> before it’s even lunchtime.'],
    ['drew', 'You spent $10k on lead gen that did worse than free cold calls. You <em>still won’t consider</em> going back to cold calls.'],
    ['avery', 'On a day off, you spend half of it <em>compulsively checking</em> your phone.'],
    ['bailey', 'You’re tired at the end of the day and your to-do list is done. None of it got you <em>any closer to new clients</em>.'],
    ['parker', 'A client pushes back when you quote the price for new work. Your first instinct is to <em>justify the price</em>.'],
    ['morgan', 'You’re busy with an important task. Someone asks for your time, and you <em>say yes</em> without even thinking about it.'],
    ['drew', 'You finish all your work for the day in 4 hours. Taking the rest of the day off would make you <em>feel lazy</em>.'],
    ['avery', 'When you picture being fully offline for a week, you <em>feel panic</em>.'],
    ['bailey', 'You’re getting ready to do outreach, and you’re already expecting rejection. You <em>find something else</em> to do.'],
    ['parker', 'You’re on version 12 of the work you’re doing for a client. You know deep down they would have <em>loved version 4</em>.'],
    ['morgan', 'You can’t remember the last time you spent hours on <em>the work you love most</em>.'],
    ['drew', 'You worry that if you change anything in your business, <em>everything will fall apart</em>.']
  ];
  var FREQ = ['Never', 'Rarely', 'Sometimes', 'Often'];

  // Section 2: pick one, +3 to that archetype. Options are listed in archetype order here and rotated per question on screen.
  var SCENARIOS = [
    ['You’re pitching a big project to a client tomorrow morning. How do you spend <em>the day before</em>?', 'You:', ['Work on it all day, including finishing touches in bed.', 'Get caught up in admin all day, then work on the pitch until 2 AM.', 'Tweak the header and fonts 17 more times.', 'Have a parent-teacher conference and several team meetings, and barely get to it in the evening.', 'Do it exactly the way you did it for them last time. It’s probably fine.']],
    ['Lead gen <em>slowed down</em> this month.', 'Your first move:', ['Work evenings and weekends to make up for it.', 'Make sure you’re caught up on emails and the CRM is up to date.', 'Check in with past clients to make sure they’re happy.', 'You’re too busy with everything else to have even noticed.', 'Pay a lead gen expert to fix it for you.']],
    ['You launched a new product or service, and <em>no one seems to care</em>.', 'You:', ['Spend every spare moment trying to find out why.', 'Tweak the website, the ads, the hook and the name.', 'Drop the price and add more free features.', 'Plan to get to it after your other obligations.', 'Double the ad spend so it reaches more people.']],
    ['A client is <em>a week behind on a payment</em>.', 'You:', ['Check obsessively, and work more to make up for it.', 'Distract yourself by planning your LinkedIn posts for the week.', 'Feel anxious about following up, then tell them they can take their time.', 'Forget about it between tasks.', 'Hire someone to chase down the payment.']],
    ['A friend recommends a <em>new lead gen strategy</em>.', 'You:', ['Spend the weekend looking into it.', 'Say you’ll look into it, then get busy with other things.', 'Wonder if it’s secretly a criticism of how you do things now.', 'Book a call with the person behind the strategy.', 'Feel anxious about changing the strategy you’ve used this whole time.']]
  ];
  var TOTAL = STATEMENTS.length + SCENARIOS.length;

  var PRIORITIES = {
    money: {
      label: 'Money',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3 2 2.6 4.5 3 4.5 1.4 4.5 3.2-2 3.3-4.5 3.3-4.5-1.4-4.5-3"/></svg>',
      html: '<h4 class="prio-title">An invisible $3,000 bill</h4>' +
            '<p>One client figured his time was worth about $150 an hour, and guessed he lost around 5 hours a week to these patterns. <strong>That’s about $3,000 a month.</strong></p>' +
            '<p>Then we looked at his actual days, and how often something threw him off. <strong>It was closer to 10 hours, double his original estimate.</strong></p>' +
            '<p>When a deal you spent months on falls through, <strong>it can even take weeks to get back to your best</strong>, and in the meantime busy work and distractions take over.</p>'
    },
    time: {
      label: 'Time',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
      html: '<h4 class="prio-title">Fewer distractions, finish faster</h4>' +
            '<p>Most clients don’t want more money. <strong>They want the hours they already work to count for more.</strong></p>' +
            '<p>They <strong>get the same work done in less time.</strong> The hours they get back go to a partner, the kids, a drink with a friend, or that second vacation that keeps getting pushed back.</p>' +
            '<p>Those 10 hours a week aren’t extra work. <strong>They’re evenings you get back.</strong></p>'
    },
    energy: {
      label: 'Energy',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
      html: '<h4 class="prio-title">Regain your love for the work</h4>' +
            '<p>Even if time and money don’t matter as much to you, energy does. Getting it back means <strong>staying in control of your state.</strong></p>' +
            '<p>You do your best work, and <strong>your clients, team, vendors and family get the best version of you too.</strong></p>' +
            '<p><strong>You regain the joy you had for your business</strong>, and it changes your work and relationships.</p>'
    }
  };

  /* ---------------------------------------------------------------- state */
  var s1 = [], s2 = [], priority = null, history = [], current = 'intro', sharedKey = null;
  var stage = document.getElementById('stage');
  var bar = document.querySelector('.q2-progress');

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }

  function scores() {
    var sc = {}; ORDER.forEach(function (k) { sc[k] = 0; });
    STATEMENTS.forEach(function (st, i) { if (s1[i] != null) sc[st[0]] += s1[i]; });
    s2.forEach(function (k) { if (k) sc[k] += 3; });
    return sc;
  }
  function totalScore() { var sc = scores(); return ORDER.reduce(function (a, k) { return a + sc[k]; }, 0); }
  // Share of all points, rounded so the five always add up to 100 (largest remainder)
  function percentages() {
    var sc = scores(), total = 0;
    ORDER.forEach(function (k) { total += sc[k]; });
    if (!total) { var even = {}; ORDER.forEach(function (k) { even[k] = 20; }); return even; }
    var raw = ORDER.map(function (k) { var v = sc[k] * 100 / total; return { k: k, floor: Math.floor(v), rem: v - Math.floor(v) }; });
    var left = 100 - raw.reduce(function (a, r) { return a + r.floor; }, 0);
    raw.slice().sort(function (a, b) { return b.rem - a.rem; }).slice(0, left).forEach(function (r) { r.floor++; });
    var out = {}; raw.forEach(function (r) { out[r.k] = r.floor; });
    return out;
  }
  function primary() {
    var sc = scores(), picks = {};
    ORDER.forEach(function (k) { picks[k] = 0; }); s2.forEach(function (k) { if (k) picks[k]++; });
    return ORDER.slice().sort(function (a, b) { return (sc[b] - sc[a]) || (picks[b] - picks[a]) || (ORDER.indexOf(a) - ORDER.indexOf(b)); })[0];
  }

  /* ----------------------------------------------------------- navigation */
  function go(screen, push) { if (push !== false) history.push(current); current = screen; render(); }
  function back() { if (history.length) { current = history.pop(); render(); } }
  function nextOf(screen) {
    if (screen === 'intro') return 'q0';
    var n = Number(screen.slice(1)) + 1;
    return n < TOTAL ? 'q' + n : 'report';
  }
  function restart() {
    s1 = []; s2 = []; priority = null; history = [];
    try { window.history.replaceState(null, '', location.pathname); } catch (e) { /* ignore */ }
    go('intro', false);
  }

  /* --------------------------------------------------------------- render */
  function render() {
    var isReport = current === 'report' || current === 'shared';
    document.body.classList.toggle('report-mode', isReport);
    var done = current.charAt(0) === 'q' ? Number(current.slice(1)) : (current === 'report' ? TOTAL : 0);
    bar.querySelector('span').style.width = (done / TOTAL * 100) + '%';
    bar.setAttribute('aria-valuenow', done);

    if (current === 'intro') stage.innerHTML = introHTML();
    else if (current === 'report') stage.innerHTML = totalScore() === 0 ? frankieHTML() : reportHTML(primary(), true);
    else if (current === 'shared') stage.innerHTML = reportHTML(sharedKey, false);
    else stage.innerHTML = questionHTML(Number(current.slice(1)));

    bind();
    window.scrollTo(0, 0);
    var f = stage.querySelector('[data-focus]'); if (f) f.focus({ preventScroll: true });
  }

  function introHTML() {
    return '<section class="screen intro">' +
      '<div class="q-eyebrow"><span class="phase">Your State Archetype &middot; <b>20 quick questions</b></span></div>' +
      '<h1 class="q-title" tabindex="-1" data-focus>Five characters run most founders&rsquo; weeks. <em>Which one is running yours?</em></h1>' +
      // Emblems only, no names: a teaser for the five characters
      '<div class="cast" aria-hidden="true">' + ORDER.map(function (k) { return '<figure>' + emblem(k) + '</figure>'; }).join('') + '</div>' +
      '<p class="q-help">A quick personality quiz. Go with your first instinct. There are no wrong answers. You&rsquo;ll get your character sheet along with some of your untapped potential.</p>' +
      '<button type="button" class="btn btn-light" data-start>Meet my character <span class="arrow" aria-hidden="true">&rarr;</span></button>' +
      '<div class="intro-meta"><span>20 questions</span><span>About 4 minutes</span><span>No sign-up</span></div>' +
      '</section>';
  }

  function eyebrow(n, part) {
    return '<div class="q-eyebrow"><span class="phase">Part ' + (part === 1 ? 'I &middot; <b>How often does this sound like you?</b>' : 'II &middot; <b>What would you do?</b>') + '</span>' +
      '<span class="count">' + (n + 1) + ' / ' + TOTAL + '</span></div>';
  }
  // Scenarios get a way out: skipping adds no points to anyone and moves on
  function actions(skippable) {
    return '<div class="q-actions"><button type="button" class="back-btn" data-back>&larr; Back</button>' +
      (skippable ? '<button type="button" class="back-btn skip-btn" data-skip>Doesn&rsquo;t apply to me &rarr;</button>' : '') + '</div>';
  }

  function questionHTML(n) {
    if (n < STATEMENTS.length) {
      var st = STATEMENTS[n], sel = s1[n];
      return '<section class="screen statement">' + eyebrow(n, 1) +
        '<h1 class="q-title" tabindex="-1" data-focus>' + st[1] + '</h1>' +
        '<div class="freq">' + FREQ.map(function (f, i) {
          return '<button type="button" class="opt" data-freq="' + i + '" aria-pressed="' + (sel === i) + '">' + f + '</button>';
        }).join('') + '</div>' + actions() + '</section>';
    }
    var j = n - STATEMENTS.length, sc = SCENARIOS[j], picked = s2[j];
    // rotate option order per scenario so the same archetype isn't always in the same slot
    var opts = ORDER.map(function (k, i) { return { k: k, label: sc[2][i] }; });
    opts = opts.slice(j % 5).concat(opts.slice(0, j % 5));
    if (j % 2) opts.reverse();
    return '<section class="screen">' + eyebrow(n, 2) +
      '<h1 class="q-title" tabindex="-1" data-focus>' + sc[0] + '</h1><p class="scenario-lead">' + sc[1] + '</p>' +
      '<div class="options">' + opts.map(function (o, i) {
        return '<button type="button" class="opt" data-scen="' + o.k + '" aria-pressed="' + (picked === o.k) + '"><span class="key" aria-hidden="true">' + String.fromCharCode(65 + i) + '</span><span>' + esc(o.label) + '</span></button>';
      }).join('') + '</div>' + actions(true) + '</section>';
  }

  /* --------------------------------------------------------------- report */
  function list(items) { return '<ul>' + items.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>'; }
  // Numbered section header, same pattern as the science page ("01 The Internal Math Angle")
  function sectionHead(num, title, tagline) {
    return '<div class="angle-head"><span class="angle-num">' + num + '</span><h2>' + title + '</h2><p class="tagline">' + tagline + '</p></div>';
  }
  // The closing line follows whatever they picked under "What matters most to you?"
  var COST = { money: 'costing you so much', time: 'taking so much time', energy: 'taking so much energy' };
  function costPhrase() { return priority ? COST[priority] : 'costing you so much time, money and energy'; }
  function traitBox(a) {
    return '<div class="trait"><div class="trait-label">Hidden trait to unlock</div><div class="trait-name">' + a.trait.name + '</div><p>' + a.trait.text + '</p></div>';
  }

  function reportHTML(key, full) {
    var a = ARCH[key];
    var h = '<div class="report">';

    // 1. Character sheet
    h += '<section class="sheet">' +
      '<div class="sheet-head">' + emblem(key, a.name + ' emblem') +
      '<div><div class="eyebrow">' + (full ? 'Your State Archetype' : 'A State Archetype') + '</div>' +
      '<h1 class="sheet-name" tabindex="-1" data-focus>' + a.name + '</h1>' +
      '<p class="sheet-tag">' + a.tag + '</p><p class="sheet-intro">' + a.intro + '</p></div></div>' +
      '<div class="sheet-cols">' +
      '<div class="sheet-col signs"><h3><span class="dot"></span>Signs</h3>' + list(a.signs) + '</div>' +
      '<div class="sheet-col strengths"><h3><span class="dot"></span>Strengths</h3>' + list(a.strengths) + '</div>' +
      '<div class="sheet-col limits"><h3><span class="dot"></span>Limitations</h3>' + list(a.limits) + '</div>' +
      '</div>' + traitBox(a);
    if (full) {
      var pct = percentages();
      h += '<div class="mix"><h3>Your full archetype mix</h3>' +
        ORDER.slice().sort(function (x, y) { return (pct[y] - pct[x]) || ((y === key) - (x === key)); }).map(function (k) {
          return '<div class="mix-row' + (k === key ? ' top' : '') + '"><span class="mix-name">' + ARCH[k].name + '</span>' +
            '<span class="mix-bar"><span style="width:' + pct[k] + '%"></span></span><span class="mix-pct">' + pct[k] + '%</span></div>';
        }).join('') + '</div>';
    }
    h += '</section>';

    if (!full) {
      return h + '<section class="center"><h2>Which one are <span class="hl">you</span>?</h2>' +
        '<p class="lead" style="max-width:560px;margin:0 auto 24px">Twenty quick questions to meet the character running your week.</p>' +
        '<button type="button" class="btn btn-primary" data-restart-report>Take the quiz <span class="arrow" aria-hidden="true">&rarr;</span></button></section></div>';
    }

    // 01. The archetype's challenge (numbered headers match the science page)
    h += '<section>' + sectionHead('01', a.name + '&rsquo;s Challenge', 'The usual fixes, and their limitations.') +
      '<div class="obstacle">' + a.obstacle.map(function (p) { return '<p>' + p + '</p>'; }).join('') + '</div>' +
      '<div class="strategies">' + a.strategies.map(function (s) {
        return '<article class="strategy"><h3>' + s[0] + '</h3><ol class="s-flow">' +
          '<li><span class="s-step">1</span><div><b>The idea</b><p>' + s[1] + '</p></div></li>' +
          '<li><span class="s-step">2</span><div><b>What it gives you</b><p>' + s[2] + '</p></div></li>' +
          '<li class="limit"><span class="s-step">3</span><div><b>Where it breaks</b><p>' + s[3] + '</p></div></li>' +
          '</ol></article>';
      }).join('') + '</div></section>';

    // 02. Why the fixes fade (science, summarized), then what fills the gap
    h += '<section>' + sectionHead('02', 'Planned in one state. Needed in another.', 'Why the fixes fade.') +
      '<div class="science-sum"><div>' +
      '<p class="kicker">Every fix above was planned while you were calm, and needed while you were not.</p>' +
      '<p>A rule you made on a calm Sunday night, or an insight from a therapy session, is <strong>tied to that calm state.</strong> Then the notification, the awkward silence or the invoice comes in, your state changes, and <strong>the plan does too.</strong></p>' +
      '</div><div>' +
      '<p>Your brain also forgets what it doesn&rsquo;t use. <strong>Most of what you read or decide is gone within hours</strong> unless you practice it.</p>' +
      '<p>Instead of bigger plans and new systems, we use <strong>short practices you do at your desk, during your real workday</strong>, in the moments you need them. You have the opportunity to repeat them up to 900 times in three months, which <strong>hardwires the new behavior where and when you need it most.</strong></p>' +
      '</div></div>' +
      '<div class="stat-tiles"><div class="stat-tile"><strong>5 to 60s</strong><span>per practice</span></div><div class="stat-tile"><strong>5 to 10x</strong><span>a day, at your desk</span></div><div class="stat-tile"><strong>&lt; 5 min</strong><span>total per day</span></div><div class="stat-tile"><strong>900</strong><span>live reps in 3 months</span></div></div>';

    // Still part of 02: where those fixes break vs what fills the gap
    var x = '<span class="ico" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4.5 4.5l7 7M11.5 4.5l-7 7"/></svg></span>';
    var v = '<span class="ico" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 8.5l3 3 6-7"/></svg></span>';
    h += '<div class="sub-head"><div class="eyebrow with-rule">Filling the gap</div>' +
      '<h3>What changes for ' + a.short + '.</h3></div>' +
      '<div class="compare" role="table" aria-label="Where the usual fixes break, and what we do instead">' +
      '<div class="compare-row heads" role="row"><div class="compare-head them" role="columnheader">Where the usual fix breaks</div><div class="compare-head us" role="columnheader">What we do instead</div></div>' +
      a.contrast.map(function (c) {
        return '<div class="compare-row" role="row"><div class="compare-cell them" role="cell">' + x + '<div><span class="compare-label">Where it breaks</span>' + c[0] + '</div></div>' +
          '<div class="compare-cell us" role="cell">' + v + '<div><span class="compare-label">What we do instead</span>' + c[1] + '</div></div></div>';
      }).join('') + '</div></section>';

    // 03. Making it real: what matters most
    h += '<section>' + sectionHead('03', 'Making it Real', 'What it takes to break the cycle.') +
      // Left: the question and the three choices. Right: the panel for whichever one they pick.
      '<div class="prio-wrap"><div class="prio-pick"><h3>What matters most to you?</h3>' +
      '<div class="prio-tabs" role="tablist" aria-label="What matters most to you" aria-orientation="vertical">' + Object.keys(PRIORITIES).map(function (p) {
        return '<button type="button" class="prio-tab" role="tab" id="tab-' + p + '" aria-controls="prio-panel" aria-selected="' + (priority === p) + '" data-prio="' + p + '">' + PRIORITIES[p].icon + PRIORITIES[p].label + '</button>';
      }).join('') + '</div></div>' +
      '<div class="prio-panel" id="prio-panel" role="tabpanel"' + (priority ? ' aria-labelledby="tab-' + priority + '"' : '') + '>' +
      (priority ? PRIORITIES[priority].html : '<p class="prio-hint">Pick one to see what changes.</p>') + '</div></div>' +
      '<div class="prio-trait"><p class="lead-line">And as ' + a.name + ', that&rsquo;s where you <strong>unlock your hidden trait:</strong></p>' + traitBox(a) + '</div>' +
      '</section>';

    // The invitation
    h += '<section><div class="closing invite">' +
      '<h2>Being ' + a.name + ' works.</h2>' +
      '<p>It&rsquo;s gotten you this far in your business and your life. What I&rsquo;m offering isn&rsquo;t getting rid of ' + a.short + ' or changing who you are.</p>' +
      '<p>Instead, learn how to work with ' + a.short + ': keep the best traits, without it <strong data-cost>' + costPhrase() + '</strong>.</p>' +
      '<p>No complicated morning routines or new systems to try. Just short, simple practices you can do in the moments you need them most.</p>' +
      '<p class="question">Learn how to unlock your hidden trait.</p>' +
      '<a class="btn btn-light" data-book href="' + calendlyURL(key) + '" target="_blank" rel="noopener">Book a free call about my results <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
      '<p style="margin-top:16px;font-size:.9rem">Your quiz results are added to the booking, so we can get straight to it.</p>' +
      '</div>' +
      '<div class="after-cta">' +
      '<button type="button" class="btn btn-outline btn-sm" data-restart-report>Retake the quiz</button>' +
      '<button type="button" class="btn btn-outline btn-sm" data-share="' + key + '">Share my character</button>' +
      '<p class="share-status" role="status"></p>' +
      '<div class="share-fallback"><label class="visually-hidden" for="share-link">Share link</label><input id="share-link" type="text" readonly value="' + shareURL(key) + '"></div>' +
      '</div></section>' +
      '<p class="disclaimer">This quiz is a reflection tool, not a medical or psychological assessment.</p></div>';
    return h;
  }

  // Zero points everywhere ("Never" to every statement, every scenario skipped): a joke result
  function frankieHTML() {
    return '<div class="report"><section class="sheet frankie">' +
      '<div class="sheet-head">' + emblem('frankie', 'Infinity emblem') +
      '<div><div class="eyebrow">Your State Archetype</div>' +
      '<h1 class="sheet-name" tabindex="-1" data-focus>Flawless Founder Frankie</h1>' +
      '<p class="sheet-tag">The character we all aspire to be</p>' +
      '<p class="sheet-intro">You do exclusively high level work. Never burn out. You&rsquo;re the Buddha of business.</p></div></div>' +
      '<div class="frankie-end"><p>The world needs more people like you:</p>' +
      '<div class="frankie-actions"><button type="button" class="btn btn-light" data-share-quiz>Share the quiz</button>' +
      '<button type="button" class="btn btn-ghost-light" data-restart-report>Retake the quiz</button></div>' +
      '<p class="frankie-status" role="status"></p></div>' +
      '</section></div>';
  }

  function shareURL(key) { return location.origin + location.pathname + '#' + key; }
  function calendlyURL(key) {
    var pct = percentages();
    var mix = ORDER.slice().sort(function (x, y) { return (pct[y] - pct[x]) || ((y === key) - (x === key)); }).map(function (k) { return ARCH[k].short + ' ' + pct[k]; }).join(' / ');
    var parts = ['State Archetype: ' + ARCH[key].name, 'Mix: ' + mix, 'Most important: ' + (priority ? PRIORITIES[priority].label : 'not picked')];
    return CALENDLY + '?a1=' + encodeURIComponent(parts.join(' | '));
  }

  /* --------------------------------------------------------------- events */
  function bind() {
    var start = stage.querySelector('[data-start]');
    if (start) start.addEventListener('click', function () { go('q0'); });
    var b = stage.querySelector('[data-back]');
    if (b) b.addEventListener('click', back);
    var skip = stage.querySelector('[data-skip]');
    if (skip) skip.addEventListener('click', function () {
      s2[Number(current.slice(1)) - STATEMENTS.length] = null;
      go(nextOf(current));
    });

    stage.querySelectorAll('[data-freq]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        s1[Number(current.slice(1))] = Number(btn.getAttribute('data-freq'));
        stage.querySelectorAll('[data-freq]').forEach(function (x) { x.setAttribute('aria-pressed', x === btn); });
        setTimeout(function () { go(nextOf(current)); }, 200);
      });
    });
    stage.querySelectorAll('[data-scen]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        s2[Number(current.slice(1)) - STATEMENTS.length] = btn.getAttribute('data-scen');
        stage.querySelectorAll('[data-scen]').forEach(function (x) { x.setAttribute('aria-pressed', x === btn); });
        setTimeout(function () { go(nextOf(current)); }, 220);
      });
    });

    stage.querySelectorAll('[data-prio]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        priority = btn.getAttribute('data-prio');
        stage.querySelectorAll('[data-prio]').forEach(function (x) { x.setAttribute('aria-selected', x === btn); });
        var panel = stage.querySelector('#prio-panel');
        panel.innerHTML = PRIORITIES[priority].html;
        panel.setAttribute('aria-labelledby', 'tab-' + priority);
        var book = stage.querySelector('[data-book]');
        if (book) book.href = calendlyURL(primary());
        var cost = stage.querySelector('[data-cost]');
        if (cost) cost.textContent = costPhrase();
      });
    });

    var again = stage.querySelector('[data-restart-report]');
    if (again) again.addEventListener('click', restart);
    var shareQuiz = stage.querySelector('[data-share-quiz]');
    if (shareQuiz) shareQuiz.addEventListener('click', function () {
      var url = location.origin + location.pathname, status = stage.querySelector('.frankie-status');
      try {
        navigator.clipboard.writeText(url).then(function () { status.textContent = 'Quiz link copied: ' + url; },
          function () { status.textContent = 'Copy this link: ' + url; });
      } catch (e) { status.textContent = 'Copy this link: ' + url; }
    });
    var share = stage.querySelector('[data-share]');
    if (share) share.addEventListener('click', function () {
      var url = shareURL(share.getAttribute('data-share'));
      var status = stage.querySelector('.share-status');
      var fallback = function () {
        var box = stage.querySelector('.share-fallback'); box.classList.add('show');
        var inp = box.querySelector('input'); inp.focus(); inp.select();
        status.textContent = 'Copy this link to share your character (your percentages aren’t included).';
      };
      try {
        navigator.clipboard.writeText(url).then(function () { status.textContent = 'Link copied. It shows your character, without your percentages.'; }, fallback);
      } catch (e) { fallback(); }
    });
  }

  document.querySelector('[data-restart]').addEventListener('click', restart);
  var motionBtn = document.querySelector('[data-motion]');
  function setMotion(reduce) {
    document.documentElement.classList.toggle('reduce-motion', reduce);
    motionBtn.setAttribute('aria-pressed', reduce);
    motionBtn.textContent = reduce ? 'Motion reduced' : 'Reduce motion';
    try { localStorage.setItem('quizReduceMotion', reduce ? '1' : '0'); } catch (e) { /* ignore */ }
  }
  var saved = null;
  try { saved = localStorage.getItem('quizReduceMotion'); } catch (e) { /* ignore */ }
  setMotion(saved === '1' || (saved === null && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches));
  motionBtn.addEventListener('click', function () { setMotion(!document.documentElement.classList.contains('reduce-motion')); });

  // Number keys answer the current question (1 to 4 for statements, 1 to 5 for scenarios)
  document.addEventListener('keydown', function (e) {
    if (e.target && /INPUT|TEXTAREA/.test(e.target.tagName)) return;
    var n = parseInt(e.key, 10); if (!n) return;
    var btns = stage.querySelectorAll('[data-freq], [data-scen]');
    if (btns[n - 1]) btns[n - 1].click();
  });

  var hash = location.hash.slice(1);
  if (ARCH[hash]) { sharedKey = hash; go('shared', false); } else go('intro', false);
})();
