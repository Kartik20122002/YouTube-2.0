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
         // Check if we received a valid response
         if (!response || response.status !== 200 || response.type !== 'basic') {
           return response;
         }
 
         // Cache the fetched response
         const clonedResponse = response.clone();
         caches.open(cacheName).then((cache) => {
           cache.put(event.request, clonedResponse);
         });
 
         return response;
       })
       .catch(() => {
         // If the network request fails, serve from the cache
         return caches.open(cacheName).then(async (cache) => {
           return await cache.match(event.request);
         });
       })
   );
 });
