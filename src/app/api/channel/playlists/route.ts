import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";

export const dynamic = 'force-dynamic'


export async function POST(req : any ) {

  const body = await req.text();
  const {id} = JSON.parse(body);

  try{
  const tokens = await getToken({req , secret});

  if(tokens?.status != 200){
    console.log('not right');
  }

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

const playlistData = await youtube.playlists.list({
  part : ['snippet' , 'contentDetails'],
  channelId : id,
  maxResults : 25,
})

if(playlistData.status != 200)
return NextResponse.json([])

const data = playlistData?.data?.items;

return NextResponse.json({data})

}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);
}
}

