var CACHE='fee-calc-v7';
var FILES=['./','index.html','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}));
  self.skipWaiting();
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(x){return x!==CACHE}).map(function(x){return caches.delete(x)}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(fetch(e.request).then(function(r){
    if(!r||r.status!==200)return r;var copy=r.clone();
    caches.open(CACHE).then(function(c){c.put(e.request,copy)});
    return r;
  }).catch(function(){return caches.match(e.request).then(function(m){return m||caches.match('index.html')})}));
});
