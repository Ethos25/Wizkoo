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

  /* ══ ROUND 7 — THE NUCLEUS, GROUND UP ═════════════════════════════════
     Amy rejected six rounds of dimension-by-falloff: "looks terrible...
     removed from everything else... we need a nucleus that looks 3D,
     luminous, giving off light, like it came out of a Pixar studio."

     THE DIAGNOSIS: the star emitted nothing the scene received. Every prior
     round adjusted the body's own shading — deeper limb law, texture taper,
     churn, an in-body star field — and every one read flat at the deployed
     ~80px because the defect was never inside the body. A light source is
     believed when the scene answers it.

     WHAT THIS REBUILD DOES NOT CARRY FORWARD, deliberately:
       - the churn (12 rows/frame, 5s cross-fade): sub-perceptual at 80px,
         which the casino test names as cost, not craft. The surface is still.
       - the in-body star field (240 points): invisible at page scale.
       - the brown-black limb ramp (bottom [40,22,7]): at 80px it wrapped the
         body in a dark ring against the navy sky — the "sticker" edge.
       - dimension-by-falloff as the ONLY cue. The falloff stays, as one
         component; it no longer carries the whole job alone.

     WHAT SURVIVES (certified law): self-luminous, no directional terminator;
     symmetric corona; the system is the subject (scale untouched); nodes lit
     by the nucleus; casino test on all motion.

     ROUND 8 — Amy rejected all three round-7 candidates: "These are
     terrible... It needs to literally look real. None of these look real —
     they are flat relative to the dots on the subjects around them."
     The r7 bets (ignition/molten/aura) stay on their nuc-r7-* branches as
     the record; their table entries are replaced by this round's.

     THE DIAGNOSTIC IN HER WORDS: the NODES read as spheres because they
     carry strong modelled shading — a full value range across a small ball.
     Every glow-led nucleus reads flat beside them, because glow COSTS
     contrast. And the reference for "real" is a photograph of the Sun,
     which has no terminator and still reads round: deep limb darkening,
     REAL granulation at photographic contrast, a crisp edge, almost no
     halo. That exact combination — punchy surface, deep chromatic falloff,
     minimal glow — is the one thing no round has tried: the falloff rounds
     had timid texture and muddy ramps, round 7 had glow instead of surface.

     ignition read "a bright sun that is exploding" (glare-dominant) and
     molten "a star that is dying" (ember-dark). So round 8: healthy
     white-gold centre, no glare, and the value range of the body itself
     doing the modelling, exactly like the dots do it.

       photo-a — the quiet photosphere: two-scale granulation at
                 photographic contrast, deep limb darkening, crisp limb.
       photo-b — the active photosphere: stronger cells, two small spot
                 groups, a touch more exposure.

     Both keep the emission system (the scene receiving light was and
     remains the belonging fix), turned down to photographic restraint. */
  /* ══ ROUND 9 — ELEVATION. RULED BY AMY: photo-a is the base, "best yet,
     elevate it, do not restart." Five levers, cumulative, each deployed as
     its own step so she can rule where the object comes alive. Judged in
     the SECTION, never in crops. Casino test and the self-luminous law
     (no directional terminator) hold throughout.

       1  TEMPERATURE GRADIENT  the heart reads HOTTER, not just brighter:
          white-gold core cooling to deep amber at the limb. Energy inside,
          not paint on top.
       2  CONVECTION AT MIXED SCALES  three octave groups: large soft cells
          dominating, fine grain beneath, all compressing toward the limb
          per the certified radial law.
       3  THE LIMB SEQUENCE  kill the rim-as-boundary: surface -> ONE thin
          crisp bright warm edge-line (the chromosphere move) -> soft
          corona -> space. The line is the highest-value row in the object.
          NOTE: the round-3 "no bright ring at the silhouette" clause is
          SUPERSEDED by this ruling for the chromosphere line specifically —
          a thin line the surface hands off to, not a backlight halo.
       4  GLOW REACH  measured, and pulled in: light LEAVES the surface, it
          does not surround it. Numbers in the branch report.
       5  LIVING SURFACE  built, measured, and CUT by its own law — the
          measured keyframe delta saturates at ~4.5/255 mean, below
          perception at page scale. See the LEVERS table for the numbers.

     Branch pins: nuc-e1 .. nuc-e4 set ELEVATION 1..4; ELEVATION 5 exists
     but renders identically to 4 (lever 5 cut). */
  var ELEVATION = 1;   /* per-branch pin: 1..5, cumulative */

  var CANDIDATE = 'saffron-lantern';   /* RULED by Amy 2026-08-02: the close of the rebuild. photo-a was the r8 base; the lantern is where the lane ended. */

  var CANDIDATES = {
    /* extent    canvas half-width in body radii; past 1.0 is halation
       exposure  radiance at disc centre, in ramp units
       u, p      the falloff: I = exposure * ((1-u) + u * mu^p)
       cells     [[freq, amp], ...] granulation octave groups sampled at the
                 SURFACE point (nx, ny, mu) — two scales, like the Sun:
                 supergranulation you can count and granulation you can feel
       spots     [{lon, lat, size, depth}] photospheric spot groups, radians;
                 dark features ON the surface (they rotate with it in any
                 future round), not shading — the falloff stays directionless
       hot       additive active-region cap (never shades — one-light law)
       halation  [[amp, scale-in-radii], ...] summed exponentials past the
                 limb, coloured from the limb they leave
       ramp      radiance -> colour; bottoms WARM, never brown-black
       corona    symmetric shells centred on the body, each monotone outward
       glows     additive interior breath layers
       emit      the light landing on the cage: reach in body radii, peak A */
    /* ══ THE PHOTOGRAPH — round 8's single premise ═══════════════════════
       A telescope photograph of the Sun reads round with zero glare: the
       value range ON the body does everything. Centre near-white gold,
       limb at ~15% of centre and chromatically deep orange, granulation at
       photographic contrast compressing toward the edge, and a crisp limb
       with only a thin warm fringe past it. The corona is presence, not
       spectacle. This is also exactly how the node dots earn their 3D —
       full value range across a small ball — which answers "flat relative
       to the dots" in the dots' own language. */
    'photo-a': {
      extent: 1.35, exposure: 1.24, u: 0.90, p: 1.9,
      cells: [[3.4, 0.16], [8.5, 0.15]], spots: [], hot: 0,
      halation: [[0.50, 0.035], [0.10, 0.20]],
      /* RE-RAMPED ON AMY'S RULING (photo-a preferred, "not so orange...
         it needs to kind of go with the saffron"): the dots' gold family
         holds G/R near 0.7-0.8 (NODE_RAMP, #E8AF38, #F6CB68); the first
         photo ramp fell to G/R ~0.5 at the limb, which is orange fighting
         saffron. Every stop below the knee now stays on the saffron axis —
         the limb is deep gold, not burnt orange. */
      ramp: [
        [1.40, [255, 251, 238]], [1.15, [255, 243, 210]], [0.98, [253, 229, 168]],
        [0.82, [249, 211, 126]], [0.66, [242, 190, 92]],  [0.50, [228, 166, 64]],
        [0.36, [204, 141, 48]],  [0.22, [172, 113, 38]],  [0.10, [142, 90, 32]],
        [0.00, [116, 72, 28]]
      ],
      corona: [
        { Rout: 1.35, A: 0.30, p: 3.0, breath: 'a', lo: 0.90, hi: 1.00 },
        { Rout: 4.6,  A: 0.08, p: 2.2, breath: 'c', lo: 0.86, hi: 1.00 }
      ],
      glows: [
        { at: [0.50, 0.50], span: 0.50, col: '#FFEFC0', a: 0.30, breath: 'a', lo: 0.04, hi: 0.12 }
      ],
      emit: { reach: 4.6, A: 0.30 }
    },
    /* photo-b (the spots variant) retired by the same ruling that made
       photo-a the base; it lives on nuc-r8-photo-b as the record. */

    /* ══ NODE-STAR — Amy's direct question, built literally ══════════════
       "Are you able to make the nucleus just a bigger version of one of
       those little nodes?" Yes: the body renders through the NODE shader —
       the same wrap-Lambert light, the same NODE_RAMP golds, the same halo
       bloom, at nucleus size. THE CONSEQUENCE, stated: a node has a lit
       side and a dark side, so on this candidate the star is a LIT OBJECT,
       not the light. For the frame to stay coherent, every node's bright
       side aims at the shared off-frame light (upper-left) instead of at
       the centre, and the arc emission is off — there is no central source
       to cast it. The self-luminous law is knowingly suspended ON THIS
       BRANCH ONLY, pending her ruling; everywhere else it stands. */
    /* ══ SAFFRON-LANTERN — Amy on node-star: "The color isn't quite the
       saffron I want, it looks like some kind of a yellow. I really wanted
       to lean into saffron, and I do want it to be somewhat luminous from
       the inside out. I want it to also be giving off light."
       The synthesis, then: the node's modelled-ball VALUE RANGE, arranged
       RADIALLY (the self-luminous law returns — the light is inside),
       the ramp locked onto saffron proper — a compact white-gold heart,
       a wide band saturated at #E8AF38's own neighbourhood, a deep-saffron
       limb that never drifts lemon — and the light given off restored:
       chromosphere line, tight corona at the lever-4 reach, arcs catching
       the glow, nodes lit from the centre again. */
    'saffron-lantern': {
      /* v3 — Amy: "something about making it luminous from the inside out
         actually makes it flat... this doesn't look like it came out of a
         Pixar studio." The diagnosis, optical: a PERFECTLY RADIAL glow
         carries no shape-from-shading — it is geometrically identical to a
         vignette on a flat disc, so the eye files it as a sticker. Pixar's
         luminous objects read round because the ENERGY CORE IS DISPLACED:
         subsurface light seen through a translucent shell, brightest
         off-centre, asymmetric across the face, never shadowed. v2 had
         turned off both symmetry-breakers at once (hot 0, cells 0.09).
         v3 restores them: the certified additive hot cap (upper-left,
         38/32 — always legal under the one-light law) becomes the molten
         heart, and the mixed-scale texture returns to carry foreshortening.
         The falloff stays directionless; nothing is ever darker than it —
         no terminator, the law stands. */
      /* v4 — Amy, with her own screenshot: "the nucleus looks like a
         cartoon almost, and the balls look like they're 3D — I need to
         close that gap." The gap, measured off her frame: the nodes run
         bright-face-to-genuinely-dark; v3's ball never left mid-saffron.
         The additive cap could not close it — additive only raises. v4 is
         a true SUBSURFACE model: radiance falls with 3D DISTANCE FROM AN
         INTERNAL CORE (upper-left, 42% deep, toward the viewer), so the
         shell burns white-gold over the heart and the far side goes as
         deep as a node's shadow side — but the gradient is anchored to a
         point INSIDE the body, not to an outside lamp: the light is still
         its own. The edge line and halation scale with how close the core
         sits to each stretch of limb, so the light visibly leaves the
         bright side hardest. exposure/k set the pole-to-far-limb ratio at
         roughly the nodes' own. */
      extent: 1.35, exposure: 2.05, u: 0.90, p: 2.0,
      sub: { dir: [0.38, 0.32], depth: 0.36, zc: 0.50, k: 3.0 },
      cells: [[2.6, 0.16], [6.2, 0.10], [13.0, 0.06]], spots: [], hot: 0,
      /* v5 — Amy, with her screenshot: "the light seems concentrated very
         very close to it and then it's just dark around it, but when you
         go far the balls have the impact of light... light needs to be
         handled differently so it looks more natural." The defect is the
         MOAT: lever 4 tightened the visible glow to ~1.5 body radii, but
         the lit nodes sit at 2.2-5R — so the frame showed source, dark
         gap, then illuminated objects, which no real light does. Natural
         light is CONTINUOUS: if the source lights the balls, the field
         between them carries a smooth low gradient the whole way. v5
         keeps the tight incandescent edge and bridges the moat — a mid
         shell and a broad low field reaching past the inner nodes, each
         still symmetric, monotone, zero-slope at its edge. The lever-4
         "light leaves, not surrounds" ruling is superseded by this one:
         light leaves AND travels. */
      halation: [[0.55, 0.045], [0.14, 0.30]],
      chromo: { w: 0.013, A: 0.70, I: 1.34 },
      ramp: [
        [1.60, [255, 249, 225]], [1.38, [255, 241, 198]], [1.16, [252, 224, 152]],
        [0.98, [245, 203, 108]], [0.82, [237, 185, 76]],  [0.66, [229, 168, 58]],
        [0.50, [214, 149, 48]],  [0.36, [190, 126, 42]],  [0.24, [160, 102, 36]],
        [0.13, [128, 80, 30]],   [0.06, [98, 62, 26]],    [0.00, [64, 42, 20]]
      ],
      corona: [
        { Rout: 1.35, A: 0.34, p: 3.2, breath: 'a', lo: 0.90, hi: 1.00 },
        { Rout: 2.6,  A: 0.14, p: 2.0, breath: 'b', lo: 0.84, hi: 1.00 },
        { Rout: 7.5,  A: 0.18, p: 1.5, breath: 'c', lo: 0.88, hi: 1.00 }
      ],
      glows: [
        /* the breath now lives AT the molten heart, not at dead centre */
        { at: [0.38, 0.32], span: 0.46, col: '#FFF3D2', a: 0.45, breath: 'a', lo: 0.06, hi: 0.18 },
        { at: [0.50, 0.50], span: 0.60, col: '#F6CB68', a: 0.28, breath: 'c', lo: 0.04, hi: 0.10 }
      ],
      emit: { reach: 4.0, A: 0.30 }
    },

    'node-star': {
      nodeStyle: true, lightDeg: -135, mult: 1.22,
      haloR: 2.1, haloA: 0.55,
      extent: 1.06, exposure: 1, u: 0.9, p: 2,
      cells: null, spots: [], hot: 0, halation: [],
      ramp: [[1.0, [255, 255, 255]], [0.0, [0, 0, 0]]],
      corona: [], glows: [],
      emit: null
    }
  };

  /* ══ THE LEVERS — cumulative overrides on the ruled base ═══════════════ */
  var LEVERS = {
    /* 1 — TEMPERATURE GRADIENT. Exposure and falloff both rise so the SPAN
       widens at both ends: the ramp gains a white-hot knee the core now
       reaches (1.62 against 1.85-top), and the bottom cools to deep amber.
       The heart is a different TEMPERATURE than the limb, not a brighter
       copy of it. The extreme limb dips below the saffron G/R band on
       purpose — deep amber is Amy's word for the cold end of this lever —
       and rejoins the saffron axis by mid-values. */
    1: {
      exposure: 1.62, u: 0.93, p: 2.05,
      ramp: [
        [1.85, [255, 255, 252]], [1.55, [255, 250, 230]], [1.28, [255, 240, 198]],
        [1.06, [253, 227, 160]], [0.90, [249, 212, 124]], [0.74, [242, 192, 94]],
        [0.58, [230, 168, 66]],  [0.44, [210, 140, 50]],  [0.30, [182, 111, 40]],
        [0.16, [150, 86, 33]],   [0.00, [118, 66, 27]]
      ]
    },
    /* 2 — CONVECTION AT MIXED SCALES. Three octave groups replacing two:
       the large cells DOMINATE (0.22 at freq 2.6 — countable at 80px), the
       mid granulation carries the photograph, the fine grain is felt at 2x.
       Limb compression is free from surface sampling, as certified. */
    2: {
      cells: [[2.6, 0.22], [6.2, 0.12], [13.0, 0.07]]
    },
    /* 3 — THE LIMB SEQUENCE. The chromosphere line: one thin crisp bright
       warm edge-line the surface hands off to, then the soft corona, then
       space. w is its centre past the limb and its width scale, in body
       radii — ~2.5 texels at the 512 render. I is its colour on the ramp:
       ABOVE the surface's own limb values, so the line is the brightest
       row in the object, which is the lever's requirement. */
    3: {
      chromo: { w: 0.013, A: 0.92, I: 1.42 }
    },
    /* 4 — GLOW REACH, measured and pulled in. The outer shell comes from
       4.6R to 3.1R, the wide halation term shortens, the arc emission
       reach follows. The measured visible-glow radius (2/255 over sky,
       horizontal ray on the deploy) is in the branch report; light leaves
       the surface. */
    4: {
      halation: [[0.50, 0.035], [0.10, 0.15]],
      corona: [
        { Rout: 1.30, A: 0.32, p: 3.4, breath: 'a', lo: 0.90, hi: 1.00 },
        { Rout: 3.1,  A: 0.07, p: 2.4, breath: 'c', lo: 0.86, hi: 1.00 }
      ],
      emit: { reach: 4.0, A: 0.26 }
    },
    /* 5 — LIVING SURFACE: CUT, by the lever's own law, with the numbers.
       Built in full (keyframe renderer, golden-ratio dwell, 7s cross-fade,
       reduced-motion still — the machinery below this table stands and
       works) and then MEASURED: mean |delta| between fully rendered
       keyframes over the body is 4.16/255 at dT 0.42 and 4.50/255 at
       dT 0.85 (max 23/255) — doubling the decorrelation saturated it,
       because the texture amplitudes and the ramp's white knee bound the
       ceiling. That is ~1.8% mean change at an 80px body: below perception
       even on return. Amy's lever pre-ruled this exact case: "if amplitude
       lands below perception at page scale, cut it and say so (effort
       below perception is cost)." Cut. Raising texture amplitude to buy
       perceptibility would trade lever 2's ruled surface for motion's
       sake, which is backwards. The scheduler stays dormant — no config
       carries `live`, so it never runs; a future round that wants a
       legible living surface needs a bigger body, not a knob. */
    5: {}
  };

  var CFG = (function () {
    var c = {};
    var base = CANDIDATES[CANDIDATE];
    Object.keys(base).forEach(function (k) { c[k] = base[k]; });
    /* the levers elevate the RULED BASE only. A self-contained candidate
       (saffron-lantern, node-star) carries its whole design in its own
       entry — measured on the page: with ELEVATION 1 the lever's exposure
       1.62 and amber ramp silently masked saffron-lantern's 1.38/saffron
       ramp, which is exactly the kind of quiet override this file exists
       to forbid. */
    if (CANDIDATE === 'photo-a') {
      for (var lv = 1; lv <= ELEVATION; lv++) {
        var o = LEVERS[lv] || {};
        Object.keys(o).forEach(function (k) { c[k] = o[k]; });
      }
    }
    return c;
  })();
  /* spot directions precomputed as unit vectors on the visible hemisphere */
  (CFG.spots || []).forEach(function (s) {
    var cl = Math.cos(s.lat);
    s.nx = cl * Math.sin(s.lon);
    s.ny = -Math.sin(s.lat);
    s.nz = cl * Math.cos(s.lon);
    s.cosSize = Math.cos(s.size);
  });

  var ARRIVAL_VARIANTS = {
    /* Nodes first, then paths. Members before structure. */
    brisk: { nodeStart: 0.10, nodeStagger: 0.165, nodeDur: 0.42, labelLag: 0.10, labelDur: 0.46,
             pathStart: 1.24, orbitStagger: 0.11, halfDur: 0.51 },
    slow:  { nodeStart: 0.15, nodeStagger: 0.26,  nodeDur: 0.52, labelLag: 0.14, labelDur: 0.56,
             pathStart: 2.00, orbitStagger: 0.16, halfDur: 0.78 }
  };

  /* RULED round 2: 2.5s arrival, orbits drift. The nucleus is the branch's
     pinned CANDIDATE — round 7 replaced the a/b/c volume variants. */
  var DEFAULTS = { nucleus: CANDIDATE, arrival: 'brisk', orbits: 'drift' };
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

    /* Interior life. The body is a raster, so the breath rides on additive
       overlays defined by the candidate — always additive (they brighten,
       never shade: the one-light law), always with every stop fading to zero
       before the limb so no overlay draws an edge of its own. */
    CFG.glows.forEach(function (gl, i) {
      d.appendChild(grad('lo-nuc-glow-' + i,
        (gl.at[0] * 100) + '%', (gl.at[1] * 100) + '%', (gl.span * 100) + '%', [
          ['0%', gl.col, gl.a], ['58%', gl.col, gl.a * 0.36], ['100%', gl.col, 0]
        ]));
    });

    /* One gradient per corona shell. All centred on the body (symmetric-
       corona law), all monotone outward — layering is what gives the
       atmosphere depth without any shell reading as a ring. */
    CFG.corona.forEach(function (L, i) {
      d.appendChild(grad('lo-corona-' + i, '50%', '50%', '50%', coronaStops(L)));
    });

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
     own image. It does not touch this. Past the limb the star is round.

     ROUND 7: the corona is now LAYERED — the candidate declares one to three
     shells, each symmetric, each monotone outward, each on its own breath
     period. One power-law gradient was a coat of glow; unequal shells moving
     on unequal rhythms are an atmosphere with depth in it. Every law above
     still binds each shell individually. */
  function coronaStops(L) {
    var out = [];
    /* Stops LOGARITHMICALLY spaced in radius, not evenly. A gradient
       interpolates linearly between its stops, and this profile is far steeper
       just outside the limb than it is anywhere else, so evenly-spaced stops put
       a visible kink exactly where the eye is. Measured, that kink was a 1.48
       rise in the falloff rate at r/R 1.34 — a boundary, which is the one thing
       this may not have. Log spacing puts the stops where the curvature is. */
    var n = 48;
    out.push(['0%', '#FFDFA0', L.A.toFixed(5)]);
    out.push([(100 / L.Rout * 0.98).toFixed(3) + '%', '#FFDFA0', L.A.toFixed(5)]);
    for (var i = 0; i <= n; i++) {
      var r = Math.pow(L.Rout, i / n);
      var w = 1 - Math.pow((r - 1) / (L.Rout - 1), 2);
      var a = L.A * Math.pow(1 / r, L.p) * w * w;
      var t = Math.min(1, Math.max(0, (r - 1) / (L.Rout - 1)));
      out.push([(100 * r / L.Rout).toFixed(3) + '%', mixHex('#FFDFA0', '#B8863A', t), a.toFixed(5)]);
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
  /* ROUND 7: N2 (u 0.96, p 3.2) was the deepest the falloff bet ever went,
     and Amy rejected the result on sight. The comment above stands as the
     record of why this file no longer buys dimension from the falloff alone.
     The falloff, texture and extent now belong to the CANDIDATE (table
     above); EDGE_FEATHER survives — the boundary is still a smoothstep
     arrived at by the light, not a drawn line. */
  var EDGE_FEATHER = 3.0;

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

  /* The body's value ramp is the CANDIDATE's (CFG.ramp). The old shared ramp
     bottomed at [40,22,7] — near-black brown — and at the deployed ~80px that
     wrapped the body in a dark ring against the navy sky: the "sticker" edge
     Amy named. Every round-7 ramp bottoms WARM: the coolest a luminous body
     gets here is ember, never soil. Hue still shifts with level — a star's
     limb is cooler and redder because you are looking through more of it. */
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
  /* rampWith serves both the candidate's body ramp and NODE_RAMP; the old
     dedicated ramp() went with the shared RAMP table. */

  /* ROUND 7: the in-body star field (240 projected points) is deleted. At the
     lab's 1:1 it was "at a stare there is something inside it"; at the
     deployed ~80px it was nothing at all — texels below the threshold of
     existence, rendered every frame. Git history preserves it. */

  /* ══ THE BODY ═════════════════════════════════════════════════════════
     Round 7 rendered once and deleted the churn as sub-perceptual. Round 9
     lever 5 brings a LIVING SURFACE back at a cadence that passes the
     casino test where the churn failed it: keyframes tens of seconds
     apart, decorrelated enough to register on RETURN, cross-faded slowly
     enough to sit below conscious notice in the moment. The renderer is
     therefore resumable again (rows-per-frame into an offscreen canvas),
     and the cell field takes a TIME coordinate T — the noise is sampled
     along a moving diagonal, so cells drift and evolve together.

     The render itself: for every pixel inside the disc, radiance
       I = exposure * ((1-u) + u * mu^p)          the falloff, directionless
         * (1 + amp * cells(surface point, T))     per octave group — sampled
                                                   at (nx, ny, mu) so they
                                                   compress toward the limb
         * (1 - depth * spot(surface point))       photospheric spot groups
         + hot * cap^3                             additive active region
     mapped through the candidate's ramp, whose top the exposure CLIPS.
     Past the limb: the CHROMOSPHERE LINE when lever 3 is on (one thin
     crisp bright row the surface hands off to), then halation — summed
     exponentials coloured from the limb they leave, inside the body's own
     image. */
  function makeBodyRenderer(px, v) {
    var cv = document.createElement('canvas');
    cv.width = cv.height = px;
    var ctx = cv.getContext('2d');
    var img = ctx.createImageData(px, px);
    var d = img.data;
    var half = px / 2, sc = v.extent / half, edge = EDGE_FEATHER * sc;
    var col = [0, 0, 0], limbCol = [0, 0, 0], chromoCol = [0, 0, 0];
    /* the radiance the limb leaves at — what the halation is coloured from.
       Continuous with the limb itself: a fringe brighter than the edge it
       leaves is a rim, and a step darker is an outline. */
    var IL = v.exposure * (1 - v.u) * 1.05;
    /* each octave group drifts at its own rate — fine grain churns faster
       than the big cells, which is how convection actually layers */
    var RATE = [1.0, 1.45, 2.1];
    /* node-star: the light's screen direction, baked into the raster */
    var lb = (v.lightDeg || 0) * D2R, lbc = Math.cos(lb), lbs = Math.sin(lb);
    /* SUBSURFACE: the internal core as a point inside the unit sphere.
       d0 is the closest the shell ever gets to it — the radiance there is
       exactly `exposure`. limbMax is the core's proximity factor at the
       nearest stretch of limb, so the edge modulation normalises to 1. */
    var SUB = null;
    if (v.sub) {
      var sx = 2 * v.sub.dir[0] - 1, sy = 2 * v.sub.dir[1] - 1;
      var sl = Math.hypot(sx, sy) || 1;
      SUB = { x: (sx / sl) * v.sub.depth, y: (sy / sl) * v.sub.depth,
              z: v.sub.zc, k: v.sub.k };
      SUB.d0 = 1 - Math.hypot(SUB.x, SUB.y, SUB.z);
      var dnl = Math.hypot(sx / sl - SUB.x, sy / sl - SUB.y, SUB.z);
      SUB.limbMax = Math.exp(-SUB.k * (dnl - SUB.d0));
    }

    function rows(y0, count, T) {
    T = T || 0;
    var y1 = Math.min(px, y0 + count);
    for (var y = y0; y < y1; y++) {
      var ny = (y + 0.5 - half) * sc;
      for (var x = 0; x < px; x++) {
        var nx = (x + 0.5 - half) * sc;
        var r2 = nx * nx + ny * ny, r = Math.sqrt(r2), o = (y * px + x) * 4;

        if (r >= v.extent) { d[o + 3] = 0; continue; }

        /* NODE-STAR: the node shader verbatim, at nucleus scale — the same
           wrap-Lambert (AMB 0.20, WRAP 0.45), the same limb term, the same
           NODE_RAMP golds renderNodeSphere uses at 96px. Nothing else in
           this renderer runs for it: a node has no halation, no chromo, no
           cells — its bloom is the SVG halo, exactly like a node's. */
        if (v.nodeStyle) {
          if (r >= 1 + edge) { d[o + 3] = 0; continue; }
          var rcN = r > 1 ? 1 : r, muN = Math.sqrt(1 - rcN * rcN);
          var nxr = nx * lbc + ny * lbs;
          var lamN = (nxr + 0.45) / 1.45;
          lamN = lamN < 0 ? 0 : Math.pow(lamN, 1.15);
          var LN = (0.20 + 0.80 * lamN) * (0.40 + 0.60 * Math.pow(muN, 0.5));
          rampWith(NODE_RAMP, LN * v.mult, col);
          var atN = r <= 1 - edge ? 1 : (1 + edge - r) / (2 * edge);
          atN = atN < 0 ? 0 : atN > 1 ? 1 : atN;
          var aN = atN * atN * (3 - 2 * atN);
          d[o] = col[0]; d[o + 1] = col[1]; d[o + 2] = col[2];
          d[o + 3] = 255 * aN;
          continue;
        }

        /* HALATION — the body's light in the air just past its edge, drawn
           inside the body's own image so it can never read as a second
           object. Radially symmetric (no directional bias: the one-light law
           owns direction and this is the light itself). Two scales: a tight
           incandescent fringe and a wide soft spill. Computed for the whole
           feather band too, because the body is composited OVER it — the
           first render feathered the limb straight onto the navy sky, and a
           half-transparent orange over navy is a muddy outline. */
        var t2 = r - 1, A2 = 0;
        if (t2 > -edge) {   /* any point the feather can reach */
          for (var h = 0; h < v.halation.length; h++) {
            A2 += v.halation[h][0] * Math.exp(-(t2 > 0 ? t2 : 0) / v.halation[h][1]);
          }
          /* windowed to zero WITH ZERO SLOPE at the canvas edge — the same
             law the corona obeys: the element's own boundary must not be a
             boundary. Without this the wide term still carries ~3% alpha at
             the edge and the raster's square prints as a ring. */
          var wnd = 1 - ((t2 > 0 ? t2 : 0) / (v.extent - 1)) * ((t2 > 0 ? t2 : 0) / (v.extent - 1));
          A2 *= wnd * wnd;
          A2 = A2 < 0 ? 0 : A2 > 1 ? 1 : A2;
          /* coloured from the limb it leaves, cooling as it travels.
             SUBSURFACE: the light leaves hardest where the core sits
             closest to the limb — halation, colour and the chromosphere
             line all scale with that proximity, so the bright side of the
             shell visibly sheds more light than the deep side. */
          var sN = 1;
          if (SUB) {
            var lxu = r ? nx / r : 0, lyu = r ? ny / r : 1;
            var dl = Math.hypot(lxu - SUB.x, lyu - SUB.y, SUB.z);
            sN = Math.min(1, Math.exp(-SUB.k * (dl - SUB.d0)) / SUB.limbMax);
            A2 *= 0.15 + 0.85 * sN;
          }
          var mixT = Math.min(1, (t2 > 0 ? t2 : 0) / (v.extent - 1));
          rampWith(v.ramp, IL * (SUB ? 0.35 + 0.65 * sN : 1) * (1 - 0.45 * mixT), limbCol);

          /* LEVER 3 — the chromosphere line: a thin gaussian ridge just
             past the limb, brighter than any surface value (v.chromo.I sits
             above the limb's radiance), composited OVER the halation so the
             sequence reads surface -> line -> soft corona -> space. The
             round-3 no-ring clause is superseded by Amy's ruling for this
             line specifically. */
          if (v.chromo) {
            var q = (t2 - v.chromo.w) / (v.chromo.w * 0.62);
            var cA = v.chromo.A * Math.exp(-q * q) * (SUB ? 0.15 + 0.85 * sN : 1);
            if (cA > 0.004) {
              rampWith(v.ramp, v.chromo.I, chromoCol);
              var aT = cA + A2 * (1 - cA);
              if (aT > 0.002) {
                limbCol[0] = (chromoCol[0] * cA + limbCol[0] * A2 * (1 - cA)) / aT;
                limbCol[1] = (chromoCol[1] * cA + limbCol[1] * A2 * (1 - cA)) / aT;
                limbCol[2] = (chromoCol[2] * cA + limbCol[2] * A2 * (1 - cA)) / aT;
              }
              A2 = aT > 1 ? 1 : aT;
            }
          }
        }

        if (r < 1 + edge) {
          var rc = r > 1 ? 1 : r;
          var mu = Math.sqrt(1 - rc * rc);
          var I;
          if (SUB) {
            /* radiance falls with 3D distance from the internal core; the
               mild mu term keeps the silhouette curving even over the
               bright pole. No external direction exists anywhere here. */
            var dxs = nx - SUB.x, dys = ny - SUB.y, dzs = mu - SUB.z;
            var sd = Math.sqrt(dxs * dxs + dys * dys + dzs * dzs);
            /* the mu term is mild on purpose: the core distance carries the
               form; mu only keeps the silhouette curving. 0.45+0.55mu was
               tried first and crushed the pole below the white knee. */
            I = v.exposure * Math.exp(-SUB.k * (sd - SUB.d0)) * (0.60 + 0.40 * mu);
          } else {
            I = v.exposure * ((1 - v.u) + v.u * Math.pow(mu, v.p));
          }
          if (v.cells) {
            /* granulation on the SURFACE (nx, ny, mu), so it compresses
               toward the limb the way a photograph's does. Contrast keeps
               most of its strength to the edge — (0.45 + 0.55*mu) — because
               timid, hard-tapered texture is exactly what left six rounds
               reading flat. Frequencies are chosen for the DEPLOYED size:
               cells you can count at 80px, grain you can feel at 2x. */
            var keep = 0.45 + 0.55 * mu;
            for (var ci = 0; ci < v.cells.length; ci++) {
              var cf = v.cells[ci][0];
              var Tg = T * (RATE[ci] || 1);
              I *= 1 + v.cells[ci][1] * keep *
                   fbm(nx * cf + 11.7 * Tg, ny * cf - 7.3 * Tg,
                       mu * cf + 7.7 + ci * 13.1 + 5.1 * Tg, 3);
            }
          }
          if (v.spots) {
            /* spot groups: dark features ON the sphere, foreshortening at
               the limb like everything on the surface. An umbra floor keeps
               them photospheric-dark, never black. */
            for (var si2 = 0; si2 < v.spots.length; si2++) {
              var sp = v.spots[si2];
              var cosA = nx * sp.nx + ny * sp.ny + mu * sp.nz;
              if (cosA > sp.cosSize) {
                var st = (cosA - sp.cosSize) / (1 - sp.cosSize);
                st = st > 1 ? 1 : st;
                st = st * st * (3 - 2 * st);
                I *= 1 - sp.depth * Math.pow(st, 0.7);
              }
            }
          }
          if (v.hot) {
            var dot = nx * HOT_N.x + ny * HOT_N.y + mu * HOT_N.z;
            var capT = (dot - 0.34) / 0.66;
            if (capT > 0) { capT = capT > 1 ? 1 : capT; I += v.hot * capT * capT * capT; }
          }
          rampWith(v.ramp, I, col);
          var at = r <= 1 - edge ? 1 : (1 + edge - r) / (2 * edge);
          at = at < 0 ? 0 : at > 1 ? 1 : at;
          var a = at * at * (3 - 2 * at);   /* smoothstep: no drawn line */
          /* body OVER halation: the sky never shows through the feather */
          var aOut = a + A2 * (1 - a);
          if (aOut > 0.002) {
            d[o]     = (col[0] * a + limbCol[0] * A2 * (1 - a)) / aOut;
            d[o + 1] = (col[1] * a + limbCol[1] * A2 * (1 - a)) / aOut;
            d[o + 2] = (col[2] * a + limbCol[2] * A2 * (1 - a)) / aOut;
          }
          d[o + 3] = 255 * (aOut < 0 ? 0 : aOut > 1 ? 1 : aOut);
        } else {
          d[o] = limbCol[0]; d[o + 1] = limbCol[1]; d[o + 2] = limbCol[2];
          d[o + 3] = 255 * A2;
        }
      }
    }
    return y1;
    }

    return {
      px: px,
      rows: rows,
      flush: function () { ctx.putImageData(img, 0, 0); return cv; },
      all: function (T) { rows(0, px, T || 0); return this.flush(); }
    };
  }

  /* one still frame — the mount render and the instruments both use this */
  function makeBody(px, v, T) { return makeBodyRenderer(px, v).all(T); }


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

  /* The corona: the candidate's shells, every one centred on the body,
     every one monotone outward, each on its own breath period — unequal
     rhythms are what make layered light read as depth rather than as one
     glow at three sizes. Amplitudes sit near full: this is the star's light
     in the field, not a veil over it. */
  function buildCorona() {
    var g = svg('g', { class: 'lo-corona', 'aria-hidden': 'true' });
    CFG.corona.forEach(function (L, i) {
      var c = svg('circle', { cx: FRAME.cx, cy: FRAME.cy, r: NUC_R * L.Rout,
                              fill: 'url(#lo-corona-' + i + ')',
                              class: 'lo-breath-' + L.breath + ' lo-corona-ring' });
      c.style.setProperty('--lo-breath-lo', L.lo);
      c.style.setProperty('--lo-breath-hi', L.hi);
      c.style.setProperty('--lo-breath-still', ((L.lo + L.hi) / 2).toFixed(3));
      g.appendChild(c);
    });
    return g;
  }

  function buildNucleus() {
    var g = svg('g', { class: 'lo-nucleus', 'aria-hidden': 'true' });
    var side = 2 * NUC_R * CFG.extent;
    var at2 = { class: 'lo-nuc-body', x: FRAME.cx - side / 2,
                y: FRAME.cy - side / 2, width: side, height: side };
    /* node-star: the node's own halo bloom, scaled with the body — offset
       toward the lit face exactly as buildNode offsets it, drawn first so
       it sits behind. Static, like a node's: nothing here breathes. */
    if (CFG.nodeStyle) {
      var lb2 = CFG.lightDeg * D2R;
      g.appendChild(svg('circle', {
        cx: (FRAME.cx + Math.cos(lb2) * NUC_R * 0.35).toFixed(2),
        cy: (FRAME.cy + Math.sin(lb2) * NUC_R * 0.35).toFixed(2),
        r: (NUC_R * CFG.haloR).toFixed(2),
        fill: 'url(#lo-node-halo)', opacity: CFG.haloA
      }));
    }
    /* two layers again as of lever 5: a living surface needs a keyframe to
       arrive OVER the one before it. At elevations below 5 the second image
       simply never receives a href. */
    var img = svg('image', at2);
    var imgB = svg('image', Object.assign({ opacity: 0 }, at2));
    g.appendChild(img);
    g.appendChild(imgB);
    g.__img = img;
    g.__imgB = imgB;

    var at = { cx: FRAME.cx, cy: FRAME.cy, r: NUC_R };
    CFG.glows.forEach(function (gl, i) {
      var c = svg('circle', Object.assign({ fill: 'url(#lo-nuc-glow-' + i + ')',
                                            class: 'lo-breath-' + gl.breath }, at));
      c.style.setProperty('--lo-breath-lo', gl.lo);
      c.style.setProperty('--lo-breath-hi', gl.hi);
      c.style.setProperty('--lo-breath-still', ((gl.lo + gl.hi) / 2).toFixed(3));
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
      /* node-star: the star is a lit body, not the light — every bright
         side (and halo offset) aims at the shared off-frame light instead
         of at the centre, or the frame contradicts itself */
      if (CFG.nodeStyle) {
        var lbN = CFG.lightDeg * D2R;
        dx = Math.cos(lbN); dy = Math.sin(lbN);
      }
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

        /* ══ EMISSION — the star's light landing on the cage. ROUND 7. ════
           The diagnosis this round inherits: the star emitted nothing the
           scene received. This is the receipt — where an arc passes near the
           body it warms, in the star's own colour, falling off with SCREEN
           distance exactly as the node light does (one law, one light). The
           overlay rides the arc's own path data, so it can never separate
           from the stroke it lights; it fades up only after the arrival has
           drawn the cage (CSS gates it on data-arrival), so light lands on
           arcs that exist. The depth term keeps a near arc catching more
           than a far one at the same radius. */
        var ea = 0;
        if (CFG.emit) {   /* node-star has no central source to cast this */
          var pm = pointAt(o, mid);
          var dm = Math.hypot(pm.x - FRAME.cx, pm.y - FRAME.cy);
          var exx = (dm - NUC_R) / (CFG.emit.reach * NUC_R - NUC_R);
          exx = exx < 0 ? 0 : exx > 1 ? 1 : exx;
          ea = CFG.emit.A * Math.pow(1 - exx, 2.2) * (0.55 + 0.45 * (0.5 + 0.5 * zn));
        }
        var emit = null, emitSoft = null;
        if (ea > 0.012) {
          /* two scales, like the halation: a wide soft under-glow (the arc
             sitting IN the star's light) and a tighter warm tint on the
             stroke itself (the arc CATCHING it) */
          emitSoft = svg('path', { class: 'lo-emit lo-emit-soft', d: d, fill: 'none',
                                   stroke: '#F6B84E', 'stroke-width': (wdt * 8.5).toFixed(3),
                                   'stroke-opacity': (ea * 0.42).toFixed(4), 'stroke-linecap': 'round' });
          emit = svg('path', { class: 'lo-emit', d: d, fill: 'none',
                               stroke: '#FFCF74', 'stroke-width': (wdt * 3.2).toFixed(3),
                               'stroke-opacity': ea.toFixed(4), 'stroke-linecap': 'round' });
          host.appendChild(emitSoft);
          host.appendChild(emit);
        }
        paths.push({ orbit: o, orbitIndex: oi, seg: si, segs: order.length,
                     line: line, glow: glow, emit: emit, emitSoft: emitSoft });
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

  function applyNucleus(sys) {
    /* One synchronous full render, once, on mount — nothing is moving yet, so
       the block is free. 512 texels across 2 * extent body radii keeps the
       body above 1.5 device pixels per texel at a 2x display. The corona
       shells and breath amplitudes were built from CFG directly; there is no
       variant to re-apply at runtime — the elevation is the branch. */
    sys.bodyR = makeBodyRenderer(512, CFG);
    var url = sys.bodyR.all(0).toDataURL('image/png');
    sys.nucleus.__img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', url);
    sys.nucleus.__img.setAttribute('href', url);
    sys.nucleusVariant = CANDIDATE + '+e' + ELEVATION;
    if (CFG.live) {
      /* lever 5 state. nextAt is absolute on the live clock; the dwell
         sequence is golden-ratio spaced — deterministic, non-periodic, no
         common beat with the breath or the libration. */
      sys.live = { clock: 0, T: 0, n: 0, phase: 'idle', f: 0, cursor: 0,
                   url: null, nextAt: liveDwell(0) };
    }
  }

  function liveDwell(n) {
    var L = CFG.live;
    var fr = (n + 1) * 0.6180339887;
    return L.dwellA + L.dwellB * (fr - Math.floor(fr));
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
    /* ROUND 9, LEVER 5 — the living surface. NOT round 7's churn: that ran
       continuously and moved nothing anyone could see. This renders a
       KEYFRAME tens of seconds ahead of its cue (12 rows a frame — the
       budget round 5 proved), then cross-fades it in over CFG.live.fade
       seconds. Decorrelation dT is large enough that a viewer returning
       after half a minute sees a different surface; the fade in the moment
       sits below conscious notice. The scheduler lives inside the drift
       loop, so reduced motion — which never starts the drift — keeps the
       still frame without a line of special-casing. */
    function live(dt) {
      var L = CFG.live, s = sys.live, n = sys.nucleus;
      if (!L || !s || !sys.bodyR) return;
      s.clock += dt;
      if (s.phase === 'idle' && s.clock >= s.nextAt - L.prep) {
        s.phase = 'render'; s.cursor = 0; s.T += L.dT;
      }
      if (s.phase === 'render') {
        s.cursor = sys.bodyR.rows(s.cursor, 12, s.T);
        if (s.cursor >= sys.bodyR.px) {
          s.phase = 'encode';
          /* toBlob, not toDataURL — a synchronous 512-square PNG encode is
             a hitch, and there is nothing to hitch for */
          sys.bodyR.flush().toBlob(function (blob) {
            if (!blob) { s.phase = 'idle'; s.nextAt = s.clock + liveDwell(++s.n); return; }
            var next = URL.createObjectURL(blob);
            if (s.url) URL.revokeObjectURL(s.url);
            s.url = next;
            n.__imgB.setAttributeNS('http://www.w3.org/1999/xlink', 'href', next);
            n.__imgB.setAttribute('href', next);
            s.phase = 'ready';
          }, 'image/png');
        }
        return;
      }
      if (s.phase === 'ready' && s.clock >= s.nextAt) { s.phase = 'fade'; s.f = 0; }
      if (s.phase === 'fade') {
        s.f += dt;
        var o = s.f / L.fade;
        if (o >= 1) {
          n.__img.setAttributeNS('http://www.w3.org/1999/xlink', 'href', s.url);
          n.__img.setAttribute('href', s.url);
          n.__imgB.setAttribute('opacity', 0);
          s.phase = 'idle';
          s.nextAt = s.clock + liveDwell(++s.n);
        } else {
          n.__imgB.setAttribute('opacity', o.toFixed(4));
        }
      }
    }

    function tick(dt) {
      live(dt);
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

    applyNucleus(sys);
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
          /* the light the nucleus lands on an arc recedes WITH that arc —
             a dimmed stroke still carrying full glow would put the received
             light out of agreement with its receiver (one-light law) */
          if (p.emit) p.emit.classList.toggle('is-dim', dim);
          if (p.emitSoft) p.emitSoft.classList.toggle('is-dim', dim);
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
      /* round 7: the falloff belongs to the candidate; the old export names
         stay so the lab instruments still find A falloff to read */
      EXTENT: CFG.extent, U_LIMB: CFG.u, LIMB_P: CFG.p,
      CANDIDATE: CANDIDATE, CFG: CFG, ELEVATION: ELEVATION, LEVERS: LEVERS,
      LIBRATION: LIBRATION, SIGMA: SIGMA,
      ARR: ARR, ARR_KEY: ARR_KEY, ARRANGEMENTS: ARRANGEMENTS,
      FIGURE: FIGURE, NUC_RATIO: NUC_R / MAX_RX, WINDOW: WINDOW,
      /* pixels back, so the light model can be asserted rather than admired.
         Round 7: the texture-only and stars-only modes went with the churn
         and the star field; mode is accepted and ignored. */
      readBody: function (px, mode, T) {
        var cv = makeBody(px || 256, CFG, T || 0);
        var g = cv.getContext('2d');
        return { px: cv.width, data: Array.prototype.slice.call(g.getImageData(0, 0, cv.width, cv.height).data) };
      }
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
