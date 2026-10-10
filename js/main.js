/* ============ XAQI ARTS — main.js ============ */
(function(){
"use strict";

/* ---------- loader : logo welcome (fast — never waits on full page load) ---------- */
var loaderHidden = false;
function hideLoader(){
  if(loaderHidden) return; loaderHidden = true;
  document.getElementById('loader').classList.add('done');
}
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(hideLoader, 900); });
}else{ setTimeout(hideLoader, 900); }
setTimeout(hideLoader, 2600); // safety

/* ---------- theme : light / dark ---------- */
var root = document.documentElement;
try{
  var saved = localStorage.getItem('xaqi-theme');
  if(saved) root.setAttribute('data-theme', saved);
}catch(e){}
document.getElementById('theme-toggle').addEventListener('click', function(){
  var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  try{ localStorage.setItem('xaqi-theme', next); }catch(e){}
});

/* ---------- marquee ---------- */
var skills = ['AI Films','UGC Ads','<b>Prompt Engineering</b>','Video Post-Production','<b>AI Avatars</b>','Oil Painting','<b>Charcoal Portraits</b>','Murals','<b>3D Motion</b>','Calligraphy'];
var mt = document.getElementById('marquee-track');
var half = skills.map(function(s){ return '<span>'+s+'</span><span>✦</span>'; }).join('');
mt.innerHTML = half + half;

/* ---------- reveal on scroll ---------- */
var io = new IntersectionObserver(function(es){
  es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

/* ---------- stat counters ---------- */
var cio = new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(!e.isIntersecting) return;
    var b = e.target, target = +b.dataset.count, t0 = null;
    function step(t){ if(!t0) t0 = t; var p = Math.min((t-t0)/1400, 1);
      b.textContent = Math.round(target * (1-Math.pow(1-p,3))); if(p<1) requestAnimationFrame(step); }
    requestAnimationFrame(step); cio.unobserve(b);
  });
},{threshold:.6});
document.querySelectorAll('[data-count]').forEach(function(b){ cio.observe(b); });

/* ---------- lazy video posters : only fetch near viewport ---------- */
var pio = new IntersectionObserver(function(es){
  es.forEach(function(e){
    if(!e.isIntersecting) return;
    var v = e.target;
    if(v.dataset.poster){ v.poster = v.dataset.poster; v.removeAttribute('data-poster'); }
    pio.unobserve(v);
  });
},{rootMargin:'500px 0px'});
function watchPosters(root){
  (root || document).querySelectorAll('video[data-poster]').forEach(function(v){ pio.observe(v); });
}

/* ---------- AI work cards ---------- */
var PROJECTS = [
  {slug:'ayms-fence',    title:'AYMS Fence — AI Spokesperson Ad', tag:'Photorealistic AI', desc:'Cedar-fence company, Katy TX. Full pipeline: generate → upscale → animate (lip-sync) → assemble.'},
  {slug:'binder-notebook',title:'Binder — Anime Product Teaser', tag:'Anime / 2.5D', desc:'Leather planner "coming soon" teaser. Factory macro shots → crafting → premium packaging.'},
  {slug:'boom-boon',     title:'Boom Boon — 3D Mascot Ad',       tag:'3D Cartoon', desc:'Fuzzy loofah-puppet mascots sing a brushing song. Toddler-friendly character comedy.'},
  {slug:'got-explainer', title:'GOT-Style Fantasy Explainer',    tag:'Cinematic AI', desc:'Epic castle-city aerials and medieval drama, graded like a fantasy series.'},
  {slug:'house-siege',   title:'House Siege — Game Trailer',     tag:'AI Game Trailer', desc:'Suburban house under monster attack. Fight while repairing — escalating chaos.'},
  {slug:'jiyu-korean',   title:'JIYU — Halmoni UGC Ads',         tag:'UGC / Avatar', desc:'AI Korean-grandmother avatar sells K-beauty. Rapid problem → product beats.'},
  {slug:'kumar-project', title:'KLING Character Tests',          tag:'AI Character', desc:'Photorealistic character animation studies — poses, faces, motion.'},
  {slug:'redstar-retreat',title:'Red Star Retreat — Property Film',tag:'AI Marketing', desc:'11-acre waterfront retreat. AI avatar spokesperson + sun-drenched aerials.'},
  {slug:'soralya',        title:'Soralya — Pixar-Style Explainer',tag:'3D Explainer', desc:'Offloading insoles explained through Pixar-style foot anatomy. UGC direct-response.'},
  {slug:'spnutrition',    title:'SPNutrition — Animated UGC',     tag:'Animated UGC', desc:'Hook-driven supplement ads. Cortisol angle, animated doctor persona.'},
  {slug:'bronx-king',     title:'The Bronx King — AI Series',     tag:'AI Series', desc:'1987 South Bronx urban fantasy. Shot-by-shot visual bible, film-grain grade.'}
];
/* filled in after editing: slug -> video file (relative to site root) */
var VIDEOS = {
  'ayms-fence':    'assets/video/ayms-fence.mp4',
  'binder-notebook':'assets/video/binder-notebook.mp4',
  'boom-boon':     'assets/video/boom-boon.mp4',
  'got-explainer': 'assets/video/got-explainer.mp4',
  'house-siege':   'assets/video/house-siege.mp4',
  'jiyu-korean':   'assets/video/jiyu-korean.mp4',
  'kumar-project': 'assets/video/kumar-project.mp4',
  'redstar-retreat':'assets/video/redstar-retreat.mp4',
  'soralya':       'assets/video/soralya.mp4',
  'spnutrition':   'assets/video/spnutrition.mp4',
  'bronx-king':    'assets/video/bronx-king.mp4'
};
var grid = document.getElementById('work-grid');
PROJECTS.forEach(function(p){
  var card = document.createElement('article');
  card.className = 'work-card reveal';
  var v = VIDEOS[p.slug];
  var media = v
    ? '<video src="'+v+'" data-poster="assets/video/thumbs/'+p.slug+'.jpg" muted loop playsinline preload="none"></video><div class="work-play">▶</div>'
    : '<div class="work-soon">Film in the edit bay — premiering soon</div>';
  card.innerHTML =
    '<div class="work-thumb">'+media+'</div>'+
    '<div class="work-body"><b>'+p.title+'</b><p>'+p.desc+'</p><span class="work-tag">'+p.tag+'</span></div>';
  grid.appendChild(card);
  io.observe(card);
  watchPosters(card);
  var vid = card.querySelector('video');
  if(vid){
    card.querySelector('.work-thumb').addEventListener('click', function(){
      if(vid.paused){ vid.muted = false; vid.play(); card.querySelector('.work-play').style.display='none'; }
      else { vid.pause(); vid.muted = true; card.querySelector('.work-play').style.display='flex'; }
    });
  }
});

