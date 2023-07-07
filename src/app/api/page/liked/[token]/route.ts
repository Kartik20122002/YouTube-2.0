import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";

export async function GET(req : any , {params} :any ) {

  const {token} = params;
  console.log('likepage fetched');

  try{
  
  const tokens = await getToken({req , secret});

  if(tokens?.status != 200) 
  return  NextResponse.json({});

  const accessToken = tokens?.access_token;
  const refreshToken = tokens?.refresh_token;

  oauth2client.credentials = {
    access_token : accessToken as string, 
    refresh_token : refreshToken as string
  }

  const results = await youtube.videos.list(
    {   part:['snippet','statistics'], 
        maxResults : 50,
        regionCode : 'In',
        myRating : 'like',
        pageToken : token == 'notoken' ? '' : token,
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