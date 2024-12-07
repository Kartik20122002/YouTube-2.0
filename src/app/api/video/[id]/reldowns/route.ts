import { NextRequest, NextResponse } from 'next/server'
import {getInfo} from 'ytdl-core';


export async function POST(req : NextRequest ) {
  
  const body = await req.text();
  const {id} = JSON.parse(body);

  let Links: any[] = []
  let relatedVideos: any [] = []

  try{

    const videoData = await getInfo(`https://www.youtube.com/watch?v=${id}`);

    Links = videoData?.formats?.filter((format)=>{ return (format?.hasAudio && format?.hasVideo)}) || [];

    relatedVideos = videoData?.related_videos || [];

    return NextResponse.json({
        linksStr : JSON.stringify(Links),
        relatedVideosStr : JSON.stringify(relatedVideos)
    });
  }

catch(err){
    console.log('fetch error' , err);
    return NextResponse.json({
        linksStr : Links?.length > 0 ? JSON.stringify(Links) : JSON.stringify([]),
        relatedVideosStr : relatedVideos?.length > 0 ? JSON.stringify(relatedVideos) : JSON.stringify([])
    });

}
}



