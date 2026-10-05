/* QUE Stage website — the Experience demo.
   A small, browser-only imitation of QUE's LIVE + cue list. It never connects to a Hue Bridge or a QUE server.
   A cue here is a raw snapshot of every fixture (colour + level), like QUE's cues. */
(function () {
  'use strict';
  var Q = window.QueStage;
  var $ = function (id) { return document.getElementById(id); };

  function copy(o) { return JSON.parse(JSON.stringify(o)); }
  function lookOf(name) { return copy(Q.LOOKS[name]); }

  /* ======================= Recording frame (experience.html?reel) ======================= */
  var params = new URLSearchParams(location.search);
  if (params.has('reel')) { startReel(params.get('reel') || 'cues'); return; }

  /* ======================= Interactive demo ======================= */
  var STEPS = [
    'Press GO to run the first cue.',
    'Tap a light — on the stage or in the list.',
    'Give it a colour and a brightness.',
    'Press CAPTURE to save your look as a new cue.',
    'Press BLACKOUT. Then RELEASE.',
    'That is the whole idea: build looks, save cues, press GO.'
  ];

  function fresh() {
    return {
      look: lookOf('dark'),
      sel: ['fl'],
      now: -1,          // index of the cue on stage, -1 = none yet
      blackout: false,
      fadeMs: 0,
      step: 0,          // coach step 0..5
      sawBlackout: false,
      mine: 0,
      cues: [
        { name: 'Pre-show', fade: 3, look: lookOf('preshow') },
        { name: 'Morning', fade: 2.5, look: lookOf('morning') },
        { name: 'Alone', fade: 4, look: lookOf('alone') },
        { name: 'Storm', fade: 1.5, look: lookOf('storm') }
      ]
    };
  }
  var S = fresh();

  var stage = Q.create($('stage'), {
    interactive: true,
    label: 'Virtual stage. Tap a light to select it.',
    onPick: function (id) { pick([id]); }
  });

  // Fixture rows and colour swatches are built once, then updated.
  var rows = {};
  Q.FIXTURES.forEach(function (f) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'fx-row';
    b.innerHTML = '<i></i><span class="n"></span><span class="t"></span><span class="v"></span>';
    b.querySelector('.n').textContent = f.name;
    b.querySelector('.t').textContent = f.tag;
    b.addEventListener('click', function () { pick([f.id]); });
    $('fixtures').appendChild(b);
    rows[f.id] = b;
  });
  var swatches = {};
  Q.COLOURS.forEach(function (c) {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'sw';
    b.style.background = Q.css(Q.rgb(c.id));
    b.setAttribute('aria-label', c.name); b.title = c.name;
    b.addEventListener('click', function () { setColour(c.id); });
    $('swatches').appendChild(b);
    swatches[c.id] = b;
  });
  var dots = [];
  for (var i = 0; i < 5; i++) { dots.push(document.createElement('i')); $('dots').appendChild(dots[i]); }

  function advance(from) { if (S.step === from) S.step = from + 1; }

  function pick(ids) { S.sel = ids; advance(1); draw(); }

  function edit(patch, fadeMs) {
    S.sel.forEach(function (id) {
      if (patch.c != null) S.look[id][0] = patch.c;
      if (patch.lvl != null) S.look[id][1] = patch.lvl;
    });
    S.fadeMs = fadeMs;
    advance(2);
    draw();
  }
  function setColour(cid) {
    var first = S.look[S.sel[0]];
    // Picking a colour on a dark lamp also brings it up, so the change is visible.
    edit(first[1] > 0 ? { c: cid } : { c: cid, lvl: 70 }, 300);
  }

  function runCue(i) {
    var q = S.cues[i];
    S.look = copy(q.look); S.now = i; S.fadeMs = q.fade * 1000;
    advance(0);
    draw();
  }
  function nextIndex() { return S.now + 1 < S.cues.length ? S.now + 1 : -1; }

  $('go').addEventListener('click', function () { var n = nextIndex(); if (n >= 0) runCue(n); });
  $('back').addEventListener('click', function () { if (S.now > 0) runCue(S.now - 1); });
  $('select-all').addEventListener('click', function () { pick(Q.FIXTURES.map(function (f) { return f.id; })); });
  $('level').addEventListener('input', function (e) { edit({ lvl: Number(e.target.value) }, 120); });
  $('capture').addEventListener('click', function () {
    S.mine += 1;
    S.cues.push({ name: 'My look ' + S.mine, fade: 2, look: copy(S.look) });
    S.now = S.cues.length - 1;
    advance(3);
    draw();
  });
  // BLACKOUT sits above the cues: GO still moves through the list, the stage stays dark until RELEASE.
  $('blackout').addEventListener('click', function () {
    if (!S.blackout) { S.blackout = true; if (S.step === 4) S.sawBlackout = true; }
    else { S.blackout = false; S.fadeMs = 0; if (S.step === 4 && S.sawBlackout) S.step = 5; }
    draw();
  });
  $('restart').addEventListener('click', function () { S = fresh(); draw(); });

  function draw() {
    stage.render(S.look, { fadeMs: S.fadeMs, blackout: S.blackout, selected: S.sel });

    var done = S.step >= 5;
    $('coach-label').textContent = done ? 'TRY IT · DONE' : 'TRY IT · ' + (S.step + 1) + ' / 5';
    $('coach-text').textContent = STEPS[Math.min(S.step, 5)];
    dots.forEach(function (d, k) { d.className = k < S.step ? 'done' : (k === S.step ? 'cur' : ''); });

    // cue list
    var n = nextIndex(), ol = $('cues');
    ol.textContent = '';
    S.cues.forEach(function (q, k) {
      var li = document.createElement('li');
      if (k === S.now) li.className = 'now';
      li.innerHTML = '<span class="num"></span><span class="name"></span><span class="fade"></span><span class="tag"></span>';
      li.querySelector('.num').textContent = String(k + 1);
      li.querySelector('.name').textContent = q.name;
      li.querySelector('.fade').textContent = q.fade.toFixed(2) + ' s';
      if (k === S.now) li.querySelector('.tag').innerHTML = '<span class="pill now">NOW</span>';
      else if (k === n) li.querySelector('.tag').innerHTML = '<span class="pill next">NEXT</span>';
      ol.appendChild(li);
    });
    $('cue-count').textContent = S.cues.length + ' cues';

    // inspector
    var names = {};
    Q.FIXTURES.forEach(function (f) { names[f.id] = f.name; });
    $('sel-name').textContent = S.sel.length === 1 ? names[S.sel[0]] : S.sel.length + ' fixtures';
    Q.FIXTURES.forEach(function (f) {
      var v = S.look[f.id], on = !S.blackout && v[1] > 0, col = Q.css(Q.rgb(v[0]));
      var r = rows[f.id];
      r.setAttribute('aria-pressed', S.sel.indexOf(f.id) >= 0 ? 'true' : 'false');
      r.querySelector('i').style.background = on ? col : '';
      r.querySelector('i').style.boxShadow = on ? '0 0 10px ' + col : 'none';
      r.querySelector('.v').textContent = v[1] > 0 ? v[1] + ' %' : 'Off';
    });
    var first = S.look[S.sel[0]];
    var same = S.sel.every(function (id) { return S.look[id][0] === first[0]; });
    $('level').value = first[1];
    $('level-value').textContent = first[1] + ' %';
    Q.COLOURS.forEach(function (c) {
      var on = same && first[0] === c.id;
      swatches[c.id].setAttribute('aria-pressed', on ? 'true' : 'false');
      swatches[c.id].innerHTML = on ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4 10-10"/></svg>' : '';
    });

    // transport
    $('blackout').textContent = S.blackout ? 'RELEASE' : 'BLACKOUT';
    $('blackout').setAttribute('aria-pressed', S.blackout ? 'true' : 'false');
    $('bo-banner').hidden = !S.blackout;
    $('now').textContent = S.now >= 0 ? (S.now + 1) + '  ' + S.cues[S.now].name : '—';
    $('next').textContent = n >= 0 ? (n + 1) + '  ' + S.cues[n].name : 'End of list';
    $('go').disabled = n < 0;
    $('back').disabled = S.now <= 0;
  }
  draw();

  /* ======================= Reel ======================= */
  function startReel(name) {
    document.body.classList.add('reel-mode');
    $('reel').hidden = false;
    var frame = $('reel-frame');
    function fit() {
      var k = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
      frame.style.transform = 'scale(' + k + ')';
    }
    window.addEventListener('resize', fit); fit();

    var st = Q.create($('reel-stage'), { label: 'Virtual stage' });
    var cues = [
      { name: 'Pre-show', look: 'preshow', fade: 0 },
      { name: 'Morning', look: 'morning', fade: 2500 },
      { name: 'Alone', look: 'alone', fade: 3000 },
      { name: 'Storm', look: 'storm', fade: 1500 },
      { name: 'Calm', look: 'calm', fade: 2500 }
    ];
    // Each scenario is a list of [wait ms, action]. Captions stay short: the video is watched without sound.
    var SCENARIOS = {
      cues: {
        title: 'Run a light show<br>in your browser.',
        steps: [
          [1500, 'go'], [3000, 'go'], [3200, 'go'], [2800, 'go'], [3200, 'end']
        ],
        captions: ['Pick a light. Colour it. CAPTURE. GO.']
      },
      blackout: {
        title: 'One button.<br>Total darkness.',
        steps: [[1200, 'go'], [2800, 'go'], [2600, 'blackout'], [2600, 'release'], [2600, 'end']],
        captions: ['BLACKOUT is on screen at all times.']
      }
    };
    var sc = SCENARIOS[name] || SCENARIOS.cues;
    $('reel-title').innerHTML = sc.title;
    $('reel-caption').textContent = sc.captions[0];
    $('reel-bo').hidden = name !== 'blackout';

    var now, blackout, timer;
    function show() {
      var c = cues[now];
      st.render(lookOf(c.look), { fadeMs: c.fade, blackout: blackout });
      $('reel-bo').textContent = blackout ? 'RELEASE' : 'BLACKOUT';
      $('reel-bo').classList.toggle('on', !!blackout);
      $('reel-now').textContent = (now + 1) + '  ' + c.name;
      $('reel-next').textContent = now + 1 < cues.length ? (now + 2) + '  ' + cues[now + 1].name : 'End of list';
    }
    function press() {
      var g = $('reel-go');
      g.classList.add('pressed');
      setTimeout(function () { g.classList.remove('pressed'); }, 180);
    }
    function run(k) {
      if (k >= sc.steps.length) return;
      timer = setTimeout(function () {
        var a = sc.steps[k][1];
        if (a === 'go' && now + 1 < cues.length) { press(); now += 1; show(); }
        if (a === 'blackout') { blackout = true; show(); }
        if (a === 'release') { blackout = false; show(); }
        if (a === 'end') {
          $('reel-end').hidden = false;
          timer = setTimeout(restart, 2500);
          return;
        }
        run(k + 1);
      }, sc.steps[k][0]);
    }
    function restart() {
      clearTimeout(timer);
      $('reel-end').hidden = true;
      now = 0; blackout = false; show();
      run(0);
    }
    // R restarts the take, so a recording can start cleanly.
    document.addEventListener('keydown', function (e) { if (e.key === 'r' || e.key === 'R') restart(); });
    restart();
  }
})();
