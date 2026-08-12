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
function loadSoftTheme(){
 if(document.querySelector('link[data-sdl-soft-theme]'))return;
 const link=document.createElement('link');
 link.rel='stylesheet';link.href='./assets/theme-soft.css?v=1';link.dataset.sdlSoftTheme='true';
 document.head.appendChild(link);
}
function loadAnimatedCards(){
 if(!document.querySelector('link[data-sdl-animated-cards]')){
  const link=document.createElement('link');
  link.rel='stylesheet';link.href='./assets/animated-architecture-cards.css?v=2';link.dataset.sdlAnimatedCards='true';
  document.head.appendChild(link);
 }
 if(!document.querySelector('script[data-sdl-animated-cards]')){
  const script=document.createElement('script');
  script.src='./assets/animated-architecture-cards.js?v=1';script.defer=true;script.dataset.sdlAnimatedCards='true';
  document.body.appendChild(script);
 }
}
function loadLocalization(){
 if(!document.querySelector('script[data-sdl-i18n]')){
  const script=document.createElement('script');
  script.src='./assets/i18n-pt.js?v=2';script.async=false;script.dataset.sdlI18n='true';
  document.body.appendChild(script);
 }
 if(!document.querySelector('script[data-sdl-core-i18n]')){
  const core=document.createElement('script');
  core.src='./assets/i18n-core-pages-pt.js?v=1';core.async=false;core.dataset.sdlCoreI18n='true';
  document.body.appendChild(core);
 }
}
function boot(){patch();loadNavigationV2();loadSoftTheme();loadAnimatedCards();loadLocalization();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
