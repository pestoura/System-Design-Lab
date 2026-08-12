/* Keeps Security Lab sections compatible with the legacy navigation router. */
(function(){
'use strict';
function hideSecurity(){document.querySelectorAll('.sdl-security-section').forEach(function(el){el.classList.remove('active');});document.querySelectorAll('.sdl-security-nav .sidebar-item,.sdl-security-topnav').forEach(function(el){el.classList.remove('active');});}
function patch(){
 if(typeof window.showSection==='function'&&!window.showSection.__securityBridge){
  const original=window.showSection;
  const wrapped=function(){hideSecurity();return original.apply(this,arguments);};
  wrapped.__securityBridge=true;window.showSection=wrapped;
 }
 document.addEventListener('click',function(e){
  if(e.target.closest('[data-sec-open]'))return;
  if(e.target.closest('.sidebar-item,.nav-btn,.nav-logo'))hideSecurity();
 },true);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',patch,{once:true});else patch();
})();
