import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextRequest, NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";

export const dynamic = 'force-dynamic'

export async function POST(req : NextRequest ) {
  
  const body = await req.text();
  const {id , channelId} = JSON.parse(body);

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
    
    return {rating,subscription};
  }

}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);

}
}



