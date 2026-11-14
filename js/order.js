/* ============ XAQI ARTS — order.js : custom order form -> Supabase orders ============
   Service options come from the services table when it has rows, otherwise
   from the built-in fallback list. ?artwork=<id> pre-fills the painting.
   On submit one row is inserted into orders (status 'new'); on success a
   WhatsApp button is offered so the customer can send a reference photo. */
(function(){
"use strict";

var WA_NUMBER = '923155296859';
var WA_DISPLAY = '0315 5296859';
var FALLBACK_SERVICES = ['Custom Sketch', 'Custom Painting', 'Photography', 'Professional Videography', 'Other'];

var form = document.getElementById('order-form');
var serviceSel = document.getElementById('service-type');
var artworkNote = document.getElementById('artwork-note');
var successBox = document.getElementById('order-success');
var errorBox = document.getElementById('order-error');
var submitBtn = document.getElementById('order-submit');
var waBtn = document.getElementById('order-whatsapp');
var client = null;
var artwork = null; /* {id, title, price_pkr} when ?artwork=<id> resolves */

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
function showError(msg){
  errorBox.textContent = msg;
  errorBox.style.display = 'block';
}
function hideError(){
  errorBox.style.display = 'none';
}

function getClient(){
  if(client) return client;
  if(!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY ||
     window.SUPABASE_ANON_KEY === 'PASTE_ANON_KEY_HERE') return null;
  try{
    client = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  }catch(e){
    client = null;
  }
  return client;
}

/* Pre-select "Custom Painting" when a painting was chosen, if that option exists. */
function preselectPaintingService(){
  if(!artwork) return;
  var found = Array.prototype.some.call(serviceSel.options, function(o){
    return o.value === 'Custom Painting';
  });
  if(found) serviceSel.value = 'Custom Painting';
}

function fillServices(options){
  serviceSel.innerHTML = '';
  options.forEach(function(o){
    var opt = document.createElement('option');
    opt.value = o.value;
    opt.textContent = o.label;
    serviceSel.appendChild(opt);
  });
  preselectPaintingService();
}

function loadServices(){
  var c = getClient();
  if(!c){
    fillServices(FALLBACK_SERVICES.map(function(s){ return {value: s, label: s}; }));
    return;
  }
  c.from('services')
    .select('name,price_pkr')
    .order('created_at', {ascending: true})
    .then(function(res){
      if(res.error || !res.data || !res.data.length){
        fillServices(FALLBACK_SERVICES.map(function(s){ return {value: s, label: s}; }));
        return;
      }
      fillServices(res.data.map(function(s){
        var label = s.name;
        if(s.price_pkr != null && s.price_pkr !== '') label += ' — ' + fmtPrice(s.price_pkr);
        return {value: s.name, label: label};
      }));
    })
    .catch(function(){
      fillServices(FALLBACK_SERVICES.map(function(s){ return {value: s, label: s}; }));
    });
}

function loadArtwork(){
  var id = null;
  try{ id = new URLSearchParams(window.location.search).get('artwork'); }catch(e){}
  if(!id) return;
  var c = getClient();
  if(!c) return;
  c.from('artworks')
    .select('id,title,price_pkr')
    .eq('id', id)
    .maybeSingle()
    .then(function(res){
      if(res.error || !res.data) return;
      artwork = res.data;
      var price = (artwork.price_pkr != null && artwork.price_pkr !== '')
        ? ' — ' + fmtPrice(artwork.price_pkr) : '';
      artworkNote.innerHTML = 'Painting: <b>' + esc(artwork.title || 'Untitled') + '</b>' + esc(price);
      artworkNote.style.display = 'block';
      preselectPaintingService();
    })
    .catch(function(){ /* unknown artwork id — form still works as a custom order */ });
}

form.addEventListener('submit', function(e){
  e.preventDefault();
  hideError();

  var name = document.getElementById('cust-name').value.trim();
  var phone = document.getElementById('cust-phone').value.trim();
  var email = document.getElementById('cust-email').value.trim();
  var service = serviceSel.value;
  var details = document.getElementById('cust-details').value.trim();
  var budgetRaw = document.getElementById('cust-budget').value.trim();

  if(!name || !phone || !details){
    showError('Please fill in your name, phone number and order details.');
    return;
  }
  var c = getClient();
  if(!c){
    showError('The order form is being set up. Please WhatsApp us directly at ' + WA_DISPLAY + '.');
    return;
  }

  var fullDetails = details;
  if(artwork){
    var price = (artwork.price_pkr != null && artwork.price_pkr !== '')
      ? ' (' + fmtPrice(artwork.price_pkr) + ')' : '';
    fullDetails = 'Painting: ' + (artwork.title || 'Untitled') + price + '\n' + details;
  }
  var budget = null;
  if(budgetRaw !== ''){
    var parsed = parseInt(budgetRaw, 10);
    if(isFinite(parsed)) budget = parsed;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';
  c.from('orders').insert([{
    customer_name: name,
    email: email === '' ? null : email,
    phone: phone,
    service_type: service,
    details: fullDetails,
    budget_pkr: budget,
    status: 'new'
  }]).then(function(res){
    submitBtn.disabled = false;
    submitBtn.textContent = 'Place order';
    if(res.error){
      showError('Sorry, your order could not be sent. Please try again, or WhatsApp us at ' + WA_DISPLAY + '.');
      return;
    }
    var waText = 'Hi XAQI arts, I am ' + name + '. I just placed an order for ' + service + '.' +
      (artwork ? ' Painting: ' + (artwork.title || '') + '.' : '');
    waBtn.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(waText);
    form.style.display = 'none';
    successBox.style.display = 'block';
    successBox.scrollIntoView({behavior: 'smooth', block: 'center'});
  }).catch(function(){
    submitBtn.disabled = false;
    submitBtn.textContent = 'Place order';
    showError('Sorry, your order could not be sent. Please try again, or WhatsApp us at ' + WA_DISPLAY + '.');
  });
});

loadServices();
loadArtwork();
})();
