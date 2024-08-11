
import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import ConnectDB from "@/db/ConnectDB";
import User from "@/db/User";

export async function POST(req: any) {
    const body = await req.text();
    const { name, email } = JSON.parse(body);

    try {

        const saveObj = {
            name : name,
            timestamp: Date.now(),
            items : [],
        }

        await ConnectDB();
        const dbUser = await User.findOne({ email: email });
        if (dbUser) {
            const playlists = dbUser?.playlists as string;

            if (playlists) {
                let playlistsOld = JSON.parse(playlists) as Array<any>;
                let playlistsNew = [] as any;

                playlistsNew.push(saveObj);
                playlistsOld?.forEach((item: { name: string; }) => { playlistsNew.push(item); });

                dbUser.playlists = JSON.stringify(playlistsNew);
                await dbUser.save();
                return NextResponse.json({ status: 200 });
            } else {
                let playlists = [saveObj]
                dbUser.playlists = JSON.stringify(playlists);
                const resp = await dbUser.save();
                console.log(resp)
                return NextResponse.json({ status: 200 });
            }

        } else {
            console.log("User not found now cannot save Playlist....\n")
            console.log(email);
        }
        return NextResponse.json({ status: 404 });

    }
    catch (err) {
        console.log('fetch error', err);
        return NextResponse.json({ status: 404 });
    }
}













