import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import ConnectDB from "@/db/ConnectDB";
import Playlist from "@/db/Playlist";

export async function POST(req: any) {
    const body = await req.text();
    const { email } = JSON.parse(body);

    try {
        const tokens = await getToken({ req, secret });

        if (tokens && tokens?.access_token) {
            ConnectDB();
            const list = await Playlist.find({ email: email });
            return NextResponse.json({ myPlaylists: list });
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