/* ---------- Claymorphism ripple on Pixar-style clicks ---------- */
function clayRipple(){
  document.body.classList.remove('clay-time');
  void document.body.offsetWidth;
  document.body.classList.add('clay-time');
  setTimeout(function(){ document.body.classList.remove('clay-time'); }, 700);
}
document.addEventListener('click', function(e){
  if(e.target.closest('.proj-card') || e.target.closest('.album-item') || e.target.closest('#projects-grid')){
    clayRipple();
  }
});
/* ---------- Originkit-inspired: cursor ring field ---------- */
(function(){
  var ring = document.getElementById('cursor-ring'), dot = document.getElementById('cursor-dot');
  if(!ring || !window.matchMedia('(pointer:fine)').matches) return;
  var rx = -500, ry = -500, tx = rx, ty = ry, shown = false;
  document.addEventListener('mousemove', function(e){
    tx = e.clientX; ty = e.clientY;
    dot.style.transform = 'translate('+tx+'px,'+ty+'px)';
    if(!shown){ ring.style.opacity = '1'; dot.style.opacity = '1'; shown = true; }
  });
  document.addEventListener('mouseleave', function(){ ring.style.opacity = '0'; dot.style.opacity = '0'; shown = false; });
  (function follow(){
    rx += (tx - rx) * .14; ry += (ty - ry) * .14;
    ring.style.transform = 'translate('+rx+'px,'+ry+'px)';
    requestAnimationFrame(follow);
  })();
  /* grow ring over interactive elements */
  document.addEventListener('mouseover', function(e){
    var hit = e.target.closest('a,button,.work-card,.album-item,.g-tab,.collab-card');
    ring.style.width = ring.style.height = hit ? '480px' : '340px';
    ring.style.margin = hit ? '-240px 0 0 -240px' : '-170px 0 0 -170px';
  });
})();
/* ---------- Spatial parallax on mouse ---------- */
(function(){
  var layers = document.querySelectorAll('.sec-title, .sec-kicker');
  if(!window.matchMedia('(pointer:fine)').matches) return;
  document.addEventListener('mousemove', function(e){
    var x = (e.clientX / window.innerWidth - .5), y = (e.clientY / window.innerHeight - .5);
    layers.forEach(function(el, i){
      var depth = (i % 3 + 1) * 4;
      el.style.transform = 'translate('+(x*depth)+'px,'+(y*depth)+'px)';
    });
  });
})();
/* ---------- Intro video autoplay on scroll ---------- */
(function(){
  var v = document.getElementById('intro-main');
  if(!v) return;
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ v.play().catch(function(){}); }
      else { v.pause(); }
    });
  }, {threshold: 0.4});
  io.observe(v);
  var muteBtn = document.getElementById('intro-mute');
  muteBtn.addEventListener('click', function(){
    v.muted = !v.muted;
    muteBtn.textContent = v.muted ? '🔇' : '🔊';
  });
  document.getElementById('intro-fs').addEventListener('click', function(){
    if(v.requestFullscreen) v.requestFullscreen();
    else if(v.webkitEnterFullscreen) v.webkitEnterFullscreen();
  });
})();

