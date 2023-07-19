import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
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
  cookieStore.set('tokens',JSON.stringify(tokens));

  const access_tokenTrial = cookieStore.get('aToken');
  const refresh_tokenTrial = cookieStore.get('rToken');

 if(access_tokenTrial){ 
  const accessToken = access_tokenTrial.value;
  const refreshToken = refresh_tokenTrial?.value;

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


  const results = await youtube.videos.list({ 
  part:['snippet','statistics'], 
  maxResults : 48,
  chart : 'mostPopular',
  regionCode : 'In',
  });

  if(results.status == 401){
    const newAccessToken = await refreshedToken(refresh_tokenTrial?.value);
      if(cookieStore.has('aToken')) cookieStore.delete('aToken');
      cookieStore.set('aToken' , newAccessToken);
    
      oauth2client.credentials = {
        access_token : newAccessToken as string, 
        refresh_token : refresh_tokenTrial?.value as string
      }

      const newResults = await youtube.videos.list({ 
        part:['snippet','statistics'], 
        maxResults : 48,
        chart : 'mostPopular',
        regionCode : 'In',
        });

        if(newResults.status !== 200) 
        return  NextResponse.json({});
    
        const videos = newResults.data.items;
        const ptoken = newResults.data.prevPageToken;
        const ntoken = newResults.data.nextPageToken;
     
        return NextResponse.json({videos , ptoken , ntoken});
  }
  else{

    if(results.status !== 200) 
    return  NextResponse.json({});

    const videos = results.data.items;
    const ptoken = results.data.prevPageToken;
    const ntoken = results.data.nextPageToken;
 
    return NextResponse.json({videos , ptoken , ntoken});
  }


}
catch(err){
    console.log('fetch error' , err);
    signOut();
    return NextResponse.json(err);
}
}