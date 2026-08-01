/**
 * THE ORBITAL SYSTEM — geometry, light, and the arrival beat.
 *
 * THE STRUCTURAL CLAIM
 *   An orbit is a circle in three dimensions seen edge-on-ish. Projected, it is
 *   an ellipse, and the ellipse's MAJOR AXIS is the projection of the line of
 *   nodes — the line where the orbital plane crosses the plane of the sky. So
 *   the split between "in front of the nucleus" and "behind it" is not a
 *   judgement call: it is the major axis, exactly. Parameterise the ellipse as
 *
 *       P(t) = C + (rx cos t) u + (ry sin t) v
 *
 *   with u the major-axis unit vector and v the minor. Then sin(t) > 0 is the
 *   near half and sin(t) < 0 is the far half, for every point and every node,
 *   with no special cases.
 *
 *   For that split to be VISIBLE the orbit has to actually cross the body, which
 *   means every orbit's minor semi-axis must be smaller than the nucleus radius.
 *   All three are (115, 101, 82 against 125). This is the one number that decides
 *   whether the section reads as an object or as a diagram, and it is why the
 *   orbits here are far flatter than the ones on the homepage — those have
 *   ry 178/160/135 against a 42 nucleus, so nothing ever crosses anything and the
 *   depth cue is simply absent.
 *
 * THE LIGHT
 *   One source, upper left, at 38% 32% of every sphere's own bounding box. The
 *   nucleus and all six nodes take the same relative light, so a node is the same
 *   material as the body it orbits at a sixth of its radius. The relief filter is
 *   lit at azimuth 225 / elevation 40, the same bearing in the filter's own
 *   coordinates, so the mottling's micro-shadows fall the way the terminator does.
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var D2R = Math.PI / 180;

  /* ── The frame ──────────────────────────────────────────────────────────
     1440 x 984 so that at a 1440 viewport one SVG unit is one CSS pixel and
     the labels are literally the homepage's 14px/12px, not a scaled guess. */
  var FRAME = { w: 1440, h: 984, cx: 720, cy: 460 };
  var NUC_R = 125;

  var ORBITS = [
    /* id, semi-axes, rotation of the major axis in screen degrees, stroke.
       Drawn in order of DECREASING minor axis: each orbit lies flatter than the
       last, so the system's depth deepens as it completes and the final stroke
       is the one that runs straight across the nucleus's face.

       No dashed orbit here. The homepage distinguishes its middle orbit with a
       dash; a dash pattern and a dash-offset draw are the same property, and the
       draw is the beat. The three are separated by colour and weight instead —
       starlight, saffron, ocean — which is a stronger separation anyway at this
       stroke width. */
    { id: 'c', rx: 380, ry: 115, rot: 85,  stroke: 'rgba(240,242,248,0.20)', width: 1.2, driftS: 228 },
    { id: 'a', rx: 480, ry: 101, rot: -22, stroke: 'rgba(232,175,56,0.26)',  width: 1.1, driftS: 300 },
    { id: 'b', rx: 446, ry: 82,  rot: 31,  stroke: 'rgba(120,152,208,0.30)', width: 1.0, driftS: 264 }
  ];

  /* ── The six ────────────────────────────────────────────────────────────
     Four sit out near the major-axis extremes, where there is label room.
     Two sit ON the limb, at the parameter where |P - C| equals the nucleus
     radius: SCIENCE straddling the near limb in front of the body, ART
     straddling the far limb behind it. Those two are the occlusion proof —
     same geometry, opposite z, and the sphere cuts one of them in half.
     Copy is the homepage's, verbatim; this round is material, not words. */
  var NODES = [
    { id: 'reading', orbit: 'b', t: 188,   key: 'READING',
      lines: ['The man who accidentally', "saw through his wife's hand."],
      label: { anchor: 'end',   x: 322,  y: 214 } },
    { id: 'writing', orbit: 'a', t: 350,   key: 'WRITING',
      lines: ['A get-well letter to Granddad.', 'What would you say?'],
      label: { anchor: 'start', x: 1178, y: 258 } },
    { id: 'math',    orbit: 'b', t: 8,     key: 'MATH',
      lines: ['Measuring bone lengths.', 'Which is longest?'],
      label: { anchor: 'start', x: 1122, y: 690 } },
    { id: 'science', orbit: 'a', t: 81,    key: 'SCIENCE',
      lines: ['How fractures heal.', 'Why does a cast work?'],
      label: { anchor: 'start', x: 872,  y: 512 } },
    { id: 'geo',     orbit: 'a', t: 170,   key: 'GEOGRAPHY',
      lines: ['Visit Würzburg, Germany.', 'Where X-rays were born.'],
      label: { anchor: 'end',   x: 262,  y: 646 } },
    { id: 'art',     orbit: 'b', t: 257.5, key: 'ART',
      lines: ['Sketch the human skeleton.', 'Label every bone you can name.'],
      label: { anchor: 'end',   x: 650,  y: 292 } }
  ];

  var NODE_R = 20, HALO_R = 42;

  /* ── Variants (lab only) ────────────────────────────────────────────── */

  var NUCLEUS_VARIANTS = {
    /* texture strength, corona scale, and the three breath layers' amplitudes.
       Each layer runs on its own prime-ish period (3.7s / 5.3s / 8.9s in the
       stylesheet) so the summed luminosity has amplitude inside any 3-5 second
       window and no beat a viewer can catch repeating. */
    a: { tex: 0.24, corona: 0.80, breath: [[0.06, 0.26], [0.06, 0.18], [0.05, 0.14]] },
    b: { tex: 0.48, corona: 1.00, breath: [[0.12, 0.50], [0.10, 0.34], [0.08, 0.26]] },
    c: { tex: 0.80, corona: 1.28, breath: [[0.18, 0.72], [0.16, 0.52], [0.12, 0.40]] }
  };

  var ARRIVAL_VARIANTS = {
    /* Nodes first, then paths. Members before structure: drawing the paths first
       would state the system before its subjects, which is the difference
       between an object and a diagram. */
    brisk: { nodeStart: 0.10, nodeStagger: 0.19, nodeDur: 0.42, labelLag: 0.10, labelDur: 0.46,
             pathStart: 1.22, orbitStagger: 0.12, halfDur: 0.52 },
    slow:  { nodeStart: 0.15, nodeStagger: 0.30, nodeDur: 0.52, labelLag: 0.14, labelDur: 0.56,
             pathStart: 1.95, orbitStagger: 0.18, halfDur: 0.80 }
  };

  var DEFAULTS = { nucleus: 'b', arrival: 'slow', orbits: 'static' };

  /* ── geometry ───────────────────────────────────────────────────────── */

  function basis(o) {
    var r = o.rot * D2R;
    return { u: [Math.cos(r), Math.sin(r)], v: [-Math.sin(r), Math.cos(r)] };
  }

  function pointAt(o, tDeg) {
    var b = basis(o), t = tDeg * D2R;
    var m = o.rx * Math.cos(t), n = o.ry * Math.sin(t);
    return {
      x: FRAME.cx + m * b.u[0] + n * b.v[0],
      y: FRAME.cy + m * b.u[1] + n * b.v[1],
      near: Math.sin(t) >= 0
    };
  }

  /* A half-ellipse as a polyline. 140 segments over 180 degrees is under a
     twentieth of a pixel of chord error at rx 480, and it sidesteps the arc
     command's sweep-flag ambiguity entirely. */
  function halfPath(o, fromDeg, toDeg) {
    var d = '', n = 140;
    for (var i = 0; i <= n; i++) {
      var p = pointAt(o, fromDeg + (toDeg - fromDeg) * (i / n));
      d += (i === 0 ? 'M' : 'L') + p.x.toFixed(2) + ' ' + p.y.toFixed(2);
    }
    return d;
  }

  /* ── dom helpers ────────────────────────────────────────────────────── */

  function svg(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs[k] != null) e.setAttribute(k, String(attrs[k]));
    return e;
  }
  function grad(id, cx, cy, r, stops, extra) {
    var g = svg('radialGradient', Object.assign({ id: id, cx: cx, cy: cy, r: r }, extra || {}));
    stops.forEach(function (s) {
      g.appendChild(svg('stop', { offset: s[0], 'stop-color': s[1], 'stop-opacity': s[2] }));
    });
    return g;
  }

  /* ── defs: the material ─────────────────────────────────────────────── */

  function buildDefs() {
    var d = svg('defs');

    var clip = svg('clipPath', { id: 'lo-nuc-clip' });
    clip.appendChild(svg('circle', { cx: FRAME.cx, cy: FRAME.cy, r: NUC_R }));
    d.appendChild(clip);

    /* THE BODY, in four passes. One radial gradient cannot make a sphere: it
       makes a lit disc. What separates them is that a real sphere darkens at
       EVERY limb, not only the one away from the light, because at the limb you
       are looking through the body's edge. So:

         1  shading   — the diffuse falloff from the light point
         2  limb      — centred, transparent through the middle, dark at the rim,
                        on all sides. This is the pass that was missing and it is
                        the whole difference between a ball and a body.
         3  terminator— the warm gather where the lit face turns away
         4  rim       — a hairline of the body's own light on the far limb
    */
    d.appendChild(grad('lo-nuc-base', '38%', '32%', '74%', [
      ['0%',   '#FFF8E2'], ['13%', '#FDECB6'], ['29%', '#F7D27E'],
      ['48%',  '#EDBA46'], ['68%', '#DDA134'], ['86%', '#B37E24'], ['100%', '#8A5F19']
    ]));

    d.appendChild(grad('lo-nuc-limb', '50%', '50%', '50%', [
      ['0%',   '#2A1A03', 0],    ['52%',  '#2A1A03', 0],
      ['76%',  '#332004', 0.24], ['91%', '#241601', 0.52], ['100%', '#120A01', 0.76]
    ]));

    d.appendChild(grad('lo-nuc-shadow', '26%', '20%', '94%', [
      ['28%',  '#5A3A08', 0],    ['50%',  '#503307', 0.20],
      ['72%',  '#3E2705', 0.50], ['89%', '#2B1B03', 0.72], ['100%', '#160D02', 0.86]
    ]));

    d.appendChild(grad('lo-nuc-rim', '66%', '74%', '52%', [
      ['74%', '#FFD98A', 0], ['92%', '#FFD07A', 0.16], ['100%', '#FFE6B4', 0.40]
    ]));

    /* Interior life. Held INSIDE the lit face — a glow spread over the whole
       disc is what flattens a sphere, and flattening it is exactly what the
       first pass of this build did. */
    d.appendChild(grad('lo-nuc-glow-1', '38%', '32%', '46%', [
      ['0%', '#FFFBEE', 0.85], ['38%', '#FDE9A0', 0.30], ['100%', '#F0C050', 0]
    ]));
    d.appendChild(grad('lo-nuc-glow-2', '42%', '36%', '62%', [
      ['0%', '#FCE2A0', 0.42], ['54%', '#E8AF38', 0.14], ['100%', '#E8AF38', 0]
    ]));

    /* The corona, bleeding into the sky. Three unequal falloffs rather than one:
       a tight ring that reads as atmosphere at the limb, a mid bloom, and a wide
       one that is the body's light in the field rather than around it. */
    d.appendChild(grad('lo-corona-1', '50%', '50%', '50%', [
      ['42%', '#FFE4A6', 0.62], ['52%', '#F6CB68', 0.34],
      ['70%', '#E8AF38', 0.13], ['100%', '#E8AF38', 0]
    ]));
    d.appendChild(grad('lo-corona-2', '50%', '50%', '50%', [
      ['24%', '#F0C050', 0.13], ['52%', '#E8AF38', 0.045], ['100%', '#E8AF38', 0]
    ]));
    /* The widest falloff is deliberately faint. Pushed up it stops being the
       body's light in the field and becomes fog: the night desaturates and the
       stars behind it go grey. Corona has to bleed, not flood. */
    d.appendChild(grad('lo-corona-3', '50%', '50%', '50%', [
      ['0%', '#E8AF38', 0.040], ['44%', '#C89030', 0.015], ['100%', '#A07020', 0]
    ]));

    /* Nodes: the same light at a sixth the radius. */
    d.appendChild(grad('lo-node-core', '38%', '32%', '66%', [
      ['0%', '#FFF4D6'], ['22%', '#FDE9A0'], ['46%', '#F3C862'],
      ['70%', '#E8AF38'], ['88%', '#B47C22'], ['100%', '#7E5614']
    ]));
    d.appendChild(grad('lo-node-shadow', '34%', '28%', '78%', [
      ['46%', '#4A2F06', 0], ['78%', '#3E2705', 0.34], ['100%', '#241601', 0.62]
    ]));
    d.appendChild(grad('lo-node-rim', '64%', '72%', '56%', [
      ['80%', '#FFD98A', 0], ['100%', '#FFE3AC', 0.42]
    ]));
    d.appendChild(grad('lo-node-halo', '50%', '50%', '50%', [
      ['30%', '#E8AF38', 0.42], ['58%', '#E8AF38', 0.14], ['100%', '#E8AF38', 0]
    ]));

    /* Surface relief. Two scales: a coarse one that gives the body craters and
       mass, a fine one that gives it grain. Both lit from the same bearing as
       the gradient, so nothing on the surface argues with the terminator.

       baseFrequency is in the filter's user units, and the body is 250 units
       across, so 0.022 is a feature about 45 units wide — five or six across the
       face, which is cratering. The first pass of this build used 0.0055, one
       and a half features across the whole sphere, which is why it read as a
       faint smudge instead of a surface. */
    [['lo-relief-coarse', 0.022, 3, 9, 13], ['lo-relief-fine', 0.085, 4, 3.5, 29]].forEach(function (r) {
      var f = svg('filter', { id: r[0], x: '-6%', y: '-6%', width: '112%', height: '112%',
                              'color-interpolation-filters': 'sRGB' });
      f.appendChild(svg('feTurbulence', { type: 'fractalNoise', baseFrequency: r[1],
                                          numOctaves: r[2], seed: r[4], result: 'n' }));
      var l = svg('feDiffuseLighting', { in: 'n', surfaceScale: r[3], diffuseConstant: 1,
                                         'lighting-color': '#E9C071', result: 'lit' });
      l.appendChild(svg('feDistantLight', { azimuth: 225, elevation: 40 }));
      f.appendChild(l);
      f.appendChild(svg('feComposite', { in: 'lit', in2: 'SourceGraphic', operator: 'in' }));
      d.appendChild(f);
    });

    return d;
  }

  /* ── the nucleus ────────────────────────────────────────────────────── */

  /* The corona is built in two parts, and that split matters. The first pass of
     this build put the breath ON the corona itself, so the corona's opacity was
     never above 0.38 and the bleed effectively disappeared. Here the corona has
     a full-strength standing presence, and the breath is a SEPARATE pair of
     layers laid over it — light added, not light gated. */
  function buildCorona() {
    var g = svg('g', { class: 'lo-corona', 'aria-hidden': 'true' });
    function ring(r, fill, cls, lo, hi) {
      var c = svg('circle', { cx: FRAME.cx, cy: FRAME.cy, r: NUC_R * r, fill: fill });
      if (cls) {
        c.setAttribute('class', cls);
        c.style.setProperty('--lo-breath-lo', lo);
        c.style.setProperty('--lo-breath-hi', hi);
        c.style.setProperty('--lo-breath-still', ((lo + hi) / 2).toFixed(3));
      }
      g.appendChild(c);
    }
    ring(5.2, 'url(#lo-corona-3)');       /* the body's light in the field */
    ring(3.4, 'url(#lo-corona-2)');       /* the mid bloom */
    ring(2.0, 'url(#lo-corona-1)');       /* atmosphere at the limb */
    ring(2.5, 'url(#lo-corona-1)', 'lo-breath-b', 0.10, 0.34);
    ring(3.9, 'url(#lo-corona-2)', 'lo-breath-c', 0.08, 0.26);
    return g;
  }

  function buildNucleus() {
    var g = svg('g', { class: 'lo-nucleus', 'aria-hidden': 'true' });
    var at = { cx: FRAME.cx, cy: FRAME.cy, r: NUC_R };

    /* The surface, isolated: the relief blends with the body's own shading and
       with nothing else. Without the isolation it would blend down into the sky
       and the sphere would go translucent at the limb. */
    var body = svg('g', { class: 'lo-nuc-body' });
    body.appendChild(svg('circle', Object.assign({ fill: 'url(#lo-nuc-base)' }, at)));
    /* coarse relief in overlay (it must both catch light and cast shadow, which
       is what makes a crater), fine grain in soft-light so it stays grain */
    [['lo-relief-coarse', 'overlay', 1], ['lo-relief-fine', 'soft-light', 0.7]]
      .forEach(function (f) {
        var c = svg('circle', Object.assign({ fill: '#000', filter: 'url(#' + f[0] + ')',
                                              class: 'lo-nuc-relief' }, at));
        c.style.mixBlendMode = f[1];
        c.dataset.texScale = String(f[2]);
        body.appendChild(c);
      });
    body.appendChild(svg('circle', Object.assign({ fill: 'url(#lo-nuc-shadow)' }, at)));
    body.appendChild(svg('circle', Object.assign({ fill: 'url(#lo-nuc-limb)' }, at)));
    body.appendChild(svg('circle', Object.assign({ fill: 'url(#lo-nuc-rim)' }, at)));
    g.appendChild(body);

    [['lo-nuc-glow-1', 'lo-breath-a', 0.12, 0.48], ['lo-nuc-glow-2', 'lo-breath-c', 0.08, 0.30]]
      .forEach(function (b) {
        var c = svg('circle', Object.assign({ fill: 'url(#' + b[0] + ')', class: b[1] }, at));
        c.style.setProperty('--lo-breath-lo', b[2]);
        c.style.setProperty('--lo-breath-hi', b[3]);
        c.style.setProperty('--lo-breath-still', ((b[2] + b[3]) / 2).toFixed(3));
        c.dataset.breathBase = String(b[3]);
        g.appendChild(c);
      });
    return g;
  }

  /* ── nodes and labels ───────────────────────────────────────────────── */

  function buildNode(n, pos) {
    var outer = svg('g', { class: 'lo-node', 'data-node': n.id });
    var place = svg('g', { transform: 'translate(' + pos.x.toFixed(2) + ',' + pos.y.toFixed(2) + ')' });
    var inner = svg('g', { class: 'lo-node-inner' });
    inner.appendChild(svg('circle', { r: HALO_R, fill: 'url(#lo-node-halo)' }));
    inner.appendChild(svg('circle', { r: NODE_R, fill: 'url(#lo-node-core)' }));
    inner.appendChild(svg('circle', { r: NODE_R, fill: 'url(#lo-node-shadow)' }));
    inner.appendChild(svg('circle', { r: NODE_R, fill: 'url(#lo-node-rim)' }));
    place.appendChild(inner);
    outer.appendChild(place);
    outer.__place = place;
    return outer;
  }

  function buildLabel(n) {
    var outer = svg('g', { class: 'lo-label', 'data-label': n.id });
    var inner = svg('g', { class: 'lo-label-inner' });
    var key = svg('text', { class: 'lo-label-key', x: n.label.x, y: n.label.y, 'text-anchor': n.label.anchor });
    key.textContent = n.key;
    inner.appendChild(key);
    n.lines.forEach(function (line, i) {
      var t = svg('text', { class: 'lo-label-line', x: n.label.x, y: n.label.y + 19 + i * 16,
                            'text-anchor': n.label.anchor });
      t.textContent = line;
      inner.appendChild(t);
    });
    outer.appendChild(inner);
    return outer;
  }

  /* ── build ──────────────────────────────────────────────────────────── */

  function build(host) {
    var root = svg('svg', {
      class: 'lab-orbital__svg',
      viewBox: '0 0 ' + FRAME.w + ' ' + FRAME.h,
      preserveAspectRatio: 'xMidYMid meet',
      role: 'img',
      'aria-label': 'Orbital diagram: six school subjects — reading, writing, math, science, geography and art — orbiting one central theme.'
    });
    root.appendChild(buildDefs());

    var lBack = svg('g', { class: 'lo-layer lo-layer--back' });
    /* The near arcs where they cross the body. A thin ring passing in FRONT of a
       star is not brighter than the star — it silhouettes against it. Painting
       the front arcs in saffron over a saffron body made them vanish, which read
       as the arc going behind. This layer is clipped to the disc and draws them
       dark, so the same stroke reads as "in front" without any new hue. */
    var lSil = svg('g', { class: 'lo-layer lo-layer--silhouette', 'clip-path': 'url(#lo-nuc-clip)' });
    var lFront = svg('g', { class: 'lo-layer lo-layer--front' });
    var lLabels = svg('g', { class: 'lo-layer lo-layer--labels' });

    var orbitById = {};
    ORBITS.forEach(function (o) { orbitById[o.id] = o; });

    /* paths: far half into the back layer, near half into the front, so the
       stroke vanishes behind the body and picks itself up on the other side */
    var paths = [];
    ORBITS.forEach(function (o, oi) {
      [['far', 180, 360, lBack], ['near', 0, 180, lFront]].forEach(function (h, hi) {
        var d = halfPath(o, h[1], h[2]);
        /* The glow draws with its own line, a beat wider and slower, so the
           stroke arrives with air around it rather than as a hairline. */
        var glow = svg('path', { class: 'lo-path lo-glow', d: d, fill: 'none', 'pathLength': 1,
                                 stroke: o.stroke, 'stroke-width': o.width * 3.4,
                                 'stroke-opacity': 0.18, 'stroke-linecap': 'round' });
        var line = svg('path', { class: 'lo-path', d: d, fill: 'none', 'pathLength': 1,
                                 stroke: o.stroke, 'stroke-width': o.width,
                                 'stroke-linecap': 'round' });
        h[3].appendChild(glow);
        h[3].appendChild(line);
        paths.push({ orbit: o, orbitIndex: oi, half: hi, line: line, glow: glow });

        if (h[0] === 'near') {
          var sil = svg('path', { class: 'lo-path', d: d, fill: 'none', 'pathLength': 1,
                                  stroke: '#6B4712', 'stroke-opacity': 0.62,
                                  'stroke-width': o.width + 0.5, 'stroke-linecap': 'round' });
          lSil.appendChild(sil);
          paths.push({ orbit: o, orbitIndex: oi, half: hi, line: sil, glow: sil });
        }
      });
    });

    lBack.appendChild(buildCorona());
    /* the corona belongs behind the back arcs? no: it is the body's light, and
       an arc passing behind the body still passes in FRONT of the far corona.
       Move it to the very back of the back layer. */
    lBack.insertBefore(lBack.lastChild, lBack.firstChild);

    var nucleus = buildNucleus();

    var nodes = [];
    NODES.forEach(function (n) {
      var o = orbitById[n.orbit];
      var pos = pointAt(o, n.t);
      var g = buildNode(n, pos);
      (pos.near ? lFront : lBack).appendChild(g);
      var label = buildLabel(n);
      lLabels.appendChild(label);
      nodes.push({ def: n, orbit: o, t: n.t, home: pos, g: g, label: label,
                   near: pos.near,
                   /* screen bearing from the centre, clockwise from twelve */
                   bearing: (Math.atan2(pos.y - FRAME.cy, pos.x - FRAME.cx) / D2R + 450) % 360 });
    });

    root.appendChild(lBack);
    root.appendChild(nucleus);
    root.appendChild(lSil);
    root.appendChild(lFront);
    root.appendChild(lLabels);
    host.appendChild(root);

    return { root: root, back: lBack, front: lFront, nodes: nodes, paths: paths,
             corona: lBack.firstChild, nucleus: nucleus };
  }

  /* ── variants ───────────────────────────────────────────────────────── */

  function applyNucleus(sys, key) {
    var v = NUCLEUS_VARIANTS[key];
    sys.nucleus.querySelectorAll('.lo-nuc-relief').forEach(function (c) {
      c.style.setProperty('--lo-tex', (v.tex * Number(c.dataset.texScale)).toFixed(3));
    });
    var s = v.corona;
    sys.corona.setAttribute('transform',
      'translate(' + FRAME.cx + ',' + FRAME.cy + ') scale(' + s + ') translate(' + (-FRAME.cx) + ',' + (-FRAME.cy) + ')');
    /* three breath layers, three amplitudes, in the order they were built:
       glow-1 (fast), corona-1 (mid), then the two slow ones share the third */
    var layers = [
      sys.nucleus.querySelector('.lo-breath-a'),
      sys.corona.querySelector('.lo-breath-b'),
      sys.corona.querySelector('.lo-breath-c'),
      sys.nucleus.querySelector('.lo-breath-c')
    ];
    var amps = [v.breath[0], v.breath[1], v.breath[2], v.breath[2]];
    layers.forEach(function (el, i) {
      if (!el) return;
      var a = amps[i];
      el.style.setProperty('--lo-breath-lo', a[0]);
      el.style.setProperty('--lo-breath-hi', a[1]);
      el.style.setProperty('--lo-breath-still', ((a[0] + a[1]) / 2).toFixed(3));
    });
  }

  /* ── the arrival beat ───────────────────────────────────────────────── */

  function applyArrival(sys, key) {
    var v = ARRIVAL_VARIANTS[key];

    /* Nodes ignite in a clockwise sweep starting at the first node past twelve
       o'clock. Not reading order and not depth order: a sweep circles the
       nucleus, which restates the thesis while it plays. */
    var order = sys.nodes.slice().sort(function (a, b) { return a.bearing - b.bearing; });
    order.forEach(function (n, i) {
      var d = v.nodeStart + i * v.nodeStagger;
      n.g.style.setProperty('--lo-delay', d.toFixed(3) + 's');
      n.g.style.setProperty('--lo-node-dur', v.nodeDur + 's');
      n.label.style.setProperty('--lo-delay', (d + v.labelLag).toFixed(3) + 's');
      n.label.style.setProperty('--lo-label-dur', v.labelDur + 's');
    });

    sys.paths.forEach(function (p) {
      var d = v.pathStart + p.orbitIndex * v.orbitStagger + p.half * v.halfDur;
      p.line.style.setProperty('--lo-delay', d.toFixed(3) + 's');
      p.line.style.setProperty('--lo-draw-dur', v.halfDur + 's');
      p.glow.style.setProperty('--lo-delay', d.toFixed(3) + 's');
      p.glow.style.setProperty('--lo-draw-dur', (v.halfDur * 1.18).toFixed(3) + 's');
    });

    var last = v.pathStart + (ORBITS.length - 1) * v.orbitStagger + v.halfDur * 2;
    return last;
  }

  /* ── orbit drift (variant only) ─────────────────────────────────────── */

  function makeDrift(sys) {
    var raf = 0, prev = 0, on = false;

    function frame(now) {
      if (!on) return;
      var dt = prev ? Math.min((now - prev) / 1000, 0.1) : 0;
      prev = now;
      sys.nodes.forEach(function (n) {
        n.t = (n.t + (360 / n.orbit.driftS) * dt) % 360;
        var p = pointAt(n.orbit, n.t);
        n.g.__place.setAttribute('transform', 'translate(' + p.x.toFixed(2) + ',' + p.y.toFixed(2) + ')');
        n.label.setAttribute('transform',
          'translate(' + (p.x - n.home.x).toFixed(2) + ',' + (p.y - n.home.y).toFixed(2) + ')');
        /* the moment a node crosses the line of nodes it changes side of the
           body, so it changes layer. This is the occlusion, in motion. */
        if (p.near !== n.near) {
          n.near = p.near;
          (p.near ? sys.front : sys.back).appendChild(n.g);
        }
      });
      raf = requestAnimationFrame(frame);
    }

    return {
      start: function () { if (on) return; on = true; prev = 0; raf = requestAnimationFrame(frame); },
      stop: function () {
        on = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        sys.nodes.forEach(function (n) {
          n.t = n.def.t;
          n.g.__place.setAttribute('transform',
            'translate(' + n.home.x.toFixed(2) + ',' + n.home.y.toFixed(2) + ')');
          n.label.removeAttribute('transform');
          if (n.home.near !== n.near) {
            n.near = n.home.near;
            (n.home.near ? sys.front : sys.back).appendChild(n.g);
          }
        });
      }
    };
  }

  /* ── mount ──────────────────────────────────────────────────────────── */

  function mount() {
    var section = document.querySelector('[data-lab-orbital]');
    if (!section || section.dataset.mounted) return;
    section.dataset.mounted = '1';
    var stage = section.querySelector('.lab-orbital__stage');
    var sys = build(stage);

    var state = Object.assign({}, DEFAULTS);
    var drift = makeDrift(sys);
    var latched = false;

    var reduced = function () {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
             document.documentElement.dataset.wkMotion === 'reduced';
    };

    function playArrival(force) {
      if (latched && !force) return;
      latched = true;
      var total = applyArrival(sys, state.arrival);
      section.dataset.arrival = 'none';
      /* reflow so a replay restarts the animations rather than continuing them */
      void section.offsetWidth;
      section.dataset.arrival = 'running';
      window.setTimeout(function () {
        if (section.dataset.arrival === 'running') section.dataset.arrival = 'done';
      }, (total + 0.25) * 1000);
    }

    applyNucleus(sys, state.nucleus);
    applyArrival(sys, state.arrival);

    if (reduced()) {
      /* the completed state, rendered. No arrival, no drift; the certified
         stylesheet already freezes the sky. */
      section.dataset.arrival = 'done';
      latched = true;
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && e.intersectionRatio >= 0.4) {
            io.disconnect();
            playArrival(false);
          }
        });
      }, { threshold: [0.4] });
      io.observe(section);
    } else {
      playArrival(false);
    }

    /* ── lab panel. Never ships. ─────────────────────────────────────── */
    var panel = document.querySelector('[data-lab-panel]');
    if (panel) {
      panel.addEventListener('click', function (ev) {
        var b = ev.target.closest('button');
        if (!b) return;
        var group = b.dataset.group, value = b.dataset.value;

        if (group === 'collapse') {
          var open = !panel.hasAttribute('data-collapsed');
          if (open) panel.setAttribute('data-collapsed', '');
          else panel.removeAttribute('data-collapsed');
          b.querySelector('.lab-panel__chev').textContent = open ? '+' : '—';
          return;
        }
        if (group === 'replay') {
          section.dataset.arrival = 'none';
          window.setTimeout(function () { playArrival(true); }, 30);
          return;
        }
        if (group === 'motion') {
          var next = document.documentElement.dataset.wkMotion === 'reduced' ? '' : 'reduced';
          if (next) document.documentElement.dataset.wkMotion = next;
          else delete document.documentElement.dataset.wkMotion;
          b.setAttribute('aria-pressed', next ? 'true' : 'false');
          if (next) { drift.stop(); section.dataset.arrival = 'done'; }
          else if (state.orbits === 'drift') drift.start();
          return;
        }

        state[group] = value;
        panel.querySelectorAll('button[data-group="' + group + '"]').forEach(function (o) {
          o.setAttribute('aria-pressed', String(o === b));
        });

        if (group === 'nucleus') applyNucleus(sys, value);
        if (group === 'arrival') {
          applyArrival(sys, value);
          section.dataset.arrival = 'none';
          window.setTimeout(function () { playArrival(true); }, 30);
        }
        if (group === 'orbits') {
          if (value === 'drift' && !reduced()) drift.start(); else drift.stop();
        }
      });
    }

    window.WizkooLabOrbital = { sys: sys, state: state, play: playArrival, FRAME: FRAME,
                                NUC_R: NUC_R, ORBITS: ORBITS, NODES: NODES, pointAt: pointAt };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
