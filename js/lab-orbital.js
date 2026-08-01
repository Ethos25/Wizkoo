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
 * THE LIGHT MODEL — round 2, deepened in round 3
 *   THE NUCLEUS IS SELF-LUMINOUS. It is the only light source in the frame, and
 *   nothing else in the frame may imply another one. Round 1 lit it like a
 *   planet — diffuse falloff from upper left, a terminator opposite, a rim light
 *   on the far limb — and wrapped it in a symmetrical corona. Two contradictory
 *   sources in one frame: the sphere said a lamp was over there, the corona said
 *   a sun was behind. What a viewer feels, without needing to name it, is an
 *   object in front of a light rather than a light.
 *
 *   Round 2 replaced the model. Round 3 found it still read flat and fixed the
 *   two reasons why — see the block above renderBody. The body is now one raster
 *   sphere map: limb darkening on the exact mu law, granulation sampled at the
 *   surface point so it compresses toward the limb, the hot region as a cap on
 *   the sphere, and the bleed past the edge drawn inside the same image and
 *   coloured from the limb it leaves. No SVG filters remain on the nucleus.
 *
 *   AND THE DEMONSTRATION: the nodes are lit BY the nucleus. Each node's bright
 *   side faces the centre and its dark side faces out, with brightness falling
 *   off with distance. This is what settles the question — once light is visibly
 *   travelling outward from the middle of the frame, nobody wonders where it
 *   comes from, because they can watch it arrive.
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

  /* ── ONE TREATMENT — RULED round 4 ──────────────────────────────────────
     The three used to differ in colour and weight — chalk, saffron, ocean, at
     1.2 / 1.1 / 1.0. That looked like an encoding and encoded nothing, and the
     one thing it might have carried, depth, it did not carry: both halves of
     every orbit were drawn at the same opacity, so front and back were told
     apart only by what happened to be painted over them.

     Now: one colour, one weight, and DEPTH IN OPACITY ALONE. The three are still
     told apart, by the only thing that should tell them apart — their geometry.

     The opacity is continuous along each arc rather than one value for the front
     half and another for the back. Two flat halves meet at the major-axis
     extremes, and a step there is a seam at exactly the place the eye is
     tracking the line. Each orbit is cut into 15-degree segments and each takes
     its opacity from the depth at its own midpoint, so the value slides through
     the junction instead of jumping it. */
  var ORBIT_STROKE = 'rgba(226,234,248,1)';
  var ORBIT_WIDTH = 1.1;
  var ORBIT_BASE = 0.26;
  var SEG_DEG = 15;

  /* depth -1 at the far extreme, +1 at the near */
  function orbitAlpha(depth) {
    return ORBIT_BASE * (0.40 + 0.60 * (0.5 + 0.5 * depth));
  }

  var ORBITS = [
    /* Drawn in order of DECREASING minor axis: each orbit lies flatter than the
       last, so the system's depth deepens as it completes and the final stroke
       is the one that runs straight across the nucleus's face.

       No dashed orbit. A dash pattern and a dash-offset draw are the same
       property, and the draw is the beat. */
    { id: 'c', rx: 356, ry: 115, rot: 85 },
    { id: 'a', rx: 480, ry: 101, rot: -22 },
    { id: 'b', rx: 446, ry: 82,  rot: 31 }
  ];

  /* ── LIBRATION — RULED round 3: bigger, and faster within what is safe ──
     Round 2's setting, 11px a minute, sat below the threshold of registering a
     change on return, which was the point of having it. Two things moved.

     AMPLITUDE IS NOW PER NODE, inversely proportional to |dP/dtheta| at the
     body's own position. On an ellipse that factor swings from ry at the
     major-axis extreme to rx at the minor — 101 against 480 on orbit a — so one
     uniform angular amplitude makes a body at its turning point crawl while a
     body crossing the face flies, at 4.7x the difference. Setting amplitude
     inversely gives every body the SAME peak screen speed, which is the thing a
     viewer actually reads. Each body librating by its own angle is legitimate:
     amplitude belongs to the body's motion, not to the orbit under it.

     K is what the labels cap. K = 3000 is clean across the excursion box;
     K = 4000 is not (reading x art, 609px2). Amplitudes are therefore
     29.4 / 23.1 / 29.4 / 6.3 / 23.1 / 6.9 / 20.8 degrees, and the excursion is
     exactly +/- that: each node carries a TIME offset rather than a phase offset
     inside the sum, so the components still start together. Round 2 subtracted
     the value at phase zero instead, which decorrelated the bodies at the cost
     of doubling the box the labels had to survive — and that doubling is what
     held round 2's excursion down to 16 degrees.

     THE PERIODS set the rate independently of the amplitude. 307 / 491 / 787
     seconds, all prime, composite about 3.8 years. Peak screen speed 0.85 px/s
     on every body; averaged over a swing, about 16px in thirty seconds.

     That 0.85 is deliberately at the perceptual boundary and there is no setting
     comfortably clear of both sides of the ruling. Detecting motion against a
     static reference takes roughly 1 to 2 arcmin per second, which at a normal
     viewing distance is about 0.7 to 1.3 px/s; the rate is sinusoidal, so it is
     near peak only briefly and spends most of a swing well under it. Registering
     a change after half a minute away needs something in the tens of pixels.
     Those two requirements meet here and nowhere roomier. */
  var LIBRATION = {
    K: 3000,
    w: [0.55, 0.30, 0.15],
    P: [307, 491, 787]
  };

  /* sum of w_i * 2pi / P_i — the libration's angular rate per unit amplitude,
     which is what turns an amplitude in degrees into a screen speed in px/s */
  var SIGMA = 0;
  LIBRATION.w.forEach(function (w, i) { SIGMA += w * 2 * Math.PI / LIBRATION.P[i]; });

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

  /* mixHex is still here because the corona's colour cools outward. The node
     palettes it used to serve are gone: a node's value now comes out of the
     sphere renderer, which is the point of round 4's second finding. */
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
    /* tex: granulation depth. bleed: how far the body's light gets past its own
       edge. hot: the active region's added brightness. breath: the three
       amplitudes. The LIGHT MODEL is identical across all three — these move how
       much star there is, never where the light comes from. */
    /* breath slots, in build order: the hot region's glow, the OUTER CORONA,
       and a disc-wide lift. The corona's pair sits near full because it is the
       star's light in the field, not a veil over it — round 4's first wiring
       handed it the old faint-field amplitudes and it rendered at a tenth of its
       strength, which measured as no corona at all. */
    a: { tex: 0.16, bleed: 0.80, hot: 0.34, corona: 0.86,
         breath: [[0.08, 0.30], [0.82, 1.00], [0.05, 0.14]] },
    b: { tex: 0.24, bleed: 1.00, hot: 0.44, corona: 1.00,
         breath: [[0.12, 0.44], [0.80, 1.00], [0.07, 0.20]] },
    c: { tex: 0.34, bleed: 1.24, hot: 0.56, corona: 1.18,
         breath: [[0.17, 0.62], [0.78, 1.00], [0.09, 0.27]] }
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

    /* Interior life. The body itself is a raster now, so the breath rides on
       two additive overlays: one held inside the hot region, so it reads as the
       active region pulsing, and one across the disc with the same falloff shape
       as the limb law, so it lifts the whole body without flattening it. */
    d.appendChild(grad('lo-nuc-glow-1', '38%', '32%', '30%', [
      ['0%', '#FFFEF8', 0.92], ['42%', '#FFF0C4', 0.34], ['100%', '#FFE29A', 0]
    ]));
    d.appendChild(grad('lo-nuc-glow-2', '50%', '50%', '50%', [
      ['0%', '#FFF0C4', 0.55], ['58%', '#F6CB68', 0.20], ['88%', '#E8AF38', 0.04], ['100%', '#E8AF38', 0]
    ]));

    d.appendChild(grad('lo-corona', '50%', '50%', '50%', coronaStops(1)));

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

    return d;
  }


  /* ══ THE OUTER CORONA ══════════════════════════════════════════════════
     Round 3 deleted the outer glow because round 2's version had become a pale
     halo floating off the shoulder. That overcorrected: a body this bright has
     to light the space around it, and without that it reads as pasted onto the
     sky rather than sitting in it.

     What made the ghost a ghost was that it was CENTRED ON THE HOT REGION. An
     asymmetric glow at several body radii has a centre of its own, and anything
     with a centre of its own is a second object. A symmetric one cannot be: it
     has no position apart from the body's.

     So this is centred on the body, radially symmetric, and monotonically
     decreasing from the limb outward — no local maximum anywhere, which is what
     would read as a ring. The profile is an inverse power law, r^-2.6, because a
     power law has no characteristic scale and therefore no radius at which
     anything appears to happen. The exponent is 2.2 rather than the 2.6 tried
     first, because 2.6 put the glow under a luminance point by three and a half
     body radii, which is a bloom rather than a presence in the field. It is
     multiplied by a window that reaches zero
     WITH ZERO SLOPE at the gradient's edge, so the element's own boundary is not
     a boundary: the alpha there is not merely small, its derivative is zero too.

     The hot region still biases the surface and the near bleed inside the body's
     own image. It does not touch this. Past the limb the star is round. */
  var CORONA = { A: 0.30, Rout: 6.9, p: 2.2 };

  function coronaStops(scale) {
    var out = [], A = CORONA.A * (scale == null ? 1 : scale);
    /* Stops LOGARITHMICALLY spaced in radius, not evenly. A gradient
       interpolates linearly between its stops, and this profile is far steeper
       just outside the limb than it is anywhere else, so evenly-spaced stops put
       a visible kink exactly where the eye is. Measured, that kink was a 1.48
       rise in the falloff rate at r/R 1.34 — a boundary, which is the one thing
       this may not have. Log spacing puts the stops where the curvature is. */
    var n = 64, r0 = 1;
    out.push(['0%', '#FFDFA0', A.toFixed(5)]);
    out.push([(100 / CORONA.Rout * 0.98).toFixed(3) + '%', '#FFDFA0', A.toFixed(5)]);
    for (var i = 0; i <= n; i++) {
      var r = r0 * Math.pow(CORONA.Rout / r0, i / n);
      var w = 1 - Math.pow((r - 1) / (CORONA.Rout - 1), 2);
      var a = A * Math.pow(1 / r, CORONA.p) * w * w;
      var t = Math.min(1, Math.max(0, (r - 1) / (CORONA.Rout - 1)));
      out.push([(100 * r / CORONA.Rout).toFixed(3) + '%', mixHex('#FFDFA0', '#B8863A', t), a.toFixed(5)]);
    }
    return out;
  }

  /* ══ THE BODY, rendered as a sphere map ═══════════════════════════════
     Round 3 replaced the stack of SVG gradients and filters with one raster,
     and the reason is the two findings that came off the walk.

     LIMB DARKENING HAD TO CARRY THE WHOLE JOB. With no terminator, the falloff
     toward the edge is the only cue that this is a sphere rather than a disc,
     and a radial gradient cannot state it correctly: the real profile is not
     linear in radius, it follows mu = cos(theta) = sqrt(1 - r^2), which is flat
     through the middle and then plunges in the last tenth. That plunge is the
     signature. Approximating it with hand-placed stops is what left round 2
     reading nearly as bright at the silhouette as at the centre.

     TEXTURE HAD TO FOLLOW THE CURVE. Granulation drawn at uniform scale across
     the face is the flat-sphere tell — on a real body the pattern compresses
     hard toward the limb as the surface turns away. There is no SVG filter that
     does a spherical map. Sampling 3D noise at the SURFACE POINT (nx, ny, mu)
     does it exactly and for free: near the limb mu changes fast for a small step
     in screen position, so the noise runs through many periods in few pixels.

     Both fall out of one loop, along with the hot region as a genuine cap on the
     sphere (so it foreshortens near the limb like anything else on the surface),
     and the bleed past the edge as part of the same image — which is what stops
     it reading as a separate luminous object. One element, no filters, and the
     assertions in scripts/lab-orbital-r2.js read it back pixel by pixel. */

  /* Limb darkening. The physical law is I = (1-u) + u*mu with mu = cos(theta),
     and at u = 0.6 it is roughly the Sun in visible light. Two departures from
     it, both deliberate and both because this body is 250px across rather than
     half a degree of sky:

       u = 0.86        takes the true limb down to 14% of centre rather than 40%
       mu ^ 1.5        starts the falloff earlier, so the curve is legible across
                       the outer third instead of only in the last few pixels

     Physically correct limb darkening concentrates almost all of its drop in the
     final one or two percent of the radius. That is right for a photograph of
     the Sun and useless at this size — it left the body reading nearly as bright
     at its silhouette as at its centre, which was the finding. This is the
     exaggeration, stated rather than hidden. It cannot read as shadow, because
     it is identical in every direction. */
  var U_LIMB = 0.86, LIMB_P = 1.5;
  var EXTENT = 1.34;              /* canvas half-width in body radii; the rest is bleed */

  /* The hot region as a direction on the sphere. 38% 32% of the body's box is
     the value the product already carries, expressed here as a unit vector so it
     can be dotted with the surface normal. */
  var HOT_N = (function () {
    var x = 2 * 0.38 - 1, y = 2 * 0.32 - 1;
    return { x: x, y: y, z: Math.sqrt(Math.max(0, 1 - x * x - y * y)) };
  })();

  function hash3(i, j, k) {
    var n = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(k, 1274126177)) | 0;
    n = (n ^ (n >>> 13)) | 0;
    n = Math.imul(n, 1274126177) | 0;
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  }
  function vnoise(x, y, z) {
    var xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
    var xf = x - xi, yf = y - yi, zf = z - zi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
    function c(a, b, t) { return a + (b - a) * t; }
    var n000 = hash3(xi, yi, zi),         n100 = hash3(xi + 1, yi, zi);
    var n010 = hash3(xi, yi + 1, zi),     n110 = hash3(xi + 1, yi + 1, zi);
    var n001 = hash3(xi, yi, zi + 1),     n101 = hash3(xi + 1, yi, zi + 1);
    var n011 = hash3(xi, yi + 1, zi + 1), n111 = hash3(xi + 1, yi + 1, zi + 1);
    return c(c(c(n000, n100, u), c(n010, n110, u), v),
             c(c(n001, n101, u), c(n011, n111, u), v), w) * 2 - 1;
  }
  function fbm(x, y, z, oct) {
    var s = 0, a = 1, f = 1, norm = 0;
    for (var i = 0; i < oct; i++) {
      s += a * vnoise(x * f, y * f, z * f);
      norm += a; a *= 0.5; f *= 2.03;
    }
    return s / norm;
  }

  /* The value ramp. Deliberately shifts hue as well as level: a star's limb is
     cooler and redder because you are looking through more of it. */
  var RAMP = [
    [1.34, [255, 253, 244]], [1.12, [255, 248, 224]], [0.98, [255, 240, 196]],
    [0.86, [253, 226, 157]], [0.74, [246, 206, 114]], [0.62, [236, 178, 72]],
    [0.50, [214, 146, 50]], [0.40, [180, 114, 36]], [0.31, [142, 85, 25]],
    [0.23, [104, 60, 17]], [0.15, [70, 39, 11]], [0.00, [40, 22, 7]]
  ];
  /* A node is gold, not star-stuff: its value never reaches the top of the
     body's ramp and the body's ramp bottoms out in browns, so lit by it a node
     comes out muddy. Its own ramp keeps it gold from the lit limb to the
     shadow. */
  var NODE_RAMP = [
    [1.20, [255, 246, 220]], [1.00, [255, 232, 172]], [0.84, [250, 212, 124]],
    [0.68, [240, 194, 78]],  [0.54, [214, 160, 52]],  [0.42, [176, 126, 40]],
    [0.31, [132, 92, 33]],   [0.21, [92, 64, 27]],    [0.12, [58, 42, 22]],
    [0.00, [34, 26, 16]]
  ];
  function rampWith(TBL, I, out) {
    for (var i = 1; i < TBL.length; i++) {
      if (I >= TBL[i][0] || i === TBL.length - 1) {
        var hi = TBL[i - 1], lo = TBL[i];
        var t = (I - lo[0]) / (hi[0] - lo[0]);
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        out[0] = lo[1][0] + (hi[1][0] - lo[1][0]) * t;
        out[1] = lo[1][1] + (hi[1][1] - lo[1][1]) * t;
        out[2] = lo[1][2] + (hi[1][2] - lo[1][2]) * t;
        return;
      }
    }
  }
  function ramp(I, out) {
    for (var i = 1; i < RAMP.length; i++) {
      if (I >= RAMP[i][0] || i === RAMP.length - 1) {
        var hi = RAMP[i - 1], lo = RAMP[i];
        var t = (I - lo[0]) / (hi[0] - lo[0]);
        t = t < 0 ? 0 : t > 1 ? 1 : t;
        out[0] = lo[1][0] + (hi[1][0] - lo[1][0]) * t;
        out[1] = lo[1][1] + (hi[1][1] - lo[1][1]) * t;
        out[2] = lo[1][2] + (hi[1][2] - lo[1][2]) * t;
        return;
      }
    }
  }

  /* px is the canvas edge in device pixels; it spans 2 * EXTENT body radii. */
  function renderBody(px, v, textureOnly) {
    var cv = document.createElement('canvas');
    cv.width = cv.height = px;
    var ctx = cv.getContext('2d');
    var img = ctx.createImageData(px, px);
    var d = img.data;
    var half = px / 2, scale = EXTENT / half;
    var edge = 1.4 * scale;                     /* one and a bit pixels, for the limb */
    var col = [0, 0, 0];
    var F1 = 5.4, F2 = 15.1;                    /* cells, then grain */
    var tex = v.tex;
    /* The bleed: tight to the limb, anchored to the hot side, and — the part
       that matters — COLOURED FROM THE LIMB IT LEAVES. A fixed bright warm
       colour draws a bright line along the edge, which is a rim light, which is
       the thing round 2 deleted. Taking the body's own value at that bearing and
       lifting it slightly makes the glow continuous with the surface it comes
       off, so it reads as light getting past an edge rather than as an edge. */
    var bleedA = 0.30 * v.bleed, bleedK = 6.2 / (EXTENT - 1);
    var limbCol = [0, 0, 0];

    for (var y = 0; y < px; y++) {
      var ny = (y + 0.5 - half) * scale;
      for (var x = 0; x < px; x++) {
        var nx = (x + 0.5 - half) * scale;
        var r2 = nx * nx + ny * ny, r = Math.sqrt(r2), o = (y * px + x) * 4;

        if (r < 1 + edge) {
          var rc = r > 1 ? 1 : r;
          var mu = Math.sqrt(1 - rc * rc);
          /* the mu law: flat through the middle, plunging at the edge */
          var I = (1 - U_LIMB) + U_LIMB * Math.pow(mu, LIMB_P);
          if (textureOnly) I = 0.62;
          /* granulation on the SURFACE, so it compresses toward the limb */
          var g = 0.64 * fbm(nx * F1, ny * F1, mu * F1, 3) +
                  0.36 * fbm(nx * F2 + 11.3, ny * F2 - 7.1, mu * F2 + 3.7, 2);
          I *= 1 + tex * g;
          if (!textureOnly) {
            /* the hot region, a cap on the sphere — additive only, so it can
               brighten the surface and can never shade it */
            var dot = nx * HOT_N.x + ny * HOT_N.y + mu * HOT_N.z;
            var capT = (dot - 0.34) / 0.66;
            if (capT > 0) { capT = capT > 1 ? 1 : capT; I += v.hot * capT * capT * capT; }
          }
          ramp(I, col);
          var a = r <= 1 - edge ? 1 : (1 + edge - r) / (2 * edge);
          d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2];
          d[o + 3] = 255 * (a < 0 ? 0 : a > 1 ? 1 : a);
        } else if (!textureOnly && r < EXTENT) {
          var t = r - 1;
          var ux = nx / r, uy = ny / r;
          var dirDot = ux * HOT_N.x + uy * HOT_N.y;
          var f = 0.5 + 0.5 * dirDot;
          var dir = 0.12 + 0.88 * f * f;
          /* the body's own value where this ray leaves the limb */
          var Il = (1 - U_LIMB);
          var ld = ux * HOT_N.x + uy * HOT_N.y;
          var lc = (ld - 0.34) / 0.66;
          if (lc > 0) { lc = lc > 1 ? 1 : lc; Il += v.hot * lc * lc * lc; }
          ramp(Il * 2.4 + 0.20, limbCol);
          var A = bleedA * dir * Math.exp(-t * bleedK);
          d[o] = limbCol[0]; d[o + 1] = limbCol[1]; d[o + 2] = limbCol[2];
          d[o + 3] = 255 * (A < 0 ? 0 : A > 1 ? 1 : A);
        } else {
          d[o + 3] = 0;
        }
      }
    }
    ctx.putImageData(img, 0, 0);
    return cv;
  }


  /* ══ NODES, at their own scale ════════════════════════════════════════
     Asserted lit by the nucleus and still reading as plain gold discs beside a
     body with real surface. The assertion was true and the picture was not: a
     gradient offset toward the nucleus is a lit disc, which is exactly the
     mistake round 1 made at the other scale.

     So a node is a sphere too. Lambertian, lit from the side — the source is in
     the plane of the sky, so the terminator runs through the middle and the
     outward half is genuinely dark rather than merely dimmer. A limb-darkening
     term takes every edge down as well, including the lit one, which is what
     stops the bright side reading as a rim.

     ONE canvas serves all seven. A sphere lit from a direction in the plane of
     the sky is symmetric about that direction, so the same image rotated to
     point at the nucleus is exact for any bearing — no per-frame re-render, and
     the light visibly swings as a body librates. Only INTENSITY needs its own
     render, and intensity changes slowly. */
  function renderNodeSphere(px, I) {
    var cv = document.createElement('canvas');
    cv.width = cv.height = px;
    var ctx = cv.getContext('2d');
    var img = ctx.createImageData(px, px), d = img.data;
    var half = px / 2, sc = 1 / half, edge = 1.5 * sc;
    var col = [0, 0, 0];
    /* The star is not a point at this distance — it subtends a wide angle from
       a node, so the terminator WRAPS rather than cutting. That is why the
       lambert term is offset before it is clamped: a hard vertical edge down the
       middle of a small sphere reads as a cut-out, and it is also wrong. The
       ambient is what the corona and the star field put back. */
    var AMB = 0.20, WRAP = 0.45;
    for (var y = 0; y < px; y++) {
      var ny = (y + 0.5 - half) * sc;
      for (var x = 0; x < px; x++) {
        var nx = (x + 0.5 - half) * sc;
        var r = Math.sqrt(nx * nx + ny * ny), o = (y * px + x) * 4;
        if (r >= 1 + edge) { d[o + 3] = 0; continue; }
        var rc = r > 1 ? 1 : r, mu = Math.sqrt(1 - rc * rc);
        /* lit from +x, so n . L is simply nx; WRAP carries it past the
           geometric terminator the way an extended source does */
        var lam = (nx + WRAP) / (1 + WRAP);
        lam = lam < 0 ? 0 : Math.pow(lam, 1.15);
        var L = (AMB + (1 - AMB) * lam) * (0.40 + 0.60 * Math.pow(mu, 0.5));
        rampWith(NODE_RAMP, L * (0.62 + 0.68 * I), col);
        var a = r <= 1 - edge ? 1 : (1 + edge - r) / (2 * edge);
        d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2];
        d[o + 3] = 255 * (a < 0 ? 0 : a > 1 ? 1 : a);
      }
    }
    ctx.putImageData(img, 0, 0);
    return cv.toDataURL('image/png');
  }

  /* ── the nucleus ────────────────────────────────────────────────────── */

  /* The corona: one circle, centred on the body, carrying the profile above. */
  function buildCorona() {
    var g = svg('g', { class: 'lo-corona', 'aria-hidden': 'true' });
    var c = svg('circle', { cx: FRAME.cx, cy: FRAME.cy, r: NUC_R * CORONA.Rout,
                            fill: 'url(#lo-corona)', class: 'lo-breath-b' });
    c.style.setProperty('--lo-breath-lo', 0.78);
    c.style.setProperty('--lo-breath-hi', 1);
    c.style.setProperty('--lo-breath-still', 0.89);
    g.appendChild(c);
    return g;
  }

  function buildNucleus() {
    var g = svg('g', { class: 'lo-nucleus', 'aria-hidden': 'true' });
    var side = 2 * NUC_R * EXTENT;
    var im = svg('image', {
      class: 'lo-nuc-body',
      x: FRAME.cx - side / 2, y: FRAME.cy - side / 2, width: side, height: side
    });
    g.appendChild(im);
    g.__image = im;

    var at = { cx: FRAME.cx, cy: FRAME.cy, r: NUC_R };
    [['lo-nuc-glow-1', 'lo-breath-a', 0.08, 0.30], ['lo-nuc-glow-2', 'lo-breath-c', 0.05, 0.14]]
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
    var body = svg('image', { x: -NODE_R, y: -NODE_R, width: 2 * NODE_R, height: 2 * NODE_R,
                              class: 'lo-node-body' });
    inner.appendChild(halo);
    inner.appendChild(body);
    place.appendChild(inner);
    outer.appendChild(place);
    outer.__place = place;
    outer.__halo = halo;
    outer.__body = body;
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
      /* the sphere is lit from +x in its own image, so pointing it at the
         nucleus is one rotation — and the light swings as the body librates */
      n.bearing2 = Math.atan2(dy, dx) / D2R;
      n.g.__body.setAttribute('transform', 'rotate(' + n.bearing2.toFixed(2) + ')');
      if (Math.abs(I - n.imgI) > 0.02) {
        n.imgI = I;
        n.g.__body.setAttribute('href', renderNodeSphere(96, I));
      }
      n.g.__halo.setAttribute('cx', (dx * NODE_R * 0.35).toFixed(2));
      n.g.__halo.setAttribute('cy', (dy * NODE_R * 0.35).toFixed(2));
      n.g.__halo.setAttribute('r', (HALO_R * (0.70 + 0.45 * I)).toFixed(2));
      n.g.__halo.setAttribute('opacity', (0.22 + 0.48 * k).toFixed(3));
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

    /* Each orbit is cut into SEG_DEG segments, ordered so the draw travels as
       one continuous stroke: the far half first, from one major-axis extreme
       through the back, then the near half picking it up on the other side and
       crossing in front. Segments overlap by a hair so no hairline gap opens
       between them, and each carries the opacity of its own midpoint depth. */
    var paths = [];
    var perHalf = 180 / SEG_DEG;
    ORBITS.forEach(function (o, oi) {
      var order = [];
      for (var k = 0; k < perHalf; k++) order.push([180 + k * SEG_DEG, 'far']);
      for (var k2 = 0; k2 < perHalf; k2++) order.push([k2 * SEG_DEG, 'near']);
      order.forEach(function (seg, si) {
        var t0 = seg[0], t1 = t0 + SEG_DEG;
        var mid = (t0 + t1) / 2;
        var a = orbitAlpha(Math.sin(mid * D2R));
        var pad = si === 0 ? 0 : 0.4;
        var d = halfPath(o, t0 - pad, t1 + 0.4);
        var far = seg[1] === 'far';
        var host = far ? lBack : lFront;
        var glow = svg('path', { class: 'lo-path lo-glow', d: d, fill: 'none', 'pathLength': 1,
                                 stroke: ORBIT_STROKE, 'stroke-width': ORBIT_WIDTH * 3.4,
                                 'stroke-opacity': (a * 0.55).toFixed(4), 'stroke-linecap': 'round' });
        var line = svg('path', { class: 'lo-path', d: d, fill: 'none', 'pathLength': 1,
                                 stroke: ORBIT_STROKE, 'stroke-width': ORBIT_WIDTH,
                                 'stroke-opacity': a.toFixed(4), 'stroke-linecap': 'round' });
        host.appendChild(glow);
        host.appendChild(line);
        paths.push({ orbit: o, orbitIndex: oi, seg: si, segs: order.length,
                     line: line, glow: glow });
      });

      /* The near half where it crosses the body, in one piece and clipped to the
         disc. A thin ring passing in FRONT of a star is not brighter than the
         star — it silhouettes against it. Painting it in the orbit's own value
         over a body this bright makes it vanish, which reads as behind. */
      var sil = svg('path', { class: 'lo-path', d: halfPath(o, 0, 180), fill: 'none',
                              'pathLength': 1, stroke: '#6B4712', 'stroke-opacity': 0.62,
                              'stroke-width': ORBIT_WIDTH + 0.5, 'stroke-linecap': 'round' });
      lSil.appendChild(sil);
      paths.push({ orbit: o, orbitIndex: oi, seg: perHalf, segs: 2 * perHalf,
                   line: sil, glow: sil });
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

      /* |dP/dtheta| at the composed position, in px per radian: what decides
         how far this body has to swing to move as far on screen as any other. */
      var tt = n.t * D2R;
      var tangential = Math.hypot(o.rx * Math.sin(tt), o.ry * Math.cos(tt));
      /* k spreads the rhythms; amplitude carries k so the peak speed does not */
      var idx = sys.nodes.length;
      var k = 0.92 + 0.028 * idx;
      var amp = (LIBRATION.K / tangential) * k;

      sys.nodes.push({
        def: n, orbit: o, t: n.t, matT: -999, home: pos, g: g, label: label,
        amp: amp, tangential: tangential, k: k,
        leader: leader, leaderWrap: wrap, near: pos.near, depth: pos.depth,
        halfW: 90, imgI: -1, bearing2: 0,
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
    /* 512 spans 2 * EXTENT * 125 = 335 frame units, so the body renders at
       better than 1.5 device pixels per texel at a 2x display. */
    var cv = renderBody(512, v, false);
    sys.nucleus.__image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', cv.toDataURL('image/png'));
    sys.nucleus.__image.setAttribute('href', cv.toDataURL('image/png'));
    sys.nucleusVariant = key;

    /* the corona's reach moves with the variant, so its stops are rebuilt */
    var cg = sys.root.querySelector('#lo-corona');
    while (cg.firstChild) cg.removeChild(cg.firstChild);
    coronaStops(v.corona).forEach(function (st) {
      cg.appendChild(svg('stop', { offset: st[0], 'stop-color': st[1], 'stop-opacity': st[2] }));
    });

    var layers = [
      sys.nucleus.querySelector('.lo-breath-a'),
      sys.corona.querySelector('.lo-breath-b'),
      sys.nucleus.querySelector('.lo-breath-c')
    ];
    layers.forEach(function (el, i) {
      if (!el) return;
      var a = v.breath[i];
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

    /* One continuous travel per orbit, handed from segment to segment. The
       silhouette rides the near half's window so the stroke crossing the body
       and the stroke crossing the sky are the same stroke. */
    sys.paths.forEach(function (p) {
      var each = (v.halfDur * 2) / p.segs;
      var d = v.pathStart + p.orbitIndex * v.orbitStagger + p.seg * each;
      var dur = p.line === p.glow ? v.halfDur : each * 1.25;
      p.line.style.setProperty('--lo-delay', d.toFixed(3) + 's');
      p.line.style.setProperty('--lo-draw-dur', dur.toFixed(3) + 's');
      p.glow.style.setProperty('--lo-delay', d.toFixed(3) + 's');
      p.glow.style.setProperty('--lo-draw-dur', (dur * 1.18).toFixed(3) + 's');
    });

    return v.pathStart + (ORBITS.length - 1) * v.orbitStagger + v.halfDur * 2;
  }

  /* ── orbit drift ────────────────────────────────────────────────────── */

  function makeDrift(sys) {
    var raf = 0, prev = 0, on = false, scale = 1, tau = 0;

    /* Every sine starts at zero, so librate(n, 0) is EXACTLY the composed
       position — which matters more than it sounds. The composed state is what
       the arrival lands on, what "static" shows, and what carries the ruled
       limb-straddling geometry; if the libration's zero sat anywhere else, the
       system would jump the moment it started and SCIENCE and ART would no
       longer sit on the limb. Round 3's first attempt used per-node TIME offsets
       to decorrelate the bodies, which broke exactly this.

       Bodies are decorrelated by PERIOD instead: node i runs the three
       components at k_i times their base periods. That changes its angular rate
       by 1/k_i, so its amplitude is scaled by k_i to compensate — leaving every
       body at the same peak screen speed, on its own rhythm, starting from rest
       at its composed place. */
    function librate(n, time) {
      var L = LIBRATION, s = 0;
      for (var i = 0; i < L.P.length; i++) {
        s += L.w[i] * Math.sin(2 * Math.PI * time / (L.P[i] * n.k));
      }
      return n.def.t + n.amp * s;
    }

    /* A node covers 0.02 degrees far below anything anyone can resolve, so
       writing the DOM every frame is work done under the threshold. The gate is
       on distance moved, not on a clock, so the lab's accelerator still gets
       every frame. */
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
      setScale: function (s) { scale = s; },
      getScale: function () { return scale; },
      running: function () { return on; },
      time: function () { return tau; },
      advance: function (seconds) {
        tau += seconds;
        sys.nodes.forEach(function (n) { n.t = librate(n, tau); applyNodeState(sys, n, true); });
        sortLabels(sys);
      },
      amplitudes: function () {
        return sys.nodes.map(function (n) {
          return { id: n.def.id, amp: +n.amp.toFixed(2), tangential: Math.round(n.tangential),
                   k: +n.k.toFixed(3),
                   peakPxPerS: +(n.amp / n.k * SIGMA * D2R * n.tangential).toFixed(3) };
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
      advance: function (seconds) { drift.advance(seconds); },
      EXTENT: EXTENT, U_LIMB: U_LIMB, LIMB_P: LIMB_P, LIBRATION: LIBRATION, SIGMA: SIGMA,
      /* pixels back, so the light model can be asserted rather than admired */
      readBody: function (px, textureOnly) {
        var cv = renderBody(px || 256, NUCLEUS_VARIANTS[state.nucleus], !!textureOnly);
        var g = cv.getContext('2d');
        return { px: cv.width, data: Array.prototype.slice.call(g.getImageData(0, 0, cv.width, cv.height).data) };
      }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
