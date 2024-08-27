
import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import ConnectDB from "@/db/ConnectDB";
import User from "@/db/User";
import Playlist from "@/db/Playlist";

export async function POST(req: any) {
    const body = await req.text();
    const { name, email } = JSON.parse(body);

    try {

        const saveObj = {
            name : name,
            email : email,
            updatedAt: Date.now(),
            items : JSON.stringify([]),
        }

        await ConnectDB();
        const dbUserPromise = User.findOne({ email: email });
        const isAvialablePromise = Playlist.findOne({email : email , name : name});

        const [dbUser , isAvialable] = await Promise.all([dbUserPromise,isAvialablePromise]);

        if (dbUser && !isAvialable) {

            const res = await Playlist.create(saveObj);

            if(res){
                const playlistsOldstr = dbUser?.playlists || [];
                let playlistsOld = JSON.parse(playlistsOldstr);

                const playlists = playlistsOld.length > 0 ? [res._id,...playlistsOld] : [res._id];
                dbUser.playlists = JSON.stringify(playlists);
                await dbUser.save();
                return NextResponse.json({status :200});
            }
            else{
                return NextResponse.json({status : 404});
            }

        } else {
            if(isAvialable) console.log("Two Playlist cannot have same name");
            else console.log("User not found now cannot save Playlist....\n")
        }
        return NextResponse.json({ status: 404 });

    }
    catch (err) {
        console.log('fetch error', err);
        return NextResponse.json({ status: 404 });
    }
}













