'use client'
import { useSession, signIn, signOut } from "next-auth/react"
import { Suspense, useEffect, useState } from "react";
import LikePage from "@/components/likepage/Likepage";
import Loader from "@/components/global/loader/Loader";

export default function Home() {
 
  const { status } = useSession();

  useEffect(()=>{
    console.log(status)
  },[status])

  return (
    <>
          {status == 'authenticated' ?
          <LikePage/>
           : 
           <>
           {status == 'unauthenticated' ?
          <button onClick={()=>signIn()}>signin</button>
          : <><Loader/></>
           }
          </>
          }
    </>
  )
}


