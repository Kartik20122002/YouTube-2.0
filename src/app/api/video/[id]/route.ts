import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";

export const dynamic = 'force-dynamic'

export async function POST(req : any ) {
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


const RelatedVideosPromise = fetch(`https://youtube-v3-alternative.p.rapidapi.com/related?id=${id}&part=id%2Csnippet&type=video&maxResults=25`,{
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '79f25e9d42mshed666ecd3dda012p1ed78ejsnaa144f427d4e',
    'X-RapidAPI-Host': 'youtube-v3-alternative.p.rapidapi.com'
  }
  });

  const [VideoData , ChannelData , RelatedVideos] = await Promise.all([VideoPromise,ChannelPromise,RelatedVideosPromise]);

  const relatedData = await RelatedVideos.json();

  // @ts-ignore
      const video = VideoData?.data?.items[0] || {};
  // @ts-ignore
      const channel = ChannelData?.data?.items[0] || {};
  // @ts-ignore
      const related = relatedData?.data || [];
  
  return NextResponse.json({video,channel,related});

}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);

}
}
