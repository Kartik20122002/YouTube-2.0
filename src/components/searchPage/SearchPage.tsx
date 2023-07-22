import Image from "next/legacy/image";
import Link from "next/link";
import {RiPlayListLine} from 'react-icons/ri';
import SekeltonImg from "../global/skeletonComponents/ImgSkeleton";
import SekeltonText from "../global/skeletonComponents/TextSkeleton";
import { useEffect, useState } from "react";
import { DateConverter } from "@/utils/Functions/Converters/DateConverter";

const img = 'https://yt3.googleusercontent.com/ytc/AOPolaQygjiMgnSw5zUP1F_PyEkcGBmfaE8HMq7S_xu_=s176-c-k-c0x00ffffff-no-rj';
const videoImg = 'https://i.ytimg.com/vi/fsNrgCivsZg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBjTNa2oj9zdcd0gdxGRYylfpzalA'

const SearchPage = ({query}:any)=>{

    const [items,setItems] = useState<any>([]);
    const [loading,setLoading] = useState(true);
    const getDetails = async ()=>{
        const res = await fetch(`/api/search`,{
            method : 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body : JSON.stringify({query}),
            next : {revalidate : 300}
        });
        if(res.status != 404 && res.status != 500){
            const {data} = await res.json();
            setItems(data);
            setLoading(false);
        }
    }

    useEffect(()=>{
        getDetails();
    },[]);

    return<>
     <div className="flex flex-col  overflow-y-scroll h-full pb-[3rem] w-full">
        {loading ? <>
        <SkeletonCard/>
        <SkeletonCard/>
        <SkeletonCard/>
        <SkeletonCard/>
        <SkeletonCard/>
        </> : 
        items?.map((item : any , index : any)=>{
            if(item?.id?.kind === "youtube#video") return <VideoCard item={item} />
            if(item?.id?.kind === "youtube#playlist") return <PlaylistCard item={item} />
            if(item?.id?.kind === "youtube#channel") return <ChannelCard item={item} />
        })
        }
     </div>
    </>
}

