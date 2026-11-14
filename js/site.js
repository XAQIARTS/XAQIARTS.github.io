/* ============ XAQI ARTS — site.js : shared chrome for sub-pages ============
   Theme toggle + reveal-on-scroll, written defensively so it works on any
   page (unlike main.js, which assumes the index-only elements exist). */
(function(){
"use strict";

var root = document.documentElement;

/* theme : light / dark (same localStorage key as index) */
try{
  var saved = localStorage.getItem('xaqi-theme');
  if(saved) root.setAttribute('data-theme', saved);
}catch(e){}
var toggle = document.getElementById('theme-toggle');
if(toggle){
  toggle.addEventListener('click', function(){
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try{ localStorage.setItem('xaqi-theme', next); }catch(e){}
  });
}

/* reveal on scroll */
function showAll(){
  document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('visible'); });
}
if('IntersectionObserver' in window){
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
}else{
  showAll();
}
})();
