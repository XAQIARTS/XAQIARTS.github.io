/* ============ XAQI ARTS — shop.js : paintings grid from Supabase ============
   Loads artworks with status='available', newest first. If Supabase is
   unreachable (or the anon key is not filled in yet) it shows a plain
   message — never a blank page. */
(function(){
"use strict";

var grid = document.getElementById('shop-grid');
var statusBox = document.getElementById('shop-status');
var emptyBox = document.getElementById('shop-empty');

function showStatus(msg){
  if(statusBox){ statusBox.textContent = msg; statusBox.style.display = 'block'; }
}
function hideStatus(){
  if(statusBox){ statusBox.style.display = 'none'; }
}
function esc(s){
  return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
}
function fmtPrice(n){
  var v = Number(n);
  if(!isFinite(v)) return '';
  return 'Rs ' + v.toLocaleString('en-US');
}

function render(rows){
  grid.innerHTML = '';
  rows.forEach(function(a){
    var card = document.createElement('article');
    card.className = 'shop-card';
    var media = a.image_url
      ? '<img src="'+esc(a.image_url)+'" alt="'+esc(a.title || 'Painting')+'" loading="lazy">'
      : '<div class="shop-img-empty">Photo coming soon</div>';
    var meta = [a.medium, a.category].filter(Boolean).join(' · ');
    var desc = a.description ? '<p class="shop-desc">'+esc(a.description)+'</p>' : '';
    var price = (a.price_pkr != null && a.price_pkr !== '')
      ? '<p class="shop-price">'+esc(fmtPrice(a.price_pkr))+'</p>'
      : '<p class="shop-price">Price on request</p>';
    card.innerHTML =
      '<div class="shop-img">'+media+'</div>'+
      '<div class="shop-body"><b>'+esc(a.title || 'Untitled')+'</b>'+
      (meta ? '<p class="shop-meta">'+esc(meta)+'</p>' : '')+
      desc + price +
      '<a class="btn btn-primary btn-sm" href="order.html?artwork='+encodeURIComponent(a.id)+'">Order this painting</a></div>';
    grid.appendChild(card);
  });
}

function load(){
  if(!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY ||
     window.SUPABASE_ANON_KEY === 'PASTE_ANON_KEY_HERE'){
    showStatus('The shop is being set up — please check back soon, or place a custom order instead.');
    return;
  }
  var client;
  try{
    client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }catch(e){
    showStatus('Could not connect to the shop right now. Please try again later.');
    return;
  }
  client.from('artworks')
    .select('id,title,description,category,medium,price_pkr,image_url,status')
    .eq('status', 'available')
    .order('created_at', {ascending: false})
    .then(function(res){
      if(res.error){
        showStatus('Could not load the paintings right now. Please try again later.');
        return;
      }
      var rows = res.data || [];
      if(!rows.length){
        grid.style.display = 'none';
        emptyBox.style.display = 'block';
        hideStatus();
        return;
      }
      hideStatus();
      render(rows);
    })
    .catch(function(){
      showStatus('Could not load the paintings right now. Please try again later.');
    });
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', load);
}else{
  load();
}
})();
