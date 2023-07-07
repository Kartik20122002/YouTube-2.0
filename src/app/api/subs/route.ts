import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";

export const dynamic = 'force-dynamic'

export async function GET(req : any ) {

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

    const results = await youtube.subscriptions.list({
    part : ['snippet','contentDetails'],
    maxResults : 50,
    mine : true,
    });

    if(results.status !== 200) 
    return  NextResponse.json(results);

    const subs = results.data.items;
    const ptoken = results.data.prevPageToken;
    const ntoken = results.data.nextPageToken;
 
  return NextResponse.json({subs , ptoken , ntoken});

}
catch(err){
    console.log('fetch error' , err);
    return NextResponse.json(err);

}
}