
import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import ConnectDB from "@/db/ConnectDB";
import User from "@/db/User";
import Playlist from "@/db/Playlist";

export async function POST(req: any) {
    const body = await req.text();
    const { playlistId, bodyData } = JSON.parse(body);

    try {

        await ConnectDB();
        const playlist = await Playlist.findOne({ _id : playlistId });

        if (playlist) {
                const oldItemsStr = playlist.items;
                const oldItems = JSON.parse(oldItemsStr);
                if(oldItems.length >= 20) return NextResponse.json({status : 404, message : "Playlist is full"});
                else {
                let newitems = [bodyData,...oldItems];
                playlist.items = JSON.stringify(newitems);
                playlist.thumbnail = playlist?.thumbnail ? playlist.thumbnail : bodyData.img
                await playlist.save();
                return NextResponse.json({ status: 200 });}
        } else {
                
                console.log("Playlists Not Found")
                
                return NextResponse.json({ status: 404 });
        }


    }
    catch (err) {
        console.log('fetch error', err);
        return NextResponse.json({ status: 404 });
    }
}













