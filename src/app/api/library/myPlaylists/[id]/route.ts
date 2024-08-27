import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import ConnectDB from "@/db/ConnectDB";
import User from "@/db/User";
import Playlist from "@/db/Playlist";

export async function POST(req: any) {
    const body = await req.text();
    const { id } = JSON.parse(body);

    try {
        const tokens = await getToken({ req, secret });

        if (tokens && tokens?.access_token) {
            ConnectDB();
            const list = await Playlist.findOne({ _id: id });
            return NextResponse.json({ playlist : list });
        }
        else {
            return NextResponse.json({ playlist : {} })
        }
    }
    catch (err) {
        console.log('fetch error', err);
        return NextResponse.json({ playlist : {} });
    }
}