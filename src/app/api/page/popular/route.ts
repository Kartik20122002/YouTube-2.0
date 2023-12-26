'use server'

import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";

export async function POST(req: any) {

  const body = await req.text();
  const { filter } = JSON.parse(body);
  const cookieStore = cookies();

  try {

    const tokens = await getToken({ req, secret });

    if (tokens && tokens?.access_token) {
      console.log("User is Singed In")

      const accessToken = cookieStore.get('aToken')?.value || tokens?.access_token as string;
      const refreshToken = tokens?.refresh_token as string;
      if (accessToken) console.log("we have accessToken")

      if (refreshToken) {

        console.log("we have refresh token and now saving...")

        cookieStore.set('rTokens', refreshToken, {
          maxAge: 1000 * 60 * 60 * 24 * 30,
          // expires : new Date(1000*60*60*24*30 + Date.now()).getTime(),
        });
        oauth2client.setCredentials({ refresh_token: refreshToken })
      } else {
        const refresh_token = cookieStore.get('rTokens')?.value;
        if (refresh_token) {
          oauth2client.setCredentials({ refresh_token: refresh_token });

          console.log("Don't Worry we got refresh token from cookies");
          
        }
        else console.log("we don't have refresh token at all");
      }

      const tokeninfo = await oauth2client.getTokenInfo(accessToken);
      const accessTokenExpTime = tokeninfo?.expiry_date;

      if (accessTokenExpTime && accessTokenExpTime < new Date().getTime()) {

        console.log("Access token is expired now obtaining new one")

        const newToken = await oauth2client.getAccessToken();
        const newAccessToken = newToken.token as string;
        oauth2client.setCredentials({ access_token: newAccessToken });
        cookieStore.set('aToken', newAccessToken);

        console.log("New Access Token Saved");
      }
      else {
        oauth2client.setCredentials({ access_token: accessToken });
        cookieStore.set('aToken', accessToken);

        console.log("Access Token is not Expired and Stored successfully");
      }

    }
    else {

      console.log("User not log in proceeding with API key");

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