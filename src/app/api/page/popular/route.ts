'use server'

import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";


export async function GET(req : any ) {
const cookieStore = cookies();

try{
  
const tokens = await getToken({req , secret});

if(tokens && tokens?.access_token){ 
  const tokenstr = JSON.stringify(tokens?.refresh_token);
   cookieStore.set('kartik',tokenstr);
  const accessToken = tokens?.access_token;
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


  const results = await youtube.videos.list({ 
  part:['snippet','statistics'], 
  maxResults : 48,
  chart : 'mostPopular',
  regionCode : 'In',
  });

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