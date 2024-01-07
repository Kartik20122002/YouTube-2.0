'use client'
import { useSession, signIn } from "next-auth/react"
import { useContext, useEffect } from "react";
import Loader from "@/components/global/loader/Loader";
import { pageContext, slideContext } from "../layout";
import { motion } from "framer-motion";
import History from "@/components/historypage/History";

export default function Home() {

    const { status } = useSession();

    const { setslide } = useContext(slideContext) as any;
    setslide(2);
    const { setpage } = useContext(pageContext) as any;
    setpage(false);

    useEffect(() => {
        if (status === "unauthenticated") signIn();
    },[])

    return (
        <>
            {status == 'authenticated' ?
                <motion.div layout transition={{ duration: 0.5 }}>
                    <History />
                </motion.div>
                : <Loader />
            }

        </>
    )
}


