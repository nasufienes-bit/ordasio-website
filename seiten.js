/* Ordasio – Preise, Paket-Links und Seitenleiste */
(function(){
  var APP = 'https://app.ordasio.ch/';
  var PREISE = { start: { monat: 15, jahr: 150 }, solo: { monat: 29, jahr: 290 }, business: { monat: 39, jahr: 390 }, privat: { monat: 4, jahr: 39 }, ma: { monat: 6, jahr: 60 }, team: { monat: 19, jahr: 190 }, lohn: { monat: 12, jahr: 120 }, projekte: { monat: 12, jahr: 120 }, verkauf: { monat: 9, jahr: 90 }, finanzen: { monat: 9, jahr: 90 }, bewerbungen: { monat: 9, jahr: 90 } };
  var rf = 'einzel';
  var zyklus = 'jahr';
  var $ = function(s){ return document.querySelector(s); }, $$ = function(s){ return [].slice.call(document.querySelectorAll(s)); };
  function zeigen(){
    $$('[data-zyklus]').forEach(function(b){ b.classList.toggle('an', b.getAttribute('data-zyklus') === zyklus); });
    Object.keys(PREISE).forEach(function(k){
      var p = PREISE[k];
      $$('[data-preis="' + k + '"]').forEach(function(e){ e.textContent = zyklus === 'jahr' ? p.jahr : p.monat; });
      $$('[data-unter="' + k + '"]').forEach(function(e){ e.textContent = zyklus === 'jahr' ? 'entspricht CHF ' + (p.jahr / 12).toFixed(2) + ' pro Monat' : 'monatlich kündbar'; });
      $$('[data-klein="' + k + '"]').forEach(function(e){ e.textContent = 'CHF ' + (zyklus === 'jahr' ? p.jahr + '/Jahr' : p.monat + '/Monat'); });
    });
    $$('[data-rf]').forEach(function(b){ b.classList.toggle('an', b.getAttribute('data-rf') === rf); });
    $$('[data-nur]').forEach(function(e){ e.hidden = e.getAttribute('data-nur') !== rf; });
    $$('[data-paket-wahl]').forEach(function(a){ var p = a.getAttribute('data-paket-wahl'); a.setAttribute('href', APP + '?neu=1&paket=' + p + (p === 'privat' ? '&rechtsform=privat' : (/^business/.test(p) || rf === 'firma') ? '&rechtsform=gmbh' : '')); });
    $$('[data-pro]').forEach(function(s){ s.textContent = zyklus === 'jahr' ? '/ Jahr' : '/ Monat'; });
  }
  $$('[data-zyklus]').forEach(function(b){ b.addEventListener('click', function(){ zyklus = b.getAttribute('data-zyklus'); zeigen(); }); });
  $$('[data-rf]').forEach(function(b){ b.addEventListener('click', function(){ rf = b.getAttribute('data-rf'); zeigen(); }); });
  // Jeder „Gratis testen“-Knopf führt direkt zur Anmeldung mit dem gewählten Paket

  // Seitenleiste auf dem Handy öffnen und schliessen
  var knopf = $('.menue-knopf');
  function menue(auf){ document.body.classList.toggle('menu-offen', auf); if (knopf) knopf.setAttribute('aria-expanded', auf ? 'true' : 'false'); }
  if (knopf) knopf.addEventListener('click', function(){ menue(!document.body.classList.contains('menu-offen')); });
  $$('.schleier, .leiste a').forEach(function(e){ e.addEventListener('click', function(){ menue(false); }); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') menue(false); });
  zeigen();
})();

/* Neu in Ordasio: Karten wechseln alle 6 Sekunden, pausieren bei Maus, Fokus oder Wischen */
(function(){
  var band = document.querySelector('.vt-band'); if (!band) return;
  var karten = band.children, pk = document.querySelector('.vt-punkte'), jetzt = 0, pause = false, uhr;
  pk.innerHTML = [].map.call(karten, function(_, i){ return '<i data-i="' + i + '"></i>'; }).join('');
  function zeige(i, sanft){ jetzt = (i + karten.length) % karten.length; band.scrollTo({ left: karten[jetzt].offsetLeft - band.offsetLeft, behavior: sanft === false ? 'auto' : 'smooth' }); malen(); }
  function malen(){ [].forEach.call(pk.children, function(x, j){ x.classList.toggle('an', j === jetzt); }); }
  band.addEventListener('scroll', function(){ var i = Math.round(band.scrollLeft / band.clientWidth); if (i !== jetzt) { jetzt = i; malen(); } }, { passive: true });
  ['mouseenter', 'focusin', 'touchstart'].forEach(function(e){ band.addEventListener(e, function(){ pause = true; }, { passive: true }); });
  ['mouseleave', 'focusout'].forEach(function(e){ band.addEventListener(e, function(){ pause = false; }); });
  document.querySelectorAll('[data-vt]').forEach(function(b){ b.addEventListener('click', function(){ pause = true; zeige(jetzt + Number(b.getAttribute('data-vt'))); }); });
  pk.addEventListener('click', function(e){ var t = e.target.closest('[data-i]'); if (t) { pause = true; zeige(Number(t.getAttribute('data-i'))); } });
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!still) uhr = setInterval(function(){ if (!pause && !document.hidden) zeige(jetzt + 1); }, 6000);
  malen();
})();