/* ---------- Client Projects directory ---------- */
var PROJECTS = [
  {name:"AYMS Fence", tag:"AI Spokesperson Ad", brief:"A fence company in Katy, Texas needed a photorealistic AI spokesperson ad — no shoot, no crew.", did:"Built the spokesperson with AI image → upscale → animate, and edited the final ad shot-by-shot from the client's implied sequence.", result:"A broadcast-ready spokesperson spot delivered from pure AI pipeline."},
  {name:"Binder Notebook", tag:"Anime Teaser", brief:"A leather-bound planner brand wanted a soft anime/manga “Coming Soon” teaser.", did:"Cut 18 scenes plus outro to the client's script, with Japanese-styled captions and pacing.", result:"A teaser that feels hand-drawn, built entirely from AI frames."},
  {name:"Boom Boon", tag:"3D Mascot Ad", brief:"A kids dental brand needed an ad starring its 3D loofah-puppet mascots, Boom & Boon.", did:"Animated and polished the mascots from the client's instruction brief to a finished spot.", result:"A playful, kid-safe mascot ad ready for broadcast."},
  {name:"Thrones of Ash", tag:"Cinematic Fantasy Explainer", brief:"A cinematic AI fantasy explainer in a Game-of-Thrones register.", did:"Assembled thirteen shots from two source reels into one trailer-grade narrative.", result:"A fantasy trailer with genuine cinematic weight."},
  {name:"House Siege AAA", tag:"Game Trailer", brief:"An AAA-style AI game trailer for a house-siege title.", did:"Edited beat-by-beat from 19 themed scene folders, with poster art and an alternate outro.", result:"A game trailer that could sit beside real AAA announces."},
  {name:"JIYU Korean Beauty", tag:"UGC Ad Campaign", brief:"K-beauty brand JIYU wanted AI halmoni (grandmother) UGC-style ads.", did:"Produced multiple script angles from the client's scripts and voice-cloned reads.", result:"A full UGC ad set with authentic halmoni warmth."},
  {name:"KLING Animation Tests", tag:"Character Animation Study", brief:"An urgent client delivery needed character animation tests on the KLING model.", did:"Ran 7 clips exploring motion fidelity under a tight deadline.", result:"Client-ready motion tests, delivered fast."},
  {name:"Red Star Retreat", tag:"Property Film + AI Avatar", brief:"A retreat property needed AI marketing films plus an avatar spokesperson.", did:"Cut the hero film from trailer scripts, then 50+ alternate reels, long-form and avatar variants.", result:"A complete property-film package in every ratio."},
  {name:"Soralya Footwear", tag:"Pixar-Style Explainer", brief:"A footwear brand wanted Pixar-style 3D foot-anatomy explainers.", did:"Cut 26 clips plus hooks to the UGC script and visual blueprint.", result:"Explainers that make anatomy feel delightful."},
  {name:"SPNutrition", tag:"15+ UGC Supplement Ads", brief:"A supplement brand needed animated UGC ads — 15+ individual video projects.", did:"Cut each project (Aug ad, TAB series, New-folder drops) to its own script PDF — the largest single-client batch in the vault.", result:"15+ finished supplement ads, each scripted and shipped."},
  {name:"The Bronx King", tag:"AI Series Trailer", brief:"A dark urban-fantasy AI series needed its trailer.", did:"Cut from 500+ episode clips across e01–e04, with the 8-page Global Visual Bible as style authority.", result:"A series trailer with real cinematic menace."}
];
(function(){
  var grid = document.getElementById('projects-grid');
  if(!grid) return;
  PROJECTS.forEach(function(p){
    var card = document.createElement('article');
    card.className = 'work-card proj-card reveal visible';
    card.innerHTML =
      '<div class="proj-inner"><div class="proj-front work-body"><b>'+p.name+'</b><p>'+p.tag+'</p><span class="work-tag">Click to flip</span></div>'+
      '<div class="proj-back work-body"><b>'+p.name+'</b><p><strong>Brief:</strong> '+p.brief+'</p><p><strong>What I did:</strong> '+p.did+'</p><p><strong>Result:</strong> '+p.result+'</p></div></div>';
    card.addEventListener('click', function(){ card.classList.toggle('open'); });
    grid.appendChild(card);
  });
})();

