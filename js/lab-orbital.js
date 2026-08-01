/**
 * THE ORBITAL SYSTEM — geometry, light, and the arrival beat.
 *
 * THE STRUCTURAL CLAIM (round 1, preserved)
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
 *   whether the section reads as an object or as a diagram.
 *
 * THE LIGHT MODEL — round 2, and the whole of this round
 *   THE NUCLEUS IS SELF-LUMINOUS. It is the only light source in the frame, and
 *   nothing else in the frame may imply another one.
 *
 *   What round 1 got wrong: it lit the nucleus like a planet — a diffuse falloff
 *   from a point at 38% 32%, a terminator gathering on the opposite side, a rim
 *   light on the far limb — and then wrapped it in a symmetrical corona. Those
 *   are two contradictory sources in one frame. The sphere said "a lamp is over
 *   there, upper left"; the corona said "a sun is behind me". A viewer does not
 *   have to be able to name that to feel it, and what they feel is: an object in
 *   front of a light, not a light.
 *
 *   What replaces it, in four parts:
 *
 *   1  LIMB DARKENING, and no terminator. A star dims toward its edge in EVERY
 *      direction, because at the limb you look through a longer, cooler slant of
 *      its atmosphere. That falloff is radially symmetric and carries no
 *      direction at all, which is exactly why it is the right shading for a body
 *      that makes its own light.
 *
 *   2  THE HOT REGION, upper left. A star is not a uniform disc; it has hotter
 *      surface. This is that, and it is built as an ADDITIVE PATCH — it can only
 *      brighten, never darken, and the disc underneath it is already complete
 *      without it. That is the difference between "a bright region of the
 *      surface" and "light arriving from off-frame", and it is the entire reason
 *      the patch is smaller than the disc and has its own falloff.
 *
 *   3  GRANULATION, not relief. Round 1's surface came from feDiffuseLighting
 *      with a distant light at azimuth 225 — micro-shadows cast by an external
 *      source, which is precisely the cue being removed. Here the same turbulence
 *      drives BRIGHTNESS variation instead: contrast-stretched noise blended in
 *      overlay. Convection cells, not craters. No direction anywhere in it.
 *
 *   4  THE CORONA ANCHORS TO THE HOT REGION. Every corona layer is centred on the
 *      hot patch rather than on the body, and every gradient peaks INSIDE the
 *      body where it cannot be seen, so the visible bleed is bright just outside
 *      the near limb and falls to nothing around the far one. A corona centred on
 *      the body peaks in a ring around the whole silhouette, and a bright ring
 *      around a silhouette is the definition of a backlight.
 *
 *   AND THE DEMONSTRATION: the nodes are lit BY the nucleus. Each node's bright
 *   side faces the centre and its dark side faces out, with brightness falling
 *   off with distance from the nucleus. This is what settles the question — once
 *   light is visibly travelling outward from the middle of the frame, nobody
 *   wonders where it comes from, because they can watch it arrive.
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';
  var D2R = Math.PI / 180;

  /* ── The frame ──────────────────────────────────────────────────────────
     1440 x 984 so that at a 1440 viewport one SVG unit is one CSS pixel and
     the labels are literally the homepage's 14px/12px, not a scaled guess. */
  var FRAME = { w: 1440, h: 984, cx: 720, cy: 472 };
  var NUC_R = 125;

  /* The hot region, in absolute frame units. 38% 32% of the body's own box —
     the only value in this file that carries a direction, and it is a property
     of the surface, not of the lighting. Everything anchored to it (the corona)
     is anchored to the surface with it. */
  var HOT = { x: FRAME.cx + (0.38 - 0.5) * 2 * NUC_R, y: FRAME.cy + (0.32 - 0.5) * 2 * NUC_R };

  var ORBITS = [
    /* Drawn in order of DECREASING minor axis: each orbit lies flatter than the
       last, so the system's depth deepens as it completes and the final stroke
       is the one that runs straight across the nucleus's face.

       No dashed orbit. A dash pattern and a dash-offset draw are the same
       property, and the draw is the beat; the three separate by colour and
       weight instead.

       Round 1 drove these at 228/264/300s. Round 2's ruling was that the drift
       be meaningfully slower and never caught in the act; what it actually
       became is described under LIBRATION below. driftS is gone — motion is no
       longer a revolution rate. */
    { id: 'c', rx: 356, ry: 115, rot: 85,  stroke: 'rgba(240,242,248,0.20)', width: 1.2 },
    { id: 'a', rx: 480, ry: 101, rot: -22, stroke: 'rgba(232,175,56,0.26)',  width: 1.1 },
    { id: 'b', rx: 446, ry: 82,  rot: 31,  stroke: 'rgba(120,152,208,0.30)', width: 1.0 }
  ];

  /* ── LIBRATION: the motion, and why it is not a revolution ──────────────
     Round 2 ruled slow drift. Built as a slow REVOLUTION it fails the label
     ruling in the same round, and the failure is not a tuning problem — it is
     a theorem.

     Under revolution any two nodes eventually arrive at the same screen point.
     When they do, both are near the body, so both are near FULL presence, and
     depth-linked opacity cannot separate them. The only static remedy is to
     give each orbit its own band of label radius, and that cannot fit: a radial
     gap separates two labels only if it exceeds the label's extent ALONG the
     radial direction, which for a 186 x 52 block is 186 when that direction is
     horizontal. Three bands plus two 186px gaps put the outer edge 625px from
     centre; the frame allows 512. Proved in scripts/lab-orbital-label-solve.js.

     So the choice was: reactive collision handling, which the same ruling
     forbids, or a motion that does not produce the collision. This is the
     second. Each node LIBRATES about its composed position rather than
     revolving — which is not a fudge but a real orbital behaviour, the one the
     Moon and the Trojan asteroids do.

     Three incommensurate components, so nothing ever repeats: periods 1801,
     2803 and 4507 seconds are all prime, giving a composite period of about
     seven hundred years. Amplitude sums to 8 degrees, and because each node
     starts at the sum's zero the total excursion is bounded by 16 degrees.
     Every label placement inside that box was exhausted on a 7^7 grid — 823,543
     configurations — with no overlap anywhere; the first overlap appears past
     30 degrees.

     Maximum tangential speed 0.188 px/s, about 11px in a minute. The floor for
     seeing a small object move against a static reference is near 0.6 px/s, so
     it is never caught in the act and has plainly moved if you look away and
     come back. */
  var LIBRATION = {
    amp: 8,
    w: [0.55, 0.30, 0.15],
    P: [1801, 2803, 4507]
  };


  /* ── The seven ──────────────────────────────────────────────────────────
     SCIENCE and ART sit at the parameter where |P - C| equals the nucleus
     radius — straddling the near limb in front of the body and the far limb
     behind it. Same geometry, opposite z; the sphere cuts one of them in half.

     HISTORY is on orbit C, which carried no subject at all before it.

     Labels no longer carry hand-placed coordinates. Under drift a fixed offset
     eventually walks its label across the nucleus or off the frame, so a label
     now sits RADIALLY OUTWARD from its own node — always on the far side of the
     node from the centre, never between the node and the star. That is
     continuous by construction, which is what keeps it out of collision logic.

     Copy is the homepage's, verbatim; this round is light, not words. */
  var NODES = [
    { id: 'reading', orbit: 'b', t: 188,   key: 'READING',
      lines: ['The man who accidentally', "saw through his wife's hand."] },
    { id: 'writing', orbit: 'a', t: 350,   key: 'WRITING',
      lines: ['A get-well letter to Granddad.', 'What would you say?'] },
    { id: 'math',    orbit: 'b', t: 8,     key: 'MATH',
      lines: ['Measuring bone lengths.', 'Which is longest?'] },
    { id: 'science', orbit: 'a', t: 81,    key: 'SCIENCE',
      lines: ['How fractures heal.', 'Why does a cast work?'] },
    { id: 'geo',     orbit: 'a', t: 170,   key: 'GEOGRAPHY',
      lines: ['Visit Würzburg, Germany.', 'Where X-rays were born.'] },
    { id: 'art',     orbit: 'b', t: 257.5, key: 'ART',
      lines: ['Sketch the human skeleton.', 'Label every bone you can name.'] },
    { id: 'history', orbit: 'c', t: 195,   key: 'HISTORY',
      lines: ['1895. One accident changed', 'medicine forever.'] }
  ];

  var NODE_R = 20, HALO_R = 42;

  /* ── The light that reaches a node ──────────────────────────────────────
     Intensity falls with distance from the nucleus. The distance used is the
     SCREEN separation, not the true three-dimensional one. In 3D a circular
     orbit holds its node at a constant distance from the star, so true distance
     would give every node on an orbit the same brightness and the falloff would
     never be visible — and the falloff is the demonstration. The eye reads
     depth from screen separation, so screen separation is what has to drive it.
     A node also brightens as it swings toward the near or far extreme and dims
     as it comes around to the flanks, which is the light visibly travelling. */
  function intensityAt(dist) {
    var i = 210 / Math.max(dist, 120);
    return Math.max(0.42, Math.min(1, i));
  }

  /* Lit and unlit ends of the node palette. Intensity interpolates between them,
     so a far node is not merely more transparent — it is made of dimmer metal. */
  var NODE_BRIGHT = ['#FFF7E0', '#FDE7A8', '#F2C25A', '#D19A34', '#7A5416'];
  var NODE_DIM    = ['#C49845', '#B58A3E', '#93692D', '#6E4D20', '#3A2810'];
  var NODE_STOPS  = ['0%', '24%', '50%', '76%', '100%'];

  function mixHex(a, b, k) {
    var pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
    var r = Math.round(((pa >> 16) & 255) * (1 - k) + ((pb >> 16) & 255) * k);
    var g = Math.round(((pa >> 8) & 255) * (1 - k) + ((pb >> 8) & 255) * k);
    var bl = Math.round((pa & 255) * (1 - k) + (pb & 255) * k);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | bl).toString(16).slice(1);
  }

  /* ── Variants (lab only) ────────────────────────────────────────────────
     The LIGHT MODEL is fixed across all three now. a/b/c move granulation
     strength, corona reach and breath amplitude only — how much star, not what
     kind of light. Round 1's variants differed in a way that could make the
     frame more or less wrong; these cannot. */
  var NUCLEUS_VARIANTS = {
    a: { tex: 0.34, corona: 0.92, breath: [[0.08, 0.30], [0.07, 0.22], [0.06, 0.17]] },
    b: { tex: 0.52, corona: 1.06, breath: [[0.12, 0.44], [0.10, 0.31], [0.08, 0.24]] },
    c: { tex: 0.74, corona: 1.22, breath: [[0.17, 0.62], [0.14, 0.44], [0.11, 0.34]] }
  };

  var ARRIVAL_VARIANTS = {
    /* Nodes first, then paths. Members before structure. */
    brisk: { nodeStart: 0.10, nodeStagger: 0.165, nodeDur: 0.42, labelLag: 0.10, labelDur: 0.46,
             pathStart: 1.24, orbitStagger: 0.11, halfDur: 0.51 },
    slow:  { nodeStart: 0.15, nodeStagger: 0.26,  nodeDur: 0.52, labelLag: 0.14, labelDur: 0.56,
             pathStart: 2.00, orbitStagger: 0.16, halfDur: 0.78 }
  };

  /* RULED round 2: variant a is the base, 2.5s arrival, orbits drift. */
  var DEFAULTS = { nucleus: 'a', arrival: 'brisk', orbits: 'drift' };

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
      near: Math.sin(t) >= 0,
      depth: Math.sin(t)                       /* -1 far, +1 near */
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

    /* 1. THE DISC — limb darkening, and nothing else. Centred, so it carries no
       direction whatever. The edge is dimmer but never dark: a real star's limb
       runs at something like two thirds of centre brightness, and taking it to
       black is what makes a self-luminous body read as a shaded planet. */
    d.appendChild(grad('lo-nuc-disc', '50%', '50%', '50%', [
      ['0%',   '#FFEEBE'], ['34%', '#FBE0A0'], ['58%', '#F3C86A'],
      ['78%',  '#E8AF38'], ['91%', '#D2942E'], ['100%', '#B77D25']
    ]));

    /* 2. THE HOT REGION — additive only. Note there is no companion gradient
       darkening the opposite side; that absence is the ruling. */
    d.appendChild(grad('lo-nuc-hot', '38%', '32%', '40%', [
      ['0%',  '#FFFDF2', 0.92], ['22%', '#FFF3CE', 0.62],
      ['52%', '#FFE29A', 0.26], ['80%', '#F8CE72', 0.07], ['100%', '#F0C050', 0]
    ]));

    /* Interior life, held inside the hot region so the breath reads as the hot
       surface pulsing rather than as the whole disc flashing. */
    d.appendChild(grad('lo-nuc-glow-1', '38%', '32%', '34%', [
      ['0%', '#FFFEF8', 0.90], ['40%', '#FFF0C4', 0.32], ['100%', '#FFE29A', 0]
    ]));
    d.appendChild(grad('lo-nuc-glow-2', '38%', '32%', '54%', [
      ['0%', '#FFF3CE', 0.42], ['52%', '#F6CB68', 0.14], ['100%', '#E8AF38', 0]
    ]));

    /* 4. THE CORONA — every layer centred on the HOT REGION, not on the body,
       and every gradient peaking inside the body where it cannot be seen. The
       body's near limb sits at about 28% of the first layer's radius and its far
       limb at about 72%, so the same gradient gives a strong bleed on the hot
       side and almost nothing opposite. That asymmetry is the whole point: a
       corona that is equally bright all the way around a silhouette is a
       backlight, and this frame has no light behind it. */
    d.appendChild(grad('lo-corona-1', '50%', '50%', '50%', [
      ['24%', '#FFE9B8', 0.50], ['36%', '#F8CE72', 0.26],
      ['58%', '#E8AF38', 0.09], ['100%', '#E8AF38', 0]
    ]));
    d.appendChild(grad('lo-corona-2', '50%', '50%', '50%', [
      ['12%', '#F6CB68', 0.15], ['34%', '#E8AF38', 0.065],
      ['68%', '#E8AF38', 0.018], ['100%', '#E8AF38', 0]
    ]));
    /* The widest falloff is deliberately faint. Pushed up it stops being the
       body's light in the field and becomes fog: the night desaturates and the
       stars behind it go grey. Corona has to bleed, not flood. */
    d.appendChild(grad('lo-corona-3', '50%', '50%', '50%', [
      ['0%', '#E8AF38', 0.042], ['42%', '#C89030', 0.016], ['100%', '#A07020', 0]
    ]));

    /* 3. GRANULATION — the same turbulence round 1 used, but driving brightness
       instead of relief. feColorMatrix flattens the noise to grey, the transfer
       stretches its contrast about mid-grey, and the result is blended in
       overlay, which leaves 0.5 untouched and pushes the rest either way. No
       feDiffuseLighting, so no light direction exists anywhere in the surface.

       baseFrequency is in filter user units and the body is 250 across, so
       0.020 is a cell about 50 units wide, five across the face. */
    [['lo-gran-coarse', 0.020, 3, 1.75, 13], ['lo-gran-fine', 0.075, 4, 1.45, 29]]
      .forEach(function (r) {
        var f = svg('filter', { id: r[0], x: '-4%', y: '-4%', width: '108%', height: '108%',
                                'color-interpolation-filters': 'sRGB' });
        f.appendChild(svg('feTurbulence', { type: 'fractalNoise', baseFrequency: r[1],
                                            numOctaves: r[2], seed: r[4], result: 'n' }));
        f.appendChild(svg('feColorMatrix', { in: 'n', type: 'matrix', result: 'g',
          values: '0.34 0.34 0.34 0 0  0.34 0.34 0.34 0 0  0.34 0.34 0.34 0 0  0 0 0 0 1' }));
        var ct = svg('feComponentTransfer', { in: 'g', result: 'c' });
        ['feFuncR', 'feFuncG', 'feFuncB'].forEach(function (fn) {
          ct.appendChild(svg(fn, { type: 'linear', slope: r[3],
                                   intercept: (0.5 - 0.5 * r[3]).toFixed(4) }));
        });
        f.appendChild(ct);
        f.appendChild(svg('feComposite', { in: 'c', in2: 'SourceGraphic', operator: 'in' }));
        d.appendChild(f);
      });

    /* The label scrim. Same hue as the night ground, so on open sky it is not
       there; over an orbit line or a bright star it is the difference between
       readable and not. */
    d.appendChild(grad('lo-label-scrim', '50%', '50%', '50%', [
      ['0%', '#070C16', 0.58], ['42%', '#070C16', 0.38],
      ['74%', '#070C16', 0.13], ['100%', '#070C16', 0]
    ]));

    /* A node's bloom. Offset to the lit face when it is placed, never centred —
       a bloom centred on a body that makes no light of its own is a lie. */
    d.appendChild(grad('lo-node-halo', '50%', '50%', '50%', [
      ['26%', '#F6CB68', 0.42], ['56%', '#E8AF38', 0.13], ['100%', '#E8AF38', 0]
    ]));

    /* One core gradient and one shadow gradient per node: both are re-aimed at
       the nucleus every time the node moves, which is what makes the light
       visibly come from the middle. */
    NODES.forEach(function (n) {
      d.appendChild(grad('lo-nc-' + n.id, '38%', '32%', '70%',
        NODE_STOPS.map(function (o, i) { return [o, NODE_BRIGHT[i]]; })));
      d.appendChild(grad('lo-ns-' + n.id, '62%', '68%', '78%', [
        ['44%', '#3A2810', 0], ['78%', '#2A1C0A', 0.28], ['100%', '#160E04', 0.60]
      ]));
    });

    return d;
  }

  /* ── the nucleus ────────────────────────────────────────────────────── */

  function buildCorona() {
    var g = svg('g', { class: 'lo-corona', 'aria-hidden': 'true' });
    function ring(r, fill, cls, lo, hi) {
      /* centred on the hot region, not the body */
      var c = svg('circle', { cx: HOT.x, cy: HOT.y, r: NUC_R * r, fill: fill });
      if (cls) {
        c.setAttribute('class', cls);
        c.style.setProperty('--lo-breath-lo', lo);
        c.style.setProperty('--lo-breath-hi', hi);
        c.style.setProperty('--lo-breath-still', ((lo + hi) / 2).toFixed(3));
      }
      g.appendChild(c);
    }
    ring(5.4, 'url(#lo-corona-3)');
    ring(3.6, 'url(#lo-corona-2)');
    ring(2.0, 'url(#lo-corona-1)');
    ring(2.5, 'url(#lo-corona-1)', 'lo-breath-b', 0.10, 0.31);
    ring(4.0, 'url(#lo-corona-2)', 'lo-breath-c', 0.08, 0.24);
    return g;
  }

  function buildNucleus() {
    var g = svg('g', { class: 'lo-nucleus', 'aria-hidden': 'true' });
    var at = { cx: FRAME.cx, cy: FRAME.cy, r: NUC_R };

    /* Isolated: the granulation blends with the body's own value and with
       nothing else. Without it the blend reaches down into the sky and the
       sphere goes translucent at the limb. */
    var body = svg('g', { class: 'lo-nuc-body' });
    body.appendChild(svg('circle', Object.assign({ fill: 'url(#lo-nuc-disc)' }, at)));
    [['lo-gran-coarse', 'overlay', 1], ['lo-gran-fine', 'soft-light', 0.8]]
      .forEach(function (f) {
        var c = svg('circle', Object.assign({ fill: '#000', filter: 'url(#' + f[0] + ')',
                                              class: 'lo-nuc-relief' }, at));
        c.style.mixBlendMode = f[1];
        c.dataset.texScale = String(f[2]);
        body.appendChild(c);
      });
    /* The hot region goes on LAST, over the granulation, because it is surface
       that is hotter — not a light falling across the surface. There is no
       terminator pass and no rim pass; both were removed by ruling. */
    body.appendChild(svg('circle', Object.assign({ fill: 'url(#lo-nuc-hot)' }, at)));
    g.appendChild(body);

    [['lo-nuc-glow-1', 'lo-breath-a', 0.08, 0.30], ['lo-nuc-glow-2', 'lo-breath-c', 0.06, 0.17]]
      .forEach(function (b) {
        var c = svg('circle', Object.assign({ fill: 'url(#' + b[0] + ')', class: b[1] }, at));
        c.style.setProperty('--lo-breath-lo', b[2]);
        c.style.setProperty('--lo-breath-hi', b[3]);
        c.style.setProperty('--lo-breath-still', ((b[2] + b[3]) / 2).toFixed(3));
        g.appendChild(c);
      });
    return g;
  }

  /* ── nodes and labels ───────────────────────────────────────────────── */

  function buildNode(n) {
    var outer = svg('g', { class: 'lo-node', 'data-node': n.id });
    var place = svg('g');
    var inner = svg('g', { class: 'lo-node-inner' });
    var halo = svg('circle', { r: HALO_R, fill: 'url(#lo-node-halo)' });
    inner.appendChild(halo);
    inner.appendChild(svg('circle', { r: NODE_R, fill: 'url(#lo-nc-' + n.id + ')' }));
    inner.appendChild(svg('circle', { r: NODE_R, fill: 'url(#lo-ns-' + n.id + ')' }));
    place.appendChild(inner);
    outer.appendChild(place);
    outer.__place = place;
    outer.__halo = halo;
    return outer;
  }

  function buildLabel(n) {
    /* three nested groups, and the nesting is load-bearing:
         depth  — inline opacity and scale, written continuously from orbital depth
         label  — the arrival's opacity animation
         inner  — the arrival's translateY
       They multiply. If depth were written onto the same element the arrival
       animates, the animation would win and depth would never be visible. */
    var depth = svg('g', { class: 'lo-label-depth', 'data-label': n.id });
    var outer = svg('g', { class: 'lo-label' });
    var inner = svg('g', { class: 'lo-label-inner' });
    var scrim = svg('ellipse', { class: 'lo-label-scrim', cx: 0, cy: 3, rx: 90, ry: 40,
                                 fill: 'url(#lo-label-scrim)' });
    inner.appendChild(scrim);
    var key = svg('text', { class: 'lo-label-key', x: 0, y: -14, 'text-anchor': 'middle' });
    key.textContent = n.key;
    inner.appendChild(key);
    n.lines.forEach(function (line, i) {
      var t = svg('text', { class: 'lo-label-line', x: 0, y: 5 + i * 16, 'text-anchor': 'middle' });
      t.textContent = line;
      inner.appendChild(t);
    });
    outer.appendChild(inner);
    depth.appendChild(outer);
    depth.__inner = inner;
    depth.__scrim = scrim;
    depth.__arrival = outer;
    return depth;
  }

  /* ── the continuous state of one node ───────────────────────────────────
     Position, layer, material, label placement and label presence all come out
     of one number — the orbital parameter t — and are written together. There is
     no branch anywhere in here that tests one element against another, which is
     what keeps label behaviour physics rather than UI. */
  function applyNodeState(sys, n, force) {
    var p = pointAt(n.orbit, n.t);
    var dist = Math.hypot(p.x - FRAME.cx, p.y - FRAME.cy);
    n.g.__place.setAttribute('transform', 'translate(' + p.x.toFixed(2) + ',' + p.y.toFixed(2) + ')');

    /* the moment a node crosses the line of nodes it changes side of the body,
       so it changes layer. This is the occlusion, in motion. */
    if (p.near !== n.near) {
      n.near = p.near;
      (p.near ? sys.front : sys.back).appendChild(n.g);
    }

    /* material: re-aim at the nucleus. Skipped when nothing has moved enough to
       change a rounded value — at the ruled drift that is once every couple of
       seconds, and under the lab's accelerator it is every frame. */
    var moved = force || Math.abs(n.t - n.matT) > 0.05;
    if (moved) {
      n.matT = n.t;
      var dx = (FRAME.cx - p.x) / (dist || 1), dy = (FRAME.cy - p.y) / (dist || 1);
      var I = intensityAt(dist);
      var k = (I - 0.42) / 0.58;
      n.coreGrad.setAttribute('cx', (50 + dx * 30).toFixed(2) + '%');
      n.coreGrad.setAttribute('cy', (50 + dy * 30).toFixed(2) + '%');
      for (var i = 0; i < n.coreStops.length; i++) {
        n.coreStops[i].setAttribute('stop-color', mixHex(NODE_DIM[i], NODE_BRIGHT[i], k));
      }
      n.shadowGrad.setAttribute('cx', (50 - dx * 26).toFixed(2) + '%');
      n.shadowGrad.setAttribute('cy', (50 - dy * 26).toFixed(2) + '%');
      n.g.__halo.setAttribute('cx', (dx * NODE_R * 0.35).toFixed(2));
      n.g.__halo.setAttribute('cy', (dy * NODE_R * 0.35).toFixed(2));
      n.g.__halo.setAttribute('r', (HALO_R * (0.70 + 0.45 * I)).toFixed(2));
      n.g.__halo.setAttribute('opacity', (0.30 + 0.60 * k).toFixed(3));
    }

    /* label: radially outward from the node, never between it and the star.
       The floor keeps a label clear of the body when its node is on the limb;
       max() is continuous, and at 0.25px/s its corner is not a thing anyone
       could resolve. */
    var ox = dist ? (p.x - FRAME.cx) / dist : 0, oy = dist ? (p.y - FRAME.cy) / dist : -1;
    var rOut = Math.max(dist + NODE_R + 34, 252);
    var ax = FRAME.cx + ox * rOut, ay = FRAME.cy + oy * rOut;

    /* presence tracks depth continuously. Distant things are dimmer; that is the
       whole mechanism, and it is why two labels can only cross when one of them
       has already receded to background. */
    var u = 0.5 + 0.5 * p.depth;                 /* 0 at the far extreme, 1 at the near */
    var op = 0.35 + 0.65 * Math.pow(u, 0.85);
    var sc = 0.93 + 0.07 * u;

    n.label.setAttribute('transform',
      'translate(' + ax.toFixed(2) + ',' + ay.toFixed(2) + ') scale(' + sc.toFixed(4) + ')');
    n.label.setAttribute('opacity', op.toFixed(3));

    /* the tether, so a label pushed off its node by the floor still belongs to
       it. Its length falls to zero on its own when the label sits on the node —
       nothing switches it on or off. */
    var reach = 1 / Math.hypot(ox / (n.halfW + 14), oy / 34);
    var x1 = p.x + ox * (NODE_R + 5), y1 = p.y + oy * (NODE_R + 5);
    var x2 = ax - ox * reach, y2 = ay - oy * reach;
    if ((x2 - x1) * ox + (y2 - y1) * oy <= 0) { x2 = x1; y2 = y1; }
    n.leader.setAttribute('x1', x1.toFixed(2)); n.leader.setAttribute('y1', y1.toFixed(2));
    n.leader.setAttribute('x2', x2.toFixed(2)); n.leader.setAttribute('y2', y2.toFixed(2));
    n.leader.setAttribute('stroke-opacity', (op * 0.30).toFixed(3));

    n.depth = p.depth;
  }

  /* Near labels paint over far ones. The order can only change at the instant
     two depths are equal, and at that instant the two are being drawn
     identically, so the swap is not observable. */
  function sortLabels(sys) {
    var order = sys.nodes.slice().sort(function (a, b) { return a.depth - b.depth; });
    var key = order.map(function (n) { return n.def.id; }).join(',');
    if (key === sys.labelOrder) return;
    sys.labelOrder = key;
    order.forEach(function (n) { sys.labels.appendChild(n.label); });
  }

  /* ── build ──────────────────────────────────────────────────────────── */

  function build(host) {
    var root = svg('svg', {
      class: 'lab-orbital__svg',
      viewBox: '0 0 ' + FRAME.w + ' ' + FRAME.h,
      preserveAspectRatio: 'xMidYMid meet',
      role: 'img',
      'aria-label': 'Orbital diagram: seven school subjects — reading, writing, math, science, history, geography and art — orbiting one central theme.'
    });
    var defs = buildDefs();
    root.appendChild(defs);

    var lBack = svg('g', { class: 'lo-layer lo-layer--back' });
    /* The near arcs where they cross the body. A thin ring passing in FRONT of a
       star is not brighter than the star — it silhouettes against it. */
    var lSil = svg('g', { class: 'lo-layer lo-layer--silhouette', 'clip-path': 'url(#lo-nuc-clip)' });
    var lFront = svg('g', { class: 'lo-layer lo-layer--front' });
    var lLeaders = svg('g', { class: 'lo-layer lo-layer--leaders' });
    var lLabels = svg('g', { class: 'lo-layer lo-layer--labels' });

    var orbitById = {};
    ORBITS.forEach(function (o) { orbitById[o.id] = o; });

    var paths = [];
    ORBITS.forEach(function (o, oi) {
      [['far', 180, 360, lBack], ['near', 0, 180, lFront]].forEach(function (h, hi) {
        var d = halfPath(o, h[1], h[2]);
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
    lBack.insertBefore(lBack.lastChild, lBack.firstChild);

    var nucleus = buildNucleus();

    var sys = { root: root, back: lBack, front: lFront, labels: lLabels, nodes: [], paths: paths,
                corona: lBack.firstChild, nucleus: nucleus, labelOrder: '' };

    NODES.forEach(function (n) {
      var o = orbitById[n.orbit];
      var pos = pointAt(o, n.t);
      var g = buildNode(n);
      (pos.near ? lFront : lBack).appendChild(g);

      var label = buildLabel(n);
      lLabels.appendChild(label);

      var wrap = svg('g', { class: 'lo-label lo-leader-wrap' });
      var leader = svg('line', { class: 'lo-leader' });
      wrap.appendChild(leader);
      lLeaders.appendChild(wrap);

      /* distinct phases per node and per component, so no two bodies move in
         step and the field never reads as one thing being animated */
      var idx = sys.nodes.length;
      var phase = LIBRATION.P.map(function (_, i) {
        return (idx * 2 * Math.PI / NODES.length) * (i + 1) + i * 1.13;
      });

      sys.nodes.push({
        def: n, orbit: o, t: n.t, matT: -999, home: pos, g: g, label: label, phase: phase,
        leader: leader, leaderWrap: wrap, near: pos.near, depth: pos.depth,
        halfW: 90,
        coreGrad: defs.querySelector('#lo-nc-' + n.id),
        shadowGrad: defs.querySelector('#lo-ns-' + n.id),
        coreStops: [].slice.call(defs.querySelectorAll('#lo-nc-' + n.id + ' stop')),
        bearing: (Math.atan2(pos.y - FRAME.cy, pos.x - FRAME.cx) / D2R + 450) % 360
      });
    });

    root.appendChild(lBack);
    root.appendChild(nucleus);
    root.appendChild(lSil);
    root.appendChild(lFront);
    root.appendChild(lLeaders);
    root.appendChild(lLabels);
    host.appendChild(root);

    return sys;
  }

  /* Measure each label once so the scrim fits its own text and the tether knows
     where the block's edge is. Re-run when the webfont lands, because the
     fallback's metrics are not Plus Jakarta Sans's. */
  function measureLabels(sys) {
    sys.nodes.forEach(function (n) {
      var w = 0;
      [].slice.call(n.label.querySelectorAll('text')).forEach(function (t) {
        try { w = Math.max(w, t.getBBox().width); } catch (e) {}
      });
      if (!w) return;
      n.halfW = w / 2;
      n.label.__scrim.setAttribute('rx', (w / 2 + 34).toFixed(1));
      n.label.__scrim.setAttribute('ry', 42);
      applyNodeState(sys, n, true);
    });
  }

  /* ── variants ───────────────────────────────────────────────────────── */

  function applyNucleus(sys, key) {
    var v = NUCLEUS_VARIANTS[key];
    sys.nucleus.querySelectorAll('.lo-nuc-relief').forEach(function (c) {
      c.style.setProperty('--lo-tex', (v.tex * Number(c.dataset.texScale)).toFixed(3));
    });
    var s = v.corona;
    /* scaled about the hot region, because that is what it is anchored to */
    sys.corona.setAttribute('transform',
      'translate(' + HOT.x + ',' + HOT.y + ') scale(' + s + ') translate(' + (-HOT.x) + ',' + (-HOT.y) + ')');
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

    /* Nodes ignite in a CLOCKWISE SWEEP STARTING AT TWELVE O'CLOCK. A sweep
       circles the nucleus, which restates the thesis while it plays. HISTORY
       sits at the apex, so the beat opens there. */
    var order = sys.nodes.slice().sort(function (a, b) { return a.bearing - b.bearing; });
    var start = 0, best = Infinity;
    order.forEach(function (n, i) {
      var d = Math.min(n.bearing, 360 - n.bearing);
      if (d < best) { best = d; start = i; }
    });
    order = order.slice(start).concat(order.slice(0, start));
    order.forEach(function (n, i) {
      var d = v.nodeStart + i * v.nodeStagger;
      n.g.style.setProperty('--lo-delay', d.toFixed(3) + 's');
      n.g.style.setProperty('--lo-node-dur', v.nodeDur + 's');
      [n.label.__arrival, n.leaderWrap].forEach(function (el) {
        el.style.setProperty('--lo-delay', (d + v.labelLag).toFixed(3) + 's');
        el.style.setProperty('--lo-label-dur', v.labelDur + 's');
      });
    });

    sys.paths.forEach(function (p) {
      var d = v.pathStart + p.orbitIndex * v.orbitStagger + p.half * v.halfDur;
      p.line.style.setProperty('--lo-delay', d.toFixed(3) + 's');
      p.line.style.setProperty('--lo-draw-dur', v.halfDur + 's');
      p.glow.style.setProperty('--lo-delay', d.toFixed(3) + 's');
      p.glow.style.setProperty('--lo-draw-dur', (v.halfDur * 1.18).toFixed(3) + 's');
    });

    return v.pathStart + (ORBITS.length - 1) * v.orbitStagger + v.halfDur * 2;
  }

  /* ── orbit drift ────────────────────────────────────────────────────── */

  function makeDrift(sys) {
    var raf = 0, prev = 0, on = false, scale = 1, tau = 0;

    /* Each node starts at the sum's zero, so t equals its composed value at
       tau = 0 and the excursion stays inside +/- 2 * amp. */
    function librate(n, time) {
      var L = LIBRATION, s = 0;
      for (var i = 0; i < L.P.length; i++) {
        var ph = n.phase[i];
        s += L.w[i] * (Math.sin(2 * Math.PI * time / L.P[i] + ph) - Math.sin(ph));
      }
      return n.def.t + L.amp * s;
    }

    /* A node covers 0.02 degrees — under a fifth of a pixel at the widest orbit
       — about once a second at the ruled rate, so writing the DOM every frame
       is work done far below what anything can resolve. Round 2's first build
       did exactly that and cost a whole frame step; this gate gave it back. The
       gate is on distance moved, not on a clock, so the lab's accelerator still
       gets every frame. */
    function tick(dt) {
      tau += dt * scale;
      var changed = false;
      for (var i = 0; i < sys.nodes.length; i++) {
        var n = sys.nodes[i], t = librate(n, tau);
        if (Math.abs(t - n.t) > 0.02) { n.t = t; applyNodeState(sys, n, false); changed = true; }
      }
      if (changed) sortLabels(sys);
      return changed;
    }

    function frame(now) {
      if (!on) return;
      var dt = prev ? Math.min((now - prev) / 1000, 0.1) : 0;
      prev = now;
      tick(dt);
      raf = requestAnimationFrame(frame);
    }

    return {
      start: function () { if (on) return; on = true; prev = 0; raf = requestAnimationFrame(frame); },
      stop: function () {
        on = false;
        if (raf) cancelAnimationFrame(raf);
        raf = 0; tau = 0;
        sys.nodes.forEach(function (n) { n.t = n.def.t; applyNodeState(sys, n, true); });
        sortLabels(sys);
      },
      /* lab only: the ruled rhythm is half-hourly, which is the point of it.
         Nothing here changes what ships; it is how the excursion gets inspected
         inside a working session. */
      setScale: function (s) { scale = s; },
      getScale: function () { return scale; },
      running: function () { return on; },
      time: function () { return tau; },
      /* used by the verification script to walk the libration deterministically */
      advance: function (seconds) {
        tau += seconds;
        sys.nodes.forEach(function (n) { n.t = librate(n, tau); applyNodeState(sys, n, true); });
        sortLabels(sys);
      },
      excursion: function () {
        return sys.nodes.map(function (n) {
          return { id: n.def.id, delta: +(n.t - n.def.t).toFixed(3) };
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
      void section.offsetWidth;
      section.dataset.arrival = 'running';
      window.setTimeout(function () {
        if (section.dataset.arrival === 'running') section.dataset.arrival = 'done';
      }, (total + 0.25) * 1000);
    }

    applyNucleus(sys, state.nucleus);
    applyArrival(sys, state.arrival);
    sys.nodes.forEach(function (n) { applyNodeState(sys, n, true); });
    sortLabels(sys);
    measureLabels(sys);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { measureLabels(sys); });
    }

    if (reduced()) {
      /* the completed state, rendered. No arrival, no drift; depth-linked label
         presence still applies, because it is distance, not motion. */
      section.dataset.arrival = 'done';
      latched = true;
    } else {
      if (state.orbits === 'drift') drift.start();
      if ('IntersectionObserver' in window) {
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
        if (group === 'speed') drift.setScale(Number(value));
      });
    }

    window.WizkooLabOrbital = {
      sys: sys, state: state, play: playArrival, drift: drift,
      FRAME: FRAME, NUC_R: NUC_R, HOT: HOT, ORBITS: ORBITS, NODES: NODES,
      pointAt: pointAt, intensityAt: intensityAt,
      /* used by the verification script to walk the drift deterministically */
      setT: function (map) {
        sys.nodes.forEach(function (n) { if (map[n.def.id] != null) n.t = map[n.def.id]; applyNodeState(sys, n, true); });
        sortLabels(sys);
      },
      advance: function (seconds) { drift.advance(seconds); }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
