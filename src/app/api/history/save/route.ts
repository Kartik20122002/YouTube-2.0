
import { NextResponse } from 'next/server'
import ConnectDB from "@/db/ConnectDB";
import User from "@/db/User";

export async function POST(req: any) {
    const body = await req.text();
    const { id, channelId, title, channelTitle, videoImg, channelImg, email } = JSON.parse(body);

    try {

        const saveObj = {
            id: id,
            channelId: channelId,
            title: title,
            channelTitle: channelTitle,
            videoImg: videoImg,
            channelImg: channelImg,
            timestamp: Date.now(),
        }

        await ConnectDB();
        const dbUser = await User.findOne({ email: email });
        if (dbUser) {
            const historyStr = dbUser?.history as string;

            if (historyStr) {
                let historyItemsOld = JSON.parse(historyStr) as Array<any>;
                let historyItems = [] as any;
                historyItems.push(saveObj);
                historyItemsOld?.forEach(item => { if (item.id !== id) historyItems.push(item); })
                while (historyItems.length > 24) historyItems.pop();

                dbUser.history = JSON.stringify(historyItems);
                await dbUser.save();
                return NextResponse.json({ status: 200 });
            } else {
                let history = [saveObj]
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













