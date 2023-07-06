'use client'
import { useSession, signIn } from "next-auth/react"
import {useEffect } from "react";
import HomePage from "@/components/homepage/Homepage";
import { motion } from "framer-motion";
import { FaYoutube } from "react-icons/fa6";
import Loader from "@/components/global/loader/Loader";

export default function Home() {
 
  const { status } = useSession();

  useEffect(()=>{
    console.log(status)
  },[status])

  return (
    <>

          {status == 'loading' ?
              <Loader/> :
          <HomePage/>
          }
    </>
  )
}