const VideoCard = ({item} : any)=>{
    return <>
    <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.id?.kind?.videoId}`} className="md:w-[90%] md:max-w-[1200px] mx-auto mb-4 dark:text-white flex flex-col md:flex-row w-full">
        <div  className="basis-[25%] shrink-0 md:min-w-[200px] grow">
        <div className="w-full h-full relative overflow-hidden pt-[56.25%]">
            <Image src={item?.snippet?.thumbnails?.medium?.url} className="!absolute bg-grey md:rounded-lg !min-w-0 !min-h-0 !w-full !h-full top-0 left-0 right-0 bottom-0" layout="fill" alt="videoImg" loading="lazy" />
        </div>
        </div>
        <div className="basis-[75%] grow ml-1 md:ml-4 mt-1">
            <div className="truncate-2 text-[1.1rem] md:w-[70%] font-[400]">{item?.snippet?.title}</div>
            <div className="text-grey text-sm md:w-[70%] truncate-1">{DateConverter(item?.snippet?.publishedAt)} ago</div>
            <Link href={`/channel/${item?.snippet?.channelId}`} className="text-grey md:max-w-[70%] w-fit truncate-1 dark:hover:text-white hover:text-black text-sm">{item?.snippet?.channelTitle}</Link>
            <div className="text-grey text-sm truncate-1 md:w-[70%]">{item?.snippet?.description}</div>
        </div>
    </Link>
    </>
}

const PlaylistCard = ({item}:any)=>{
    return <>
    <Link href={`/channel/${item?.snippet?.channelId}/playlist/${item?.id?.kind?.playlistId}`} className="md:w-[90%] md:max-w-[1200px] mx-auto mb-4 dark:text-white flex flex-col md:flex-row w-full">
        <div  className="basis-[25%] shrink-0 relative md:min-w-[200px] grow">
        <div className="absolute bottom-0 w-full h-fit z-10">
            <div className="bg-[#7a7979a1] relative mt-auto md:rounded-b-lg px-1 py-1">
                <RiPlayListLine className="text-xl"/>
            </div>
        </div>
        <div className="w-full h-full relative overflow-hidden pt-[56.25%]">
            <Image src={item?.snippet?.thumbnails?.medium?.url} className="!absolute bg-grey md:rounded-lg !min-w-0 !min-h-0 !w-full !h-full top-0 left-0 right-0 bottom-0" layout="fill" alt="videoImg" loading="lazy" />
        </div>
        </div>
        <div className="basis-[75%] grow ml-1 md:ml-4 mt-1">
            <div className="truncate-2 text-[1.1rem] md:w-[70%] font-[400]">{item?.snippet?.title}</div>
            <div className="text-grey text-sm md:w-[70%] truncate-1">{DateConverter(item?.snippet?.publishedAt)} ago</div>
            <Link href={`/channel/${item?.snippet?.channelId}`} className="text-grey md:max-w-[70%] w-fit truncate-1 dark:hover:text-white hover:text-black text-sm">{item?.snippet?.channelTitle}</Link>
            <div className="text-grey text-sm truncate-1 md:w-[70%]">{item?.snippet?.description}</div>
        </div>
    </Link>
    </>
}

const ChannelCard = ({item}:any)=>{
    return <>
    <Link href={`/channel/${item?.snippet?.channelId}`} className="md:w-[90%] md:max-w-[1200px] mx-auto my-4 dark:text-white flex flex-col md:flex-row w-full">
        
       <div className="basis-[25%] shrink-0 md:min-w-[200px] grow">
        <div className="w-1/2 max-w-[200px] mx-auto">
        <div className="w-full relative overflow-hidden pt-[100%]">
            <Image src={item?.snippet?.thumbnails?.medium?.url} className="!absolute bg-grey rounded-full !min-w-0 !min-h-0 !w-full !h-full top-0 left-0 right-0 bottom-0" layout="fill" alt="videoImg" loading="lazy" />
        </div>
        </div>
        </div>
        
        <div className="basis-[75%] grow ml-1 md:ml-4 mt-2">
            <div className="truncate-2 text-[1.1rem] md:w-[70%] font-[400]">{item?.snippet?.title}</div>
            <div className="text-grey text-sm md:w-[70%] truncate-1">{DateConverter(item?.snippet?.publishedAt)} ago</div>
            <div className="text-grey text-sm truncate-1 md:w-[70%]">{item?.snippet?.description}</div>
        </div>
    </Link>

    <hr className="border-none min-h-[2px] my-4 h-[0.5px] w-full md:w-[95%] bg-[#5c5b5b3e]" />
    </>
}

const SkeletonCard = ()=>{
    return <>
    <div className="md:w-[90%] md:max-w-[1200px] mx-auto mb-4 dark:text-white flex flex-col md:flex-row w-full">
        <div  className="basis-[25%] shrink-0 md:min-w-[200px] grow">
        <div className="w-full h-full relative overflow-hidden pt-[56.25%]">
            <SekeltonImg className="absolute md:rounded-lg top-0 left-0 bottom-0 right-0"/>
        </div>
        </div>
        <div className="basis-[75%] grow ml-1 md:ml-4 mt-1">
            <div className=" md:w-[70%]">
                <SekeltonText height="min-h-[1.2rem] mb-2"/>
                <SekeltonText height="min-h-[1.2rem] mb-2" width="w-[80%]"/>
            </div>
            <div className="md:w-[70%]"><SekeltonText height="min-h-[0.8rem]" width="min-w-[25%] max-w-[25%]"/></div>
            <div className="text-grey md:w-[70%] dark:hover:text-white hover:text-black text-sm"><SekeltonText height="min-h-[0.8rem]" width="min-w-[35%] max-w-[35%]"/></div>
            <div className="text-grey text-sm truncate-1 md:w-[70%]"><SekeltonText height="min-h-[0.8rem]" width="w-[90%]"/></div>
        </div>
    </div>
    </>
}

export default SearchPage;