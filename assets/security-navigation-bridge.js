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
function loadNavigationV2(){
 if(!document.querySelector('link[data-sdl-nav-v2]')){
  const link=document.createElement('link');
  link.rel='stylesheet';link.href='./assets/app-navigation.css?v=2';link.dataset.sdlNavV2='true';
  document.head.appendChild(link);
 }
 if(!document.querySelector('script[data-sdl-nav-v2]')){
  const script=document.createElement('script');
  script.src='./assets/app-navigation.js?v=2';script.defer=true;script.dataset.sdlNavV2='true';
  document.body.appendChild(script);
 }
}
function loadLocalization(){
 if(document.querySelector('script[data-sdl-i18n]'))return;
 const script=document.createElement('script');
 script.src='./assets/i18n-pt.js?v=2';script.defer=true;script.dataset.sdlI18n='true';
 document.body.appendChild(script);
}
function boot(){patch();loadNavigationV2();loadLocalization();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
