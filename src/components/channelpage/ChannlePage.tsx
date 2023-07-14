import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineArrowRight, AiOutlineHistory } from 'react-icons/ai';
import { motion } from 'framer-motion';
import Image from 'next/legacy/image';
import { isLargeContext, pageContext } from '@/app/layout';

export const revalidate = 300;

const img = 'https://yt3.googleusercontent.com/ytc/AOPolaQygjiMgnSw5zUP1F_PyEkcGBmfaE8HMq7S_xu_=s176-c-k-c0x00ffffff-no-rj';
const videoImg = 'https://i.ytimg.com/vi/fsNrgCivsZg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBjTNa2oj9zdcd0gdxGRYylfpzalA'

const ChannelPage = ({channelId} : any)=>{ 

    const [loading , setLoading] = useState(true);
    const {setpage} = useContext(pageContext) as any;
    setpage(false);
    
    const getDetails = async ()=>{
        try{
            setLoading(false);
        }
        catch(err){
            console.log(err);
        }
    }
    
    useEffect(()=>{
       getDetails();
    },[])

    return (<>
    <motion.div layout transition={{duration : 0.5}} className='overflow-y-scroll h-screen pb-[10rem] dark:text-white'>
        <ChannelInfo id={channelId}/>
        <VideoSection id={channelId} />
        <VideoSection id={channelId} />
    </motion.div>
    </>)
}

const ChannelInfo = ({id}:any)=>{
    const [sub,setSub] = useState<any>(0);
    const toggleSub = ()=>{
        setSub(1-sub);
    }
    return <>
    <motion.div layout transition={{duration : 0.5}} className="flex flex-wrap h-1/2 md:h-fit md:mt-6">

        <motion.div layout transition={{duration : 0.5}} className="basis-full relative md:min-w-[15rem] h-1/2 md:h-auto md:basis-[15%] md:px-8 ">
            <motion.div layout transition={{duration : 0.5}} className="w-full h-full  md:h-full md:relative md:pb-[100%] overflow-hidden">
            <motion.div layout transition={{duration : 0.5}} className="absolute w-full h-full top-0 md:right-0 md:bottom-0 md:left-0">
            <Image className='md:rounded-full md:!min-h-full md:!h-full !h-[10%]' src={img} layout='fill' alt='channelImg' loading='lazy' />
            </motion.div>
            </motion.div>
        </motion.div>


        <motion.div layout transition={{duration : 0.5}} className="basis-[60%] flex min-w-max pl-3 md:pl-0 flex-col justify-center items-start grow">
            <motion.div layout transition={{duration : 0.5}} className="text-[2rem]">Channel Name</motion.div>
            <motion.div layout transition={{duration : 0.5}} className="mb-2 flex text-[0.9rem]">
                <motion.div layout transition={{duration : 0.5}} className="text-[#979696] mr-3 hover:text-[#c0bebe] font-semibold">@Channel Tag</motion.div>
                <motion.div layout transition={{duration : 0.5}} className="text-[#979696] mr-3">1.12M subcribers</motion.div>
                <motion.div layout transition={{duration : 0.5}} className="text-[#979696] mr-3">80 videos</motion.div>
            </motion.div>
            <Link href={''} className="text-[0.9rem] whitespace-normal truncate-1 max-w-[100vw] w-full text-[#979696] hover:text-[#c0bebe] flex items-center">Official YouTube Channel of the Indian Space Research Organisation </Link>
        </motion.div>

        <motion.div layout transition={{duration : 0.5}} className="flex items-center justify-end px-6 grow">
        {sub == 1 ? 
         <motion.button layout transition={{duration : 0.5}} onClick={()=>toggleSub()} className='bg-[#cfcfcf57] dark:text-[#959595cd] py-1 px-4 rounded-full text-lg text-black font-semibold hover:opacity-70'>Subscribed</motion.button>
         :
         <motion.button onClick={()=>toggleSub()} className='bg-white py-1 px-4 rounded-full md:text-lg text-black font-semibold hover:opacity-70'>Subscribe</motion.button>
         }
        </motion.div>
    </motion.div>
    </>
}

const VideoSection = ({id} :any)=>{
    const [see,setSee] = useState(false);
    const heading = 'Recently Upload'
    const icon =  <AiOutlineHistory/>

    const toggleSee =()=>{ setSee(!see)}
    return <>
    <motion.hr layout transition={{duration : 0.5}} className='my-6 border-none h-[0.1px] bg-[#69696945]' />

    <motion.div layout transition={{duration : 0.5}} className="md:mx-2">
        <motion.div layout transition={{duration : 0.5}} className="flex mx-2 md:mx-0 mb-4 justify-between">
            <motion.div layout transition={{duration : 0.5}} className="flex font-bold text-lg md:text-xl items-center">
               <motion.span layout transition={{duration : 0.5}} className='mr-2'>{icon}</motion.span> 
                {heading}
            </motion.div>
            <motion.div layout transition={{duration : 0.5}} className="actions">
                <motion.button layout transition={{duration : 0.5}} onClick={()=>toggleSee()} className='flex items-center text-sm md:text-md dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-2 md:px-4 py-1 md:py-2 md:h-10 mr-3 md:mr-1 my-1'>See All</motion.button>
            </motion.div>
        </motion.div>
         
        <VideoGallery id={id} see={see}/>
    </motion.div>
    </>
}

const VideoGallery = ({id,see}:any)=>{
    const items = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1];
    const {isLarge} = useContext(isLargeContext) as any;
    return <>
    <motion.div layout transition={{duration : 0.5}} className="justify-evenly flex-wrap flex ">
        {items?.map((item,index)=>{
            if(see) return <VideoCard index={index}/>;
            else if(!isLarge ? index < 4 : index < 3) return <VideoCard index={index}/>;
        })}
    </motion.div>
    </>
}

const VideoCard = ({index} : any)=>{
    const {isLarge} = useContext(isLargeContext) as any;
    const views = '97k'
    const time = '4 days'
    return <>
    <motion.div layout transition={{duration : 0.5 , delay : !isLarge ? (index%10)/10 : 0}} className="flex flex-col md:mx-2 my-2 md:max-w-[20rem] min-w-6 w-full">
        <motion.div layout transition={{duration : 0.5}} className="relative w-full h-full pt-[56.25%] overflow-hidden">
        <Link href={''} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
            <Image className='md:rounded-lg' src={videoImg} layout='fill' alt='videocardImg' />
        </Link>
        </motion.div>
        <motion.div layout transition={{duration : 0.5}} className="mt-1">
            <Link href={''} className="truncate-2 whitespace-normal ">Everything Goes On (Sush & Yohan x @TASHIF Mashup) • Porter Robinson, Arijit Lorem ipsum dolor sit, amet consectetur adipisicing elit. Explicabo, laudantium!</Link>
            <motion.div layout transition={{duration : 0.5}} className="text-[#979696]">{views} views &bull; {time} ago</motion.div>
        </motion.div>
    </motion.div>
    </>
}

export default ChannelPage;

