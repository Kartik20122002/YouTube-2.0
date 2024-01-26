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

self.addEventListener('fetch', event => {
  const request = event.request;

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
     }).catch(error => {
        console.error('Fetch Error:', error);

        // If the network request fails, try to get the resource from the cache
        return caches.match(request).then(cachedResponse => {
           console.log('Cache Response:', cachedResponse);
           return cachedResponse || fetch(request);
        });
     })
  );
});
