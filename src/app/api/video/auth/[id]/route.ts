import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextRequest, NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signIn, signOut } from "next-auth/react";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic'

export async function POST(req : NextRequest ) {
  
  const body = await req.text();
  const {id , channelId} = JSON.parse(body);

  try{

  const cookieStore = cookies();

    const tokens = await getToken({ req, secret });

    if (tokens && tokens?.access_token) {
      const aData = cookieStore.get('aToken') || null;
      const rData = cookieStore.get('rToken') || null;

      const accessToken = aData?.value;
      const refreshToken = rData?.value;

      if (!aData || !accessToken) {
        if (!rData) signIn();
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
signIn();
return;
}

if(tokens && tokens?.access_token){
    const RatingPromise = youtube.videos.getRating({
      id: id,
    });
    
    const SubscriptionPromise = youtube.subscriptions.list({
      part : ['id'],
      forChannelId : channelId,
      mine : true
    });

    
   
    const [RatingData , SubscriptionData] = await Promise.all([RatingPromise,SubscriptionPromise]);

    const rating = RatingData.data.items; 
    const subscription = SubscriptionData.data.items;
    
    return NextResponse.json({rating,subscription});
  }

}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);

}
}



