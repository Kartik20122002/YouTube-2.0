
import { getToken } from "next-auth/jwt";
import { secret } from "@/utils/secrets/secrets";
import { NextResponse } from 'next/server'
import ConnectDB from "@/db/ConnectDB";
import User from "@/db/User";

export async function POST(req: any) {
    const body = await req.text();
    const { id, channelId, title, channelTitle, videoImg, channelImg, email } = JSON.parse(body);

    try {

        await ConnectDB();
        const dbUser = await User.findOne({ email: email });
        if (dbUser) {
            const historyStr = dbUser?.history as string;

            if (historyStr) {
                let history = JSON.parse(historyStr);
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
                dbUser.history = JSON.stringify(history);
                await dbUser.save();
                return NextResponse.json({ status: 200 });
            }

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













