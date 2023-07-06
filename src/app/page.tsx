'use client'
import { useSession, signIn } from "next-auth/react"
import {useEffect } from "react";
import HomePage from "@/components/homepage/Homepage";

export default function Home() {
 
  const { status } = useSession();

  useEffect(()=>{
    console.log(status)
  },[status])

  return (
    <>
          {status == 'loading' ?
          <>Loading ...</> :
          <HomePage/>
          }
    </>
  )
}





