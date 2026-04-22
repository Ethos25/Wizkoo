import re, sys
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)

V14_IIFE = """\
/* \u2500\u2500\u2500 v14 Right Form \u2500\u2500\u2500 */
(function(){
  var fAge   = document.getElementById('f-age');
  var fName  = document.getElementById('nh-name');
  var fTheme = document.getElementById('nh-theme');
  var btn    = document.getElementById('nh-submit');

  /* \u2500\u2500 Age stepper \u2500\u2500 */
  var incBtn    = document.querySelector('.stepper-increment');
  var decBtn    = document.querySelector('.stepper-decrement');
  var fieldName = document.getElementById('field-name');

  function updateAgeField(){
    var val = fAge ? parseInt(fAge.value, 10) : NaN;
    if(fieldName) fieldName.classList.toggle('has-value', !isNaN(val) && val >= 3 && val <= 12);
    checkReady();
  }

  if(incBtn) incBtn.addEventListener('click', function(){
    var v    = fAge ? parseInt(fAge.value, 10) : NaN;
    var next = isNaN(v) ? 5 : Math.min(v + 1, 12);
    if(fAge){ fAge.value = next; updateAgeField(); }
  });

  if(decBtn) decBtn.addEventListener('click', function(){
    var v = fAge ? parseInt(fAge.value, 10) : NaN;
    if(isNaN(v)) return;
    var next = Math.max(v - 1, 3);
    if(fAge){ fAge.value = next; updateAgeField(); }
  });

  /* \u2500\u2500 Theme chips \u2500\u2500 */
  document.querySelectorAll('.theme-chip').forEach(function(chip){
    chip.addEventListener('click', function(){
      if(!fTheme) return;
      fTheme.value = chip.getAttribute('data-theme');
      fTheme.dispatchEvent(new Event('input', {bubbles: true}));
    });
  });

  /* \u2500\u2500 Field has-value toggling \u2500\u2500 */
  [
    {inp: fTheme, fieldId: 'field-theme'},
    {inp: fName,  fieldId: 'field-name'}
  ].forEach(function(pair){
    if(!pair.inp) return;
    var field = document.getElementById(pair.fieldId);
    pair.inp.addEventListener('input', function(){
      if(field) field.classList.toggle('has-value', pair.inp.value.trim() !== '');
      checkReady();
    });
  });

  /* \u2500\u2500 Wiggly toggle note \u2500\u2500 */
  document.querySelectorAll('input[name="wigglyKid"]').forEach(function(radio){
    radio.addEventListener('change', function(){
      var note = document.getElementById('wiggly-note');
      if(note) note.hidden = (this.value === 'false' && this.checked);
    });
  });

  /* \u2500\u2500 checkReady \u2500\u2500 */
  function checkReady(){
    if(!btn) return;
    var age   = fAge ? parseInt(fAge.value, 10) : NaN;
    var ready = !!(fName  && fName.value.trim()  &&
                   fTheme && fTheme.value.trim() &&
                   !isNaN(age) && age >= 3 && age <= 12);
    btn.disabled = !ready;
    btn.classList.toggle('ready', ready);
  }
  checkReady();

  /* \u2500\u2500 Submit stub (Prompt 1) \u2500\u2500 */
  var form = document.getElementById('nh-form');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name   = (fName  || {value:''}).value.trim();
    var theme  = (fTheme || {value:''}).value.trim();
    var age    = fAge ? parseInt(fAge.value, 10) : NaN;
    if(!name || isNaN(age) || !theme) return;
    var gate = document.getElementById('nh-gate');
    if(gate) gate.hidden = false;
  });
})()"""

with open('C:/Users/amyog/Desktop/Wizkoo/index.html', encoding='utf-8') as f:
    src = f.read()

OLD_START = '/* \u2500\u2500\u2500 v3 Right Form \u2500\u2500\u2500 */\n(function(){'
OLD_END   = '})();\n</script>\n\n<script>\n/* \u2500\u2500\u2500 Theme field: rotating placeholder + auto-expand \u2500\u2500\u2500 */'
NEW_END   = '})();\n</script>\n\n<script>\n/* \u2500\u2500\u2500 Theme field: content moderation \u2500\u2500\u2500 */'

start_pos = src.find(OLD_START)
end_marker_pos = src.find(OLD_END)

assert start_pos != -1, 'OLD_START not found'
assert end_marker_pos != -1, 'OLD_END not found: ' + repr(src[start_pos:start_pos+60])

# Replace from OLD_START through the end of OLD_END
end_pos = end_marker_pos + len(OLD_END)
result = src[:start_pos] + V14_IIFE + '\n</script>\n\n<script>\n/* \u2500\u2500\u2500 Theme field: content moderation \u2500\u2500\u2500 */' + src[end_pos:]

with open('C:/Users/amyog/Desktop/Wizkoo/index.html', 'w', encoding='utf-8') as f:
    f.write(result)

print('IIFE-main step done. File now', len(result.splitlines()), 'lines')
