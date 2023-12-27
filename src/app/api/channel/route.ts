import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic'


export async function POST(req : any ) {

  const body = await req.text();
  const {id} = JSON.parse(body);

  try{
  const cookieStore = cookies();

    const tokens = await getToken({ req, secret });

    if (tokens && tokens?.access_token) {
      const aData = cookieStore.get('aToken') || null;
      const rData = cookieStore.get('rToken') || null;

      const accessToken = aData?.value;
      const refreshToken = rData?.value;

      if (!aData || !accessToken) {
        if (!rData) throw new Error("Invalid Tokens Refresh Token bhi nahi hai");
        oauth2client.setCredentials({ refresh_token: refreshToken });
        
        const newToken = await oauth2client.refreshAccessToken()
        
        const newAccessToken = newToken.credentials.access_token;
        const newExpiry = newToken.credentials.expiry_date as number;
        cookieStore.set('aToken', newAccessToken as string , {
            expires : newExpiry-1000,
        });
      }
      else {
        oauth2client.setCredentials({ access_token: accessToken, });
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
  const subIdres = subs?.data?.items[0]?.id ;

  return  NextResponse.json({channelDetails,isSub,subIdres});
}
else{
  const result = await channelPromise;
  if(result.status != 200)
  return NextResponse.error();

  const channelDetails = result?.data?.items[0];
  const isSub = false;

  return NextResponse.json({channelDetails,isSub,subIdres:''});
}


}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);
}
}