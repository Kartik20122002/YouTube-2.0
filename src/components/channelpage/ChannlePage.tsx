import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineArrowRight, AiOutlineHistory } from 'react-icons/ai';
import { motion } from 'framer-motion';
import Image from 'next/legacy/image';
import { isLargeContext, pageContext } from '@/app/layout';
import { CountConverter } from '@/utils/Functions/Converters/CountConverter';
import SekeltonImg from '../global/skeletonComponents/ImgSkeleton';
import SekeltonText from '../global/skeletonComponents/TextSkeleton';
import { DateConverter } from '@/utils/Functions/Converters/DateConverter';

export const revalidate = 300;

const img = 'https://yt3.googleusercontent.com/ytc/AOPolaQygjiMgnSw5zUP1F_PyEkcGBmfaE8HMq7S_xu_=s176-c-k-c0x00ffffff-no-rj';
const videoImg = 'https://i.ytimg.com/vi/fsNrgCivsZg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBjTNa2oj9zdcd0gdxGRYylfpzalA'

const ChannelPage = ({channelId} : any)=>{ 

    const {setpage} = useContext(pageContext) as any;

    useEffect(()=>{
        setpage(false);
    },[])

    return (<>
    <motion.div layout transition={{duration : 0.5}} className='overflow-y-scroll h-screen pb-[10rem] dark:text-white'>
        <ChannelInfo id={channelId}/>
        <VideoSection id={channelId} type={"activities"} />
        <VideoSection id={channelId} type={"playlists"} />
    </motion.div>
    </>)
}

const ChannelInfo = ({id}:any)=>{
    const [sub,setSub] = useState<any>(false);
    const [channel , setChannel] = useState<any>({});
    const [loading,setLoading] = useState(true);
    const toggleSub = ()=>{ setSub(1-sub); }

    const getDetails = async()=>{
      const results = await fetch('/api/channel',{
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify({id}),
        next : {revalidate : 300}
      })

      if(results.status !== 404 && results.status != 500){
        const {channelDetails,isSub} = await results.json();
        if(isSub) setSub(isSub);
        setChannel(channelDetails);
        setLoading(false);
      }
    }

    useEffect(()=>{
        getDetails()
    },[])

    return <>
    <motion.div layout transition={{duration : 0.5}} className="flex relative flex-wrap  md:mt-6">
     
        <motion.div layout transition={{duration : 0.5}} className="basis-full relative md:min-w-[15rem] h-full md:basis-[15%] md:px-8 ">
            <motion.div layout transition={{duration : 0.5}} className="w-full h-full md:relative md:pb-[100%] pb-[40%] overflow-hidden">
            <motion.div layout transition={{duration : 0.5}} className="absolute w-full h-full top-0 md:right-0 md:bottom-0 md:left-0">
            { loading ? <SekeltonImg className='md:!rounded-full'/> :
            <Image className='md:rounded-full md:!min-h-full md:!h-full !h-[10%]' src={channel?.snippet?.thumbnails?.medium?.url} layout='fill' alt='channelImg' loading='lazy' />}
            </motion.div>
            </motion.div>
        </motion.div>


        <motion.div layout transition={{duration : 0.5}} className="basis-[60%] mt-2 md:mt-0 flex min-w-max pl-3 md:pl-0 flex-col justify-center items-start grow">
            <motion.div layout transition={{duration : 0.5}} className="text-[2rem] w-full">{!loading ? channel?.snippet?.title : <SekeltonText height={'min-h-[2rem]'} width={'w-3/4'}/> }</motion.div>
                {loading ? <SekeltonText /> : <>
            <motion.div layout transition={{duration : 0.5}} className="mb-2 mt-1 md:mt-0 flex text-[0.9rem]">
                <motion.div layout transition={{duration : 0.5}} className="text-[#979696] mr-3 hover:text-[#c0bebe] cursor-pointer font-semibold">{channel?.snippet?.customUrl}</motion.div>
                <motion.div layout transition={{duration : 0.5}} className="text-[#979696] mr-3">{CountConverter(channel?.statistics?.subscriberCount)} Subcribers</motion.div>
                <motion.div layout transition={{duration : 0.5}} className="text-[#979696] mr-3">{CountConverter(channel?.statistics?.videoCount)} Videos</motion.div>
            </motion.div>
                </>}
            {loading ? <SekeltonText /> : 
            <Link href={`channel/${id}`} className="text-[0.9rem] whitespace-normal truncate-1 max-w-[100vw] w-full text-[#979696] hover:text-[#c0bebe] flex items-center">Official YouTube Channel of the Indian Space Research Organisation </Link>
            }
        </motion.div>

        <motion.div layout transition={{duration : 0.5}} className="flex items-center justify-end my-1 px-6 grow">
        {sub == 1 ? 
         <motion.button layout transition={{duration : 0.5}} onClick={()=>toggleSub()} className='bg-[#cfcfcf57] dark:text-[#959595cd] py-1 px-4 rounded-full text-lg text-black font-semibold hover:opacity-70'>Subscribed</motion.button>
         :
         <motion.button onClick={()=>toggleSub()} className='bg-white py-1 px-4 rounded-full md:text-lg text-black font-semibold hover:opacity-70'>Subscribe</motion.button>
         }
        </motion.div>
    </motion.div>
    </>
}

