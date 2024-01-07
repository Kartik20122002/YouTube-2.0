import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";
import { revalidateTag } from "next/cache";

export const dynamic = 'force-dynamic'

export async function POST(req: any) {
  const body = await req.text();
  const { id, channelId } = JSON.parse(body);

  try {

    revalidateTag('history');

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
        cookieStore.set('aToken', newAccessToken as string, {
          expires: newExpiry - 1000,
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

    const VideoPromise = youtube.videos.list({
      part: ['snippet', 'statistics'],
      id: id,
      maxResults: 1
    });

    const ChannelPromise = youtube.channels.list({
      part: ['snippet', 'statistics'],
      id: channelId,
      maxResults: 1
    });

    const [VideoData, ChannelData] = await Promise.all([VideoPromise, ChannelPromise]);

    // @ts-ignore
    const video = VideoData?.data?.items[0] || {};
    // @ts-ignore
    const channel = ChannelData?.data?.items[0] || {};

    return NextResponse.json({ video, channel });

  }
  catch (err) {
    console.log('fetch error', err);
    signOut();
    return NextResponse.json(err);

  }
}
