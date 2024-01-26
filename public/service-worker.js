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

self.addEventListener('fetch',()=>{});



const cacheClone = async (e) => {
  const res = await fetch(e.request);
  const resClone = res.clone();
  const cache = await caches.open(cacheName);
  await cache.put(e.request, resClone);
  return res;
};

const fetchEvent = () => {
  self.addEventListener('fetch', (e) => {
    e.respondWith(
      cacheClone(e)
        .catch(() => caches.match(e.request))
        .then((res) => res)
    );
  });
};

fetchEvent();