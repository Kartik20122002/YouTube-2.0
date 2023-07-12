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

const RelatedVideosPromise = RelatedVideos(id);

}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);

}
}