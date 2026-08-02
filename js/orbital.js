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
 *
 *   THE RULED ARRANGEMENT IS F (Amy, 2026-08-02, from the pre-port section's
 *   own picture): the shipped composition's arcs and positions, reinstated at
 *   the certified material. Nothing crosses the body (ry 137.5/124/104.5
 *   halved vs R 48), so F declines the occlusion cue the way C did — this
 *   time because the picture she chose declines it. E (the Gemini-skeleton
 *   braid, which restored the cue on two rings) was explored and superseded
 *   the same day; both stay in the table as the record.
 *
 *   This comment said "all three are (115, 101, 82 against 125)" until the port.
 *   That was round 5's geometry and round 6 superseded it; the sentence survived
 *   the arrangement it described. Corrected against the ARRANGEMENTS table below,
 *   which is the file of record.
 *
 *   A port must not "fix" the missing cue by flattening the rings back, and must
 *   not keep the shipped homepage's ry 178/160/135 against R 42 either — that
 *   geometry is rejected on both counts and is what this port deletes.
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
  var NUC_R = 125;   /* replaced from the arrangement below */

  /* ── THE WINDOW — a port decision, and the only one in this file ─────────
     The lab had the whole band to itself and drew the certified frame at
     1:1: viewBox 0 0 1440 984 in a 1440-wide section, one unit to one CSS
     pixel, which is why the labels are the homepage's literal 14px/12px.

     The homepage does not have a 1440-wide slot for it. `.hero-body` is a
     52% / 48% grid and the orbital zone is the 48%, which is 691px at a 1440
     viewport. The certified frame in a 691px box renders at 0.480 and puts the
     labels at 6.7px, which is not a size anyone reads.

     THE OBJECT IS NOT THE FRAME. The composed system occupies 1028 x 644 of
     that 1440 x 984 — the certified frame carries 412 units of horizontal
     margin the object never uses. The window below crops the margin and
     nothing else. Every coordinate in this file is still in the certified
     frame's own space, the object is untouched, and every relationship the
     label exhaustion proved is preserved exactly, because a window is a
     change of scale and overlap is scale-invariant.

     The margin is 16 units, which is the interval the frame already uses
     between a label's baseline block and its scrim. The corona is
     deliberately NOT bounded by this window: it reaches 6.9 body radii and is
     meant to spill past the frame, which is what it does in the lab too. The
     svg carries overflow:visible so the spill is clipped by the section, not
     by the element.

     MEASURED, not estimated: the numbers below come from the rendered content
     box on the deployed page, read back with getBBox on the nodes, labels and
     orbit paths — see the report. */
  var WINDOW = { x: 187, y: 134, w: 1060, h: 676 };

  /* The hot region, in absolute frame units. 38% 32% of the body's own box —
     the only value in this file that carries a direction, and it is a property
     of the surface, not of the lighting. Everything anchored to it (the corona)
     is anchored to the surface with it. */
  var HOT = { x: 0, y: 0 };   /* set from the arrangement below */

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

  /* ── RULED round 5: the rings differ, and nothing about them is styled ──
     Round 4 gave all three one treatment and varied opacity with sin(t) — the
     orbital parameter. That is depth WITHIN a ring but not BETWEEN rings: three
     orbits at different inclinations reach different distances toward the
     viewer, and sin(t) knows nothing about that.

     The real depth is z = sin(t) * sqrt(rx^2 - ry^2). A flatter orbit swings
     further toward and away from the eye, so its near arc comes closest and
     reads brightest and marginally heaviest, and its far arc goes furthest and
     reads faintest. An orbit that lies more open never reaches either extreme
     and stays mid-toned throughout.

     One formula, three results. The rings look different because they are in
     different places, which is the only reason anything here is allowed to look
     different from anything else. */
  var Z_MAX = 1;   /* set below, once ORBITS exists */

  function orbitZ(o, tDeg) {
    return Math.sin(tDeg * D2R) * Math.sqrt(o.rx * o.rx - o.ry * o.ry);
  }
  function orbitAlpha(zn) { return ORBIT_BASE * (0.34 + 0.66 * (0.5 + 0.5 * zn)); }
  function orbitWidth(zn) { return ORBIT_WIDTH * (0.86 + 0.28 * (0.5 + 0.5 * zn)); }

  /* ══ ARRANGEMENTS — round 6 candidates ════════════════════════════════
     Selected with ?arr= on the URL, or from the lab panel. None of these is an
     answer; they are the corners of one trade.

     THE TRADE, stated once. An orbit reads as a PLANE rather than a line in
     proportion to its openness O = ry/rx — at 0.12 it is a stroke, at 0.5 it is
     a circle seen at an angle. The occlusion cue needs the arc to come inside
     the body, which for an orbit centred on the nucleus is ry < R. With
     E = rx/R for how far the orbits reach:

         ry < R   <=>   O * E < 1

     Openness and envelope are the same budget. The shipped homepage section
     spends all of it on envelope — O 0.57, E 7.4, O*E 4.2 — and has no orbit
     that comes within four body radii of the nucleus, which is exactly why it
     reads flat. Round 5 spent it on the cue and had nothing left for openness.

     The last arrangement breaks the inequality rather than trading inside it,
     by putting the nucleus off the orbit's CENTRE — which is where a star
     actually sits on any orbit that is not a perfect circle. The nearest
     approach becomes |ry - d| instead of ry, so openness can rise as long as
     the offset rises with it. */
  var ARRANGEMENTS = {
    /* what round 5 shipped, kept for comparison */
    '5': { R: 125, coronaRout: 6.9, occlusion: true, label: 'round 5, superseded',
      orbits: [{ id: 'c', rx: 356, ry: 112, rot: 88, off: 0 },
               { id: 'a', rx: 480, ry: 56,  rot: -28, off: 0 },
               { id: 'b', rx: 446, ry: 84,  rot: 32, off: 0 }] },

    /* A — the most open the cue allows with the nucleus untouched. The envelope
       shrinks to buy it: O*E stays under 1 by pulling rx in, not by flattening. */
    'A': { R: 125, coronaRout: 6.9, occlusion: true, label: 'A — openness bought with envelope (rejected: inverts the hierarchy)',
      orbits: [{ id: 'c', rx: 270, ry: 118, rot: 5,   off: 0 },
               { id: 'a', rx: 250, ry: 112, rot: 58,  off: 0 },
               { id: 'b', rx: 230, ry: 104, rot: 125, off: 0 }] },

    /* B — the logo's proportions. Same openness as A, but the whole system is
       scaled up around a nucleus that is now 400px across. The cue survives
       because R grew with rx; the nucleus takes half the envelope, which is
       what the logo does. */
    'B': { R: 200, coronaRout: 4.3, occlusion: true, label: 'B — logo proportions (rejected: the star swallows the system)',
      orbits: [{ id: 'c', rx: 390, ry: 180, rot: 5,   off: 0 },
               { id: 'a', rx: 350, ry: 168, rot: 58,  off: 0 },
               { id: 'b', rx: 310, ry: 155, rot: 125, off: 0 }] },

    /* C — the shipped section's arrangement at the lab's material. Openness
       0.57 and a small nucleus, which is the other pole: the cue is gone and
       this candidate says so. */
    /* ══ RULED — the certified arrangement ═════════════════════════════
       The system is the subject, not the star. C spends the O*E budget on
       openness: every ring reads as a circle seen at an angle, which is what
       makes three of them read as a cage. The price is stated and accepted —
       no orbit comes inside the body, so there is no occlusion cue. See the
       PORT CONSTRAINT in docs/orbital-lab.md: the minor-semi-axis law is still
       the law, and this arrangement knowingly declines it. A port must not
       quietly "fix" that, and must not quietly keep the shipped homepage's
       geometry either — C is not that geometry. */
    'C': { R: 125, coronaRout: 6.9, occlusion: false, label: 'C — RULED: the cage, occlusion knowingly declined',
      orbits: [{ id: 'c', rx: 480, ry: 275, rot: 25,  off: 0 },
               { id: 'a', rx: 434, ry: 248, rot: 148, off: 0 },
               { id: 'b', rx: 372, ry: 209, rot: 172, off: 0 }] },

    /* D — the nucleus off the orbit's centre, which is where a star sits on any
       orbit that is not a perfect circle. Nearest approach is |ry - off|, so
       openness of 0.5 and a crossing arc stop being alternatives. */
    'D': { R: 125, coronaRout: 6.9, occlusion: true, label: 'D — open rings, nucleus at the focus (not ruled; kept for the record)',
      orbits: [{ id: 'c', rx: 400, ry: 200, rot: 5,   off: 110 },
               { id: 'a', rx: 360, ry: 180, rot: 58,  off: -95 },
               { id: 'b', rx: 320, ry: 160, rot: 125, off: 82 }] },

    /* ══ E — AMY'S BRAID. RULED 2026-08-02, supersedes C's shapes. ═══════
       Her inspiration image and the skeleton she brought with it: three
       DIFFERENT-SIZED flat ellipses at widely spread rotations, interlocking
       — a braid, not a stack. Proportions mapped from that skeleton
       (350/100@40, 200/60@110, 280/90@-20 in its 1000-frame) into this one,
       envelope held at C's 480 so the on-screen size she ruled as B holds.

       This is NOT the killed geometry. The kill was for ry 178/160/135 at
       R 42: three SAME-size ellipses at CLUSTERED rotations (-32/-8/25) with
       openness 0.57. E is spread 40/110/160 (differences 70/50/60 — the
       logo's own neighbourhood), openness 0.29-0.32, sizes 480/384/274.

       And the braid buys back what C declined: with O near 0.3, two of the
       three rings come inside the body (min approach 46.5 and 41 against
       R 48), so THE OCCLUSION CUE LIVES AGAIN and ART re-seats itself on the
       far limb. The silhouette layer, kept dormant through C exactly for
       this moment, renders again. */
    'E': { R: 125, coronaRout: 6.9, occlusion: true, label: 'E — the Gemini-skeleton braid (explored 2026-08-02, superseded by F the same hour)',
      orbits: [{ id: 'c', rx: 480, ry: 137, rot: 40,  off: 0 },
               { id: 'a', rx: 384, ry: 123, rot: 160, off: 30 },
               { id: 'b', rx: 274, ry: 82,  rot: 110, off: 0 }] },

    /* ══ F — THE SHIPPED COMPOSITION, REINSTATED. RULED 2026-08-02. ══════
       Amy, with the pre-port section's picture in hand: "that inspiration
       photo is exactly what I want... that is the old diagram's composition
       and the positioning... and the arcs. That's what I like."

       These are the old section's three ellipses (310/178 @ -32, 280/160
       @ -8, 240/135 @ 25 in its 1011-frame) scaled by 480/310 so the
       envelope she ruled as B holds. They are exactly C's semi-axes — C had
       copied the shipped openness — at the ORIGINAL rotations. What the
       kill order rejected in this geometry was reversed by her ruling with
       the picture in front of her; what it rejected in the MATERIAL stays
       dead: the flat gradient nucleus, the haze yoyo and the dead light are
       not coming back, because the certified system renders these orbits.

       Nothing crosses the body (ry 137.5/124/104.5 halved vs R 48), so like
       C this arrangement declines the occlusion cue — this time because the
       picture she chose declines it. */
    'F': { R: 125, coronaRout: 6.9, occlusion: false, label: 'F — the shipped composition, reinstated by Amy at the certified material',
      orbits: [{ id: 'c', rx: 480, ry: 275, rot: -32, off: 0 },
               { id: 'a', rx: 434, ry: 248, rot: -8,  off: 0 },
               { id: 'b', rx: 372, ry: 209, rot: 25,  off: 0 }] }
  };

  /* PORT: the ?arr= switch was lab chrome and is gone. C is the ruled
     arrangement and is the only one this file can select. The others stay in the
     table above because they are the record of what the trade cost — and because
     scripts/lab-orbital-arrangement.js reads them — but nothing can reach them
     from a URL any more. */
  var ARR_KEY = 'F';   /* RULED by Amy 2026-08-02, from the picture. Not configurable. */
  var ARR = ARRANGEMENTS[ARR_KEY];

  /* ══ FIGURE SCALE — UNRULED, awaiting Amy's ruling ═════════════════════
     Amy walked the port and did not certify it: the nucleus reads too big
     relative to the rest, the figure oversized overall, and at 1966x594 the
     bottom 44px of it sat below the fold (WRITING's label was cut).

     FIGURE scales the OBJECT in frame units. It does NOT touch the viewBox
     window, so the meet scale is unchanged and the label type and the ring
     stroke keep the rendered size they already had. That is deliberate: the
     labels are the homepage's literal 14px/12px by ruling, not a proportion of
     the figure, and the ring at 1.1 units is already close to the visibility
     floor — scaling either with the geometry would make the render unjudgeable
     rather than smaller. So the orbits and the body shrink and the type and the
     line hold.

     NUC_RATIO overrides the nucleus/envelope ratio. null keeps the certified
     0.260. The lab rejected 0.46 and 0.51 (the star swallows the system) and
     the pre-port homepage sat at 0.135.

     WHAT DOES NOT SCALE, and why: the label clearance floor
     max(dist + NODE_R + 34, NUC_R + 80, 252). Those constants are set by LABEL
     SIZE, not by the figure, and the code says so where it defines them — "a
     smaller floor pulls every label inward and reopens collisions the
     exhaustion had already closed." Type is not changing, so they do not
     change. The label guarantee is re-confirmed by walking the excursion box on
     each render; the offline exhaustion was run at the full-size geometry and
     does not carry over. */
  /* RULED BY AMY, 2026-08-02: render B. "I like the smaller nucleus. I think
     that's B." Figure at half size, nucleus/envelope 0.200 — between the
     certified 0.260 and the rejected pre-port 0.135. The lab's 0.260 is
     superseded for this section by her walk. */
  var FIGURE = 0.5;
  var NUC_RATIO = 0.200;

  /* Per-label extra radial clearance, frame units, along the label's own ray.
     UNRULED except where a value is annotated with its ruling. Stays inside the
     placement law — the label is still radially outward from its own node,
     never between it and the star; the tether absorbs the distance by design.

     Under F (simulated composed field, then confirmed on the deploy):
     history +55 — its label otherwise lands 27 units INTO GEOGRAPHY's, because
     the old layout hand-tucked it under its dot and the radial law does not;
     writing +20 — opens the READING pair from 14 units to ~34.
     (E's math push retired with E.) */
  var LABEL_PUSH = { history: 55, writing: 20 };

  /* History of the park, kept for the record: before HISTORY's push the box
     guarantee had NO clean amplitude (science x history composed gap 1.6px)
     and drift was parked. The push bought the ceiling back — K_max 1662,
     measured — and Amy ruled the motion on. See LIBRATION. */

  var ORBITS = ARR.orbits.map(function (o) { return { id: o.id, rx: o.rx, ry: o.ry, rot: o.rot, off: o.off || 0 }; });
  ORBITS.forEach(function (o) { o.rx *= FIGURE; o.ry *= FIGURE; o.off *= FIGURE; });

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
  /* ── RE-RULED BY AMY, 2026-08-02: the subjects move, visibly and subtly ──
     "I definitely want the subjects to move... the whole thing about nothing
     is ever seen moving, I don't want that. I just want it to be very subtle
     so the screen feels alive."

     K = 1600 is NOT taste: the label guarantee's measured ceiling at this
     geometry is K = 1662 (scripts/orbital-k-solve.js, after HISTORY's push;
     the bar: wherever two labels touch, the dimmer is at 0.45 or under).
     1600 sits just inside it.

     The PERIODS are shortened so the smaller amplitude still moves at the
     lab's 0.85 px/s design point — the perceptual boundary, where motion is
     occasionally caught and mostly felt. 163 / 263 / 421 are all prime, like
     the 307 / 491 / 787 they replace; every sine still starts at zero, so the
     composed state is still exactly where the system rests and arrives. */
  var LIBRATION = {
    K: 1600,
    w: [0.55, 0.30, 0.15],
    P: [163, 263, 421]
  };

  /* sum of w_i * 2pi / P_i — the libration's angular rate per unit amplitude,
     which is what turns an amplitude in degrees into a screen speed in px/s */
  var SIGMA = 0;
  LIBRATION.w.forEach(function (w, i) { SIGMA += w * 2 * Math.PI / LIBRATION.P[i]; });

  var MAX_RX = Math.max.apply(null, ORBITS.map(function (o) { return o.rx; }));
  NUC_R = NUC_RATIO == null ? ARR.R * FIGURE : NUC_RATIO * MAX_RX;
  HOT.x = FRAME.cx + (0.38 - 0.5) * 2 * NUC_R;
  HOT.y = FRAME.cy + (0.32 - 0.5) * 2 * NUC_R;

  ORBITS.forEach(function (o) { Z_MAX = Math.max(Z_MAX, Math.sqrt(o.rx * o.rx - o.ry * o.ry)); });

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
  /* ── RE-SEATED FOR F, 2026-08-02: the photo's own positions ─────────────
     The old section's seven dots sit ON the old ellipses to within half a
     frame unit once each is assigned to the ring it actually hugged — solved
     numerically, not assumed. The photo's truth: four subjects ride the
     middle ring, two the outer, one the inner. These t values put every node
     within 0.5 units of where the picture Amy chose has it. */
  var NODES = [
    { id: 'reading', orbit: 'c', t: 265, key: 'READING',
      lines: ['The man who accidentally', "saw through his wife's hand."] },
    { id: 'writing', orbit: 'c', t: 300, key: 'WRITING',
      lines: ['A get-well letter to Granddad.', 'What would you say?'] },
    { id: 'math',    orbit: 'a', t: 5,   key: 'MATH',
      lines: ['Measuring bone lengths.', 'Which is longest?'] },
    { id: 'science', orbit: 'b', t: 30,  key: 'SCIENCE',
      lines: ['How fractures heal.', 'Why does a cast work?'] },
    { id: 'geo',     orbit: 'a', t: 130, key: 'GEOGRAPHY',
      lines: ['Visit Würzburg, Germany.', 'Where X-rays were born.'] },
    { id: 'art',     orbit: 'a', t: 180, key: 'ART',
      lines: ['Sketch the human skeleton.', 'Label every bone you can name.'] },
    { id: 'history', orbit: 'a', t: 100, key: 'HISTORY',
      lines: ['1895. One accident changed', 'medicine forever.'] }
  ];

  /* Node and halo are part of the object, so they scale with it. */
  var NODE_R = 20 * FIGURE, HALO_R = 42 * FIGURE;

  /* ── The light that reaches a node ──────────────────────────────────────
     Intensity falls with distance from the nucleus. The distance used is the
     SCREEN separation, not the true three-dimensional one. In 3D a circular
     orbit holds its node at a constant distance from the star, so true distance
     would give every node on an orbit the same brightness and the falloff would
     never be visible — and the falloff is the demonstration. The eye reads
     depth from screen separation, so screen separation is what has to drive it.
     A node also brightens as it swings toward the near or far extreme and dims
     as it comes around to the flanks, which is the light visibly travelling. */
  /* 210 and 60 are DISTANCES, so they scale with the figure. Left unscaled, a
     half-size figure halves every separation and every node pins at the 1.8
     ceiling — the falloff is the demonstration, and it would go flat. */
  function intensityAt(dist) {
    var i = (210 * FIGURE) / Math.max(dist, 60 * FIGURE);
    return Math.max(0.42, Math.min(1.8, i));
  }

  /* Round 5: the ceiling used to be 1.0, and the two bodies that straddle the
     limb live at 81 to 172 units — entirely inside it. They were pinned at full
     brightness for their whole excursion, so the two most visible bodies in the
     frame were the only two that did not answer to distance. The ceiling is 1.8
     now and the render multiplier takes a 0.6 power, which is what lets one
     curve serve a range of distances that spans five to one: a far body swings
     about 5% across its excursion and a limb body about 14%, and neither is a
     step, because the sphere is re-rendered every 0.004 of intensity. */
  function nodeMultiplier(I) { return 0.44 + 0.58 * Math.pow(I, 0.6); }

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
    /* RE-TUNED ON AMY'S WALK, 2026-08-01: was tex 0.16, bleed 0.80, hot 0.34,
       corona 0.86. Less light leaving the body (bleed, corona, hot region all
       down), more surface on it (tex up) — the two halves of her note. These
       move how much star there is, never where the light comes from; the one-
       light law and the symmetric corona are untouched. */
    a: { tex: 0.24, bleed: 0.55, hot: 0.26, corona: 0.62,
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
  /* Drift returned 2026-08-02 on Amy's ruling, at the labels-capped K — see
     the note above LIBRATION. The park is over. */


  /* ── geometry ───────────────────────────────────────────────────────── */

  function basis(o) {
    var r = o.rot * D2R;
    return { u: [Math.cos(r), Math.sin(r)], v: [-Math.sin(r), Math.cos(r)] };
  }

  function pointAt(o, tDeg) {
    var b = basis(o), t = tDeg * D2R;
    /* off displaces the orbit's centre along its own minor axis, which is what
       putting the nucleus at a focus rather than at the centre looks like once
       it is projected. The near/far split is untouched by it: that depends on
       the orbital plane, not on where in the plane the star sits. */
    var m = o.rx * Math.cos(t), n = (o.off || 0) + o.ry * Math.sin(t);
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
    /* Strengthened at the 2026-08-02 walk (was 0.58 / 0.38 / 0.13): at half
       FIGURE the labels sit nearer the rings, and the scrim tuned for the
       full-size geometry stopped being decisive over a stroke. Same hue, same
       stops, same mechanism — always on, nothing switches it. */
    d.appendChild(grad('lo-label-scrim', '50%', '50%', '50%', [
      ['0%', '#070C16', 0.72], ['42%', '#070C16', 0.50],
      ['74%', '#070C16', 0.18], ['100%', '#070C16', 0]
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
  var CORONA = { A: 0.30, Rout: ARR.coronaRout, p: 2.2 };

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
  /* ── RE-TUNED ON AMY'S WALK, 2026-08-01. Was u 0.86, p 1.5. ─────────────
     Her words: too much light coming from it, distracting, "feels like a flat
     object still but with a lot of light in it."

     The flat read is the mid-field, measured: with u 0.86 / p 1.5 the band from
     0.34R to 0.72R held 92% of centre luminance — the inner two-thirds of the
     disc was one bright plate, and at a 145px body the falloff that says
     "sphere" lived in the last few pixels. This is the SAME recalibration the
     lab already made once for the same reason: the physical profile (u 0.6,
     p 1) was right for a photograph of the Sun and useless at 250px, so it was
     deepened to be legible at 250px. 145px needs it deeper again. Raising p
     starts the falloff earlier, so the curvature is carried across the face
     instead of at the rim; raising u lowers the floor the limb lands on. The
     law itself — identical in every direction, no terminator — is untouched,
     and the verification still asserts it off the rendered pixels. */
  var U_LIMB = 0.94, LIMB_P = 2.6;   /* N1 CONSERVATIVE */
  /* NUCLEUS ROUND, 2026-08-02 — Amy: still a lit disc, not a lit ball.
     TEX_TAPER: the mottle compresses for free (surface sampling) but kept
     even CONTRAST to the limb, which is the flat tell. Contrast now tapers
     to TEX_TAPER_FLOOR at the limb, and the fine grain fades harder than
     the cells, so the edge is finer AND softer. EDGE_FEATHER: the boundary
     is a 3px smoothstep arrived at by the falloff, not a drawn line. */
  var TEX_TAPER_FLOOR = 0.32, TEX_TAPER_POW = 1.1;
  var EDGE_FEATHER = 3.0;
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

  /* ══ THE CONSTELLATION INSIDE THE BODY ════════════════════════════════
     The logo's sphere carries a whisper of star field in its surface: the
     nucleus contains a cosmos rather than being an opaque ball.

     Placed as points ON THE SPHERE — random unit vectors, kept when they face
     the viewer — and then projected. That gives the foreshortening for free and
     exactly: a uniform density on a sphere projects to a density rising as 1/mu
     toward the limb, so they crowd and compress at the edge the way anything on
     a surface does, without a line of code saying so.

     They dim with the same limb law as the surface they sit on, and they are
     suppressed under the hot region, where nothing faint could survive anyway.
     Sparse enough that no arrangement is legible: at a glance the sphere is a
     star, at a stare there is something inside it. */
  var STARS_IN = { n: 240, amp: 0.30, sigma: 1.05 };

  function starBuffer(px, hotAmp) {
    var buf = new Float32Array(px * px);
    var half = px / 2, sc = 1 / (half / EXTENT);       /* units per pixel */
    var rand = (function (a) {
      return function () {
        a = (a + 0x6d2b79f5) >>> 0;
        var t = Math.imul(a ^ (a >>> 15), a | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    })(20260805);
    for (var k = 0; k < STARS_IN.n; k++) {
      /* a uniform direction on the sphere; only the near face is visible */
      var z = 2 * rand() - 1, a2 = 2 * Math.PI * rand(), rr = Math.sqrt(1 - z * z);
      var nx = rr * Math.cos(a2), ny = rr * Math.sin(a2), nz = z;
      if (nz <= 0.05) continue;
      var mu = nz;
      /* dims with the surface, and steps aside for the hot region */
      var hot = (nx * HOT_N.x + ny * HOT_N.y + mu * HOT_N.z - 0.34) / 0.66;
      hot = hot > 0 ? Math.min(1, hot) : 0;
      var b = STARS_IN.amp * ((1 - U_LIMB) + U_LIMB * Math.pow(mu, LIMB_P)) *
              (1 - 0.85 * hot * hot) * (0.55 + 0.9 * rand());
      if (b < 0.004) continue;
      var cxp = half + nx / sc, cyp = half + ny / sc;
      var sg = STARS_IN.sigma * (0.8 + 0.5 * rand());
      var rad = Math.ceil(sg * 2.6);
      for (var dy = -rad; dy <= rad; dy++) for (var dx = -rad; dx <= rad; dx++) {
        var x = Math.round(cxp) + dx, y = Math.round(cyp) + dy;
        if (x < 0 || y < 0 || x >= px || y >= px) continue;
        var ex = x + 0.5 - cxp, ey = y + 0.5 - cyp;
        buf[y * px + x] += b * Math.exp(-(ex * ex + ey * ey) / (2 * sg * sg));
      }
    }
    return buf;
  }

  /* ══ THE BODY, resumable, so its surface can churn ════════════════════
     Granulation on a real star is never still. The body is a raster, so
     evolving it means re-rendering it, and a full 512-square render is a fifth
     of a second — a hitch every time. So the render is RESUMABLE: a few dozen
     rows per frame into an offscreen canvas, and when it completes it
     cross-fades over the top of the one before it. The main thread never sees a
     block, and the surface never stops moving.

     The noise's fourth coordinate advances monotonically, so nothing repeats.
     It advances slowly enough that a cell takes minutes to change: the casino
     test applies to this exactly as it applies to the libration. */
  /* Rows per frame is a budget, not a speed. The whole surface is 512 rows, so
     12 a frame completes in a fifth of a second at sixty and the five-second
     cross-fade is what actually sets the pace. Round 5's first attempt did 40 a
     frame and cost the build its frame budget outright. */
  var CHURN = { rows: 12, dw: 0.0075, fade: 5.0 };

  function makeBody(px, v) {
    var cv = document.createElement('canvas');
    cv.width = cv.height = px;
    var ctx = cv.getContext('2d');
    var img = ctx.createImageData(px, px);
    var d = img.data;
    var half = px / 2, sc = EXTENT / half, edge = EDGE_FEATHER * sc;
    var col = [0, 0, 0], limbCol = [0, 0, 0];
    var F1 = 5.4, F2 = 15.1;
    var bleedA = 0.30 * v.bleed, bleedK = 6.2 / (EXTENT - 1);
    var stars = starBuffer(px, v.hot);
    /* The fine grain does not churn — only the convection cells do — so it is
       computed once and read back per row. That is more than half the noise
       cost taken out of the per-frame budget. */
    var fine = new Float32Array(px * px);
    (function () {
      for (var y = 0; y < px; y++) {
        var ny = (y + 0.5 - half) * sc;
        for (var x = 0; x < px; x++) {
          var nx = (x + 0.5 - half) * sc, r2 = nx * nx + ny * ny;
          if (r2 >= 1) continue;
          var mu = Math.sqrt(1 - r2);
          fine[y * px + x] = fbm(nx * F2 + 11.3, ny * F2 - 7.1, mu * F2 + 3.7, 2);
        }
      }
    })();

    function rows(y0, count, w, mode) {
      var textureOnly = mode === 1, starsOnly = mode === 2;
      var y1 = Math.min(px, y0 + count);
      for (var y = y0; y < y1; y++) {
        var ny = (y + 0.5 - half) * sc;
        for (var x = 0; x < px; x++) {
          var nx = (x + 0.5 - half) * sc;
          var r2 = nx * nx + ny * ny, r = Math.sqrt(r2), o = (y * px + x) * 4;

          if (r < 1 + edge) {
            var rc = r > 1 ? 1 : r;
            var mu = Math.sqrt(1 - rc * rc);
            var I = (1 - U_LIMB) + U_LIMB * Math.pow(mu, LIMB_P);
            if (textureOnly) I = 0.62;
            if (starsOnly) {
              var sv = stars[y * px + x];
              d[o] = d[o + 1] = d[o + 2] = Math.min(255, sv * 900);
              d[o + 3] = 255;
              continue;
            }
            /* granulation on the SURFACE, so it compresses toward the limb;
               w is time, and it only ever goes forward */
            var tpr = TEX_TAPER_FLOOR + (1 - TEX_TAPER_FLOOR) * Math.pow(mu, TEX_TAPER_POW);
            var g = (0.64 * fbm4(nx * F1, ny * F1, mu * F1, w, 2) +
                    0.36 * fine[y * px + x] * (0.25 + 0.75 * mu)) * tpr;
            I *= 1 + v.tex * g;
            if (!textureOnly) {
              var dot = nx * HOT_N.x + ny * HOT_N.y + mu * HOT_N.z;
              var capT = (dot - 0.34) / 0.66;
              if (capT > 0) { capT = capT > 1 ? 1 : capT; I += v.hot * capT * capT * capT; }
              I += stars[y * px + x];
            }
            ramp(I, col);
            var at = r <= 1 - edge ? 1 : (1 + edge - r) / (2 * edge);
            at = at < 0 ? 0 : at > 1 ? 1 : at;
            var a = at * at * (3 - 2 * at);   /* smoothstep: no drawn line */
            d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2];
            d[o + 3] = 255 * (a < 0 ? 0 : a > 1 ? 1 : a);
          } else if (!textureOnly && r < EXTENT) {
            var t2 = r - 1;
            var ux = nx / r, uy = ny / r;
            var f = 0.5 + 0.5 * (ux * HOT_N.x + uy * HOT_N.y);
            var dir = 0.12 + 0.88 * f * f;
            var Il = (1 - U_LIMB);
            var lc = (ux * HOT_N.x + uy * HOT_N.y - 0.34) / 0.66;
            if (lc > 0) { lc = lc > 1 ? 1 : lc; Il += v.hot * lc * lc * lc; }
            ramp(Il * 2.4 + 0.08, limbCol);   /* follows the limb down: a bright fringe outside a dark limb is a rim */
            var A2 = bleedA * dir * Math.exp(-t2 * bleedK);
            d[o] = limbCol[0]; d[o + 1] = limbCol[1]; d[o + 2] = limbCol[2];
            d[o + 3] = 255 * (A2 < 0 ? 0 : A2 > 1 ? 1 : A2);
          } else {
            d[o + 3] = 0;
          }
        }
      }
      return y1;
    }

    return {
      px: px,
      all: function (w, mode) {
        rows(0, px, w || 0, mode | 0);
        ctx.putImageData(img, 0, 0);
        return cv;
      },
      rows: rows,
      flush: function () { ctx.putImageData(img, 0, 0); return cv; },
      canvas: cv
    };
  }

  /* four-dimensional value noise: the fourth axis is time */
  function vnoise4(x, y, z, w) {
    var wi = Math.floor(w), wf = w - wi;
    var t = wf * wf * (3 - 2 * wf);
    var a = vnoise(x + wi * 19.37, y - wi * 7.11, z + wi * 3.53);
    var b = vnoise(x + (wi + 1) * 19.37, y - (wi + 1) * 7.11, z + (wi + 1) * 3.53);
    return a + (b - a) * t;
  }
  function fbm4(x, y, z, w, oct) {
    var s2 = 0, a = 1, f = 1, norm = 0;
    for (var i = 0; i < oct; i++) {
      s2 += a * vnoise4(x * f, y * f, z * f, w * f);
      norm += a; a *= 0.5; f *= 2.03;
    }
    return s2 / norm;
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
        rampWith(NODE_RAMP, L * nodeMultiplier(I), col);
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
    /* RULED round 5: the corona is on the BODY'S OWN breath — the same
       keyframe, the same 3.7s, so the two are in phase by construction rather
       than by coincidence. It was on its own 5.3s rhythm before, which made it a
       layer around the star instead of the star's output. Its amplitude is
       deliberately under the body's: the glow follows, it does not lead. */
    var c = svg('circle', { cx: FRAME.cx, cy: FRAME.cy, r: NUC_R * CORONA.Rout,
                            fill: 'url(#lo-corona)', class: 'lo-breath-a lo-corona-ring' });
    c.style.setProperty('--lo-breath-lo', 0.87);
    c.style.setProperty('--lo-breath-hi', 1);
    c.style.setProperty('--lo-breath-still', 0.935);
    g.appendChild(c);
    return g;
  }

  function buildNucleus() {
    var g = svg('g', { class: 'lo-nucleus', 'aria-hidden': 'true' });
    var side = 2 * NUC_R * EXTENT;
    var at2 = { x: FRAME.cx - side / 2, y: FRAME.cy - side / 2, width: side, height: side };
    /* two layers, so a freshly churned surface can arrive over the one before
       it rather than replacing it */
    var a = svg('image', Object.assign({ class: 'lo-nuc-body' }, at2));
    var b = svg('image', Object.assign({ class: 'lo-nuc-body', opacity: 0 }, at2));
    g.appendChild(a); g.appendChild(b);
    g.__imgA = a; g.__imgB = b;

    var at = { cx: FRAME.cx, cy: FRAME.cy, r: NUC_R };
    [['lo-nuc-glow-1', 'lo-breath-a', 0.08, 0.30], ['lo-nuc-glow-2', 'lo-breath-c', 0.05, 0.14]]
      .forEach(function (bb) {
        var c = svg('circle', Object.assign({ fill: 'url(#' + bb[0] + ')', class: bb[1] }, at));
        c.style.setProperty('--lo-breath-lo', bb[2]);
        c.style.setProperty('--lo-breath-hi', bb[3]);
        c.style.setProperty('--lo-breath-still', ((bb[2] + bb[3]) / 2).toFixed(3));
        g.appendChild(c);
      });
    return g;
  }

  /* ── nodes and labels ───────────────────────────────────────────────── */

  function buildNode(n) {
    var outer = svg('g', { class: 'lo-node', 'data-node': n.id });
    /* The place group carries NO animation — the arrival's opacity lives on
       .lo-node and its pop on .lo-node-inner, both filling 'both' forever
       after the beat. Hover dimming therefore lands HERE, for the same reason
       label depth lives on its own outer group: an animation out-ranks
       anything else, so state that must always win gets an element with no
       animation to fight. */
    var place = svg('g', { class: 'lo-node-place' });
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
      var k = Math.min(1, (I - 0.42) / 0.58);
      /* the sphere is lit from +x in its own image, so pointing it at the
         nucleus is one rotation — and the light swings as the body librates */
      n.bearing2 = Math.atan2(dy, dx) / D2R;
      n.g.__body.setAttribute('transform', 'rotate(' + n.bearing2.toFixed(2) + ')');
      /* RULED round 5: a body brightens as it librates toward the star and dims
         as it swings away. That was already true of the model and quantised out
         of the picture — the sphere was only re-rendered when intensity moved by
         0.02, which is four steps across a whole excursion and every one of them
         visible. 0.004 is under one part in 255 of the rendered value, so the
         change slides. A 96px sphere costs a fraction of a millisecond. */
      if (Math.abs(I - n.imgI) > 0.004) {
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
    /* The 252 floor was round 5's, where limb nodes sat 81-172 units out. Under
       C at FIGURE 1 it binds NOBODY — the nearest label wants 272 — so the
       exhaustion never rode on it. At FIGURE 0.5 it bound four of seven labels
       onto one 252-unit circle and produced the SCIENCE-on-HISTORY collision
       Amy rejected on the walk. The floor is geometry, so it scales with the
       geometry; the +34 and +80 clearances are label-size terms and type does
       not scale, so they hold. At FIGURE 1 this line is identical to the
       certified one. */
    var rOut = Math.max(dist + NODE_R + 34, NUC_R + 80, 252 * FIGURE) +
               (LABEL_PUSH[n.def.id] || 0);
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

  /* The two limb-straddling nodes are solved, not written down: whichever
     arrangement is loaded, SCIENCE and ART sit where |P - C| equals the nucleus
     radius, one in front and one behind. With an offset centre there is no
     closed form worth writing, so it is a scan. */
  function solveLimb(o, fromDeg, toDeg) {
    var best = null;
    for (var t = fromDeg; t <= toDeg; t += 0.05) {
      var p = pointAt(o, t);
      var e = Math.abs(Math.hypot(p.x - FRAME.cx, p.y - FRAME.cy) - NUC_R);
      if (!best || e < best.e) best = { t: t, e: e };
    }
    return best;
  }

  /* ── build ──────────────────────────────────────────────────────────── */

  function build(host) {
    var root = svg('svg', {
      class: 'orb-svg',
      viewBox: WINDOW.x + ' ' + WINDOW.y + ' ' + WINDOW.w + ' ' + WINDOW.h,
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
        var zn = orbitZ(o, mid) / Z_MAX;
        var a = orbitAlpha(zn), wdt = orbitWidth(zn);
        var pad = si === 0 ? 0 : 0.4;
        var d = halfPath(o, t0 - pad, t1 + 0.4);
        var far = seg[1] === 'far';
        var host = far ? lBack : lFront;
        var glow = svg('path', { class: 'lo-path lo-glow', d: d, fill: 'none', 'pathLength': 1,
                                 stroke: ORBIT_STROKE, 'stroke-width': (wdt * 3.4).toFixed(3),
                                 'stroke-opacity': (a * 0.55).toFixed(4), 'stroke-linecap': 'round' });
        var line = svg('path', { class: 'lo-path', d: d, fill: 'none', 'pathLength': 1,
                                 stroke: ORBIT_STROKE, 'stroke-width': wdt.toFixed(3),
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
                              'stroke-width': (orbitWidth(orbitZ(o, 90) / Z_MAX) + 0.5).toFixed(3),
                              'stroke-linecap': 'round' });
      lSil.appendChild(sil);
      paths.push({ orbit: o, orbitIndex: oi, seg: perHalf, segs: 2 * perHalf,
                   line: sil, glow: sil });
    });

    lBack.appendChild(buildCorona());
    lBack.insertBefore(lBack.lastChild, lBack.firstChild);

    var nucleus = buildNucleus();

    var sys = { root: root, back: lBack, front: lFront, labels: lLabels, nodes: [], paths: paths,
                corona: lBack.firstChild, nucleus: nucleus, labelOrder: '' };

    /* re-seat the two limb nodes for whatever arrangement is loaded */
    NODES.forEach(function (n) {
      if (n.id !== 'science' && n.id !== 'art') return;
      var o = orbitById[n.orbit];
      var near = n.id === 'science';
      /* searched around the node's own composed position, not across the whole
         half — every orbit has two solutions and the far one puts the body on
         the other side of the minor axis, which silently re-composes the frame */
      var sol = solveLimb(o, n.t - 45, n.t + 45);
      if (sol && sol.e < 6) n.t = sol.t;
    });

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
    /* One synchronous full render on mount or on a variant change — the only
       place a block is acceptable, because nothing is moving yet. After that the
       churn takes over and every render is spread across frames. */
    sys.body = makeBody(512, v);
    sys.churn = { w: 0, phase: 'idle', cursor: 0, fade: 0, url: null };
    var url = sys.body.all(0, 0).toDataURL('image/png');
    [sys.nucleus.__imgA, sys.nucleus.__imgB].forEach(function (im) {
      im.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
      im.setAttribute('href', url);
    });
    sys.nucleus.__imgB.setAttribute('opacity', 0);
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
    /* The surface churns. A few dozen rows a frame into the offscreen canvas,
       and when it completes it arrives over the top of the one before it across
       a five-second cross-fade. The noise's fourth axis only ever goes forward,
       so no state is ever revisited. */
    function churn(dt) {
      var c = sys.churn, n = sys.nucleus;
      if (!c || !sys.body) return;
      if (c.phase === 'idle') { c.phase = 'render'; c.cursor = 0; c.w += CHURN.dw; }
      if (c.phase === 'encode') return;
      if (c.phase === 'render') {
        c.cursor = sys.body.rows(c.cursor, CHURN.rows, c.w, 0);
        if (c.cursor >= sys.body.px) {
          /* toBlob, not toDataURL: encoding a 512-square PNG synchronously is a
             hitch every cycle, and there is nothing to hitch for. */
          c.phase = 'encode';
          sys.body.flush().toBlob(function (blob) {
            if (!blob) { c.phase = 'idle'; return; }
            var next = URL.createObjectURL(blob);
            if (c.url) URL.revokeObjectURL(c.url);
            c.url = next;
            n.__imgB.setAttributeNS('http://www.w3.org/1999/xlink', 'href', next);
            n.__imgB.setAttribute('href', next);
            c.phase = 'fade'; c.fade = 0;
          }, 'image/png');
        }
        return;
      }
      c.fade += dt;
      var o = c.fade / CHURN.fade;
      if (o >= 1) {
        n.__imgA.setAttributeNS('http://www.w3.org/1999/xlink', 'href', c.url);
        n.__imgA.setAttribute('href', c.url);
        n.__imgB.setAttribute('opacity', 0);
        c.phase = 'idle';
      } else {
        n.__imgB.setAttribute('opacity', o.toFixed(4));
      }
    }

    function tick(dt) {
      churn(dt);
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
      /* PORT: setScale/getScale drove the lab's 500x and 2000x accelerator and
         are deleted with the panel. `scale` stays at 1 and nothing can move it,
         so the shipped drift rate is the ruled one and only the ruled one. */
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
    var section = document.querySelector('[data-orbital]');
    if (!section || section.dataset.mounted) return;
    section.dataset.mounted = '1';
    var stage = section.querySelector('[data-orb-stage]');
    if (!stage) return;
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

    /* ── THE HOVER ROUND — adopted by Amy 2026-08-02 ─────────────────────
       Hover a subject and the system recedes; that subject and its own orbit
       hold. A response to intent, so the casino test does not apply — nothing
       here moves unprompted, and nothing loops.

       Opacity only. No glow is added to the focused subject: full presence IS
       the illumination, and a new glow would put a second light in the frame.
       The nucleus and the sky never dim — the star is the premise, not a
       participant.

       Mouse pointers only. On touch there is no hover; a tap would latch a
       state no gesture releases, so pointerType gates it and phones (which
       get the list fallback anyway) never see a stuck focus. */
    (function hover() {
      var focused = null;
      function apply(id) {
        if (focused === id) return;
        focused = id;
        var orbitId = null;
        sys.nodes.forEach(function (n) {
          if (n.def.id === id) orbitId = n.orbit.id;
        });
        sys.nodes.forEach(function (n) {
          var isF = n.def.id === id;
          n.g.__place.classList.toggle('is-dim', id !== null && !isF);
          n.label.classList.toggle('is-dim', id !== null && !isF);
          n.label.classList.toggle('is-focus', isF && id !== null);
          n.leader.classList.toggle('is-dim', id !== null && !isF);
        });
        sys.paths.forEach(function (p) {
          var dim = id !== null && p.orbit.id !== orbitId;
          p.line.classList.toggle('is-dim', dim);
          p.glow.classList.toggle('is-dim', dim);
        });
      }
      /* NOT boundary events. pointerenter/leave were tried first and Chromium
         fires a spurious leave under a STATIONARY cursor the moment the
         hovered element's transform is rewritten — which the drift does every
         frame, forever. Measured on the deploy: enter then leave within one
         frame, mouse never moving. So the hover is tracked geometrically: on
         every (rAF-throttled) pointermove, the pointer is tested against each
         subject's label box and node box, padded 8px for intent. Boundary
         semantics come out cleaner too — focus changes only when the pointer
         actually stands on a different subject or on none. */
      function subjectAt(x, y) {
        for (var i = 0; i < sys.nodes.length; i++) {
          var n = sys.nodes[i], PAD = 8;
          var lb = n.label.getBoundingClientRect();
          if (x >= lb.left - PAD && x <= lb.right + PAD && y >= lb.top - PAD && y <= lb.bottom + PAD) return n.def.id;
          var nb = n.g.__place.getBoundingClientRect();
          if (x >= nb.left - PAD && x <= nb.right + PAD && y >= nb.top - PAD && y <= nb.bottom + PAD) return n.def.id;
        }
        return null;
      }
      /* Latest-wins throttling. The first version kept the FIRST position of
         an event burst and dropped the rest — so a cursor sweeping onto a
         label and stopping was judged by a point mid-flight, not by where it
         came to rest. One rAF per frame, always evaluating the newest
         position. */
      var hoverPend = false, hoverX = 0, hoverY = 0;
      section.addEventListener('pointermove', function (e) {
        if (e.pointerType && e.pointerType !== 'mouse') return;
        hoverX = e.clientX; hoverY = e.clientY;
        if (hoverPend) return;
        hoverPend = true;
        requestAnimationFrame(function () {
          hoverPend = false;
          apply(subjectAt(hoverX, hoverY));
        });
      });
      section.addEventListener('pointerleave', function () { apply(null); });
      window.__orbHoverApply = apply;   /* debug hook; the verifier uses real moves */
    })();

    /* PORT: the lab panel, the arrangement switcher and the drift-speed
       accelerator lived here and are deleted. Nothing on this page can change
       the nucleus variant, the arrival length, the arrangement or the drift
       rate at runtime — those were ruled, and a control that can unrule them is
       lab chrome. `replay` is gone with them: the beat latches, which is the
       point of it. */

    /* WizkooLabOrbital is kept as an alias so the lab's verification scripts
       run against this page unmodified. */
    window.WizkooOrbital = window.WizkooLabOrbital = {
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
      ARR: ARR, ARR_KEY: ARR_KEY, ARRANGEMENTS: ARRANGEMENTS,
      FIGURE: FIGURE, NUC_RATIO: NUC_R / MAX_RX, WINDOW: WINDOW,
      /* pixels back, so the light model can be asserted rather than admired */
      /* mode 0 full, 1 texture only, 2 the in-body star field alone */
      readBody: function (px, mode) {
        var cv = makeBody(px || 256, NUCLEUS_VARIANTS[state.nucleus]).all(0, mode | 0);
        var g = cv.getContext('2d');
        return { px: cv.width, data: Array.prototype.slice.call(g.getImageData(0, 0, cv.width, cv.height).data) };
      }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
