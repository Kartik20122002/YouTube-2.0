'use server'

import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";

export async function POST(req : any ) {
const cookieStore = cookies();

const body = await req.text();
  const {filter} = JSON.parse(body);

try{
  
const tokens = await getToken({req , secret});

if(tokens && tokens?.access_token){ 
  const accessToken = tokens?.access_token as string;
  const refreshToken = tokens?.refresh_token as string;
  cookieStore.set('aToken',accessToken);

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
  let config = { 
    part:['snippet','statistics'], 
    maxResults : 48,
    chart : 'mostPopular',
    regionCode : 'In', 
    } as any;

  if(filter.id !== 0) {
    config = { 
      part:['snippet','statistics'], 
      maxResults : 48,
      chart : 'mostPopular',
      regionCode : 'In',
      videoCategoryId : filter, 
      }
  }

  const results = await youtube.videos.list(config);

  if(results.status == 401){
   signOut();
  }

    if(results.status !== 200) {
    return  NextResponse.json({});
    }
    const videos = results.data.items;
    const ptoken = results.data.prevPageToken;
    const ntoken = results.data.nextPageToken;
 
    return NextResponse.json({videos , ptoken , ntoken});

}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);
}
}