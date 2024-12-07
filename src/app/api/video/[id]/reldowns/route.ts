import { NextRequest, NextResponse } from 'next/server'
// import { getInfo } from 'ytdl-core';
import axios from 'axios';
import { rapidapi } from '@/utils/secrets/secrets';

export async function POST(req: NextRequest) {

  const body = await req.text();
  const { id } = JSON.parse(body);

  try {


    const options = {
      method: 'GET',
      url: 'https://yt-api.p.rapidapi.com/related',
      params: {id: id},
      headers: {
        'x-rapidapi-key': rapidapi,
        'x-rapidapi-host': 'yt-api.p.rapidapi.com'
      }
    };
    
      const response = await axios.request(options);
    
      return NextResponse.json({
        linksStr: JSON.stringify([]),
        relatedVideosStr: response?.statusText === 'OK' ? JSON.stringify(response.data?.data || []) : JSON.stringify([]) // 
      });

    // const videoData = await getInfo(id);

    // Links = videoData?.formats?.filter((format, i) => { return (format?.hasVideo && i < 5) }) || [];

    // relatedVideos = videoData?.related_videos || [];

    // return NextResponse.json({
    //   linksStr: JSON.stringify(Links),
    //   relatedVideosStr: JSON.stringify(relatedVideos)
    // });
  }

  catch (err) {
    console.log('fetch error', err);
    return NextResponse.json({
      linksStr: JSON.stringify([]),
      relatedVideosStr: JSON.stringify([]),
      err: err
    });

  }
}



