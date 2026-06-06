'use client'
import { pageContext, slideContext } from "@/app/layout";
import PlaylistPage from "@/components/playlistpage/Playlistpage";
import { useContext, use } from "react";

const Playlistpage = ({ params }: any) => {
  const { id } = use(params);
  const { slide, setslide } = useContext(slideContext) as any;
  const { setpage } = useContext(pageContext) as any;
  setpage(false);
  setslide(-1);

  return <PlaylistPage id={id} />
}

export default Playlistpage;