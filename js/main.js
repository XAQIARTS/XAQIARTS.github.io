/* ============ XAQI ARTS — main.js ============ */
(function(){
"use strict";

/* ---------- loader : logo welcome ---------- */
var loaderHidden = false;
function hideLoader(){
  if(loaderHidden) return; loaderHidden = true;
  document.getElementById('loader').classList.add('done');
}
window.addEventListener('load', function(){ setTimeout(hideLoader, 2100); });
setTimeout(hideLoader, 4200); // safety

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
    ? '<video src="'+v+'" poster="assets/video/thumbs/'+p.slug+'.jpg" muted loop playsinline preload="none"></video><div class="work-play">▶</div>'
    : '<div class="work-soon">Film in the edit bay — premiering soon</div>';
  card.innerHTML =
    '<div class="work-thumb">'+media+'</div>'+
    '<div class="work-body"><b>'+p.title+'</b><p>'+p.desc+'</p><span class="work-tag">'+p.tag+'</span></div>';
  grid.appendChild(card);
  io.observe(card);
  var vid = card.querySelector('video');
  if(vid){
    card.querySelector('.work-thumb').addEventListener('click', function(){
      if(vid.paused){ vid.muted = false; vid.play(); card.querySelector('.work-play').style.display='none'; }
      else { vid.pause(); vid.muted = true; card.querySelector('.work-play').style.display='flex'; }
    });
  }
});

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
        '<div class="work-thumb"><video src="assets/video-extra/'+p.slug+'.mp4" poster="assets/video-extra/thumbs/'+p.slug+'.jpg" muted loop playsinline preload="none"></video><div class="work-play">▶</div></div>'+
        '<div class="work-body"><b>'+p.title+'</b><p>'+p.desc+'</p><span class="work-tag">'+p.tag+'</span></div>';
      xgrid.appendChild(card);
      var vid = card.querySelector('video');
      card.querySelector('.work-thumb').addEventListener('click', function(){
        if(vid.paused){ vid.muted = false; vid.play(); card.querySelector('.work-play').style.display='none'; }
        else { vid.pause(); vid.muted = true; card.querySelector('.work-play').style.display='flex'; }
      });
    });
  }).catch(function(){ document.getElementById('extended').style.display='none'; });
})();

