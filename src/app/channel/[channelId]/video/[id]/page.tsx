'use client'
import { pageContext, slideContext } from "@/app/layout";
import Videopage from "@/components/videopage/Videopage";
import { useContext, useEffect } from "react";

const VideoPage = ({ params }: any) => {
  const { slide, setslide } = useContext(slideContext) as any;
  const { setpage } = useContext(pageContext) as any;

  setpage(true);
  setslide(-1);

  return <Videopage id={params.id} channelId={params.channelId} />
}

export default VideoPage;