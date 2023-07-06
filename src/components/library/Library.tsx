'use client'
import { slideContext } from "@/app/layout";
import Link from "next/link";
import { useContext } from "react";

const Library = ()=>{
  const {slide , setslide} = useContext(slideContext) as any;
  setslide(1);

    return <div className="w-full h-full">
    welcome to library
    <Link href={'/homepage'}>go to homepage</Link>
    </div>
}

export default Library;