/* ---------- 3D album ring gallery ---------- */
var ring = document.getElementById('album-ring');
var caption = document.getElementById('album-caption');
var items = [], angle = 0, curAlbum = 'sketches', radius = 460;
function prettyName(f){
  return f.replace(/\.(jpg|jpeg|png)$/i,'').replace(/[_\-]+/g,' ').replace(/\s+/g,' ').trim();
}
function buildAlbum(name){
  curAlbum = name; angle = 0; items = []; ring.innerHTML = '';
  fetch('assets/img/manifest.json').then(function(r){ return r.json(); }).then(function(m){
    var files = m[name] || [];
    var step = 360 / files.length;
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
  });
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
  fetch('assets/img/manifest.json').then(function(r){ return r.json(); }).then(function(m){
    Object.keys(m).forEach(function(album){
      m[album].forEach(function(f){
        var src = 'assets/img/'+album+'/'+f;
        var card = document.createElement('div'); card.className = 'fg-card';
        card.innerHTML = '<img loading="lazy" src="'+src+'" alt="'+prettyName(f)+'"><div class="fg-bar"><span>'+prettyName(f)+'</span><a href="'+src+'" download>Download</a></div>';
        grid.appendChild(card);
      });
    });
    fg.classList.add('open'); document.body.style.overflow = 'hidden';
  });
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
document.querySelectorAll('.g-tab').forEach(function(t){
  t.addEventListener('click', function(){
    document.querySelectorAll('.g-tab').forEach(function(x){ x.classList.remove('active'); });
    t.classList.add('active'); buildAlbum(t.dataset.album);
  });
});
/* drag to spin */
(function(){
  var stage = document.querySelector('.album-stage'), sx = 0, dragging = false;
  stage.addEventListener('pointerdown', function(e){ dragging = true; sx = e.clientX; stage.setPointerCapture(e.pointerId); });
  stage.addEventListener('pointermove', function(e){ if(!dragging) return; angle += (e.clientX - sx) * .25; sx = e.clientX; updateRing(); });
  stage.addEventListener('pointerup', function(){ dragging = false; });
})();
buildAlbum('sketches');

/* ---------- socials ---------- */
var SOCIALS = [
  ['Behance','https://www.behance.net/saqibmaqbool5'],
  ['Pinterest','https://www.pinterest.com/XAQIarts/'],
  ['GitHub','https://github.com/XAQIARTS'],
  ['LinkedIn','https://www.linkedin.com/in/saqibmaqboolkhan'],
  ['YouTube','https://www.youtube.com/@xaqiarts'],
  ['Instagram','https://www.instagram.com/xaqiarts_official']
];
var sr = document.getElementById('social-row');
SOCIALS.forEach(function(s){
  var a = document.createElement('a');
  a.className = 'soc'; a.href = s[1]; a.target = '_blank'; a.rel = 'noopener'; a.textContent = s[0];
  sr.appendChild(a);
});

/* ---------- THREE.js hero : floating cosmos ---------- */
try{
  var canvas = document.getElementById('hero-3d');
  var renderer = new THREE.WebGLRenderer({canvas:canvas, antialias:true, alpha:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  var scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a10, 0.055);
  var camera = new THREE.PerspectiveCamera(60, 1, .1, 100);
  camera.position.set(0, 0, 14);

  scene.add(new THREE.AmbientLight(0x8877aa, .7));
  var key = new THREE.DirectionalLight(0xffffff, 1.1); key.position.set(6, 8, 6); scene.add(key);
  var rim = new THREE.PointLight(0xe0237a, 2.2, 40); rim.position.set(-7, -3, 4); scene.add(rim);
  var gold = new THREE.PointLight(0xf5b942, 1.4, 40); gold.position.set(7, 4, 2); scene.add(gold);

  /* starfield */
  var starGeo = new THREE.BufferGeometry(), sp = [];
  for(var i=0;i<900;i++){ sp.push((Math.random()-.5)*60, (Math.random()-.5)*40, (Math.random()-.5)*40); }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({color:0xcfd6ff, size:.07, transparent:true, opacity:.85})));

  /* floating shapes */
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
  for(var j=0;j<16;j++){
    var m = new THREE.Mesh(geos[j % geos.length], mats[j % mats.length]);
    m.position.set((Math.random()-.5)*22, (Math.random()-.5)*12, (Math.random()-.5)*10 - 2);
    m.rotation.set(Math.random()*6, Math.random()*6, 0);
    m.userData = {rx:(Math.random()-.5)*.012, ry:(Math.random()-.5)*.012, fy:Math.random()*6.28, amp:.4+Math.random()*.8, y0:m.position.y};
    scene.add(m); shapes.push(m);
  }
  /* hero torus centerpiece */
  var hero = new THREE.Mesh(new THREE.TorusKnotGeometry(1.5, .42, 140, 18),
    new THREE.MeshStandardMaterial({color:0xe0237a, roughness:.2, metalness:.85, emissive:0x4d0a26}));
  hero.position.set(5.2, .4, -3); scene.add(hero);

  var mx = 0, my = 0, t = 0;
  window.addEventListener('pointermove', function(e){
    mx = (e.clientX / window.innerWidth - .5); my = (e.clientY / window.innerHeight - .5);
  });
  function size(){ var w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false); camera.aspect = w/h; camera.updateProjectionMatrix(); }
  window.addEventListener('resize', size); size();

  (function tick(){
    requestAnimationFrame(tick); t += .008;
    shapes.forEach(function(m){
      m.rotation.x += m.userData.rx; m.rotation.y += m.userData.ry;
      m.position.y = m.userData.y0 + Math.sin(t*2 + m.userData.fy) * m.userData.amp;
    });
    hero.rotation.x += .0035; hero.rotation.y += .005;
    var sy = window.scrollY || 0;
    camera.position.x += ((mx*2.2) - camera.position.x) * .04;
    camera.position.y += ((-my*1.4 - sy*.004) - camera.position.y) * .04;
    camera.lookAt(0, -sy*.002, 0);
    renderer.render(scene, camera);
  })();
}catch(err){ /* hero canvas optional — page works without WebGL */ }

})();
