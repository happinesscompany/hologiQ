/**
 * HOLOGIQ — Master Interactive Engine (Vanilla ES6+ JavaScript)
 * Zero external dependencies. Powers SPA routing, Black-Box puzzle,
 * SVG telemetry charts, Stakeholder tabs, Cognitive Passport, and Booking Engine.
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. SEO METADATA & VIEW ROUTER (#home, #science, #programmes, #schools, #book-experiment)
  // ==========================================================================
  const VIEW_META = {
    'home': {
      title: 'HOLOGIQ | Embedded Brain Engineering & Meta-Skills for Schools (Ages 8–19)',
      description: 'Stop rote memorisation and exam blank-outs. HOLOGIQ embeds "Learning How to Learn" brain engineering and 6 core human skills directly into your school timetable.'
    },
    'science': {
      title: 'The Science of Brain Engineering | How HOLOGIQ Rewires Learning',
      description: 'Discover why "Learning How to Learn" is brain engineering, not a study trick—and how HOLOGIQ solves exam blank-outs and builds self-sufficient humans.'
    },
    'programmes': {
      title: 'HOLOGIQ Curriculum | 6 Core Meta-Skill Programmes & AI/Finance Labs',
      description: 'Explore HOLOGIQ\'s age-adapted training modules for schools and colleges: Critical Thinking, Emotional Intelligence, Public Speaking, Career Direction, Leadership, and Growth Mindset.'
    },
    'schools': {
      title: 'Partner With HOLOGIQ | Embedded Brain-Engineering for Indian Schools',
      description: 'Integrate HOLOGIQ into your weekly school timetable. Boost board exam recall, fulfill NEP 2020 mandates, empower teachers, and win new admissions.'
    },
    'book-experiment': {
      title: 'Challenge HOLOGIQ | Book a Free 12-Minute Classroom Experiment',
      description: 'Pick 8 average students and challenge HOLOGIQ for 12 minutes during a free period. Experience live brain engineering in your own school before you decide.'
    }
  };

  const validViews = Object.keys(VIEW_META);
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const mobileStickyBar = document.getElementById('mobile-sticky-bar');

  function closeMobileDrawer() {
    if (!mobileDrawer || !mobileMenuToggle) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('drawer-open');
    if (hamburgerIcon) {
      hamburgerIcon.innerHTML =
        '<line x1="3" y1="6" x2="21" y2="6" />' +
        '<line x1="3" y1="12" x2="21" y2="12" />' +
        '<line x1="3" y1="18" x2="21" y2="18" />';
    }
  }

  function toggleMobileDrawer() {
    if (!mobileDrawer || !mobileMenuToggle) return;
    const isOpen = mobileDrawer.classList.contains('open');
    if (isOpen) {
      closeMobileDrawer();
    } else {
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('drawer-open');
      if (hamburgerIcon) {
        hamburgerIcon.innerHTML =
          '<line x1="6" y1="6" x2="18" y2="18" />' +
          '<line x1="6" y1="18" x2="18" y2="6" />';
      }
    }
  }

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileDrawer);
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileDrawer();
    }
  });

  function switchView(targetView, scrollUp = true) {
    const viewName = validViews.includes(targetView) ? targetView : 'home';

    // Toggle active view containers
    document.querySelectorAll('.app-view').forEach(function (el) {
      el.classList.remove('active-view');
    });
    const activeContainer = document.getElementById('view-' + viewName);
    if (activeContainer) {
      activeContainer.classList.add('active-view');
    }

    // Update desktop & mobile nav active states
    document.querySelectorAll('[data-nav-target]').forEach(function (link) {
      if (link.classList.contains('nav-tab-link') || link.classList.contains('mobile-nav-link')) {
        if (link.getAttribute('data-nav-target') === viewName) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });

    // Update SEO title & meta description
    const metaInfo = VIEW_META[viewName];
    if (metaInfo) {
      document.title = metaInfo.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', metaInfo.description);
      }
    }

    // Hide sticky mobile CTA bar on the booking page
    if (mobileStickyBar) {
      if (viewName === 'book-experiment') {
        mobileStickyBar.classList.add('hidden-bar');
      } else {
        mobileStickyBar.classList.remove('hidden-bar');
      }
    }

    closeMobileDrawer();

    if (scrollUp) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Handle all [data-nav-target] clicks
  document.querySelectorAll('[data-nav-target]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      const target = el.getAttribute('data-nav-target');
      const selectExp = el.getAttribute('data-select-exp');
      if (target && validViews.includes(target)) {
        e.preventDefault();
        if (window.location.hash !== '#' + target) {
          history.pushState(null, '', '#' + target);
        }
        switchView(target, true);
        if (selectExp) {
          selectExperimentProtocol(selectExp);
        }
      }
    });
  });

  window.addEventListener('hashchange', function () {
    const rawHash = window.location.hash.replace(/^#/, '').trim();
    if (validViews.includes(rawHash)) {
      switchView(rawHash, true);
    }
  });

  // Initial route check on page load
  const initialHash = window.location.hash.replace(/^#/, '').trim();
  if (validViews.includes(initialHash)) {
    switchView(initialHash, false);
  } else {
    switchView('home', false);
  }

  // ==========================================================================
  // 2. GRAPHIC 2: INTERACTIVE "15-SECOND BLACK-BOX (3 -> 6 -> 9)" BRAIN TRAP
  // ==========================================================================
  const bbForm = document.getElementById('blackbox-test-form');
  const bbNum1 = document.getElementById('bb-num-1');
  const bbNum2 = document.getElementById('bb-num-2');
  const bbNum3 = document.getElementById('bb-num-3');
  const bbLog = document.getElementById('blackbox-log');
  const bbRevealPanel = document.getElementById('blackbox-reveal');
  const bbRevealVerdict = document.getElementById('blackbox-reveal-verdict');

  function runBlackBoxSequenceTest(n1, n2, n3) {
    if (!bbLog) return;
    const isAscending = n1 < n2 && n2 < n3;
    const entry = document.createElement('div');
    entry.className = 'test-log-entry';

    const seqSpan = document.createElement('span');
    seqSpan.style.color = '#E2E8F0';
    seqSpan.textContent = 'TESTED: [ ' + n1 + ' \u2192 ' + n2 + ' \u2192 ' + n3 + ' ]';

    const badgeSpan = document.createElement('span');
    badgeSpan.style.fontWeight = '700';
    if (isAscending) {
      badgeSpan.style.color = '#5EEAD4';
      badgeSpan.textContent = 'PASS \u2713';
    } else {
      badgeSpan.style.color = '#FDA4AF';
      badgeSpan.textContent = 'FAIL \u2717 (Boundary Spotted!)';
    }

    entry.appendChild(seqSpan);
    entry.appendChild(badgeSpan);
    bbLog.insertBefore(entry, bbLog.firstChild);
  }

  if (bbForm) {
    bbForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const v1 = parseFloat(bbNum1.value);
      const v2 = parseFloat(bbNum2.value);
      const v3 = parseFloat(bbNum3.value);
      if (Number.isNaN(v1) || Number.isNaN(v2) || Number.isNaN(v3)) {
        return;
      }
      runBlackBoxSequenceTest(v1, v2, v3);
    });
  }

  // Quick-test pills inside Black-Box widget
  document.querySelectorAll('.quick-pill-btn[data-seq]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const parts = btn.getAttribute('data-seq').split(',').map(Number);
      if (parts.length === 3 && bbNum1 && bbNum2 && bbNum3) {
        bbNum1.value = parts[0];
        bbNum2.value = parts[1];
        bbNum3.value = parts[2];
        runBlackBoxSequenceTest(parts[0], parts[1], parts[2]);
      }
    });
  });

  // Rule Guess Option Buttons
  document.querySelectorAll('.guess-btn[data-guess]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const guessType = btn.getAttribute('data-guess');
      document.querySelectorAll('.guess-btn[data-guess]').forEach(function (b) {
        b.classList.remove('selected-trap', 'selected-correct');
      });

      if (guessType === 'correct-c') {
        btn.classList.add('selected-correct');
        if (bbRevealVerdict) {
          bbRevealVerdict.style.color = '#5EEAD4';
          bbRevealVerdict.textContent =
            '\u2713 BRILLIANT! YOU CRACKED THE BOUNDARY RULE (TOP 5% THINKER)';
        }
      } else if (guessType === 'trap-a' || guessType === 'trap-b') {
        btn.classList.add('selected-trap');
        if (bbRevealVerdict) {
          bbRevealVerdict.style.color = '#FDA4AF';
          bbRevealVerdict.textContent =
            '\u26A0 YOU HIT THE TEXTBOOK PATTERN TRAP (JUST LIKE 95% OF STUDENTS!)';
        }
      } else {
        if (bbRevealVerdict) {
          bbRevealVerdict.style.color = '#FDBA74';
          bbRevealVerdict.textContent =
            'DIAGNOSTIC COMPLETE // COGNITIVE TRAP EXPOSED';
        }
      }

      if (bbRevealPanel) {
        bbRevealPanel.classList.add('visible');
      }
    });
  });

  // ==========================================================================
  // 3. INTERACTIVE 4-STAKEHOLDER RELIEF SWITCHER (HOME SECTION 1.4)
  // ==========================================================================
  const stakeholderTabs = Array.from(document.querySelectorAll('.stakeholder-tab-btn'));

  function activateStakeholderTab(targetKey) {
    stakeholderTabs.forEach(function (tab) {
      const isMatch = tab.getAttribute('data-stakeholder') === targetKey;
      tab.classList.toggle('active', isMatch);
      tab.setAttribute('aria-selected', isMatch ? 'true' : 'false');
    });

    document.querySelectorAll('.stakeholder-panel').forEach(function (panel) {
      const isMatch = panel.id === 'panel-' + targetKey;
      panel.classList.toggle('active', isMatch);
    });
  }

  stakeholderTabs.forEach(function (tab, idx) {
    tab.addEventListener('click', function () {
      activateStakeholderTab(tab.getAttribute('data-stakeholder'));
    });

    tab.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const nextTab = stakeholderTabs[(idx + 1) % stakeholderTabs.length];
        nextTab.focus();
        activateStakeholderTab(nextTab.getAttribute('data-stakeholder'));
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prevTab = stakeholderTabs[(idx - 1 + stakeholderTabs.length) % stakeholderTabs.length];
        prevTab.focus();
        activateStakeholderTab(prevTab.getAttribute('data-stakeholder'));
      }
    });
  });

  // ==========================================================================
  // 4. GRAPHIC 5: 4-STEP "LEARNING HOW TO LEARN" CONTINUOUS FEEDBACK LOOP
  // ==========================================================================
  const LOOP_STEP_DATA = {
    '1': {
      indicator: 'ACTIVE: STEP 01 // OBSERVE',
      tag: 'STEP 01 \u2022 OBSERVE (DECODE THE TASK \u2014 #1D4ED8)',
      title: 'Pause for 10 Seconds Before Jumping In',
      copy: 'Ask: What kind of problem is this, what are the real rules, and how is my emotion reacting right now? Instead of blind pattern-copying, the prefrontal cortex scans the actual structure of the task.',
      borderColor: '#38BDF8'
    },
    '2': {
      indicator: 'ACTIVE: STEP 02 // ENGINEER',
      tag: 'STEP 02 \u2022 ENGINEER (BUILD THE APPROACH \u2014 #1D4ED8)',
      title: 'Break Unfamiliar Tasks Into First-Principles Parts',
      copy: 'Break the unfamiliar task into small, logical parts, connect it to real-life cause-and-effect, and design a clear mental strategy before writing a single word.',
      borderColor: '#38BDF8'
    },
    '3': {
      indicator: 'ACTIVE: STEP 03 // TEST',
      tag: 'STEP 03 \u2022 TEST (TRY & SPOT GAPS \u2014 #EA580C)',
      title: 'Practise Under Live Timed Simulation & Hunt for Boundaries (\u2717)',
      copy: 'Put the strategy into action under live constraints and intentionally test boundaries (FAIL \u2717) to see clearly where mistakes or friction happen.',
      borderColor: '#EA580C'
    },
    '4': {
      indicator: 'ACTIVE: STEP 04 // SELF-FIX',
      tag: 'STEP 04 \u2022 SELF-FIX (UPGRADE & ADAPT \u2014 #0D9488)',
      title: 'Regulate Frustration in 5 Seconds & Lock In the Upgrade',
      copy: 'Regulate frustration in seconds, adjust the method based on feedback, and master the task twice as fast on the next round.',
      borderColor: '#14B8A6'
    }
  };

  function selectLoopStep(stepNum) {
    const data = LOOP_STEP_DATA[String(stepNum)];
    if (!data) return;

    // Update step cards
    document.querySelectorAll('.loop-step-card').forEach(function (card) {
      card.classList.toggle('active', card.getAttribute('data-step') === String(stepNum));
    });

    // Update SVG node boxes
    for (let i = 1; i <= 4; i++) {
      const box = document.getElementById('svg-node-box-' + i);
      if (box) {
        if (String(i) === String(stepNum)) {
          box.setAttribute('fill', 'rgba(29, 78, 216, 0.3)');
          box.setAttribute('stroke-width', '2.8');
        } else {
          box.setAttribute('fill', '#111827');
          box.setAttribute('stroke-width', '1.5');
        }
      }
    }

    // Update detail readout box
    const ind = document.getElementById('loop-active-indicator');
    const tag = document.getElementById('loop-detail-tag');
    const title = document.getElementById('loop-detail-title');
    const copy = document.getElementById('loop-detail-copy');
    const box = document.getElementById('loop-detail-box');

    if (ind) ind.textContent = data.indicator;
    if (tag) {
      tag.textContent = data.tag;
      tag.style.color = data.borderColor;
    }
    if (title) title.textContent = data.title;
    if (copy) copy.textContent = data.copy;
    if (box) box.style.borderColor = data.borderColor;
  }

  document.querySelectorAll('.loop-step-card, .loop-svg-node').forEach(function (el) {
    el.addEventListener('click', function () {
      selectLoopStep(el.getAttribute('data-step'));
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectLoopStep(el.getAttribute('data-step'));
      }
    });
  });

  // ==========================================================================
  // 5. GRAPHIC 4: EXAM BLANK-OUT OSCILLOSCOPE TOGGLE (SCIENCE SECTION 2.4)
  // ==========================================================================
  const oscPathRote = document.getElementById('osc-path-rote');
  const oscPathHologiq = document.getElementById('osc-path-hologiq');

  document.querySelectorAll('.osc-toggle-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const mode = btn.getAttribute('data-osc-mode');
      document.querySelectorAll('.osc-toggle-btn').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });

      if (!oscPathRote || !oscPathHologiq) return;

      if (mode === 'rote') {
        oscPathRote.style.opacity = '1';
        oscPathHologiq.style.opacity = '0.15';
      } else if (mode === 'hologiq') {
        oscPathRote.style.opacity = '0.15';
        oscPathHologiq.style.opacity = '1';
      } else {
        oscPathRote.style.opacity = '1';
        oscPathHologiq.style.opacity = '1';
      }
    });
  });

  // ==========================================================================
  // 6. PROGRAMMES AGE-BAND FILTER TOGGLE (VIEW 3)
  // ==========================================================================
  const PROG_AGE_NOTES = {
    all: {
      '1': 'AGE CALIBRATION: 8\u201312 Pattern Detective Labs | 13\u201319 First-Principles & Bias Audits',
      '2': 'AGE CALIBRATION: 8\u201312 3-Sec Physical Reset Switch | 13\u201319 Exam Cortisol Regulation',
      '3': 'AGE CALIBRATION: 8\u201312 Breaking Stage Hesitation | 13\u201319 3-Finger Unscripted Debate & Viva',
      '4': 'AGE CALIBRATION: 8\u201312 Curiosity & Strength Discovery | 13\u201319 Stream & AI-Era Career Mapping',
      '5': 'AGE CALIBRATION: 8\u201312 Team Fairness & Role Sharing | 13\u201319 Crisis Simulation & Conflict Resolution',
      '6': 'AGE CALIBRATION: 8\u201312 Mistake-to-Feedback Games | 13\u201319 Rule-Mutation & Lateral Innovation'
    },
    foundational: {
      '1': 'FOUNDATIONAL LAB (AGES 8\u201312): Mystery Black-Box Rule Hunts & Curiosity Challenges',
      '2': 'FOUNDATIONAL LAB (AGES 8\u201312): The 3-Second Physical-Mental Reset Switch When Stuck',
      '3': 'FOUNDATIONAL LAB (AGES 8\u201312): Show-Without-Script Storytelling & Confident Eye Contact',
      '4': 'FOUNDATIONAL LAB (AGES 8\u201312): Discovering How My Brain Learns Best & Real-World Roles',
      '5': 'FOUNDATIONAL LAB (AGES 8\u201312): Rotating Squad Captains, Active Listening & Fair Play',
      '6': 'FOUNDATIONAL LAB (AGES 8\u201312): Celebrating "Smart Mistakes" as Clue Data in Team Sprints'
    },
    mastery: {
      '1': 'MASTERY & FUTURE LAB (AGES 13\u201319): WWII Ghost Data Audits, Cognitive Bias & Twisted Board Papers',
      '2': 'MASTERY & FUTURE LAB (AGES 13\u201319): Prefrontal Recall Protection Under High-Stakes Exam Clocks',
      '3': 'MASTERY & FUTURE LAB (AGES 13\u201319): Broken Teleprompter Curveball Speaking, Viva & Panel Defense',
      '4': 'MASTERY & FUTURE LAB (AGES 13\u201319): Cognitive Strength Audit, Stream Selection & AI-Proof Careers',
      '5': 'MASTERY & FUTURE LAB (AGES 13\u201319): High-Pressure Resource Allocation & Peer Conflict Resolution',
      '6': 'MASTERY & FUTURE LAB (AGES 13\u201319): Mid-Simulation Rule Mutation & First-Principles Prototyping'
    }
  };

  document.querySelectorAll('.age-filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const band = btn.getAttribute('data-age-band');
      document.querySelectorAll('.age-filter-btn').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });

      document.querySelectorAll('.track-stage-card').forEach(function (card) {
        const cardBand = card.getAttribute('data-track-card');
        if (band === 'all' || band === cardBand) {
          card.classList.add('highlighted');
          card.style.opacity = '1';
        } else {
          card.classList.remove('highlighted');
          card.style.opacity = '0.45';
        }
      });

      const notesMap = PROG_AGE_NOTES[band] || PROG_AGE_NOTES.all;
      document.querySelectorAll('[data-prog-note]').forEach(function (noteEl) {
        const key = noteEl.getAttribute('data-prog-note');
        if (notesMap[key]) {
          noteEl.textContent = notesMap[key];
          noteEl.style.color = band === 'all' ? 'var(--hq-text-muted)' : 'var(--hq-brand-cobalt)';
        }
      });
    });
  });

  // ==========================================================================
  // 7. GRAPHIC 7: COGNITIVE PASSPORT SCORECARD COHORT SWITCHER (VIEW 4)
  // ==========================================================================
  const PASSPORT_COHORTS = {
    gr9: {
      label: 'Student Cohort: Builder Lab (Grade 9 Assessment)',
      composite: '+73.8% VERIFIED',
      poly: '105,30 163,88 105,146 50,88',
      vals: ['+64%', '+78%', '+82%', '+71%'],
      widths: ['88%', '92%', '95%', '90%']
    },
    gr5: {
      label: 'Student Cohort: Foundation Lab (Grade 5 Assessment)',
      composite: '+76.2% VERIFIED',
      poly: '105,34 159,88 105,148 48,88',
      vals: ['+69%', '+74%', '+86%', '+76%'],
      widths: ['90%', '89%', '96%', '92%']
    },
    gr11: {
      label: 'Student Cohort: Launchpad Lab (Grade 11 Assessment)',
      composite: '+79.5% VERIFIED',
      poly: '105,26 166,88 105,144 46,88',
      vals: ['+72%', '+84%', '+80%', '+82%'],
      widths: ['92%', '96%', '93%', '94%']
    }
  };

  document.querySelectorAll('.passport-cohort-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const cohortKey = btn.getAttribute('data-cohort');
      const data = PASSPORT_COHORTS[cohortKey];
      if (!data) return;

      document.querySelectorAll('.passport-cohort-btn').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });

      const labelEl = document.getElementById('passport-student-label');
      const compEl = document.getElementById('passport-composite-val');
      const polyEl = document.getElementById('passport-radar-poly');

      if (labelEl) labelEl.textContent = data.label;
      if (compEl) compEl.textContent = data.composite;
      if (polyEl) polyEl.setAttribute('points', data.poly);

      for (let i = 0; i < 4; i++) {
        const valEl = document.getElementById('p-val-' + (i + 1));
        const barEl = document.getElementById('p-bar-' + (i + 1));
        if (valEl) valEl.textContent = data.vals[i];
        if (barEl) barEl.style.width = data.widths[i];
      }
    });
  });

  // ==========================================================================
  // 8. SCHOOL LEADERSHIP FAQ ACCORDION (VIEW 4)
  // ==========================================================================
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');
      // Close other open items for clean ergonomics
      document.querySelectorAll('.faq-item').forEach(function (other) {
        other.classList.remove('open');
        const otherBtn = other.querySelector('.faq-trigger');
        const otherContent = other.querySelector('.faq-content');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        if (otherContent) otherContent.style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 32 + 'px';
      }
    });
  });

  // ==========================================================================
  // 9. VIEW 5: 4-EXPERIMENT SELECTOR + TIMELINE + 5-FIELD BOOKING FORM SYNC
  // ==========================================================================
  const EXPERIMENT_TIMELINES = {
    'exp-01': {
      badge: 'PROTOCOL 01: OUT-OF-SYLLABUS BLACK-BOX (GR 7\u201310)',
      grade: 'Grades 7\u20139',
      steps: [
        {
          time: 'MIN 00:00 \u2013 03:00 // EXPOSING THE ROTE REFLEX',
          copy: '8 average students test the 3 \u2192 6 \u2192 9 lock and get trapped inside "Multiples of 3" because they only test PASS patterns.',
          color: '#E11D48',
          textColor: '#FDA4AF'
        },
        {
          time: 'MIN 03:00 \u2013 07:00 // INSTALLING BOUNDARY TESTING (\u2717)',
          copy: 'Facilitator installs the 4-Step Loop (Observe \u2192 Engineer \u2192 Test FAIL \u2192 Self-Fix) with zero textbook theory.',
          color: '#38BDF8',
          textColor: '#38BDF8'
        },
        {
          time: 'MIN 07:00 \u2013 10:00 // LIVE RULE MUTATION CHALLENGE',
          copy: 'The system rule mutates silently under a 180-second clock; students collaborate and hunt for disconfirming evidence.',
          color: '#EA580C',
          textColor: '#FDBA74'
        },
        {
          time: 'MIN 10:00 \u2013 12:00 // UNSCRIPTED PRINCIPAL DEFENSE',
          copy: 'Your quietest student stands up and explains the exact hidden rule to you using the 3-Finger Articulation Reflex.',
          color: '#14B8A6',
          textColor: '#5EEAD4'
        }
      ]
    },
    'exp-02': {
      badge: 'PROTOCOL 02: RIGGED JUDGE EMOTIONAL RESET (GR 4\u20136)',
      grade: 'Grades 4\u20136',
      steps: [
        {
          time: 'MIN 00:00 \u2013 03:00 // SURPRISE RULE CHANGE UNDER CLOCK',
          copy: 'Students begin a fast-paced tower/pattern sprint when the facilitator suddenly changes the scoring rule mid-round.',
          color: '#E11D48',
          textColor: '#FDA4AF'
        },
        {
          time: 'MIN 03:00 \u2013 06:00 // THE 3-SECOND PHYSICAL-MENTAL RESET',
          copy: 'Instead of freezing or complaining "Unfair!", students learn the 3-Second Cortisol Reset Switch (Breathe \u2192 Label \u2192 Pivot).',
          color: '#38BDF8',
          textColor: '#38BDF8'
        },
        {
          time: 'MIN 06:00 \u2013 09:30 // CHAOS SIMULATION ROUND 2',
          copy: 'Two more curveball constraints are thrown live; watch all 8 students reset in 3 seconds and re-engineer their strategy calmly.',
          color: '#EA580C',
          textColor: '#FDBA74'
        },
        {
          time: 'MIN 09:30 \u2013 12:00 // EXAM HALL TRANSFER REFLECTION',
          copy: 'Students demonstrate how they will use the exact same 3-Second Reset Switch when a tough exam question surprises them.',
          color: '#14B8A6',
          textColor: '#5EEAD4'
        }
      ]
    },
    'exp-03': {
      badge: 'PROTOCOL 03: BROKEN TELEPROMPTER SPEAKING TEST (GR 7\u20139)',
      grade: 'Grades 7\u20139',
      steps: [
        {
          time: 'MIN 00:00 \u2013 03:00 // WIPING THE MEMORISED SCRIPT',
          copy: 'A shy student is given a paragraph on the board, then it is wiped away after 15 seconds\u2014exposing why rote speeches cause stage freeze.',
          color: '#E11D48',
          textColor: '#FDA4AF'
        },
        {
          time: 'MIN 03:00 \u2013 06:30 // THE 3-FINGER SPEAKING ARCHITECTURE',
          copy: 'We install the 3-Finger Anchor (Finger 1: Core Claim \u2192 Finger 2: Real-Life Example \u2192 Finger 3: Action Takeaway).',
          color: '#38BDF8',
          textColor: '#38BDF8'
        },
        {
          time: 'MIN 06:30 \u2013 10:00 // PRINCIPAL CURVEBALL CHALLENGE',
          copy: 'You personally shout random curveball words from the back of the room while the student weaves them smoothly into their speech.',
          color: '#EA580C',
          textColor: '#FDBA74'
        },
        {
          time: 'MIN 10:00 \u2013 12:00 // ZERO-SCRIPT VIVA MASTERY',
          copy: 'All 8 students deliver a 45-second structured defense on an unseen topic with confident eye contact and zero paper notes.',
          color: '#14B8A6',
          textColor: '#5EEAD4'
        }
      ]
    },
    'exp-04': {
      badge: 'PROTOCOL 04: INVISIBLE GRAVEYARD BIAS AUDIT (GR 10\u201312)',
      grade: 'Grades 10\u201312',
      steps: [
        {
          time: 'MIN 00:00 \u2013 03:00 // THE WWII ENGINEERING TRAP',
          copy: 'Senior students inspect returning aircraft damage data and 95% vote to armour the exact wrong wing sections.',
          color: '#E11D48',
          textColor: '#FDA4AF'
        },
        {
          time: 'MIN 03:00 \u2013 06:30 // INSTALLING THE GHOST DATA AUDIT',
          copy: 'Students discover Abraham Wald\u2019s Survivorship Bias principle: always audit the invisible data that never made it back.',
          color: '#38BDF8',
          textColor: '#38BDF8'
        },
        {
          time: 'MIN 06:30 \u2013 10:00 // AI HALLUCINATION & CAREER HYPE AUDIT',
          copy: 'Teams apply the Ghost Data Audit to a real AI-generated claim and a viral career statistic, spotting 3 hidden flaws in 90 seconds.',
          color: '#EA580C',
          textColor: '#FDBA74'
        },
        {
          time: 'MIN 10:00 \u2013 12:00 // FIRST-PRINCIPLES EXECUTIVE BRIEFING',
          copy: 'Students present a crisp boardroom-style risk audit to the Principal.',
          color: '#14B8A6',
          textColor: '#5EEAD4'
        }
      ]
    }
  };

  const expCards = document.querySelectorAll('.exp-selector-card');
  const expSelectDropdown = document.getElementById('book-experiment-select');
  const gradeHiddenInput = document.getElementById('book-grade-input');
  const gradePillBtns = document.querySelectorAll('.grade-pill-btn');
  const timelineBadge = document.getElementById('timeline-exp-badge');
  const timelineContainer = document.getElementById('timeline-steps-container');

  function setGradePill(gradeValue) {
    if (gradeHiddenInput) gradeHiddenInput.value = gradeValue;
    gradePillBtns.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-grade') === gradeValue);
    });
  }

  function selectExperimentProtocol(expId) {
    // Highlight matching card
    expCards.forEach(function (card) {
      const isSelected = card.getAttribute('data-exp-id') === expId;
      card.classList.toggle('selected', isSelected);
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });

    // Sync dropdown
    if (expSelectDropdown && expSelectDropdown.value !== expId) {
      expSelectDropdown.value = expId;
    }

    // Update timeline & grade group pill
    const tData = EXPERIMENT_TIMELINES[expId];
    if (tData) {
      setGradePill(tData.grade);
      if (timelineBadge) timelineBadge.textContent = tData.badge;
      if (timelineContainer) {
        timelineContainer.innerHTML = tData.steps
          .map(function (step) {
            return (
              '<div class="timeline-step-item" style="border-left-color: ' +
              step.color +
              ';">' +
              '<div class="telemetry-eyebrow" style="color: ' +
              step.textColor +
              ';">' +
              step.time +
              '</div>' +
              '<p style="font-size: 0.85rem; color: #E2E8F0; margin-top: 0.25rem;">' +
              step.copy +
              '</p>' +
              '</div>'
            );
          })
          .join('');
      }
    }
  }

  expCards.forEach(function (card) {
    card.addEventListener('click', function () {
      selectExperimentProtocol(card.getAttribute('data-exp-id'));
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectExperimentProtocol(card.getAttribute('data-exp-id'));
      }
    });
  });

  if (expSelectDropdown) {
    expSelectDropdown.addEventListener('change', function () {
      selectExperimentProtocol(expSelectDropdown.value);
    });
  }

  gradePillBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setGradePill(btn.getAttribute('data-grade'));
    });
  });

  // Booking Form Validation & Submission
  const bookingForm = document.getElementById('experiment-booking-form');
  const bookName = document.getElementById('book-name');
  const bookSchool = document.getElementById('book-school');
  const bookPhone = document.getElementById('book-phone');
  const confirmBox = document.getElementById('booking-confirmation-box');
  const summaryText = document.getElementById('booking-summary-text');
  const whatsappConfirmLink = document.getElementById('whatsapp-confirm-link');
  const whatsappDirectBtn = document.getElementById('whatsapp-direct-btn');
  const resetBookingBtn = document.getElementById('reset-booking-btn');

  function buildWhatsAppUrl() {
    const nameVal = (bookName && bookName.value.trim()) || 'School Leadership';
    const schoolVal = (bookSchool && bookSchool.value.trim()) || 'Our Campus';
    const phoneVal = (bookPhone && bookPhone.value.trim()) || 'Not provided';
    const expText =
      expSelectDropdown && expSelectDropdown.options[expSelectDropdown.selectedIndex]
        ? expSelectDropdown.options[expSelectDropdown.selectedIndex].text
        : '12-Minute Classroom Experiment';
    const gradeVal = (gradeHiddenInput && gradeHiddenInput.value) || 'Grades 7–9';

    const message =
      'Hello HOLOGIQ Academic Team,\n\n' +
      'We would like to schedule the Free 12-Minute Live Classroom Experiment at our campus:\n' +
      '• Name & Role: ' + nameVal + '\n' +
      '• Institution & City: ' + schoolVal + '\n' +
      '• Contact: ' + phoneVal + '\n' +
      '• Selected Experiment: ' + expText + '\n' +
      '• Preferred Grade Group: ' + gradeVal + '\n\n' +
      'Please share available slots for a 15-minute free period.';

    return 'https://wa.me/919481369078?text=' + encodeURIComponent(message);
  }

  function validateBookingForm() {
    let valid = true;

    const errName = document.getElementById('err-book-name');
    if (!bookName || bookName.value.trim().length < 2) {
      valid = false;
      if (bookName) bookName.classList.add('input-error');
      if (errName) errName.classList.add('visible');
    } else {
      bookName.classList.remove('input-error');
      if (errName) errName.classList.remove('visible');
    }

    const errSchool = document.getElementById('err-book-school');
    if (!bookSchool || bookSchool.value.trim().length < 2) {
      valid = false;
      if (bookSchool) bookSchool.classList.add('input-error');
      if (errSchool) errSchool.classList.add('visible');
    } else {
      bookSchool.classList.remove('input-error');
      if (errSchool) errSchool.classList.remove('visible');
    }

    const errPhone = document.getElementById('err-book-phone');
    const digitsOnly = bookPhone ? bookPhone.value.replace(/\D/g, '') : '';
    if (digitsOnly.length < 10) {
      valid = false;
      if (bookPhone) bookPhone.classList.add('input-error');
      if (errPhone) errPhone.classList.add('visible');
    } else {
      bookPhone.classList.remove('input-error');
      if (errPhone) errPhone.classList.remove('visible');
    }

    return valid;
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateBookingForm()) return;

      const expText =
        expSelectDropdown && expSelectDropdown.options[expSelectDropdown.selectedIndex]
          ? expSelectDropdown.options[expSelectDropdown.selectedIndex].text
          : '12-Minute Classroom Experiment';
      const gradeVal = (gradeHiddenInput && gradeHiddenInput.value) || 'Grades 7–9';

      if (summaryText) {
        summaryText.innerHTML =
          'Thank you, <strong>' +
          bookName.value.trim() +
          '</strong> (' +
          bookSchool.value.trim() +
          '). Your request for <strong>' +
          expText +
          '</strong> with 8 students from <strong>' +
          gradeVal +
          '</strong> is ready. Our founding academic team will coordinate your 15-minute slot on WhatsApp (' +
          bookPhone.value.trim() +
          ').';
      }

      if (whatsappConfirmLink) {
        whatsappConfirmLink.href = buildWhatsAppUrl();
      }

      bookingForm.style.display = 'none';
      if (confirmBox) {
        confirmBox.classList.add('visible');
      }
    });
  }

  if (whatsappDirectBtn) {
    whatsappDirectBtn.addEventListener('click', function () {
      window.open(buildWhatsAppUrl(), '_blank', 'noopener,noreferrer');
    });
  }

  if (resetBookingBtn) {
    resetBookingBtn.addEventListener('click', function () {
      if (confirmBox) confirmBox.classList.remove('visible');
      if (bookingForm) bookingForm.style.display = 'block';
    });
  }
})();
