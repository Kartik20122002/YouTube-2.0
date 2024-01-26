'use client'
const cacheName = 'v1'

const precachedAssets = [
  '/manifest.json',
];


self.addEventListener('install',(e)=>{
  e.waitUntil(caches.open(cacheName).then(async (cache)=>{
    const res = await cache.addAll(precachedAssets)
    return res;
  }))
});

// service-worker.js

self.addEventListener('fetch', (event) => {
   event.respondWith(
     fetch(event.request)
       .then((response) => {
 
         // Cache the fetched response
         const clonedResponse = response.clone();
         caches.open(cacheName).then((cache) => {
           cache.put(event.request, clonedResponse);
         });
 
         return response;
       })
       .catch(async () => {
         // If the network request fails, serve from the cache
         const cache = await caches.open(cacheName);
          return await cache.match(event.request);
       })
   );
 });
