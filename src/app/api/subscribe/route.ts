import { getToken } from "next-auth/jwt";
import { secret, ytApi } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import { oauth2client, youtube } from "@/utils/auth/youtube";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";


export async function POST(req: any) {
  const body = await req.text();
  const { id, subId, toSub } = JSON.parse(body);

  try {

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

    if (toSub) {

      const res = await youtube.subscriptions.insert({
        part: 'snippet',
        requestBody: {
          snippet: {
            resourceId: {
              channelId: id,
            }
          }
        }
      }) as any;

      if (res.status === 200) {
        revalidateTag('subs');
        revalidatePath('/api/subs');
        return NextResponse.json({ flag: true, data: res?.data?.id });
      }
      return NextResponse.json({ flag: false, data: '' });
    }
    else {
      const res = await youtube.subscriptions.delete({
        id: subId,
      })

      if (res.status === 204) {
        revalidateTag('subs');
        revalidatePath('/api/subs');
        return NextResponse.json({ flag: true, data: '' });
      }

      return NextResponse.json({ flag: false, data: '' });
    }

  }
  catch (err) {
    console.log('fetch error', err);
    signOut();
    return NextResponse.json(err);

  }
}