const VideoSection = ({id,type} :any)=>{
    const [see,setSee] = useState(false);
    const heading = type == 'activities' ? 'Recently Upload' : 'Playlists';
    const icon =  <AiOutlineHistory/>
    const [items,setItems] = useState([]);

    const getDetails = async()=>{
        const results = await fetch(`/api/channel/${type}`,{
          method : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body : JSON.stringify({id}),
          next : {revalidate : 300}
        })
  
        if(results.status !== 404 && results.status != 500){
          const {data} = await results.json();
          setItems(data);
        }
      }

    useEffect(()=>{
        getDetails()
    },[])

    const toggleSee =()=>{ setSee(!see)}
    return <>

    { items?.length > 0 && <>
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
         {
            type == 'activities' ? <VideoGallery see={see} items={items}/> 
            : <PlayListGallery see={see} items={items} />
         }
        
    </motion.div>
    </>
    }
    </>
}

export const VideoGallery = ({see,items}:any)=>{
    const {isLarge} = useContext(isLargeContext) as any;
    return <>
    <motion.div layout transition={{duration : 0.5}} className="justify-evenly flex-wrap flex ">
        {
        items?.map((val : any ,index : any)=>{
            if(see) return <VideoCard key={index} item={val} index={index}/>;
            else if(!isLarge ? index < 4 : index < 3) return <VideoCard key={index} item={val} index={index}/>;
        })
        }
    </motion.div>
    </>
}

export const PlayListGallery = ({see,items}:any)=>{
    const {isLarge} = useContext(isLargeContext) as any;
    return <>
    <motion.div layout transition={{duration : 0.5}} className="justify-evenly flex-wrap flex ">
        {items?.map((item:any,index:any)=>{
            if(see) return <PlayListCard item={item} key={index} index={index}/>;
            else if(!isLarge ? index < 4 : index < 3) return <PlayListCard item={item} key={index} index={index}/>;
        })}
    </motion.div>
    </>
}

const VideoCard = ({index , item} : any)=>{
    const {isLarge} = useContext(isLargeContext) as any;
    const time = DateConverter(item?.snippet?.publishedAt);
    return <>
    <motion.div layout transition={{duration : 0.5 , delay : !isLarge ? (index%10)/10 : 0}} className="flex flex-col md:mx-2 my-2 md:max-w-[20rem] min-w-6 w-full">
        <motion.div layout transition={{duration : 0.5}} className="relative w-full h-full pt-[56.25%] overflow-hidden">
        <Link href={`/channel/${item?.snippet?.channelId}/${item?.snippet?.type === 'upload' ? `/video/${item?.contentDetails?.upload?.videoId}` : `/playlist/${item?.contentDetails?.playlistItem?.playlistId}`}`} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
            <Image className='md:rounded-lg' src={item?.snippet?.thumbnails?.medium?.url || videoImg} layout='fill' alt='videocardImg' />
        </Link>
        </motion.div>
        <motion.div layout transition={{duration : 0.5}} className="mt-1">
            <Link href={`/channel/${item?.snippet?.channelId}/${item?.snippet?.type === 'upload' ? `/video/${item?.contentDetails?.upload?.videoId}` : `/playlist/${item?.contentDetails?.playlistItem?.playlistId}`}`} className="truncate-2 whitespace-normal ">{item?.snippet?.title || 'no title'}</Link>
            <motion.div layout transition={{duration : 0.5}} className="text-[#979696]">{time} ago &bull; {item?.snippet?.type}</motion.div>
        </motion.div>
    </motion.div>
    </>
}

const PlayListCard = ({index,item} : any)=>{
    const {isLarge} = useContext(isLargeContext) as any;
    const time = DateConverter(item?.snippet?.publishedAt);
    return <>
    <motion.div layout transition={{duration : 0.5 , delay : !isLarge ? (index%10)/10 : 0}} className="flex flex-col md:mx-2 my-2 md:max-w-[20rem] min-w-6 w-full">
        <motion.div layout transition={{duration : 0.5}} className="relative w-full h-full pt-[56.25%] overflow-hidden">
        <Link href={`/channel/${item?.snippet?.channelId}/playlist/${item?.id}`} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
            <Image className='md:rounded-lg' src={item?.snippet?.thumbnails?.medium?.url || videoImg} layout='fill' alt='videocardImg' />
        </Link>
        </motion.div>
        <motion.div layout transition={{duration : 0.5}} className="mt-1">
            <Link href={`/channel/${item?.snippet?.channelId}/playlist/${item?.id}`} className="truncate-2 whitespace-normal ">{item?.snippet?.title || 'no title'}</Link>
            <motion.div layout transition={{duration : 0.5}} className="text-[#979696]">{time} ago &bull; {item?.contentDetails?.itemCount} items</motion.div>
        </motion.div>
    </motion.div>
    </>
}

export default ChannelPage;

