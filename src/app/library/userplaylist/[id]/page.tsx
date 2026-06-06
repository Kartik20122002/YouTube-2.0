'use client'
import { pageContext, slideContext } from "@/app/layout";
import UserPlaylistPage from "@/components/playlistpage/UserPlaylistPage" ;
import { useContext, use } from "react";

const UserPlaylistpage = ({ params }: any) => {
  const { id } = use(params);
  const { slide, setslide } = useContext(slideContext) as any;
  const { setpage } = useContext(pageContext) as any;
  setpage(false);
  setslide(-1);

  return <UserPlaylistPage id={id} />
}

export default UserPlaylistpage;