/* ---------- Extended Cuts album (extra edits) ---------- */
(function(){
  var xgrid = document.getElementById('extended-grid');
  if(!xgrid) return;
  fetch('assets/video-extra/manifest.json').then(function(r){
    if(!r.ok) throw 0; return r.json();
  }).then(function(list){
    if(!list || !list.length){ document.getElementById('extended').style.display='none'; return; }
    list.forEach(function(p){
      var card = document.createElement('article');
      card.className = 'work-card reveal visible';
      card.innerHTML =
        '<div class="work-thumb"><video src="assets/video-extra/'+p.slug+'.mp4" data-poster="assets/video-extra/thumbs/'+p.slug+'.jpg" muted loop playsinline preload="none"></video><div class="work-play">▶</div></div>'+
        '<div class="work-body"><b>'+p.title+'</b><p>'+p.desc+'</p><span class="work-tag">'+p.tag+'</span></div>';
      xgrid.appendChild(card);
      watchPosters(card);
      var vid = card.querySelector('video');
      card.querySelector('.work-thumb').addEventListener('click', function(){
        if(vid.paused){ vid.muted = false; vid.play(); card.querySelector('.work-play').style.display='none'; }
        else { vid.pause(); vid.muted = true; card.querySelector('.work-play').style.display='flex'; }
      });
    });
  }).catch(function(){ document.getElementById('extended').style.display='none'; });
})();

/* ---------- inlined image manifest (no fetch needed) ---------- */
var IMG_MANIFEST = {"illustrations":["20150115_131525.jpg","20150115_131604.jpg","20150115_131654.jpg","20150115_131703.jpg","20150115_131713.jpg","20150115_131719.jpg","20150115_131732.jpg","20150115_131740.jpg","20150115_131937.jpg","20150115_131944.jpg","20150115_131950.jpg","20150115_131956.jpg","20150115_132002.jpg","20150115_132007.jpg","20150115_132015.jpg","20150115_132020.jpg","20180418_142405.jpg","20180418_142525.jpg","20180418_142747.jpg","20180418_142757.jpg"],"oil-paintings":["20150115_131630.jpg","20150115_131645.jpg","20150115_131810.jpg","20150115_131818.jpg","20150115_131842.jpg","20150115_131848.jpg","20150115_131858.jpg","20150115_131907.jpg","20180418_142317.jpg","20180418_142359.jpg","20180418_142450.jpg","20180418_142736.jpg","20180422_123522.jpg","20180422_123530.jpg","20180422_123540.jpg","IMG-20210616-WA0000.jpg"],"murals":["20170805_154601.jpg","20170813_130427.jpg","20170813_130459.jpg","20170813_130633.jpg","20180418_142632.jpg","20180418_142649.jpg","20190413_211052.jpg","20190413_211102.jpg","20200306_115535-01.jpg","20200314_120019.jpg","20200314_120025.jpg","IMG-20180327-WA0025.jpg","IMG-20180327-WA0029.jpg","IMG-20180327-WA0033.jpg"],"sketches":["00003269.jpg","20150115_131335.jpg","20150115_131359.jpg","20150115_131433.jpg","20150115_131443.jpg","20170729_220441.jpg","20180418_142519.jpg","20181015_210142.jpg","20181015_210159.jpg","20211216_231919.jpg","20211216_231939.jpg","20211216_231949-01.jpg","20230327_012942-01.jpg","20230329_011750-01.jpg","20230405_061859-01.jpg","20230410_072659-0.jpg","20230418_085528-01.jpg","20230421_024945-01.jpg","20240201_172332.jpg","FB_IMG_1519874612149.jpg","IMG-20250531-WA0003.jpg","IMG_20230415_16053.jpg","mandala 1 2023.jpg"],"characters":["039-arivan-the-last-sentinel.jpg","076-luna-rae.jpg","077-kael.jpg","078-milo.jpg","084-niko.jpg","086-aya.jpg","087-cosmo.jpg","088-elara.jpg","089-orion.jpg","090-nova.jpg","091-lyra.jpg","092-zayn.jpg","093-gora.jpg","095-luma.jpg","096-roko.jpg","098-armand.jpg","099-eloise.jpg","100-lucien.jpg","101-bill.jpg","102-o-ren-ishii.jpg","103-the-bride.jpg"],"photos":["photo-106.jpg","photo-137.jpg","photo-144.jpg","photo-156.jpg","photo-162.jpg","photo-29.jpg","photo-30.jpg","photo-31.jpg","photo-34.jpg","photo-84.jpg","photo-85.jpg","photo-86.jpg"]};

