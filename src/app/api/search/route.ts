import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";

export const dynamic = 'force-dynamic'

export async function POST(req : any ) {
  const body = await req.text();
  const {query} = JSON.parse(body);

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

const res = await youtube.search.list(
    {
        part:['snippet'], 
        q: query, 
        maxResults: 50,
    });

if(res.status != 200) return NextResponse.json({});

const data = res?.data?.items as any;

return NextResponse.json({data});

}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);

}
}

