/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
    dest: 'public',
    register: true,
    skipWaiting: true,
  });
  
const nextConfig = {
    typescript : {
        ignoreBuildErrors : true,
      },
    images : {
        unoptimized : true,
        domains: ['i.ytimg.com' , 'lh3.googleusercontent.com' ,'yt3.ggpht.com','yt3.googleusercontent.com'],
    }
}

module.exports = withPWA(nextConfig)
