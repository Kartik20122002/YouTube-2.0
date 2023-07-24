import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";


export async function POST(req : any ) {
  const body = await req.text();
  const {id , subId , toSub} = JSON.parse(body);

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

if(toSub){

  const res =  await youtube.subscriptions.insert({
    part : 'snippet',
    requestBody : {
        snippet: {
          resourceId: {
            channelId: id,
          }
        }
      }
  }) as any;
  
  if(res.status === 200) {
  return NextResponse.json({flag : true , data : res?.data?.id});
  }
  return NextResponse.json({flag : false , data : '' });
}
else {
  const res = await youtube.subscriptions.delete({
    id : subId,
})

if(res.status === 204) return NextResponse.json({flag : true , data : '' });
  
  return NextResponse.json({flag : false , data : '' });
}

}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);

}
}

