import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";

export async function POST(req: any) {

  const body = await req.text();
  const { filter } = JSON.parse(body);
  
  try {
    const cookieStore = cookies();

    const tokens = await getToken({ req, secret });

    if (tokens && tokens?.access_token) {
      const aData = cookieStore.get('aToken') || null;
      
      const accessToken = aData?.value;
      
      if (!accessToken) {
        const rData = cookieStore.get('rToken') || null;
        const refreshToken = rData?.value;

        if (!refreshToken) throw new Error("Invalid Tokens Refresh Token bhi nahi hai");
        oauth2client.setCredentials({ refresh_token: refreshToken });
        
        const newToken = await oauth2client.refreshAccessToken();
        
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
    else {
      oauth2client.credentials = {
        access_token: '' as string,
        refresh_token: '' as string
      }

      oauth2client.apiKey = ytApi;
    }

    let config = {
      part: ['snippet', 'statistics'],
      maxResults: 48,
      chart: 'mostPopular',
      regionCode: 'In',
    } as any;

    if (filter.id !== 0) {
      config = {
        part: ['snippet', 'statistics'],
        maxResults: 48,
        chart: 'mostPopular',
        regionCode: 'In',
        videoCategoryId: filter,
      }
    }

    const results = await youtube.videos.list(config);

    if (results.status == 401) {
      signOut();
    }

    if (results.status !== 200) {
      return NextResponse.json({});
    }
    const videos = results.data.items;
    const ptoken = results.data.prevPageToken;
    const ntoken = results.data.nextPageToken;

    return NextResponse.json({ videos, ptoken, ntoken });

  }
  catch (err) {
    console.log('fetch error', err);
    signOut();
    return NextResponse.json({});
  }
}