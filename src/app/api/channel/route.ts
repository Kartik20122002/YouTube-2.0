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
  console.log('using api key');
 oauth2client.credentials = {
  access_token : '' as string, 
  refresh_token : '' as string
}
 oauth2client.apiKey = ytApi;
}

const channelPromise = youtube.channels.list({
  part : ['snippet','statistics'],
  id : id,
});

if(tokens && tokens?.access_token){
const subPromise = youtube.subscriptions.list({
part : ['id'],
forChannelId : id,
mine : true,
})

const [results , subs] = await Promise.all([channelPromise,subPromise]);

  if(results.status !== 200) 
  return NextResponse.error()

  const channelDetails = results?.data?.items[0];
  const isSub = (subs?.data?.pageInfo?.totalResults > 0) ? true : false;
  
  return  NextResponse.json({channelDetails,isSub});
}
else{
  const result = await channelPromise;
  if(result.status != 200)
  return NextResponse.error();

  const channelDetails = result?.data?.items[0];
  const isSub = false;

  return NextResponse.json({channelDetails,isSub});
}


}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);
}
}