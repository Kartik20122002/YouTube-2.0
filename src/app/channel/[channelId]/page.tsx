'use client'
import { pageContext, slideContext } from "@/app/layout";
import ChannelPage from "@/components/channelpage/ChannlePage";
import { useContext, use } from "react";

const Channelpage = ({ params }: any) => {
  const { channelId } = use(params);
  const { slide, setslide } = useContext(slideContext) as any;
  const { setpage } = useContext(pageContext) as any;

  setpage(false);
  setslide(-1);

  return <ChannelPage channelId={channelId} />
}

export default Channelpage;