/* Tests Pau FC : l'appli s'ouvre même sans réseau. Les résultats, eux, ne passent jamais par ce fichier : ils attendent dans le téléphone et partent dès que le réseau revient. */
const C="tests-paufc-v12";const FILES=["tests-app.html","tests-app.webmanifest","tests-app-icon-192.png","tests-app-icon-512.png","tests-app-icon-180.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* page : réseau d'abord (toujours la dernière version), copie de secours si pas de réseau ; le classeur du club n'est jamais mis en cache */
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!=="GET"||u.origin!==location.origin)return;
  e.respondWith(fetch(e.request,{cache:"no-store"}).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request,{ignoreSearch:true})))});
