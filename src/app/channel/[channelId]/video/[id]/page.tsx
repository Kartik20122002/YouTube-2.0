import Videopage from "@/components/videopage/Videopage";
import {getInfo} from 'ytdl-core';

const VideoPage = async ({ params }: any) => {
  const {id , channelId} = params;

  const videoData = await getInfo(`https://www.youtube.com/watch?v=${id}`);

  // const videoDetails = videoData.videoDetails;
  const downloadOptions = videoData.formats.filter((format)=>{ return (format.hasAudio && format.hasVideo)});
  
  // const channelDetails = videoData.videoDetails.author;
  const relatedVideos = videoData.related_videos;

  return <Videopage relatedStr={JSON.stringify(relatedVideos)} downloadOptionsStr={JSON.stringify(downloadOptions)} id={id} channelId={channelId} />
}

export default VideoPage;