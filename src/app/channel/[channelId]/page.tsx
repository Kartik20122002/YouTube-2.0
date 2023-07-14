'use client'
import { slideContext } from "@/app/layout";
import ChannelPage from "@/components/channelpage/ChannlePage";
import { useContext, useEffect } from "react";

const Channelpage = ({params} : any)=>{
  const {slide , setslide} = useContext(slideContext) as any;

  useEffect(()=>{
    setslide(-1);
  })

  return <ChannelPage channelId={params.channelId}/>
}

export default Channelpage;