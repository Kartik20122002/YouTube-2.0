import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";


export async function POST(req : any ) {
  const body = await req.text();
  const {id , rating} = JSON.parse(body);

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

const result = await youtube.videos.rate({
    id: id,
    rating : rating,
});

if(result.status === 204) return NextResponse.json({flag : true});
return NextResponse.json({flag : false});

}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);

}
}

