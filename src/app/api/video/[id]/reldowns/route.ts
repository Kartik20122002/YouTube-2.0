import { NextRequest, NextResponse } from 'next/server'
import {getInfo} from 'ytdl-core';


export async function POST(req : NextRequest ) {
  
  const body = await req.text();
  const {id} = JSON.parse(body);

  try{

    const videoData = await getInfo(`https://www.youtube.com/watch?v=${id}`);

    const Links = videoData.formats.filter((format)=>{ return (format.hasAudio && format.hasVideo)});
    
    const relatedVideos = videoData.related_videos;

    return NextResponse.json({
        linksStr : JSON.stringify(Links),
        relatedVideosStr : JSON.stringify(relatedVideos)
    });
  }

catch(err){
    console.log('fetch error' , err);
    return NextResponse.json({
        linksStr : JSON.stringify([]),
        relatedVideosStr : JSON.stringify([])
    });

}
}



