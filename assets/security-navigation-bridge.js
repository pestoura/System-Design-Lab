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
  const link=document.createElement('link');link.rel='stylesheet';link.href='./assets/app-navigation.css?v=2';link.dataset.sdlNavV2='true';document.head.appendChild(link);
 }
 if(!document.querySelector('script[data-sdl-nav-v2]')){
  const script=document.createElement('script');script.src='./assets/app-navigation.js?v=2';script.defer=true;script.dataset.sdlNavV2='true';document.body.appendChild(script);
 }
}
function loadSoftTheme(){
 if(document.querySelector('link[data-sdl-soft-theme]'))return;
 const link=document.createElement('link');link.rel='stylesheet';link.href='./assets/theme-soft.css?v=1';link.dataset.sdlSoftTheme='true';document.head.appendChild(link);
}
function loadAnimatedCards(){
 if(!document.querySelector('link[data-sdl-animated-cards]')){
  const link=document.createElement('link');link.rel='stylesheet';link.href='./assets/animated-architecture-cards.css?v=2';link.dataset.sdlAnimatedCards='true';document.head.appendChild(link);
 }
 if(!document.querySelector('script[data-sdl-animated-cards]')){
  const script=document.createElement('script');script.src='./assets/animated-architecture-cards.js?v=1';script.defer=true;script.dataset.sdlAnimatedCards='true';document.body.appendChild(script);
 }
}
function addScript(selector,src,attr){
 if(document.querySelector(selector))return;
 const script=document.createElement('script');script.src=src;script.async=false;script.setAttribute(attr,'true');document.body.appendChild(script);
}
function loadLocalization(){
 addScript('script[data-sdl-i18n]','./assets/i18n-pt.js?v=2','data-sdl-i18n');
 addScript('script[data-sdl-core-i18n]','./assets/i18n-core-pages-pt.js?v=1','data-sdl-core-i18n');
 addScript('script[data-sdl-core-extended-i18n]','./assets/i18n-core-extended-pt.js?v=1','data-sdl-core-extended-i18n');
 addScript('script[data-sdl-core-content-i18n]','./assets/i18n-core-content-pt.js?v=1','data-sdl-core-content-i18n');
 addScript('script[data-sdl-domain-pack]','./assets/i18n-domain-pack-pt.js?v=1','data-sdl-domain-pack');
 addScript('script[data-sdl-interactive-pack]','./assets/i18n-interactive-pack-pt.js?v=1','data-sdl-interactive-pack');
 addScript('script[data-sdl-patterns-pack]','./assets/i18n-patterns-pack-pt.js?v=1','data-sdl-patterns-pack');
 addScript('script[data-sdl-dynamic-pack]','./assets/i18n-dynamic-pack-pt.js?v=1','data-sdl-dynamic-pack');
 addScript('script[data-sdl-i18n-sync]','./assets/i18n-core-language-sync.js?v=1','data-sdl-i18n-sync');
}
function loadVendorComponents(){
 if(!document.querySelector('link[data-sdl-vendor-components]')){
  const link=document.createElement('link');link.rel='stylesheet';link.href='./assets/vendor-components.css?v=1';link.dataset.sdlVendorComponents='true';document.head.appendChild(link);
 }
 addScript('script[data-sdl-vendor-components]','./assets/vendor-components.js?v=1','data-sdl-vendor-components');
}
function boot(){patch();loadNavigationV2();loadSoftTheme();loadAnimatedCards();loadLocalization();loadVendorComponents();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
