import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic'


export async function POST(req : any ) {

  console.log('channels fetching');

  console.log(req.cookies);

  const cookieHand = cookies();
  const access_token =  cookieHand.get('access');
  const refresh_token = cookieHand.get('refresh');

  if(access_token){
    console.log('access_token',access_token)
  }

  try{

//   const tokens = await getToken({req , secret});

//  if(tokens && tokens?.access_token){ const accessToken = tokens?.access_token;
//   const refreshToken = tokens?.refresh_token;

//   oauth2client.credentials = {
//     access_token : accessToken as string, 
//     refresh_token : refreshToken as string
//   }
// }
// else{ 
//   console.log('using api key');

//  oauth2client.credentials = {
//   access_token : '' as string, 
//   refresh_token : '' as string
// }
//  oauth2client.apiKey = ytApi;
// }


// let results = await youtube.channels.list({
//     part : ['snippet'],
//     maxResults : 50,
//     id : channelsId,
// });

    // if(results.status !== 200) 
    return  NextResponse.json({'kartik' : 'hatwar'});

}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);

}
}