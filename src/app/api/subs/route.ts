import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";


export async function GET(req: any) {

  try {

    const cookieStore = cookies();

    const tokens = await getToken({ req, secret });

    if (tokens && tokens?.access_token) {
      const aData = cookieStore.get('aToken');
      const rData = cookieStore.get('rToken');

      const accessToken = aData?.value;
      const refreshToken = rData?.value;

      if (!accessToken) {
        if (!refreshToken) throw new Error("Invalid Tokens Refresh Token is required");

        oauth2client.setCredentials({ refresh_token: refreshToken });

        const newToken = await oauth2client.refreshAccessToken()

        const newAccessToken = newToken.credentials.access_token;

        const newExpiry = newToken?.credentials?.expiry_date as number;
        cookieStore.set('aToken', newAccessToken as string, {
          expires: newExpiry - 5000,
        });

      }
      else {
        oauth2client.setCredentials({ access_token: accessToken });
      }
    }

    const results = await youtube.subscriptions.list({
      part: ['snippet', 'contentDetails'],
      maxResults: 50,
      mine: true,
    });

    if (results.status == 401) signOut({ callbackUrl: "/" });

    const subs = results.data.items;
    const ptoken = results.data.prevPageToken;
    const ntoken = results.data.nextPageToken;

    return NextResponse.json({ subs, ptoken, ntoken });

  }
  catch (err) {
    console.log('fetch error', err);
    signOut({ callbackUrl: "/" });
    return NextResponse.json({ subs: [], ptoken: '', ntoken: '' });
  }
}