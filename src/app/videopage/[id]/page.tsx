import { slideContext } from "@/app/layout";
import { useContext } from "react";

const VideoPage = ({params} : any)=>{
  const {slide , setslide} = useContext(slideContext) as any;
  setslide(-1);

    return <div className="text-white">{params.id}</div>
}

export default VideoPage;