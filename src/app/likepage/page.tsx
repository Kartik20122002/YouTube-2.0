'use client'
import { useSession, signIn } from "next-auth/react"
import { useContext } from "react";
import Loader from "@/components/global/loader/Loader";
import { slideContext } from "../layout";
import { motion } from "framer-motion";
import PageSection from "@/components/global/pagesection/pagesection";

export default function Home() {

  const { status } = useSession();

  const { slide, setslide } = useContext(slideContext) as any;
  setslide(3);

  return (
    <>
      {status == 'authenticated' ?
        <motion.div layout transition={{ duration: 0.5 }}>
          <PageSection page={'liked'} />
        </motion.div>
        :
        <>
          {status == 'unauthenticated' ?
            <button onClick={() => signIn()}>signin</button>
            : <><Loader /></>
          }
        </>
      }
    </>
  )
}


