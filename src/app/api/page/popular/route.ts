import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";

export async function GET(req : any ) {

  console.log('homepage fetched');

  try{

  
  const tokens = await getToken({req , secret});

 if(tokens && tokens?.access_token){ const accessToken = tokens?.access_token;
  const refreshToken = tokens?.refresh_token;

  oauth2client.credentials = {
    access_token : accessToken as string, 
    refresh_token : refreshToken as string
  }
  console.log('using tokens without token');
}
else{ 
  console.log('using api key');
 oauth2client.credentials = {
  access_token : '' as string, 
  refresh_token : '' as string
}
 oauth2client.apiKey = ytApi;
}


  const results = await youtube.videos.list({ 
  part:['snippet','statistics'], 
  maxResults : 50,
  chart : 'mostPopular',
  regionCode : 'In',
  });

    if(results.status !== 200) 
    return  NextResponse.json({});

    const videos = results.data.items;
    const ptoken = results.data.prevPageToken;
    const ntoken = results.data.nextPageToken;
 
  return NextResponse.json({videos , ptoken , ntoken});

}
catch(err){
    console.log('fetch error' , err);
    return NextResponse.json(err);

}
}