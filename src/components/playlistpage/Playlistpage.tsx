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
    <motion.div layout transition={{duration : 0.5}} className='overflow-y-scroll h-screen dark:text-white'>

        <motion.div layout transition={{duration : 0.5}} className='w-full flex flex-wrap h-full overflow-y-scroll pb-[10rem]'>

           <PlayListInfo id={id}/>
           <motion.div layout transition={{duration : 0.5}} className="items bg-[red] basis-full md:basis-[70%] grow ">
                   items
           </motion.div>
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

   return <motion.div layout transition={{duration : 0.5}} className="basis-full md:basis-[30%] grow min-w-[20rem] md:px-4">
                
                <motion.div layout transition={{duration : 0.5}} className="relative h-full w-full overflow-hidden md:rounded-[3%] p-6">
                 <Image src={loading ? videoImg : info?.snippet?.thumbnails?.medium?.url} layout='fill' loading='lazy' className='blur-[15px] !mb-auto !mt-0 !h-[90%] !min-h-[50%] opacity-80 z-0' alt='' />

                 <motion.div layout transition={{duration : 0.5}} className="w-full flex flex-wrap md:flex-col">

                    <motion.div layout transition={{duration : 0.5}} className="relative pt-[56.25%] w-full h-full">
                    <Link href={`/channel/${'' || info?.snippet?.channelpage}/playlist/${info?.id}`} className="absolute min-w-full flex items-center cursor-pointer justify-center text-transparent  hover:text-white top-0 min-h-full bg-transparent hover:bg-[#0000009c] z-10 rounded-[4%]">
                        Play
                    </Link>
                    <motion.div layout transition={{duration : 0.5}} className="absolute top-0 right-0 bottom-0 left-0 w-full h-full"> <Image src={loading ? videoImg : info?.snippet?.thumbnails?.medium?.url}  layout='fill' className='rounded-[4%] dark:bg-[#202324] bg-[#b8b8b8]' loading='lazy' alt='playlistImg' /> </motion.div>
                    </motion.div>
                    
                    <motion.div layout transition={{duration : 0.5}} className="details mt-3 z-10">
                        <motion.div layout transition={{duration : 0.5}} className="text-[1.5rem] font-semibold hover:opacity-70 truncate-2">{info?.snippet?.title || "No Title"}</motion.div>
                        <motion.div layout transition={{duration : 0.5}} className="mt-2">
                            <div className="truncate-1 text-sm font-semibold">{info?.snippet?.channelTitle}</div>
                            <div className="flex text-[#b9b9b9] mt-1 font text-[0.8rem]">
                                <div className="mr-2">{0 || info?.contentDetails?.itemCount} videos</div>
                                <div className="mr-2">1,805 views</div>
                                <div className="">Last updated on {DateConverter(info?.snippet?.publishedAt)}</div>
                            </div>
                        </motion.div>
                        <motion.div layout transition={{duration : 0.5}} className="flex mt-4">
                            <motion.button layout transition={{duration : 0.5}} className='text-[1.5rem] p-2 m-1 rounded-full bg-[#6564645d]'><PiShareFatThin/></motion.button>
                            <motion.button layout transition={{duration : 0.5}} className='text-[1.5rem] p-2 m-1 rounded-full bg-[#6564645d]'><LiaDownloadSolid/></motion.button>
                            <motion.button layout transition={{duration : 0.5}} className='text-[1.5rem] p-2 m-1 rounded-full bg-[#6564645d]'><AiOutlineMore/></motion.button>
                        </motion.div>
                        <motion.div layout transition={{duration : 0.5}} className="buttons">

                        </motion.div>
                    </motion.div>

                 </motion.div>

                 <motion.div layout transition={{duration : 0.5}} className="mt-6 z-10 flex justify-center flex-wrap w-full">
                    <Link href={`/channel/${'' || info?.snippet?.channelpage}/playlist/${info?.id}`} className='w-[45%] py-2 mx-2 my-1 bg-[#181a1b] hover:bg-[#282b2d] text-white z-10 rounded-full'>Play</Link>
                    <button className='w-[45%] py-2 mx-2 my-1 bg-[#51515163] hover:bg-[#6f6e6e63] z-10 rounded-full'>Shuffle</button>
                 </motion.div>

                </motion.div>
           </motion.div>
}



export default PlaylistPage;

