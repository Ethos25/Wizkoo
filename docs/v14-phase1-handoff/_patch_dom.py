
import re, sys

V14_DOM = """\
<!-- ═══ NEW HERO SECTION ═══ -->
<section class="hero">
  <div class="wrap">
    <div class="hero-grid" style="grid-template-columns:1.08fr 1fr">

      <!-- LEFT COLUMN -->
      <div class="left">
        <h1 class="visually-hidden">Personalized homeschool learning plans for families with children ages 3 to 12</h1>

        <div class="left-header">
          <span class="tick"></span>
          <span>Every <span class="saffron">US standard</span></span>
          <span>&middot;</span>
          <span>Automatically</span>
        </div>

        <h1>
          <span class="l1">Personalized weekly</span>
          <span class="l2">homeschool plans.</span>
          <span class="l3"><em>And tracking.</em></span>
        </h1>
        <p class="left-and-sub">so you never wonder what's missing.</p>

        <article class="desk">
          <div class="desk-head">
            <div class="desk-title">What we ask first.</div>
            <div class="desk-kicker">Two minutes &middot; No account</div>
          </div>
          <p class="desk-body">
            What your child <strong>can't stop talking about.</strong>
            <span class="hl">Dragons. Tornadoes. Volcanoes.</span>
            The week builds from there, and every standard still gets met.
            See the week as it would be built.
          </p>
          <div class="desk-foot">
            <span class="left-sig">&mdash; The Wizkoo Desk</span>
            <em id="desk-sig">Monday, afternoon</em>
          </div>
        </article>

        <div class="left-foot">
          <span><em>One price</em></span>
          <span class="dot"></span>
          <span>Up to <em>4 children</em></span>
        </div>
      </div>

      <!-- RIGHT COLUMN -->
      <div class="right">

        <div class="right-meta">
          <div class="dateline">
            <span>Monday &middot; <strong>afternoon</strong></span>
          </div>
          <span class="folio">Intake / 01</span>
        </div>

        <form id="nh-form" novalidate>

          <div class="form-head">
            <h2><span class="roman">&sect;</span>Build your week.</h2>
            <div class="count">Three fields &middot; <em>one</em> minute</div>
          </div>

          <div class="fields">

            <!-- 01 — Theme -->
            <div class="field" id="field-theme">
              <div class="field-num">01 /</div>
              <div class="field-body">
                <div class="field-label">
                  Build the week from
                  <span class="aux">the one thing they can't stop thinking about</span>
                </div>
                <input id="nh-theme" name="theme" class="theme-input" type="text" placeholder="Superheroes" autocomplete="off" maxlength="60">
                <div class="theme-examples">
                  <span class="lbl">or try</span>
                  <button type="button" class="theme-chip" data-theme="Dragons">Dragons</button>
                  <button type="button" class="theme-chip" data-theme="Tornadoes">Tornadoes</button>
                  <button type="button" class="theme-chip" data-theme="Volcanoes">Volcanoes</button>
                  <button type="button" class="theme-chip" data-theme="The ocean">The ocean</button>
                  <button type="button" class="theme-chip" data-theme="Trains">Trains</button>
                </div>
                <div id="theme-error" class="field-error" aria-live="polite">Let's try a different theme.</div>
                <div id="theme-network-error" class="field-error" aria-live="polite">Something went wrong. Try again.</div>
              </div>
            </div>

            <!-- 02 — Name + Age -->
            <div class="field" id="field-name">
              <div class="field-num">02 /</div>
              <div class="field-body">
                <div class="field-label">
                  For
                  <span class="aux">their first name &amp; age</span>
                </div>
                <div class="field-input-row">
                  <input id="nh-name" name="childName" class="name-input" type="text" placeholder="their name" autocomplete="off" maxlength="30" style="--w:12ch">
                  <div class="age-group">
                    <span class="lbl">age</span>
                    <div class="age-box">
                      <input id="f-age" name="childAge" type="number" min="3" max="12" step="1" required readonly inputmode="numeric" autocomplete="off" aria-describedby="age-error" placeholder="&mdash;">
                      <div class="age-steppers">
                        <button type="button" class="stepper-increment" aria-label="increase age">&#9650;</button>
                        <button type="button" class="stepper-decrement" aria-label="decrease age">&#9660;</button>
                      </div>
                    </div>
                    <span class="age-hint">yrs &middot; 3&ndash;12</span>
                  </div>
                </div>
                <div id="age-error" class="visually-hidden" aria-live="polite"></div>
              </div>
            </div>

            <!-- 03 — Wiggly kid -->
            <div class="field has-value" id="field-wiggly">
              <div class="field-num">03 /</div>
              <div class="field-body">
                <fieldset class="wiggly-fieldset">
                  <legend class="visually-hidden">Wiggly kid?</legend>
                  <div class="field-label">
                    Wiggly kid?
                    <span class="aux">movement in the week</span>
                  </div>
                  <div class="toggle-row">
                    <div class="toggle-segment">
                      <label class="toggle-opt">
                        <input type="radio" name="wigglyKid" value="true" id="wiggly-yes" checked>
                        <span class="toggle-opt-label">Yes</span>
                      </label>
                      <label class="toggle-opt">
                        <input type="radio" name="wigglyKid" value="false" id="wiggly-no">
                        <span class="toggle-opt-label">No</span>
                      </label>
                    </div>
                    <p class="toggle-note" id="wiggly-note">We weave themed movement into the week &mdash; dance breaks, obstacle play, outdoor missions.</p>
                  </div>
                </fieldset>
              </div>
            </div>

          </div>

          <div class="cta-row">
            <button type="submit" class="lbracket" id="nh-submit" disabled>
              See a sample week<span class="arrow">&#x2192;</span>
            </button>
            <div id="cta-progress-hairline" hidden></div>
          </div>
          <p class="cta-note">See a sample week. Personalized plans come with subscription.</p>
          <p class="sibling-note">More kids? <em>Add them next.</em></p>

        </form>

        <div class="gate" id="nh-gate" hidden>
          <div class="gate-progress"></div>
          <div class="gate-ready"></div>
        </div>

      </div>
    </div>
  </div>
</section>"""

with open('C:/Users/amyog/Desktop/Wizkoo/index.html', encoding='utf-8') as f:
    src = f.read()

DOM_START = re.search(r'<!-- [^\-]*NEW HERO SECTION[^\-]* -->', src)
# End marker: </section> followed by newline then <!-- linen hero
DOM_END   = re.search(r'</section>\s*\n<!-- [^\-]*LINEN HERO', src)

assert DOM_START, 'DOM_START not found'
assert DOM_END,   'DOM_END not found'

# Replace from DOM_START to the </section> tag (inclusive), keep what follows
end_pos = DOM_END.start() + len('</section>')
result = src[:DOM_START.start()] + V14_DOM + src[end_pos:]

with open('C:/Users/amyog/Desktop/Wizkoo/index.html', 'w', encoding='utf-8') as f:
    f.write(result)

print('DOM step done. File now', len(result.splitlines()), 'lines')