/* ---------- 3D album ring gallery ---------- */
var ring = document.getElementById('album-ring');
var caption = document.getElementById('album-caption');
var items = [], angle = 0, curAlbum = 'sketches', radius = 460;
function prettyName(f){
  return f.replace(/\.(jpg|jpeg|png)$/i,'').replace(/[_\-]+/g,' ').replace(/\s+/g,' ').trim();
}
function buildAlbum(name){
  curAlbum = name; angle = 0; items = []; ring.innerHTML = '';
  var files = (typeof IMG_MANIFEST !== 'undefined' && IMG_MANIFEST[name]) || [];
  var step = 360 / Math.max(1, files.length);
  files.forEach(function(f, i){
    var d = document.createElement('div');
    d.className = 'album-item';
    d.style.transform = 'rotateY('+(i*step)+'deg) translateZ('+radius+'px)';
    var img = document.createElement('img');
    img.src = 'assets/img/'+name+'/'+f; img.alt = prettyName(f); img.loading = 'lazy';
    d.appendChild(img); ring.appendChild(d); items.push(d);
    d.addEventListener('click', function(){ openLightbox('assets/img/'+name+'/'+f, prettyName(f)); });
  });
  updateRing(); focusItem(0);
}
/* lightbox */
var lb = document.getElementById('lightbox');
function openLightbox(src, cap){
  document.getElementById('lb-img').src = src;
  document.getElementById('lb-cap').textContent = cap;
  lb.classList.add('open'); document.body.style.overflow = 'hidden';
}
function closeLightbox(){ lb.classList.remove('open'); document.body.style.overflow = ''; }
document.getElementById('lb-close').addEventListener('click', closeLightbox);
lb.addEventListener('click', function(e){ if(e.target === lb) closeLightbox(); });
document.addEventListener('keydown', function(e){ if(e.key === 'Escape'){ closeLightbox(); closeFullgal(); } });
/* full gallery */
var fg = document.getElementById('fullgal');
function openFullgal(){
  var grid = document.getElementById('fg-grid'); grid.innerHTML = '';
  function render(m){
    Object.keys(m).forEach(function(album){
      m[album].forEach(function(f){
        var src = 'assets/img/'+album+'/'+f;
        var card = document.createElement('div'); card.className = 'fg-card';
        card.innerHTML = '<img loading="lazy" src="'+src+'" alt="'+prettyName(f)+'"><div class="fg-bar"><span>'+prettyName(f)+'</span><a href="'+src+'" download>Download</a></div>';
        grid.appendChild(card);
      });
    });
    fg.classList.add('open'); document.body.style.overflow = 'hidden';
  }
  if(typeof IMG_MANIFEST !== 'undefined'){ render(IMG_MANIFEST); }
  else { fetch('assets/img/manifest.json').then(function(r){ return r.json(); }).then(render); }
}
function closeFullgal(){ fg.classList.remove('open'); document.body.style.overflow = ''; }
document.getElementById('open-fullgal').addEventListener('click', openFullgal);
document.getElementById('fg-close').addEventListener('click', closeFullgal);
/* achievement images open in lightbox */
document.querySelectorAll('.achieve-card img').forEach(function(img){
  img.addEventListener('click', function(){ openLightbox(img.src, img.alt); });
});
function updateRing(){ ring.style.transform = 'translateZ(-'+radius+'px) rotateY('+angle+'deg)'; }
function focusItem(i){
  items.forEach(function(d){ d.classList.remove('focus'); });
  if(!items.length) return;
  var n = items.length, idx = ((i % n) + n) % n;
  var step = 360 / n;
  angle = -idx * step; updateRing();
  items[idx].classList.add('focus');
  caption.textContent = prettyName(items[idx].querySelector('img').alt);
  ring.dataset.idx = idx;
}
function stepAlbum(dir){ focusItem((+ring.dataset.idx || 0) + dir); }
document.getElementById('album-prev').addEventListener('click', function(){ stepAlbum(-1); });
document.getElementById('album-next').addEventListener('click', function(){ stepAlbum(1); });
/* ---------- XYLOPHONE HELIX — album selector ---------- */
var ALBUMS = [
  {id:'sketches',      short:'Sketches', label:'Sketches'},
  {id:'oil-paintings', short:'Oils',     label:'Oil Paintings'},
  {id:'illustrations', short:'Illust',   label:'Illustrations'},
  {id:'characters',    short:'Chars',    label:'Pixar 3D Styled Character Storyboard'},
  {id:'photos',        short:'Photos',   label:'Photos'},
  {id:'murals',        short:'Murals',   label:'Murals'}
];
(function(){
  var stage = document.getElementById('helix-stage');
  var helix = document.getElementById('helix');
  var label = document.getElementById('helix-label');
  if(!stage || !helix) return;
  var n = ALBUMS.length, step = 360/n;
  var R = Math.min(300, window.innerWidth*.34);
  var bars = [], rot = 0, targetRot = 0, cur = 0, idle = true, idleTimer = null;
  ALBUMS.forEach(function(a, i){
    var b = document.createElement('div');
    b.className = 'h-bar' + (i===0 ? ' active' : '');
    var ang = i*step;
    var y = Math.sin(ang*Math.PI/180) * 46; /* helix twist */
    b.style.transform = 'rotateY('+ang+'deg) translateZ('+R+'px) translateY('+y.toFixed(1)+'px)';
    b.innerHTML = '<span>'+a.short+'</span>';
    b.addEventListener('click', function(ev){ ev.stopPropagation(); select(i); });
    helix.appendChild(b); bars.push(b);
  });
  function pokeIdle(){
    idle = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function(){ idle = true; }, 6000);
  }
  function select(i){
    cur = ((i % n) + n) % n;
    var want = -cur*step;
    targetRot = want + Math.round((rot - want)/360)*360; /* nearest equivalent angle */
    bars.forEach(function(b, bi){ b.classList.toggle('active', bi===cur); });
    label.textContent = ALBUMS[cur].label;
    buildAlbum(ALBUMS[cur].id);
    pokeIdle();
  }
  document.getElementById('helix-prev').addEventListener('click', function(){ select(cur-1); });
  document.getElementById('helix-next').addEventListener('click', function(){ select(cur+1); });
  /* drag / swipe to spin */
  var sx = 0, dragging = false, moved = 0;
  stage.addEventListener('pointerdown', function(e){
    dragging = true; sx = e.clientX; moved = 0; pokeIdle();
    try{ stage.setPointerCapture(e.pointerId); }catch(err){}
  });
  stage.addEventListener('pointermove', function(e){
    if(!dragging) return;
    var dx = e.clientX - sx; sx = e.clientX; moved += Math.abs(dx);
    rot += dx*.45; targetRot = rot;
  });
  stage.addEventListener('pointerup', function(){
    if(!dragging) return;
    dragging = false;
    if(moved > 10){ select(Math.round(-rot/step)); } /* snap to nearest bar */
    else pokeIdle();
  });
  (function spin(){
    requestAnimationFrame(spin);
    if(!dragging){
      if(idle) targetRot += .12;
      rot += (targetRot - rot) * .07;
    }
    helix.style.transform = 'translateZ(-'+R+'px) rotateY('+rot+'deg)';
  })();
  window.addEventListener('resize', function(){ R = Math.min(300, window.innerWidth*.34); });
})();
/* drag to spin */
(function(){
  var stage = document.querySelector('.album-stage'), sx = 0, dragging = false;
  stage.addEventListener('pointerdown', function(e){ dragging = true; sx = e.clientX; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', function(e){ if(!dragging) return; angle += (e.clientX - sx) * .25; sx = e.clientX; updateRing(); });
  stage.addEventListener('pointerup', function(){ dragging = false; });
})();
buildAlbum('sketches');

/* ---------- IMAGE GROUP CIRCLE — orbiting portraits in About ---------- */
(function(){
  var orbit = document.getElementById('img-orbit');
  if(!orbit) return;
  var pics = [
    'assets/img/photos/portrait.jpg',
    'assets/img/photos/photo-29.jpg',
    'assets/img/characters/039-arivan-the-last-sentinel.jpg',
    'assets/img/photos/photo-84.jpg',
    'assets/img/characters/076-luna-rae.jpg',
    'assets/img/photos/photo-137.jpg',
    'assets/img/characters/077-kael.jpg',
    'assets/img/photos/photo-156.jpg'
  ];
  var R = window.innerWidth < 500 ? 128 : 168;
  pics.forEach(function(src, i){
    var a = (i/pics.length)*Math.PI*2 - Math.PI/2;
    var img = document.createElement('img');
    img.src = src; img.loading = 'lazy'; img.alt = 'XAQI arts — selected work';
    img.style.left = 'calc(50% + '+(Math.cos(a)*R).toFixed(1)+'px - 38px)';
    img.style.top = 'calc(50% + '+(Math.sin(a)*R).toFixed(1)+'px - 38px)';
    img.addEventListener('click', function(){ openLightbox(src, img.alt); });
    orbit.appendChild(img);
  });
})();

/* ---------- socials ---------- */
var SOCIALS = [
  ['Behance','https://www.behance.net/saqibmaqbool5'],
  ['Pinterest','https://www.pinterest.com/XAQIarts/'],
  ['GitHub','https://github.com/XAQIARTS'],
  ['LinkedIn','https://www.linkedin.com/in/saqibmaqboolkhan'],
  ['YouTube','https://www.youtube.com/@xaqiarts'],
  ['Funday Rhymes','https://www.youtube.com/@FundayRhymes-XAQIarts'],
  ['Instagram','https://www.instagram.com/xaqiarts_official']
];
var sr = document.getElementById('social-row');
SOCIALS.forEach(function(s){
  var a = document.createElement('a');
  a.className = 'soc'; a.href = s[1]; a.target = '_blank'; a.rel = 'noopener'; a.textContent = s[0];
  sr.appendChild(a);
});

/* ---------- PARTICLE DRIFT — originkit-style network in hero ---------- */
(function(){
  var cv = document.getElementById('drift');
  if(!cv) return;
  var ctx = cv.getContext('2d');
  var W = 0, H = 0, pts = [];
  var mouse = {x:-9999, y:-9999};
  var N = window.innerWidth < 700 ? 55 : 95;
  var COLORS = ['224,35,122','245,185,66','122,92,255','45,225,168'];
  var LINK = 130;
  function resize(){
    var r = cv.parentElement.getBoundingClientRect();
    W = cv.width = Math.max(1, r.width); H = cv.height = Math.max(1, r.height);
  }
  window.addEventListener('resize', resize); resize();
  var i;
  for(i=0;i<N;i++){
    pts.push({x:Math.random()*W, y:Math.random()*H,
      vx:(Math.random()-.5)*.45, vy:(Math.random()-.5)*.45,
      r:1+Math.random()*2.2, c:COLORS[i%COLORS.length], glow:Math.random()<.16});
  }
  cv.parentElement.addEventListener('pointermove', function(e){
    var r = cv.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  cv.parentElement.addEventListener('pointerleave', function(){ mouse.x = -9999; mouse.y = -9999; });
  (function tick(){
    requestAnimationFrame(tick);
    ctx.clearRect(0,0,W,H);
    var j, k;
    for(j=0;j<pts.length;j++){
      var p = pts[j];
      p.x += p.vx; p.y += p.vy;
      if(p.x<0||p.x>W) p.vx *= -1;
      if(p.y<0||p.y>H) p.vy *= -1;
      var mdx = p.x-mouse.x, mdy = p.y-mouse.y, md = Math.sqrt(mdx*mdx+mdy*mdy);
      if(md<140 && md>1){ p.x += mdx/md*.6; p.y += mdy/md*.6; }
    }
    ctx.lineWidth = 1;
    for(j=0;j<pts.length;j++){
      for(k=j+1;k<pts.length;k++){
        var a = pts[j], b = pts[k];
        var dx = a.x-b.x, dy = a.y-b.y, d = Math.sqrt(dx*dx+dy*dy);
        if(d<LINK){
          ctx.strokeStyle = 'rgba(165,155,195,'+((1-d/LINK)*.32).toFixed(3)+')';
          ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
        }
      }
    }
    for(j=0;j<pts.length;j++){
      var q = pts[j];
      if(q.glow){
        var g = ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,q.r*5);
        g.addColorStop(0,'rgba('+q.c+',.9)');
        g.addColorStop(1,'rgba('+q.c+',0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(q.x,q.y,q.r*5,0,6.2832); ctx.fill();
      }
      ctx.fillStyle = 'rgba('+q.c+',.85)';
      ctx.beginPath(); ctx.arc(q.x,q.y,q.r,0,6.2832); ctx.fill();
    }
  })();
})();

/* ---------- 2D FALLBACK background (runs if WebGL unavailable) ---------- */
function bgFallback2D(canvas){
  var ctx = canvas.getContext('2d');
  var W = 0, H = 0, stars = [], blobs = [], i;
  var COLORS = ['224,35,122','245,185,66','122,92,255','45,225,168'];
  function resize(){ W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();
  var n = window.innerWidth < 700 ? 90 : 160;
  for(i=0;i<n;i++) stars.push({x:Math.random(), y:Math.random(), r:.4+Math.random()*1.6, s:.06+Math.random()*.25, tw:Math.random()*6.28});
  for(i=0;i<5;i++) blobs.push({x:Math.random(), y:Math.random(), r:.18+Math.random()*.22, c:COLORS[i%COLORS.length], vx:(Math.random()-.5)*.0006, vy:(Math.random()-.5)*.0006});
  var t = 0;
  (function tick(){
    requestAnimationFrame(tick); t += .016;
    var sy = (window.scrollY || 0) * .00012;
    ctx.clearRect(0,0,W,H);
    var bi;
    for(bi=0;bi<blobs.length;bi++){
      var bl = blobs[bi];
      bl.x += bl.vx; bl.y += bl.vy;
      if(bl.x<-.3||bl.x>1.3) bl.vx *= -1;
      if(bl.y<-.3||bl.y>1.3) bl.vy *= -1;
      var bx = bl.x*W, by = ((bl.y - sy) % 1.3 + 1.3) % 1.3 * H, br = bl.r*Math.min(W,H);
      var g = ctx.createRadialGradient(bx,by,0,bx,by,br);
      g.addColorStop(0,'rgba('+bl.c+',.20)');
      g.addColorStop(1,'rgba('+bl.c+',0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(bx,by,br,0,6.2832); ctx.fill();
    }
    var si;
    for(si=0;si<stars.length;si++){
      var st = stars[si];
      st.y += st.s*.016; if(st.y > 1.02) st.y = -.02;
      var sx = st.x*W, syy = ((st.y - sy) % 1.04 + 1.04) % 1.04 * H;
      var tw = .45 + .35*Math.sin(t*2 + st.tw);
      ctx.fillStyle = 'rgba(207,214,255,'+tw.toFixed(3)+')';
      ctx.beginPath(); ctx.arc(sx,syy,st.r,0,6.2832); ctx.fill();
    }
  })();
}

/* ---------- THREE.js : fixed full-page cosmos (v1 proven scene) ---------- */
(function(){
var canvas = document.getElementById('bg-3d');
if(!canvas) return;
try{
  if(!window.THREE) throw new Error('no THREE');
  var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a10, 0.045);
  var camera = new THREE.PerspectiveCamera(60, 1, .1, 120);
  camera.position.set(0, 0, 14);

  scene.add(new THREE.AmbientLight(0x8877aa, .7));
  var key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(6, 8, 6); scene.add(key);
  var rim = new THREE.PointLight(0xe0237a, 2.2, 50); rim.position.set(-7, -3, 4); scene.add(rim);
  var gold = new THREE.PointLight(0xf5b942, 1.4, 50); gold.position.set(7, 4, 2); scene.add(gold);

  /* starfield — tall volume for the whole page */
  var starGeo = new THREE.BufferGeometry(), sp = [], si;
  for(si=0;si<900;si++){ sp.push((Math.random()-.5)*60, 24-Math.random()*95, (Math.random()-.5)*40); }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({color:0xcfd6ff, size:.07, transparent:true, opacity:.85})));

  /* floating shapes — v1 style, spread down the page */
  var shapes = [], geos = [
    new THREE.IcosahedronGeometry(1, 0), new THREE.TorusGeometry(.9, .32, 14, 28),
    new THREE.OctahedronGeometry(1.1, 0), new THREE.TorusKnotGeometry(.7, .22, 90, 12)
  ];
  var mats = [
    new THREE.MeshStandardMaterial({color:0xe0237a, roughness:.25, metalness:.75}),
    new THREE.MeshStandardMaterial({color:0xf5b942, roughness:.3, metalness:.7}),
    new THREE.MeshStandardMaterial({color:0x7a5cff, roughness:.25, metalness:.75}),
    new THREE.MeshStandardMaterial({color:0x2de1a8, roughness:.3, metalness:.7})
  ];
  var sj;
  for(sj=0;sj<18;sj++){
    var m = new THREE.Mesh(geos[sj % geos.length], mats[sj % mats.length]);
    var side = (sj % 2 === 0) ? -1 : 1;
    m.position.set(side*(6.5+Math.random()*5.5), 20-Math.random()*88, (Math.random()-.5)*10 - 2);
    if(sj < 4){ m.position.set((Math.random()-.5)*20, 8-Math.random()*10, (Math.random()-.5)*10 - 2); }
    m.rotation.set(Math.random()*6, Math.random()*6, 0);
    m.userData = {rx:(Math.random()-.5)*.012, ry:(Math.random()-.5)*.012, fy:Math.random()*6.28, amp:.4+Math.random()*.8, y0:m.position.y};
    scene.add(m); shapes.push(m);
  }
  /* hero torus centerpiece */
  var hero = new THREE.Mesh(new THREE.TorusKnotGeometry(1.5, .42, 140, 18),
    new THREE.MeshStandardMaterial({color:0xe0237a, roughness:.2, metalness:.85, emissive:0x4d0a26}));
  hero.position.set(5.2, 5.5, -3); scene.add(hero);

  var mx = 0, my = 0, t = 0;
  if(window.matchMedia('(pointer:fine)').matches){
    window.addEventListener('pointermove', function(e){
      mx = (e.clientX / window.innerWidth - .5); my = (e.clientY / window.innerHeight - .5);
    });
  }
  function size(){ var w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h, false); camera.aspect = w/h; camera.updateProjectionMatrix(); }
  window.addEventListener('resize', size); size();

  function maxScroll(){ return Math.max(1, document.documentElement.scrollHeight - window.innerHeight); }
  (function tick(){
    requestAnimationFrame(tick); t += .008;
    shapes.forEach(function(mm){
      mm.rotation.x += mm.userData.rx; mm.rotation.y += mm.userData.ry;
      mm.position.y = mm.userData.y0 + Math.sin(t*2 + mm.userData.fy) * mm.userData.amp;
    });
    hero.rotation.x += .0035; hero.rotation.y += .005;
    var sy = window.scrollY || 0;
    var prog = Math.min(1, sy / maxScroll());
    var targetY = -prog * 62;
    camera.position.x += ((mx*2.2) - camera.position.x) * .04;
    camera.position.y += ((targetY - my*1.4) - camera.position.y) * .05;
    camera.lookAt(camera.position.x*.3, targetY - 1, 0);
    renderer.render(scene, camera);
  })();
}catch(err){ bgFallback2D(canvas); }
})();

/* ---------- lazy alt intro videos (inside <details>) ---------- */
(function(){
  var det = document.querySelector('.intro-more');
  if(!det) return;
  det.addEventListener('toggle', function(){
    if(!det.open) return;
    det.querySelectorAll('video[data-src]').forEach(function(v){
      v.src = v.getAttribute('data-src'); v.removeAttribute('data-src'); v.load();
    });
  });
})();

})();
