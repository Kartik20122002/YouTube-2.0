import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";


export async function POST(req : any ) {
  const body = await req.text();
  const {id , rating} = JSON.parse(body);

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

