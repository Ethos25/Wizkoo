/* ARCHIVED 2026-07-31 · index.html JS removed this round:
   2585-2599 dead legacy handler (#hero-intake-form — element never existed)
   2617-2706 v14 form IIFE incl. live submit handler at 2701
   2709-2920 theme moderation block (blocklist, paste sanitizer, submit intercept) */

/* ─── Hero intake form submit (Granddad section) ─── */
(function(){
  var form = document.getElementById('hero-intake-form');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name  = document.getElementById('hif-name').value.trim();
    var age   = document.getElementById('hif-age').value;
    var theme = document.getElementById('hif-theme').value.trim();
    if(!name || !age || !theme) return;
    window.location.href = 'https://app.wizkoo.com/generate'
      + '?childName=' + encodeURIComponent(name)
      + '&childAge=' + age
      + '&theme='    + encodeURIComponent(theme);
  });
})();

/* ---- v14 form IIFE ---- */
/* ─── v14 Right Form ─── */
(function(){
  var fAge   = document.getElementById('f-age');
  var fName  = document.getElementById('nh-name');
  var fTheme = document.getElementById('nh-theme');
  var btn    = document.getElementById('nh-submit');

  /* ── Age stepper ── */
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

  /* ── Theme chips ── */
  document.querySelectorAll('.theme-chip').forEach(function(chip){
    chip.addEventListener('click', function(){
      if(!fTheme) return;
      fTheme.value = chip.getAttribute('data-theme');
      fTheme.dispatchEvent(new Event('input', {bubbles: true}));
    });
  });

  /* ── Field has-value toggling ── */
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

  /* ── Wiggly toggle note ── */
  var wigglyNoteYes = 'We weave themed movement in \u2014 dance breaks, obstacle play, outdoor missions.';
  var wigglyNoteNo  = 'We build deeper focus in \u2014 deep reads, long builds, big questions.';
  document.querySelectorAll('input[name="wigglyKid"]').forEach(function(radio){
    radio.addEventListener('change', function(){
      var note = document.getElementById('wiggly-note');
      if(note) note.textContent = this.value === 'true' ? wigglyNoteYes : wigglyNoteNo;
    });
  });

  /* ── checkReady ── */
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

  /* ── Submit: hand off to the plan generator's intake, pre-filled ── */
  var form = document.getElementById('nh-form');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name   = (fName  || {value:''}).value.trim();
    var theme  = (fTheme || {value:''}).value.trim();
    var age    = fAge ? parseInt(fAge.value, 10) : NaN;
    if(!name || isNaN(age) || !theme) return;
    window.location.href = 'https://app.wizkoo.com/generate'
      + '?childName=' + encodeURIComponent(name)
      + '&childAge=' + age
      + '&theme='    + encodeURIComponent(theme);
  });
})()

