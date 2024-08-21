'use client'
import { pageContext, slideContext } from "@/app/layout";
import UserPlaylistPage from "@/components/playlistpage/UserPlaylistPage" ;
import { useContext, useEffect } from "react";

const UserPlaylistpage = ({ params }: any) => {
  const { slide, setslide } = useContext(slideContext) as any;
  const { setpage } = useContext(pageContext) as any;
  setpage(false);
  setslide(-1);

  return <UserPlaylistPage id={params.id} />
}

export default UserPlaylistpage;