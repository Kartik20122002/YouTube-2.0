import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";
import { refreshedToken } from "@/utils/auth/refreshed";

export const dynamic = 'force-dynamic'

export async function GET(req : any ) {

  const cookieStore = cookies();

  try{
  
  const tokens = await getToken({req , secret});

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


      const subs = results.data.items;
      const ptoken = results.data.prevPageToken;
      const ntoken = results.data.nextPageToken;
   
      return NextResponse.json({subs , ptoken , ntoken});
    
}
catch(err){
  console.log('fetch error' , err);
  signOut();
  return NextResponse.json({subs : [],ptoken : '',ntoken :''});
}
}