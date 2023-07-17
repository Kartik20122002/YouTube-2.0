'use client'
import { slideContext } from "@/app/layout";
import PlaylistPage from "@/components/playlistpage/Playlistpage";
import { useContext, useEffect } from "react";

const Playlistpage = ({params} : any)=>{
  const {slide , setslide} = useContext(slideContext) as any;

  useEffect(()=>{
    setslide(-1);
  })

  return <PlaylistPage id={params.id}/>
}

export default Playlistpage;