'use client'
import { slideContext } from "@/app/layout";
import Videopage from "@/components/videopage/Videopage";
import { useContext, useEffect } from "react";

const VideoPage = ({params} : any)=>{
  const {slide , setslide} = useContext(slideContext) as any;

  useEffect(()=>{
    setslide(-1);
  })


    return <div className="w-full h-full"><Videopage id={params.id}/></div>
}

export default VideoPage;