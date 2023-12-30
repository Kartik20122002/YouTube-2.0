'use client'
import { useSession } from "next-auth/react"
import { useContext, useEffect } from "react";
import { motion } from "framer-motion";
import Loader from "@/components/global/loader/Loader";
import { slideContext } from "./layout";
import PageSection from "@/components/global/pagesection/pagesection";


export default function Home() {

  const { status, data: session } = useSession();

  const { slide, setslide } = useContext(slideContext) as any;
  setslide(0);

  useEffect(() => {
    const fun = async () => {
      if (typeof window !== "undefined") {

        const res = await fetch(`/api/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: session?.user?.email }),
          next: { tags: ['history'] }
        });

        if (res.status != 500 && res.status != 404) {
          const { videoItems } = await res.json();
          localStorage.setItem('history', JSON.stringify(videoItems));
        }

      }
    }
    if (status === "authenticated") fun();

  }, [status])


  return (
    <>
      {status == 'loading' ?
        <Loader /> :
        <motion.div layout transition={{ duration: 0.5 }}>
          <PageSection page={'popular'} />
        </motion.div>
      }
    </>
  )
}





