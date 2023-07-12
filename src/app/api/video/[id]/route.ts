import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextRequest, NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic'





export async function POST(req : NextRequest ) {
  const body = await req.text();
  const {id , channelId} = JSON.parse(body);


  try{

  const tokens = await getToken({req , secret});

 if(tokens && tokens?.access_token){ const accessToken = tokens?.access_token;
  const refreshToken = tokens?.refresh_token;

  oauth2client.credentials = {
    access_token : accessToken as string, 
    refresh_token : refreshToken as string
  }
}
else{ 
 oauth2client.credentials = {
  access_token : '' as string, 
  refresh_token : '' as string
}
 oauth2client.apiKey = ytApi;
}

const VideoPromise = youtube.videos.list({
    part: ['snippet','statistics'],
            id: id,
            maxResults: 1
});

const ChannelPromise = youtube.channels.list({
    part: ['snippet','statistics'],
    id: channelId,
    maxResults: 1
});

const CommentsPromise = youtube.commentThreads.list({
  part : ['snippet'],
  videoId : id,
  maxResults : 50
});

const RelatedVideosPromise = async (id : any)=>{
  try {
const url = `https://youtube-v31.p.rapidapi.com/search?relatedToVideoId=${id}&part=id%2Csnippet&type=video&maxResults=25`;

const options = {
method: 'GET',
headers: {
  'X-RapidAPI-Key': '79f25e9d42mshed666ecd3dda012p1ed78ejsnaa144f427d4e',
  'X-RapidAPI-Host': 'youtube-v31.p.rapidapi.com'
}
};

let results = await fetch(url,options);
results = await results.json();

return results;

  } catch (error) {
    return {};
      throw error;
  }
}


if(tokens && tokens?.access_token){
  const RatingPromise = youtube.videos.getRating({
    id: id,
  });
  
  const SubscriptionPromise = youtube.subscriptions.list({
    part : ['id'],
    forChannelId : channelId,
    mine : true
  });
  
 
  const [VideoData , ChannelData , CommentsData , RatingData , SubscriptionData , RelatedVideos] = await Promise.all([VideoPromise,ChannelPromise,CommentsPromise,RatingPromise,SubscriptionPromise,RelatedVideosPromise]);
  
  const relatedData = RelatedVideos;
  const video = VideoData?.data?.items;
  const channel = ChannelData?.data?.items;
  const comments = CommentsData.data.items;
  const rating = RatingData.data.items; 
  const subscription = SubscriptionData.data.items;
  
  return {video,channel,comments,rating,subscription,relatedData};
}
else{
  const [VideoData , ChannelData , CommentsData , RelatedVideos] = await Promise.all([VideoPromise,ChannelPromise,CommentsPromise,RelatedVideosPromise]);

  const relatedData = RelatedVideos;
  const video = VideoData?.data?.items;
  const channel = ChannelData?.data?.items;
  const comments = CommentsData.data.items;
  
  return {video,channel,comments,relatedData};
}


}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);

}
}
