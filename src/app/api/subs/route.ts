import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";

export async function GET(req : any ) {

  try{
  
  const token = await getToken({req , secret});

  const accessToken = token?.access_token;
  const refreshToken = token?.refresh_token;

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
    return  NextResponse.json({});

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