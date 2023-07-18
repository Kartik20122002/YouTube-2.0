import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { AiFillPlayCircle, AiOutlineMore} from 'react-icons/ai';
import {PiShareFatThin} from 'react-icons/pi'
import {LiaDownloadSolid} from 'react-icons/lia'
import { motion } from 'framer-motion';
import Image from 'next/legacy/image';
import { isLargeContext, pageContext } from '@/app/layout';
import { CountConverter } from '@/utils/Functions/Converters/CountConverter';
import SekeltonImg from '../global/skeletonComponents/ImgSkeleton';
import SekeltonText from '../global/skeletonComponents/TextSkeleton';
import { DateConverter } from '@/utils/Functions/Converters/DateConverter';
import { POST } from '@/app/api/channel/route';

export const revalidate = 300;

const img = 'https://yt3.googleusercontent.com/ytc/AOPolaQygjiMgnSw5zUP1F_PyEkcGBmfaE8HMq7S_xu_=s176-c-k-c0x00ffffff-no-rj';
const videoImg = 'https://i.ytimg.com/vi/fsNrgCivsZg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBjTNa2oj9zdcd0gdxGRYylfpzalA'

const PlaylistPage = ({id} : any)=>{ 

    const {setpage} = useContext(pageContext) as any;
    setpage(false);
    

    return (<>
    <motion.div layout transition={{duration : 0.5}} className='h-[89vh] overflow-y-scroll dark:text-white'>

        <motion.div layout transition={{duration : 0.5}} className='w-full flex flex-wrap h-full'>
           <PlayListInfo id={id}/>
           <PlayListItems id={id} />
        </motion.div>
    </motion.div>
    </>)
}

const PlayListInfo = ({id} : any)=>{
    const [info,setInfo] = useState<any>({});
    const [loading,setLoading] = useState(true);
    const getDetails = async ()=>{
        const res = await fetch(`/api/playlist/${id}/info`,{
            method : 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body : JSON.stringify({id}),
            next : {revalidate : 300}
        });
        if(res.status != 404 && res.status != 500){
            const {data} = await res.json();
            // console.log(data);
            setInfo(data);
            setLoading(false);
        }
    }

    useEffect(()=>{
        getDetails();
    },[]);

   return <motion.div layout transition={{duration : 0.5}} className="basis-full md:basis-[30%] grow min-w-[20rem] max-h-full overflow-y-scroll md:px-4">
                
                <motion.div layout transition={{duration : 0.5}} className="relative max-h-full h-full w-full overflow-hidden md:rounded-[15px] p-6">
                 <Image src={loading ? videoImg : info?.snippet?.thumbnails?.default?.url} layout='fill' loading='lazy' className='blur-[40px] !mb-auto !mt-0 !h-[99%] !min-h-[50%] opacity-80 z-0' alt='' />
                 <div className="relative max-h-full overflow-y-scroll">
                 {/* info */}
                 <motion.div layout transition={{duration : 0.5}} className="w-full flex flex-wrap md:flex-col">

                    <motion.div layout transition={{duration : 0.5}} className="relative pt-[56.25%] w-full h-full">
                    <Link href={`/channel/${'' || info?.snippet?.channelTitle}/playlist/${info?.id}`} className="absolute min-w-full flex items-center cursor-pointer justify-center text-transparent  hover:text-white top-0 min-h-full bg-transparent hover:bg-[#0000009c] z-10 rounded-[4%]">
                        Play
                    </Link>
                    <motion.div layout transition={{duration : 0.5}} className="absolute top-0 right-0 bottom-0 left-0 w-full h-full"> <Image src={loading ? videoImg : info?.snippet?.thumbnails?.medium?.url}  layout='fill' className='rounded-[4%] dark:bg-[#202324] bg-[#b8b8b8]' loading='lazy' alt='playlistImg' /> </motion.div>
                    </motion.div>
                    
                    <motion.div layout transition={{duration : 0.5}} className="details mt-3 z-10">
                        <motion.div layout transition={{duration : 0.5}} className="text-[1.15rem] font-semibold text-white truncate-2">{info?.snippet?.title || "No Title"}</motion.div>
                        <motion.div layout transition={{duration : 0.5}} className="mt-2">
                            <Link href={`/channel/${'' || info?.snippet?.channelId}`} className="truncate-1 text-white text-sm hover:opacity-70 font-semibold">{info?.snippet?.channelTitle}</Link>
                            <div className="flex text-[#b9b9b9] mt-1 font text-[0.8rem]">
                                <div className="mr-4">{0 || info?.contentDetails?.itemCount} videos</div>
                                <div className="">Last updated {DateConverter(info?.snippet?.publishedAt)} ago</div>
                            </div>
                        </motion.div>
                        <motion.div layout transition={{duration : 0.5}} className="flex mt-4">
                            <motion.button layout transition={{duration : 0.5}} className='text-[1.5rem] p-2 m-1 text-white rounded-full bg-[#6564645d]'><PiShareFatThin/></motion.button>
                            <motion.button layout transition={{duration : 0.5}} className='text-[1.5rem] p-2 m-1 text-white rounded-full bg-[#6564645d]'><LiaDownloadSolid/></motion.button>
                            <motion.button layout transition={{duration : 0.5}} className='text-[1.5rem] p-2 m-1 text-white rounded-full bg-[#6564645d]'><AiOutlineMore/></motion.button>
                        </motion.div>
                    </motion.div>

                 </motion.div>
                 {/* buttons */}
                 <motion.div layout transition={{duration : 0.5}} className="mt-6 z-10 flex justify-center flex-wrap w-full">
                    <Link href={`/channel/${'' || info?.snippet?.channelId}/playlist/${info?.id}`} className='w-[45%] py-2 mx-2 my-1 bg-[#181a1b] hover:bg-[#282b2d] text-white z-10 text-center rounded-full'>Play</Link>
                    {/* <button className='w-[45%] py-2 mx-2 my-1 bg-[#51515163] hover:bg-[#6f6e6e63] z-10 rounded-full'>Shuffle</button> */}
                 </motion.div>
                  {/* description  */}
                 <div className="text-white mt-2 hidden md:block">
                    {info?.snippet?.description}
                 </div>
                 </div>

                </motion.div>

           </motion.div>
}


