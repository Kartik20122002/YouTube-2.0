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

self.addEventListener('fetch', event => {
   const request = event.request;

   // Check if the request is for an image or under the "/api" route
   if (request.url.match(/\.(png|jpg|jpeg|gif|webp)$/) || request.url.includes('/api/')) {
      console.log('Handling fetch for:', request.url);

      event.respondWith(
         // Try to fetch the resource from the network
         fetch(request).then(response => {
            console.log('Network Response:', response);

            // If the network request is successful, cache the response
            const responseClone = response.clone();
            caches.open('network-first-cache').then(cache => {
               cache.put(request, responseClone);
            });

            return response;
         }).catch(async error => {
            console.error('Fetch Error:', error);

            // If the network request fails, try to get the resource from the cache
            const cachedResponse = await caches.match(request);
            console.log('Cache Response:', cachedResponse);
            return cachedResponse;
         })
      );
   } else {
      console.log('Ignoring fetch for:', request.url);

      // For other requests, do not interfere and let the default browser behavior take over.
      event.respondWith(fetch(request));
   }
});
