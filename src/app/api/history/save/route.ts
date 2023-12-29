
import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import ConnectDB from "@/db/ConnectDB";
import User from "@/db/User";

export async function POST(req: any) {
    const body = await req.text();
    const { id, channelId, title, channelTitle, videoImg, channelImg, email } = JSON.parse(body);

    try {
        console.log("Reached First Step - Saving to History.....\n\n")

        console.log("\nuser signed in\n")
        await ConnectDB();
        const dbUser = await User.findOne({ email: email });
        if (dbUser) {
            console.log("User Found now accessing history....\n")
            const historyStr = dbUser?.history as string;

            if (historyStr) {
                let history = JSON.parse(historyStr);
                console.log("History found now accessing")
                if (history.length === 50) history.pop();
                history.unshift({
                    id: id,
                    channelId: channelId,
                    title: title,
                    channelTitle: channelTitle,
                    videoImg: videoImg,
                    channelImg: channelImg,
                    timestamp: Date.now(),
                });
                console.log("History found and updated \n");
                console.log(history);
                console.log("\nsaving history")
                dbUser.history = JSON.stringify(history);
                await dbUser.save();
                return NextResponse.json({ status: 200 });
            } else {
                let history = [{
                    id: id,
                    channelId: channelId,
                    title: title,
                    channelTitle: channelTitle,
                    videoImg: videoImg,
                    channelImg: channelImg,
                    timestamp: Date.now(),
                }]
                console.log("History made and updated \n");
                console.log(history);
                console.log("\nsaving history")
                dbUser.history = JSON.stringify(history);
                await dbUser.save();
                return NextResponse.json({ status: 200 });
            }

            return NextResponse.json({ status: 404 });



        } else {
            console.log("User not found now cannot save history....\n")
            console.log(email);
        }
        return NextResponse.json({ status: 404 });

    }
    catch (err) {
        console.log('fetch error', err);
        return NextResponse.json({ status: 404 });
    }
}













