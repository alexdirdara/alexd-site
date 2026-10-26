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
      tag: 'Always reachable. Never quite off.',
      intro: "You're the one everyone can count on. The catch: you're at your kid's game, and also in your inbox.",
      signs: ['Your phone is always within arm’s reach', 'You draft replies in your head on days off', 'You scan for what might be breaking while you’re away'],
      strengths: ['People and clients can count on you, and you care about things going well', 'You notice problems early, before they get expensive', 'You take ownership instead of passing things off'],
      limits: ['Switching off feels unsafe, so rest doesn’t restore you', 'Your family gets part of you while the rest is in the inbox', 'The business leans on you, which keeps you on call'],
      trait: { name: 'Calm Radar', text: 'You keep your sharp read on what the business needs, from a settled state. You catch what matters without being on call for everything, so you’re fully present at the game and still the first to know when something actually needs you.' },
      obstacle: [
        'You’re the person people count on, and you catch problems early.',
        'But when a client email lands or something feels slightly off, your system flips into alert mode, and <strong>staying reachable starts to feel like the only safe option.</strong> One two-second ping can keep you on guard for the whole evening, or the whole weekend.',
        'Your discipline and your boundaries are fine. <strong>What decides the evening is the state you’re in when the ping arrives.</strong> Learn to return to a settled state on demand, and rest goes back under your control.'
      ],
      strategies: [
        ['Phone rules (“no phone after 7”)', 'Remove the trigger.', 'Fewer interruptions, and easy to start.', 'It holds until Thursday, when the email you’ve been dreading lands and you check “just once” at 7:40. The rule breaks right when the alert state kicks in.'],
        ['Delegating or building systems', 'If the business runs without me, I can relax.', 'Real resilience, and less actually on your plate.', 'The VA is great and everything’s covered, and you still check. Tuesday’s calm plan doesn’t survive Saturday’s “what if.”'],
        ['A week offline', 'A long enough break will reset me.', 'Real time away.', 'Day one is bliss. Day two you’re hunting for wifi. An hour after you land to 400 emails, you’re back on alert.']
      ],
      contrast: [
        ['The 7pm rule breaks at 7:40 on Thursday, the moment the dreaded email shows up.', 'You practice a 30-second reset for that exact moment, so Thursday at 7:40 is what you’re trained for.'],
        ['The VA has it covered, and you still check, because the urge doesn’t care what’s covered.', 'We work on the urge itself, in the moment it shows up, so a covered business finally feels covered.'],
        ['The calm from the trip is gone an hour after you open 400 emails.', 'The calm is built at your desk in daily reps, so it’s still there after the trip, because it never depended on the trip.']
      ]
    },
    bailey: {
      name: 'Busy Bee Bailey', short: 'Bailey',
      tag: 'A full day. The big thing still waiting.',
      intro: 'You’re comparing three new CRMs while the leads already in yours sit untouched. Busy, organized, and somehow still behind on the one thing that matters.',
      signs: ['Inbox, CRM or a tidy-up before the important call', 'A long done list, with the key task still untouched', 'A small knot of tension, then a sudden urge to organize'],
      strengths: ['You get a lot done and rarely sit idle', 'You keep systems, details and follow-ups in good shape', 'You have high capacity and keep moving'],
      limits: ['The task that would move things most keeps getting pushed back', 'Tension before high-stakes work sends you to easier tasks', 'Full days don’t always turn into progress'],
      trait: { name: 'Steady Closer', text: 'You can sit with the discomfort of the high-leverage task and do it first. Your organizing and follow-through then back up the important work instead of replacing it.' },
      obstacle: [
        'You keep things moving, and your systems and follow-ups are in great shape.',
        'But when the high-leverage moment arrives (the call, the ask, the follow-up), tension shows up and <strong>your system reaches for something easier.</strong> You can push through for stretches, then one awkward silence or rejection sends you back to the inbox for the rest of the day, or the week.',
        '<strong>What decides it is the state you’re in right as the important task begins.</strong> Settle that state, and the important thing goes first, with your organizing skills backing it up.'
      ],
      strategies: [
        ['Time blocking the hard task first', 'If it’s scheduled, I’ll do it.', 'Clear priorities, and a plan you believe in.', 'Calm you made the plan on Sunday night. At 8:55 on Monday, tense you opens the CRM “just to prep.”'],
        ['Sales training or call scripts', 'If I knew what to say, it wouldn’t feel so hard.', 'Real skill and confidence, on paper.', 'You know exactly what to say, and your stomach still drops when the phone starts ringing.'],
        ['An accountability partner or coach', 'Someone checking in will make me do it.', 'The calls get made while it lasts.', 'It works while someone’s checking in. Alone on a Wednesday afternoon, the urge to tidy something comes right back.']
      ],
      contrast: [
        ['Calm Sunday-night you made the plan. Tense Monday-morning you opens the CRM.', 'A 10-second practice at 8:55 shifts you into the state where the call already feels doable.'],
        ['You know the script, and your stomach still drops when the phone rings.', 'We work on the drop in your stomach, since you already know the words.'],
        ['It works while someone’s checking in. Alone on Wednesday, the tidy-up wins.', 'The shift happens inside you, so it works on a Wednesday afternoon with nobody watching.']
      ]
    },
    parker: {
      name: 'People Pleaser Parker', short: 'Parker',
      tag: 'Everyone’s happy. Except your margins.',
      intro: 'A client sounds a little flat, and suddenly there’s a discount, a free extra, and a fifth round of edits on work that was finished weeks ago.',
      signs: ['You replay a client’s tone of voice for hours', 'Your first instinct is a discount or a bonus', 'You send version five when version one was fine'],
      strengths: ['You read a room faster than most people', 'Clients feel heard and cared for', 'You hold a high standard for your work'],
      limits: ['You discount or add free work when a client seems unhappy', 'You polish long after the work is good enough', 'Being liked starts to feel like being okay'],
      trait: { name: 'Quiet Reader', text: 'You read people and anticipate their needs without feeling responsible for managing their feelings. Your relationships with family, clients and vendors get better, and your pricing and boundaries stop depending on someone’s mood.' },
      obstacle: [
        'You read people faster than most, and your clients feel it.',
        'But when a client sounds flat or an email comes back short, your system treats it as a threat, and <strong>you end up discounting, adding free work, or polishing one more round.</strong> One “ok, thanks” can throw off the rest of your afternoon.',
        'Your pricing and your confidence are fine on paper. <strong>What decides it is the state you’re in the moment someone seems displeased.</strong> Come back to steady in that moment, and your decisions stay yours instead of following your client’s mood.'
      ],
      strategies: [
        ['Therapy', 'Understand why I need to be liked so much.', 'Real insight, words for the pattern, and a safe place to talk.', 'The calm of Thursday’s 6pm session doesn’t make it to Monday at 9:05, when a client sounds upset and you’re back at your desk.'],
        ['Firm pricing and scope rules', 'If it’s written down, I won’t cave.', 'Structure that protects your time and income.', 'The policy says no discounts. Then the client sounds disappointed, and you offer “just this once” before the call ends.'],
        ['Morning routines and affirmations', 'Start the day confident and it’ll carry.', 'You walk in feeling strong.', 'The confidence from 7am lasts until the first client pushes back at 10:15. Then you’re reworking the proposal for free.']
      ],
      contrast: [
        ['Thursday’s insight doesn’t reach Monday at 9:05.', 'The practice happens on Monday at 9:05, at your desk, while the client is still on the line.'],
        ['The policy says no discounts. Then their voice drops and you offer “just this once.”', 'We train the moment their voice drops, so the policy you wrote is the one you keep.'],
        ['The confidence from your 7am routine lasts until the first pushback at 10:15.', 'You reset in the pushback moment itself, so you hold your ground when it counts.']
      ]
    },
    morgan: {
      name: 'Million Mask Morgan', short: 'Morgan',
      tag: 'Every role. All at once.',
      intro: 'Parent, founder, HR, accounting and client services, often before lunch. You’re short on structure and boundaries more than time, and the work you love keeps getting the leftovers.',
      signs: ['You change roles many times before lunch', 'You say yes to interruptions mid-task', 'You can’t remember your last long stretch on one thing'],
      strengths: ['You’re versatile and can step into almost any role', 'You’re resourceful and rarely stuck', 'Everyone knows you’ll handle it'],
      limits: ['Nothing gets deep enough for flow or enjoyment', 'Boundaries are loose, so everything lands on you', 'Constant switching leaves you worn out'],
      trait: { name: 'Fluid Focus', text: 'You still move easily between roles, but on purpose. You choose the mask, protect real stretches of deep work, and give each role your full attention instead of your leftovers.' },
      obstacle: [
        'You’re versatile and resourceful, the one who always gets it handled.',
        'But when an interruption arrives (a client ping, a kid at the door, a team question), your system treats it as urgent, <strong>you say yes, and you switch masks again.</strong> One interruption can unravel a well-planned morning, and the week looks the same.',
        'A better calendar won’t fix this on its own. <strong>What decides it is the state you’re in when someone needs you mid-task.</strong> Hold your ground in that moment, and you choose your roles instead of getting pulled into them.'
      ],
      strategies: [
        ['Time blocking or a planner app', 'Give every role its own slot.', 'A visible structure, and some protected deep work.', '9am says deep work. At 9:20 a client fire and a kid at the door arrive together, and the plan is gone.'],
        ['Batching (“all accounting on Friday”)', 'Fewer switches, less drain.', 'Clearer weeks with fewer context switches.', 'Friday brings one upset client, accounting slides to next week, and you’re back where you started.'],
        ['Hiring help or setting boundaries', 'Fewer roles on my plate.', 'Real relief, and fewer masks.', 'You hire the help and still step in to “just do it quickly.” The first “it’ll only take a minute” still gets a yes.']
      ],
      contrast: [
        ['9am says deep work. 9:20 brings a client fire and a kid at the door.', 'You practice a 10-second reset for the interruption itself, so you choose which mask to put on.'],
        ['One upset client on Friday, and accounting slides another week.', 'Practices for the moment pressure hits keep your plan running when Friday goes sideways.'],
        ['You hired help and still say yes to “it’ll only take a minute.”', 'We train a steady “give me 20 minutes,” so not now stops feeling like letting someone down.']
      ]
    },
    drew: {
      name: 'Double Downer Drew', short: 'Drew',
      tag: 'One more tool, and this time it’ll work.',
      intro: 'You spent $20k on marketing to avoid cold calls. Now another $30k tool looks easier than admitting a few weeks of calls might have landed ten clients for free.',
      signs: ['Another tool when the last one underdelivered', '“That’s how it was done at my old job”', 'Reluctance to look closely at what a purchase actually returned'],
      strengths: ['You’re loyal, disciplined and follow through', 'You’re willing to invest in growth', 'You value proven methods and don’t chase every shiny thing'],
      limits: ['A miss gets answered with more spending instead of a reset', 'Admitting a purchase didn’t work feels shameful', 'New approaches feel riskier than repeating familiar ones'],
      trait: { name: 'Clear-Eyed Investor', text: 'You keep the commitment and the willingness to invest, and you can look at results honestly and change course early. You test small, learn quickly, and put money behind what’s working.' },
      obstacle: [
        'You’re loyal, disciplined and willing to invest in growth.',
        'But when something you paid for underdelivers, admitting it feels like a verdict on you, so <strong>your system answers with more spending instead of a reset.</strong> Months of sound decisions, then one look at an invoice or a dashboard locks in a choice that costs more than the first one.',
        '<strong>What decides it is the state you’re in when you look at the result.</strong> Stay steady in that moment, and you change course early, before the bill gets bigger.'
      ],
      strategies: [
        ['A course on the tool you bought', 'Learn it properly and it’ll pay off.', 'Real skills, and the tool may genuinely improve.', 'You get better at the tool, but the question you’re avoiding, “did the first $10k work?”, isn’t in the curriculum.'],
        ['A bigger tool or an agency', 'The first one wasn’t enough, so go bigger.', 'Real expertise and fresh options.', 'A bigger commitment, made from the same place. The more you’ve put in, the harder “that didn’t work” is to say out loud.'],
        ['More of the old playbook', 'It worked at my old firm, so work it harder.', 'Familiar, disciplined, and proven somewhere.', 'It was proven somewhere with a team, a brand and a budget behind it. Doing more of it feels safe and keeps results flat.']
      ],
      contrast: [
        ['The course teaches the tool, and never asks whether the first $10k worked.', 'We work on the state that makes that question hard to ask, so you can ask it early.'],
        ['The bigger vendor is a bigger bet, made from the same place.', 'You look at the dashboard from a steady state and decide on results, before the next invoice.'],
        ['More of the old playbook feels safe and keeps results flat.', 'You stay steady enough to test something new on a small scale, and keep only what works.']
      ]
    }
  };

  // Section 1: interleaved so the scoring isn't obvious. Never/Rarely/Sometimes/Often = 0/1/2/3.
  var STATEMENTS = [
    ['avery', 'It’s Sunday afternoon at a family picnic. Your work phone suddenly buzzes, and you’re having a small crisis <em>not checking it</em>.'],
    ['bailey', 'When things slow down, you’re really good at finding 20 things to do. Somehow none of them <em>get you new clients</em>. (Whoops.)'],
    ['parker', 'One of your best clients made a weird face on a call during a pitch, and a week later you <em>can’t stop</em> trying to understand it.'],
    ['morgan', 'Founder, partner, parent, HR, sales, marketing. You’ve changed masks 5 times already, and it <em>isn’t even lunchtime</em>.'],
    ['drew', 'You spent $10k on a new marketing tool, and it sucked. You decide to try <em>another $10k tool</em> rather than consider cold calling.'],
    ['avery', 'On a day off, you spend half of it <em>compulsively checking</em> your phone.'],
    ['bailey', 'You crash onto your bed at the end of the day. You got a lot done, but your <em>pipeline hasn’t budged</em>.'],
    ['parker', 'Your client scoffs when you say the price of a new project. Your first instinct is to offer a <em>discount</em> or extra free services.'],
    ['morgan', 'You’re deep in a task, someone needs something, and you <em>say yes</em> anyway.'],
    ['drew', 'Each time you decide to try a 4-hour workday or take a long vacation, <em>guilt</em> from your old corporate bosses haunts you.'],
    ['avery', 'When you picture being fully offline for a week, you <em>feel panic</em>.'],
    ['bailey', 'Before a sales call or asking for money, you notice tension and <em>find something else</em> to do.'],
    ['parker', 'You keep polishing work long after it’s good enough. They <em>HAVE</em> to love it.'],
    ['morgan', 'You can’t remember the last time you did <em>one thing</em> for hours and enjoyed it.'],
    ['drew', 'You like things the way they are now. It’s <em>not worth the risk</em> of a new marketing or sales strategy.']
  ];
  var FREQ = ['Never', 'Rarely', 'Sometimes', 'Often'];

  // Section 2: pick one, +3 to that archetype. Options are listed in archetype order here and rotated per question on screen.
  var SCENARIOS = [
    ['A big proposal is due tomorrow, and it’s <em>9pm</em>.', 'You:', ['Keep going, then check email in bed', 'Clear small emails and the CRM first', 'Rewrite the intro a fifth time', 'Get pulled into a family or team thing and start at 10', 'Buy a tool or template to speed it up']],
    ['Lead flow <em>slowed</em> this month.', 'Your first move:', ['Work evenings and weekends to make up for it', 'Reorganize the pipeline and tidy your systems', 'Check in with past clients to make sure they’re happy', 'Say yes to anything that comes in, and fix everything else too', 'Put a bigger budget behind ads or tools']],
    ['Something you launched <em>isn’t getting traction</em>.', 'You:', ['Put in longer hours', 'Tweak the website and branding instead of reaching out', 'Ask friends if they like it, and soften the price', 'Can’t give it focus because of everything else', 'Put more money behind it']],
    ['A client is <em>slow to pay</em>.', 'You:', ['Check obsessively, and cover the gap with extra work', 'Avoid the awkward email and do other admin', 'Worry about pushing, and offer a discount', 'Forget about it between tasks', 'Look for a service or tool to chase it for you']],
    ['A friend suggests a <em>different way</em> to run your business.', 'You:', ['Think, “I don’t have time. It needs me.”', 'Agree, then get busy with other things', 'Wonder what they think of how you run it now', 'Add it to the pile', 'Stick with what’s worked, because change feels risky']]
  ];
  var TOTAL = STATEMENTS.length + SCENARIOS.length;

  var PRIORITIES = {
    money: {
      label: 'Money',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 3v18M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.3-4.5 3 2 2.6 4.5 3 4.5 1.4 4.5 3.2-2 3.3-4.5 3.3-4.5-1.4-4.5-3"/></svg>',
      html: '<p class="kicker">One client figured his hour was worth about $150, and guessed he lost around 5 hours a week to these patterns. That’s roughly $3,000 a month.</p>' +
            '<p>Then we looked at his actual days, and how often something knocked him out of his best state. <strong>It was closer to 2 hours a day. About 10 hours a week</strong>, and that’s the conservative count.</p>' +
            '<p>The bigger hits are rarer and heavier. When a deal you spent months on falls through, <strong>it can take weeks to get back to your best</strong>, and in the meantime busy work and distractions win.</p>'
    },
    time: {
      label: 'Time',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
      html: '<p class="kicker">Most clients don’t want more money. They want the hours they already work to count for more.</p>' +
            '<p>They <strong>finish faster and earn the same in less time.</strong> The hours that come back go to a partner, the kids, a drink with a friend, or the second vacation that keeps getting pushed.</p>' +
            '<p>Those 10 hours a week aren’t extra work. <strong>They’re evenings you get back.</strong></p>'
    },
    energy: {
      label: 'Energy',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>',
      html: '<p class="kicker">Even if the time and money don’t move you, your energy will. Getting it back means staying in control.</p>' +
            '<p>You do your best work, and <strong>your clients, team, vendors and family get the best version of you too.</strong></p>' +
            '<p>What changes is <strong>who shows up to do the work</strong>, more than how much of it you do.</p>'
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
      '<p class="q-help">A quick personality quiz. Go with your first instinct; there are no wrong answers. You&rsquo;ll get your character sheet along with some of your untapped potential.</p>' +
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
      '<p class="kicker">Every fix above was planned in a calm moment and needed in a tense one.</p>' +
      '<p>Your brain ties what you learn to the state you learned it in. A rule made on a calm Sunday night, or an insight from a quiet session, lives in that calm state. Then the ping, the silence or the invoice arrives, your system shifts, and the plan doesn&rsquo;t come with it.</p>' +
      '</div><div>' +
      '<p>The brain also drops what it doesn&rsquo;t use. Most of what you read or decide fades within days unless it&rsquo;s practiced.</p>' +
      '<p>So instead of building bigger plans and workflows, we put something small into the exact moments you need it: short practices you do at your desk, in your real day. Repeated up to 900 times in three months, they end up <strong>hardwiring the new behavior into the exact environment where you actually need it.</strong></p>' +
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
      '<div class="sub-head center"><h3>What matters most to you?</h3></div>' +
      '<div class="prio-tabs" role="tablist" aria-label="What matters most to you">' + Object.keys(PRIORITIES).map(function (p) {
        return '<button type="button" class="prio-tab" role="tab" id="tab-' + p + '" aria-controls="prio-panel" aria-selected="' + (priority === p) + '" data-prio="' + p + '">' + PRIORITIES[p].icon + PRIORITIES[p].label + '</button>';
      }).join('') + '</div>' +
      '<div class="prio-panel" id="prio-panel" role="tabpanel"' + (priority ? ' aria-labelledby="tab-' + priority + '"' : '') + '>' +
      (priority ? PRIORITIES[priority].html : '<p class="prio-hint">Pick one to see what changes.</p>') + '</div>' +
      '<div class="prio-trait"><p class="lead-line">And as ' + a.name + ', that&rsquo;s where you <strong>unlock your hidden trait:</strong></p>' + traitBox(a) + '</div>' +
      '</section>';

    // The invitation
    h += '<section><div class="closing invite">' +
      '<h2>Being ' + a.name + ' works.</h2>' +
      '<p>It&rsquo;s gotten you this far in your business and your life. What I&rsquo;m offering isn&rsquo;t getting rid of ' + a.short + ', or changing who you are.</p>' +
      '<p>Learn how to work with ' + a.short + ' instead: keep the best traits, without it <strong data-cost>' + costPhrase() + '</strong>.</p>' +
      '<p>No elaborate morning routines or complex systems to try. Just simple, short practices you can do right in the moments you need them most.</p>' +
      '<p class="question">Learn how to unlock your hidden trait.</p>' +
      '<a class="btn btn-light" data-book href="' + calendlyURL(key) + '" target="_blank" rel="noopener">Book a free call about my results <span class="arrow" aria-hidden="true">&rarr;</span></a>' +
      '<p style="margin-top:16px;font-size:.9rem">Your archetype mix is added to the booking, so we can get straight to it.</p>' +
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
