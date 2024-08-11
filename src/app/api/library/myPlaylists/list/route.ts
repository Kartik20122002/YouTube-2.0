import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import ConnectDB from "@/db/ConnectDB";
import User from "@/db/User";

export async function POST(req: any) {
    const body = await req.text();
    const { email } = JSON.parse(body);

    try {
        const tokens = await getToken({ req, secret });

        if (tokens && tokens?.access_token) {
            ConnectDB();
            const user = await User.findOne({ email: email });
            if (!user) return NextResponse.json({ playlists: [] });
            const playlists = user?.playlists as string ;
            const myPlaylists = JSON.parse(playlists);
            return NextResponse.json({ myPlaylists: myPlaylists });
        }
        else {
            return NextResponse.json({ myPlaylists: [] })
        }
    }
    catch (err) {
        console.log('fetch error', err);
        return NextResponse.json({ myPlaylists: [] });
    }
}