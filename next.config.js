/** @type {import('next').NextConfig} */

  
const nextConfig = {
    typescript : {
        ignoreBuildErrors : true,
      },
    images : {
        unoptimized : true,
        remotePatterns: [
            { protocol: 'https', hostname: 'i.ytimg.com' },
            { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
            { protocol: 'https', hostname: 'yt3.ggpht.com' },
            { protocol: 'https', hostname: 'yt3.googleusercontent.com' },
        ],
    }
}

module.exports = nextConfig;
