import Videopage from "@/components/videopage/Videopage";


const VideoPage = async ({ params }: any) => {
  const {id , channelId} = params;


  return <Videopage id={id} channelId={channelId} />
}

export default VideoPage;