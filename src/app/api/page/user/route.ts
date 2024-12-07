import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server'
import { secret } from "@/utils/secrets/secrets";
import {getInfo} from 'ytdl-core';
import ConnectDB from '@/db/ConnectDB';
import User from '@/db/User';


function shuffleArray(array: any[]) {
    const shuffledArray = array.slice(); // Create a copy of the array to avoid mutating the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); // Pick a random index from 0 to i
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // Swap elements
    }
    return shuffledArray;
  }

export async function POST(req : NextRequest ) {
  
  const body = await req.text();
  const {email} = JSON.parse(body);

  try {
    const tokens = await getToken({ req, secret });

    if (tokens && tokens?.access_token) {
        ConnectDB();
        const user = await User.findOne({ email: email });
        if (!user) return NextResponse.json({ videoItems: [] });
        const historyStr = user?.history as string;
        const history = JSON.parse(historyStr);
        const relIds = history.map((obj: any) => obj.id)

        if(relIds.length == 0) return NextResponse.json({ videoItems: [] });

        let relvideos: any[] = [];

        relIds.forEach((relId: string) => {
            relvideos.push(getInfo(`https://www.youtube.com/watch?v=${relId}`))
        });

        const videoDataResolved = await Promise.allSettled(relvideos);
        const videoDataArrays = videoDataResolved.map(obj => obj.status === "fulfilled" ? obj.value.related_videos : null)

        let videoData: any[] = []; // Array of videos
        let remainingData: any[] = []; // Array of array of videos

        videoDataArrays?.forEach(videoArray =>{ if(videoArray?.length > 0) {videoData.push(videoArray[0]); remainingData.push(videoArray.slice(1));}});

        while(remainingData.length > 0 || videoData.length < 50){
            for(let i = remainingData.length-1 ; i >= 0; i--){
                if(remainingData[i].length > 0) videoData.push(remainingData[i].shift());
                else remainingData.splice(i, 1)
                if(videoData.length >= 50) break;
            }
        }

        return NextResponse.json({ videoItems: shuffleArray(videoData) || [] });
    }
    else {
        return NextResponse.json({ videoItems: [] })
    }
}
catch (err) {
    console.log('fetch error', err);
    return NextResponse.json({ videoItems: [] });
}

}





