/* QUE Stage website: the virtual stage.
   Draws a small theatre with six lights and a wooden mannequin, all in the browser.
   It never talks to a Hue Bridge or a QUE server: it only shows what the lights would do. */
(function () {
  'use strict';

  const FIGURE_PARTS = [
    '<path class="b" d="M54.4 34.0 Q53.9 47.0 53.4 60.0 A6.6 6.6 0 0 1 66.6 60.0 Q66.1 47.0 65.6 34.0 A5.6 5.6 0 0 1 54.4 34.0Z"/><path d="M54.4 34.0 Q53.9 47.0 53.4 60.0 A6.6 6.6 0 0 1 66.6 60.0 Q66.1 47.0 65.6 34.0 A5.6 5.6 0 0 1 54.4 34.0Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M40 166 A9 9 0 1 0 58 166 A9 9 0 1 0 40 166Z"/><path d="M40 166 A9 9 0 1 0 58 166 A9 9 0 1 0 40 166Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M62 164 A9 9 0 1 0 80 164 A9 9 0 1 0 62 164Z"/><path d="M62 164 A9 9 0 1 0 80 164 A9 9 0 1 0 62 164Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M38.5 165.9 Q38.9 206.4 41.0 246.9 A7 7 0 0 1 55.0 247.1 Q58.1 206.6 59.5 166.1 A10.5 10.5 0 0 1 38.5 165.9Z"/><path d="M38.5 165.9 Q38.9 206.4 41.0 246.9 A7 7 0 0 1 55.0 247.1 Q58.1 206.6 59.5 166.1 A10.5 10.5 0 0 1 38.5 165.9Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M41.0 247.0 Q41.6 282.5 43.8 318.0 A4.2 4.2 0 0 1 52.2 318.0 Q54.4 282.5 55.0 247.0 A7 7 0 0 1 41.0 247.0Z"/><path d="M41.0 247.0 Q41.6 282.5 43.8 318.0 A4.2 4.2 0 0 1 52.2 318.0 Q54.4 282.5 55.0 247.0 A7 7 0 0 1 41.0 247.0Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M60.5 164.5 Q63.4 204.5 68.0 244.3 A7 7 0 0 1 82.0 243.7 Q82.6 203.5 81.5 163.5 A10.5 10.5 0 0 1 60.5 164.5Z"/><path d="M60.5 164.5 Q63.4 204.5 68.0 244.3 A7 7 0 0 1 82.0 243.7 Q82.6 203.5 81.5 163.5 A10.5 10.5 0 0 1 60.5 164.5Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M68.0 244.1 Q69.1 280.1 71.8 316.1 A4.2 4.2 0 0 1 80.2 315.9 Q81.9 279.9 82.0 243.9 A7 7 0 0 1 68.0 244.1Z"/><path d="M68.0 244.1 Q69.1 280.1 71.8 316.1 A4.2 4.2 0 0 1 80.2 315.9 Q81.9 279.9 82.0 243.9 A7 7 0 0 1 68.0 244.1Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M43 315 C40 322 36 327 33 329 C31 331 33 333 37 333 L54 333 C55 328 54 321 53 315 Z"/><path d="M43 315 C40 322 36 327 33 329 C31 331 33 333 37 333 L54 333 C55 328 54 321 53 315 Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M71 313 C70 320 70 327 71 333 L88 333 C92 333 93 330 90 328 C86 325 82 320 81 313 Z"/><path d="M71 313 C70 320 70 327 71 333 L88 333 C92 333 93 330 90 328 C86 325 82 320 81 313 Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M44 140 C51 134 69 133 76 139 C81 144 81 156 77 166 C73 176 66 181 60 181 C54 181 47 177 43 167 C39 157 39 145 44 140 Z"/><path d="M44 140 C51 134 69 133 76 139 C81 144 81 156 77 166 C73 176 66 181 60 181 C54 181 47 177 43 167 C39 157 39 145 44 140 Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M50 112 C56 110 64 110 70 112 C72 120 72 130 69 138 C64 141 56 141 51 138 C48 130 48 120 50 112 Z"/><path d="M50 112 C56 110 64 110 70 112 C72 120 72 130 69 138 C64 141 56 141 51 138 C48 130 48 120 50 112 Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M41 58 C48 52 72 52 79 58 C84 63 83 80 80 94 C77 108 70 116 60 116 C50 116 43 108 40 94 C37 80 36 63 41 58 Z"/><path d="M41 58 C48 52 72 52 79 58 C84 63 83 80 80 94 C77 108 70 116 60 116 C50 116 43 108 40 94 C37 80 36 63 41 58 Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M30.0 61.4 Q27.8 88.9 27.0 116.5 A5 5 0 0 1 37.0 117.5 Q41.2 90.1 44.0 62.6 A7 7 0 0 1 30.0 61.4Z"/><path d="M30.0 61.4 Q27.8 88.9 27.0 116.5 A5 5 0 0 1 37.0 117.5 Q41.2 90.1 44.0 62.6 A7 7 0 0 1 30.0 61.4Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M27.0 117.1 Q27.9 138.6 29.6 160.1 A3.4 3.4 0 0 1 36.4 159.9 Q37.1 138.4 37.0 116.9 A5 5 0 0 1 27.0 117.1Z"/><path d="M27.0 117.1 Q27.9 138.6 29.6 160.1 A3.4 3.4 0 0 1 36.4 159.9 Q37.1 138.4 37.0 116.9 A5 5 0 0 1 27.0 117.1Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M76.0 61.8 Q79.3 88.3 84.0 114.6 A5 5 0 0 1 94.0 113.4 Q92.7 86.7 90.0 60.2 A7 7 0 0 1 76.0 61.8Z"/><path d="M76.0 61.8 Q79.3 88.3 84.0 114.6 A5 5 0 0 1 94.0 113.4 Q92.7 86.7 90.0 60.2 A7 7 0 0 1 76.0 61.8Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M84.0 114.5 Q86.4 135.4 89.6 156.3 A3.4 3.4 0 0 1 96.4 155.7 Q95.6 134.6 94.0 113.5 A5 5 0 0 1 84.0 114.5Z"/><path d="M84.0 114.5 Q86.4 135.4 89.6 156.3 A3.4 3.4 0 0 1 96.4 155.7 Q95.6 134.6 94.0 113.5 A5 5 0 0 1 84.0 114.5Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M30 161 C28 166 28 174 29 180 C30 186 36 186 37 180 C38 174 38 166 36 161 Z"/><path d="M30 161 C28 166 28 174 29 180 C30 186 36 186 37 180 C38 174 38 166 36 161 Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M90 157 C89 162 90 170 92 176 C94 182 100 181 100 175 C99 168 98 161 96 157 Z"/><path d="M90 157 C89 162 90 170 92 176 C94 182 100 181 100 175 C99 168 98 161 96 157 Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M30 62 A7 7 0 1 0 44 62 A7 7 0 1 0 30 62Z"/><path d="M30 62 A7 7 0 1 0 44 62 A7 7 0 1 0 30 62Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M76 61 A7 7 0 1 0 90 61 A7 7 0 1 0 76 61Z"/><path d="M76 61 A7 7 0 1 0 90 61 A7 7 0 1 0 76 61Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M26.7 117 A5.3 5.3 0 1 0 37.3 117 A5.3 5.3 0 1 0 26.7 117Z"/><path d="M26.7 117 A5.3 5.3 0 1 0 37.3 117 A5.3 5.3 0 1 0 26.7 117Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M83.7 114 A5.3 5.3 0 1 0 94.3 114 A5.3 5.3 0 1 0 83.7 114Z"/><path d="M83.7 114 A5.3 5.3 0 1 0 94.3 114 A5.3 5.3 0 1 0 83.7 114Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M29.4 160 A3.6 3.6 0 1 0 36.6 160 A3.6 3.6 0 1 0 29.4 160Z"/><path d="M29.4 160 A3.6 3.6 0 1 0 36.6 160 A3.6 3.6 0 1 0 29.4 160Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M89.4 156 A3.6 3.6 0 1 0 96.6 156 A3.6 3.6 0 1 0 89.4 156Z"/><path d="M89.4 156 A3.6 3.6 0 1 0 96.6 156 A3.6 3.6 0 1 0 89.4 156Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M40.8 247 A7.2 7.2 0 1 0 55.2 247 A7.2 7.2 0 1 0 40.8 247Z"/><path d="M40.8 247 A7.2 7.2 0 1 0 55.2 247 A7.2 7.2 0 1 0 40.8 247Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M67.8 244 A7.2 7.2 0 1 0 82.2 244 A7.2 7.2 0 1 0 67.8 244Z"/><path d="M67.8 244 A7.2 7.2 0 1 0 82.2 244 A7.2 7.2 0 1 0 67.8 244Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M43.5 318 A4.5 4.5 0 1 0 52.5 318 A4.5 4.5 0 1 0 43.5 318Z"/><path d="M43.5 318 A4.5 4.5 0 1 0 52.5 318 A4.5 4.5 0 1 0 43.5 318Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M71.5 316 A4.5 4.5 0 1 0 80.5 316 A4.5 4.5 0 1 0 71.5 316Z"/><path d="M71.5 316 A4.5 4.5 0 1 0 80.5 316 A4.5 4.5 0 1 0 71.5 316Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>',
    '<path class="b" d="M60 2 C69 2 74 10 74 19 C74 30 67 40 60 40 C53 40 46 30 46 19 C46 10 51 2 60 2 Z"/><path d="M60 2 C69 2 74 10 74 19 C74 30 67 40 60 40 C53 40 46 30 46 19 C46 10 51 2 60 2 Z" fill="url(#queManVol)" stroke="#000" stroke-opacity=".35" stroke-width=".6"/>'
  ];

  // The six fixtures, in stage positions (what QUE calls fixtures, never bulbs).
  var FIXTURES = [
    { id: 'sl',  name: 'Side left',   tag: '#side',  x: '7%',  y: '9%' },
    { id: 'fl',  name: 'Front left',  tag: '#front', x: '30%', y: '9%' },
    { id: 'top', name: 'Top spot',    tag: '#top',   x: '50%', y: '9%' },
    { id: 'fr',  name: 'Front right', tag: '#front', x: '70%', y: '9%' },
    { id: 'sr',  name: 'Side right',  tag: '#side',  x: '93%', y: '9%' },
    { id: 'cyc', name: 'Cyc strip',   tag: '#cyc',   x: '84%', y: '67.2%' }
  ];

  // Palette colours (hue °, saturation %) taken from the QUE Library palettes.
  var COLOURS = [
    { id: 'white', name: 'Open white', h: 0, s: 0 },
    { id: 'warm', name: 'Warm white', h: 34, s: 28 },
    { id: 'amber', name: 'Amber', h: 36, s: 72 },
    { id: 'peach', name: 'Peach', h: 28, s: 42 },
    { id: 'coral', name: 'Coral', h: 10, s: 62 },
    { id: 'red', name: 'Red', h: 0, s: 92 },
    { id: 'magenta', name: 'Magenta', h: 310, s: 80 },
    { id: 'lavender', name: 'Lavender', h: 265, s: 48 },
    { id: 'deep', name: 'Deep blue', h: 228, s: 92 },
    { id: 'sky', name: 'Sky', h: 205, s: 60 },
    { id: 'ice', name: 'Ice', h: 195, s: 26 },
    { id: 'green', name: 'Green', h: 135, s: 70 }
  ];

  function rgb(colourId) {
    var c = COLOURS.filter(function (x) { return x.id === colourId; })[0] || COLOURS[0];
    var h = c.h, s = c.s / 100, x = s * (1 - Math.abs(((h / 60) % 2) - 1)), m = 1 - s;
    var r = 0, g = 0, b = 0;
    if (h < 60) { r = s; g = x; } else if (h < 120) { r = x; g = s; } else if (h < 180) { g = s; b = x; }
    else if (h < 240) { g = x; b = s; } else if (h < 300) { r = x; b = s; } else { r = s; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }
  function css(a) { return 'rgb(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')'; }

  // Ready-made looks: { fixtureId: [colourId, level %] }.
  var LOOKS = {
    preshow: { fl: ['amber', 0], fr: ['amber', 0], sl: ['peach', 0], sr: ['peach', 0], top: ['white', 0], cyc: ['deep', 35] },
    morning: { fl: ['amber', 85], fr: ['amber', 85], sl: ['peach', 45], sr: ['peach', 45], top: ['white', 0], cyc: ['sky', 60] },
    alone:   { fl: ['amber', 0], fr: ['amber', 0], sl: ['peach', 0], sr: ['peach', 0], top: ['white', 100], cyc: ['deep', 15] },
    storm:   { fl: ['ice', 25], fr: ['ice', 25], sl: ['ice', 80], sr: ['ice', 80], top: ['white', 0], cyc: ['lavender', 55] },
    calm:    { fl: ['warm', 60], fr: ['warm', 60], sl: ['lavender', 30], sr: ['lavender', 30], top: ['white', 0], cyc: ['magenta', 40] },
    dark:    { fl: ['amber', 0], fr: ['amber', 0], sl: ['peach', 0], sr: ['peach', 0], top: ['white', 0], cyc: ['deep', 0] }
  };

  function el(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }

  var figureCount = 0;

  /* Build a stage inside `host`.
     options.interactive: lights can be tapped (calls options.onPick(fixtureId)).
     options.demoBadge: show the DEMO badge (default true). */
  function create(host, options) {
    options = options || {};
    var root = el('div', 'stage' + (options.interactive ? '' : ' static'), host);
    root.setAttribute('role', 'img');
    root.setAttribute('aria-label', options.label || 'A theatre stage with a mannequin, lit by six lights');
    el('div', 'back', root);
    var cyc = el('div', 'l cyc', root);
    el('div', 'floor', root);
    var cycbar = el('div', 'l cycbar', root);
    var pools = {};
    ['sl', 'sr', 'fl', 'fr'].forEach(function (id) { pools[id] = el('div', 'l pool ' + id, root); });
    // The beam is clipped to a cone, then the wrapper blurs it, so its edges are soft like real haze.
    var coneWrap = el('div', 'cone', root);
    var cone = el('div', 'l cone-in', coneWrap);
    var spot = el('div', 'l pool spot', root);
    el('div', 'shadow', root);

    // Each stage gets its own gradient id so two stages on one page never share it.
    var gid = 'queManVol' + (++figureCount);
    var fig = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    fig.setAttribute('viewBox', '0 0 120 340');
    fig.setAttribute('class', 'figure');
    fig.setAttribute('aria-hidden', 'true');
    fig.innerHTML = '<defs><radialGradient id="' + gid + '" cx=".36" cy=".3" r=".8">' +
      '<stop offset="0" stop-color="#fff" stop-opacity=".3"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/>' +
      '<stop offset=".62" stop-color="#000" stop-opacity=".06"/><stop offset="1" stop-color="#000" stop-opacity=".55"/>' +
      '</radialGradient></defs>' + FIGURE_PARTS.join('').split('queManVol').join(gid);
    root.appendChild(fig);

    el('div', 'wing left', root);
    el('div', 'wing right', root);
    el('div', 'border', root);
    el('div', 'pipe', root);

    var markers = {}, labels = {};
    FIXTURES.forEach(function (f) {
      var b = el('button', 'mk', root);
      b.type = 'button';
      b.style.left = f.x; b.style.top = f.y;
      b.setAttribute('aria-label', f.name);
      b.setAttribute('aria-pressed', 'false');
      if (!options.interactive) { b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); }
      el('i', '', b);
      b.addEventListener('click', function () { if (options.onPick) options.onPick(f.id); });
      markers[f.id] = b;
      var lab = el('span', 'mk-label', root);
      lab.textContent = f.name;
      lab.style.left = f.x;
      lab.style.top = f.id === 'cyc' ? '70%' : '13%';
      lab.hidden = true;
      labels[f.id] = lab;
    });
    if (options.demoBadge !== false) el('span', 'demo', root).textContent = 'DEMO';

    /* Show a look.
       look: { fixtureId: [colourId, level] }
       opts.fadeMs: fade time; opts.blackout: everything dark at once; opts.selected: [fixtureId] */
    function render(look, opts) {
      opts = opts || {};
      var bo = !!opts.blackout;
      // BLACKOUT is instant: no fade on the safety path.
      root.style.setProperty('--fade', (bo ? 0 : (opts.fadeMs == null ? 600 : opts.fadeMs)) + 'ms');
      function paint(node, id, factor) {
        var v = look[id] || ['white', 0];
        node.style.backgroundColor = css(rgb(v[0]));
        node.style.opacity = bo ? 0 : (v[1] / 100) * (factor || 1);
      }
      paint(cyc, 'cyc'); paint(cycbar, 'cyc');
      ['sl', 'sr', 'fl', 'fr'].forEach(function (id) { paint(pools[id], id); });
      paint(cone, 'top', 0.45); paint(spot, 'top');

      // The mannequin is lit mostly by front and top light, a little by the sides.
      var w = { fl: 0.55, fr: 0.55, top: 0.75, sl: 0.25, sr: 0.25, cyc: 0.04 };
      var c = [18, 18, 20];
      if (!bo) Object.keys(w).forEach(function (id) {
        var v = look[id] || ['white', 0], a = rgb(v[0]);
        for (var i = 0; i < 3; i++) c[i] += a[i] * (v[1] / 100) * w[id];
      });
      root.style.setProperty('--actor', css(c.map(function (n) { return Math.min(235, Math.round(n)); })));

      var sel = opts.selected || [];
      FIXTURES.forEach(function (f) {
        var v = look[f.id] || ['white', 0];
        var on = !bo && v[1] > 0, col = css(rgb(v[0]));
        var dot = markers[f.id].firstChild;
        dot.style.backgroundColor = on ? col : '';
        dot.style.boxShadow = on ? '0 0 16px ' + col : 'none';
        var isSel = sel.indexOf(f.id) >= 0;
        markers[f.id].setAttribute('aria-pressed', isSel ? 'true' : 'false');
        labels[f.id].hidden = !isSel;
      });
    }

    return { root: root, render: render };
  }

  window.QueStage = { create: create, FIXTURES: FIXTURES, COLOURS: COLOURS, LOOKS: LOOKS, rgb: rgb, css: css };

  // Any element with data-stage="lookName" becomes a still stage showing that look.
  document.addEventListener('DOMContentLoaded', function () {
    var nodes = document.querySelectorAll('[data-stage]');
    for (var i = 0; i < nodes.length; i++) {
      var s = create(nodes[i], { label: nodes[i].getAttribute('data-label') || undefined });
      s.render(LOOKS[nodes[i].getAttribute('data-stage')] || LOOKS.morning, { fadeMs: 0 });
    }
  });
})();
