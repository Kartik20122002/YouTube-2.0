'use server'

import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";
import { refreshedToken } from "@/utils/auth/refreshed";


export async function GET(req : any ) {
const cookieStore = cookies();

try{
  
const tokens = await getToken({req , secret});



if(tokens && tokens?.access_token){ 
  const accessToken = tokens?.access_token as string;
  const refreshToken = tokens?.refresh_token as string;
  const atoken = cookieStore.get('aToken')?.value;
  
  if(atoken){
     oauth2client.credentials = {
      access_token : atoken,
      refresh_token : refreshToken as string,
     }
     cookieStore.set('msd','congrats')
  }
  else{
    cookieStore.set('aToken',accessToken);
    console.log('from auth')
    oauth2client.credentials = {
      access_token : accessToken as string, 
      refresh_token : refreshToken as string
    }
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

  if(results.status == 401){
    console.log('refreshed')
    const newatoken = await refreshedToken(tokens?.refresh_token);
    cookieStore.set('aToken',newatoken);
    cookieStore.set('token update' , newatoken)

    oauth2client.credentials = {
      access_token : newatoken,
      refresh_token : tokens?.refresh_token as string,
     }

     console.log('new results')

     const newresults = await youtube.videos.list({ 
      part:['snippet','statistics'], 
      maxResults : 48,
      chart : 'mostPopular',
      regionCode : 'In',
      });

      if(newresults.status !== 200) {
        return  NextResponse.json({});
        }
        const videos = newresults.data.items;
        const ptoken = newresults.data.prevPageToken;
        const ntoken = newresults.data.nextPageToken;
     
      return NextResponse.json({videos , ptoken , ntoken});
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