'use client'
import { signOut, useSession } from "next-auth/react"
import {useContext, useEffect } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/global/loader/Loader";
import { slideContext } from "./layout";
import PageSection from "@/components/global/pagesection/pagesection";

const dynamic = 'force-dynamic'


export default function Home() {
 
  const { status } = useSession();

  const {slide , setslide} = useContext(slideContext) as any;
  setslide(0);

 
  return (
    <>
          {status == 'loading' ?
              <Loader/> :
              <motion.div layout transition={{duration : 0.5}}>
              {/* <PageSection page={'popular'}/> */}
              </motion.div>
          }
    </>
  )
}