/* ---- moderation block ---- */
<script>
/* ─── Theme field: content moderation ─── */
(function(){
  var input=document.getElementById('nh-theme');
  if(!input) return;

  /* ── Content moderation — Layer 1 client-side blocklist ── */
  var BLOCKLIST=[
    /* sexual */
    'sexy','sexual','porn','pornographic','nude','naked',
    'masturbat','orgasm','ejaculat','erection','boner','hardon',
    'penis','vagina','vulva','clitoris','anus','anal','rectum',
    'cock','dick','pussy','cunt','tit','boob','nipple',
    'testicles','scrotum',
    'butthole','asshole','arsehole','blowjob','handjob',
    'rimjob','rimming','fellatio','cunnilingus',
    'threesome','orgy','gangbang','incest','pedophil','pedo',
    'bestiality','zoophilia','hentai','lolicon','shotacon',
    'rape','molest','grope','fondle',
    'stripper','escort','prostitut','whore','slut','skank','hooker',
    'dildo','vibrator',
    'cum','cumshot','jizz','jism','semen',
    'fuck','fucker','fucking','fuk','phuck','fvck',
    'shit','crap','piss',
    'bitch','bastard','wank','wanker','twat','tosser',
    'smut','pervert','fetish','lewd',
    'nudes','sexting','onlyfans','camgirl','camboy',
    'xxx','xrated','x-rated',
    /* drugs */
    'cocaine','heroin','meth','methamphetamine','crack',
    'lsd','mdma','ecstasy','fentanyl','opioid',
    'ketamine','psilocybin','shrooms',
    'marijuana','cannabis','stoner','bong','blunt','spliff',
    'drugs','druggie','junkie',
    /* violence / self-harm */
    'self-harm','selfharm','self harm',
    'gore','decapitat','dismember','mutilat','massacre','genocide',
    'terrorist','terrorism','snuff',
    'kill yourself','hang yourself',
    /* hate speech */
    'nigger','nigga','faggot','kike','spic','chink',
    'gook','wetback','tranny','retard',
    /* hateful figures / ideologies */
    'hitler','nazi','kkk','white power','white supremac',
    'heil','antisemit',
  ];

  /* Terms that only block when the entire input exactly equals the term.
     Allows legitimate phrases ("sex education", "gun safety") to pass. */
  var BLOCKLIST_EXACT=[
    'sex','gun','rifle','pistol','bomb','grenade','explosive',
    'cutting','hanging','overdose',
    'murder','suicide','weed',
  ];

  function normalizeLeet(s){
    return s.toLowerCase()
      .replace(/0/g,'o').replace(/3/g,'e').replace(/1/g,'i')
      .replace(/4/g,'a').replace(/5/g,'s').replace(/@/g,'a')
      .replace(/!/g,'i').replace(/\$/g,'s').replace(/7/g,'t');
  }

  function isThemeBlocked(val){
    var n=normalizeLeet(val.trim());
    for(var i=0;i<BLOCKLIST.length;i++){
      var esc=BLOCKLIST[i].replace(/[-\/\\^$*+?.()|[\]{}]/g,'\\$&');
      /* \b left boundary — no right boundary to catch plurals/suffixes */
      if(new RegExp('\\b'+esc,'i').test(n))return true;
    }
    return false;
  }

  function isExactBlocked(val){
    var n=normalizeLeet(val.trim());
    for(var i=0;i<BLOCKLIST_EXACT.length;i++){
      if(n===BLOCKLIST_EXACT[i])return true;
    }
    return false;
  }

  var errEl=document.getElementById('theme-error');
  var errNetEl=document.getElementById('theme-network-error');
  function showThemeError(){if(errEl)errEl.classList.add('visible');}
  function hideThemeError(){if(errEl)errEl.classList.remove('visible');}
  function showNetworkError(){if(errNetEl)errNetEl.classList.add('visible');}
  function hideNetworkError(){if(errNetEl)errNetEl.classList.remove('visible');}

  /* Clear errors whenever user edits the field */
  input.addEventListener('input',function(){hideThemeError();hideNetworkError();},true);

  /* ── Layer 6 Item 12 — Two-word cap via keydown ── */
  (function wireTwoWordCap(){
    var themeInput=document.getElementById('nh-theme');
    if(!themeInput)return;
    function countWords(str){
      var cleaned=str.replace(/\s+/g,' ').trim();
      if(!cleaned)return 0;
      return cleaned.split(' ').length;
    }
    themeInput.addEventListener('keydown',function(e){
      if(e.key==='Backspace'||e.key==='Delete'||
         e.key==='ArrowLeft'||e.key==='ArrowRight'||
         e.key==='ArrowUp'||e.key==='ArrowDown'||
         e.key==='Home'||e.key==='End'||
         e.key==='Tab'||e.key==='Escape'||
         e.key==='Enter'||e.ctrlKey||e.metaKey){return;}
      var val=themeInput.value;
      var cursorStart=themeInput.selectionStart;
      if(e.key===' '&&cursorStart===0){e.preventDefault();return;}
      if(e.key===' '&&val.charAt(cursorStart-1)===' '){e.preventDefault();return;}
      if(e.key===' '&&countWords(val)>=2){e.preventDefault();return;}
      if(e.key!==' '&&countWords(val)===2&&val.endsWith(' ')){e.preventDefault();return;}
    });
  })();

  /* ── Layer 6 Item 13 — Paste sanitizer ── */
  (function wirePasteSanitizer(){
    var themeInput=document.getElementById('nh-theme');
    if(!themeInput)return;
    themeInput.addEventListener('paste',function(e){
      e.preventDefault();
      var pastedText='';
      if(e.clipboardData&&e.clipboardData.getData){
        pastedText=e.clipboardData.getData('text/plain');
      }else if(window.clipboardData&&window.clipboardData.getData){
        pastedText=window.clipboardData.getData('Text');
      }
      if(!pastedText)return;
      var normalized=pastedText.replace(/\s+/g,' ').trim();
      if(!normalized)return;
      var sanitized=normalized.split(' ').slice(0,2).join(' ');
      var supportsExecCommand=typeof document.execCommand==='function';
      var inserted=false;
      if(supportsExecCommand){
        try{inserted=document.execCommand('insertText',false,sanitized);}catch(err){inserted=false;}
      }
      if(!inserted){
        var start=themeInput.selectionStart;
        var end=themeInput.selectionEnd;
        themeInput.setRangeText(sanitized,start,end,'end');
        themeInput.dispatchEvent(new Event('input',{bubbles:true}));
      }
    });
  })();

  /* Capture-phase submit intercept — Layers 1 + 3 validation before
     the bubble-phase gate listener runs */
  var validationPassed=false;
  var nhForm=document.getElementById('nh-form');
  var submitBtn=document.getElementById('nh-submit');

  if(nhForm){
    nhForm.addEventListener('submit',function(e){

      /* Second pass: validation already cleared — let bubble phase run */
      if(validationPassed){validationPassed=false;return;}

      /* Always intercept on first pass */
      e.preventDefault();
      e.stopImmediatePropagation();

      var val=(input.value||'').trim();

      /* Layer 1 — client blocklist */
      if(isThemeBlocked(val)||isExactBlocked(val)){
        showThemeError();
        if(typeof fetch==='function'){
          fetch('/api/validate-theme',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({theme:val,clientBlocked:true}),
          }).catch(function(){});
        }
        input.value='';
        return;
      }

      /* Layer 3 — async server validation (200-400ms typical, 3s cap) */
      hideThemeError();
      hideNetworkError();
      var origHTML=submitBtn.innerHTML;
      submitBtn.textContent='Checking\u2026';
      submitBtn.disabled=true;

      var controller=typeof AbortController!=='undefined'?new AbortController():null;
      var tid=setTimeout(function(){if(controller)controller.abort();},3000);

      fetch('/api/validate-theme',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({theme:val,clientBlocked:false}),
        signal:controller?controller.signal:undefined,
      }).then(function(res){
        clearTimeout(tid);
        submitBtn.innerHTML=origHTML;
        submitBtn.disabled=false;
        if(res.ok){
          validationPassed=true;
          nhForm.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));
        }else{
          showThemeError();
        }
      }).catch(function(){
        clearTimeout(tid);
        submitBtn.innerHTML=origHTML;
        submitBtn.disabled=false;
        showNetworkError();
      });

    },true); /* capture phase */
  }
})();
