/* Ensures a clean language reset when switching from the layered PT localisation back to English. */
(function(){
'use strict';
window.addEventListener('sdl:locale-change',function(e){
  if(!e.detail||e.detail.locale!=='en')return;
  /* The base and core translators intentionally keep separate original-text stores.
     A lightweight reload gives both layers a clean English DOM without touching routes/state in storage. */
  setTimeout(function(){window.location.reload();},40);
});
})();
