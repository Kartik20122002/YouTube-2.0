'use client'
import Header from '@/components/global/header/Header'
import './globals.css'
import { SessionProvider } from "next-auth/react"
import Sidebar from '@/components/global/sidebar/Sidebar'
import { createContext, useState } from 'react'
import { motion } from 'framer-motion'

// @ts-ignore
export const isLargeContext = createContext();

// @ts-ignore
export const slideContext = createContext(-1);

// @ts-ignore
export const pageContext = createContext();

import { Roboto } from 'next/font/google'
 
const roboto = Roboto({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})


export default function RootLayout({
  children,
}: {
  children: React.ReactNode,
}) {

  const [isLarge , setIsLarge ] = useState(true);
  const [slide,setSlide] = useState(-1);
  const [IsVideoPage,setPage] = useState(false);

  function toggle(){
    setIsLarge(!isLarge);
  }

  function setslide(val : any){
    setSlide(val)
  }

  function setpage(val:any){
    setPage(val);
  }

  return (
    <html lang="en" className={roboto.className}>
      <head>
      <title>YouTube Pro</title>
      <meta name="description" content="This is YouTube 2 Web App" />
      <meta charSet="UTF-8" />
      <meta name="keywords" content="youtube, youtube-2, youtube 2" />
      <meta name="author" content="Kartik Hatwar" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>

      <body className='w-screen h-screen'>
      <SessionProvider>
        <isLargeContext.Provider value={{isLarge , setIsLarge}}>
        <pageContext.Provider value={{setpage} as any}>
        <slideContext.Provider value={{slide , setslide} as any}>

        <Header isLarge={isLarge} change={toggle}/>
        <Sidebar isLarge={isLarge} IsVideoPage={IsVideoPage}/>
        <motion.div layout transition={{duration : 0.5}}>
        <motion.div layout transition={{duration : 0.5}} className={`${IsVideoPage ? 'md:px-8' : isLarge ? 'md:pl-[16%]' : 'md:pl-[7%]'} w-full pt-12 fixed h-full `}>
        {children}
        </motion.div>
        </motion.div>

        </slideContext.Provider>
        </pageContext.Provider>
        </isLargeContext.Provider>

      </SessionProvider>
      </body>
    </html>
  )
}

