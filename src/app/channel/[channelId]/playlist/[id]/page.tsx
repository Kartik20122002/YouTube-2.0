'use client'
import { pageContext, slideContext } from "@/app/layout";
import PlaylistPage from "@/components/playlistpage/Playlistpage";
import { useContext, useEffect } from "react";

const Playlistpage = ({ params }: any) => {
  const { slide, setslide } = useContext(slideContext) as any;
  const { setpage } = useContext(pageContext) as any;
  setpage(false);
  setslide(-1);

  return <PlaylistPage id={params.id} />
}

export default Playlistpage;