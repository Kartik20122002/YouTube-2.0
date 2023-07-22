/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript : {
        ignoreBuildErrors : true,
      },
    images : {
        unoptimised : true,
        domains: ['i.ytimg.com' , 'lh3.googleusercontent.com' ,'yt3.ggpht.com','yt3.googleusercontent.com'],
    }
}

module.exports = nextConfig