const PlayListItems = ({id} : any)=>{

    const [items,setItems] = useState<any>({});
    const [loading,setLoading] = useState(true);
    const getDetails = async ()=>{
        const res = await fetch(`/api/playlist/${id}/items`,{
            method : 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body : JSON.stringify({id}),
            next : {revalidate : 300}
        });
        if(res.status != 404 && res.status != 500){
            const {data} = await res.json();
            console.log(data);
            setItems(data);
            setLoading(false);
        }
    }

    useEffect(()=>{
        getDetails();
    },[]);

    return <>
    <div className="mt-4 mb-2 md:hidden font-bold text-2xl">Playlist Items</div>
    <motion.div layout transition={{duration : 0.5}} className="items max-h-full overflow-y-scroll basis-full md:basis-[70%] grow ">
     {items?.map((item : any , index : any)=>{
        return <PlayListItem key={index} index={index+1} item={item} />
     })}

    </motion.div>
    </>
}

const PlayListItem = ({index,item} : any)=>{
  return <>
  <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.contentDetails?.videoId}`} className="flex flex-col md:items-center md:flex-row w-full max-w-full overflow-x-hidden py-2 mb-2">
   <div className="hidden md:flex items-center justify-center basis-[4%]">{index}</div>
   <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.contentDetails?.videoId}`} className="basis-[20%] shrink-0 h-full ">
    <div className="w-full h-full relative pt-[56.25%] overflow-hidden">
        <Image src={item?.snippet?.thumbnails?.default?.url || videoImg} loading='lazy' className='absolute md:rounded-lg top-0 dark:bg-[#202324] bg-[#b8b8b8] right-0 bottom-0 left-0 !w-full !h-full !min-w-0 !min-h-0' layout='fill'  alt='itemImg' />
    </div>
   </Link>
   <div className="grow shrink basis-[60%] ml-3 mb-auto">
    <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.contentDetails?.videoId}`} className="text-[1.1rem] font-semibold truncate-1">{item?.snippet?.title}</Link>
    <div className="w-full flex flex-wrap">
        <Link href={`/channel/${item?.snippet?.channelId}`} className="text-[#aeadad] dark:hover:text-white hover:text-black text-[0.9rem] max-w-[50%] truncate mr-1">{item?.snippet?.channelTitle} </Link>
        <div className="text-[#b9b9b9] text-[0.9rem]"> &bull; 2.1M views &bull; {DateConverter(item?.contentDetails?.videoPublishedAt)} ago</div>
    </div>
   </div>
  </Link>

  </>
}


export default PlaylistPage;

