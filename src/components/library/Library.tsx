'use client'
import { isLargeContext, pageContext, slideContext } from "@/app/layout";
import Link from "next/link";
import { motion } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import Image from "next/legacy/image";
import { AiOutlineHistory, AiOutlineLike } from "react-icons/ai";
import SekeltonImg from "../global/skeletonComponents/ImgSkeleton";
import SekeltonText from "../global/skeletonComponents/TextSkeleton";
import { DateConverter } from "@/utils/Functions/Converters/DateConverter";
import { CountConverter } from "@/utils/Functions/Converters/CountConverter";
import { RiPlayListLine } from "react-icons/ri";
const img = 'https://yt3.googleusercontent.com/ytc/AOPolaQygjiMgnSw5zUP1F_PyEkcGBmfaE8HMq7S_xu_=s176-c-k-c0x00ffffff-no-rj';
const videoImg = 'https://i.ytimg.com/vi/fsNrgCivsZg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBjTNa2oj9zdcd0gdxGRYylfpzalA'

const Library = ()=>{
  const {slide , setslide} = useContext(slideContext) as any;
  const {setpage} = useContext(pageContext) as any;
  setslide(1);
  setpage(false);


    return <>
     <motion.div layout transition={{duration : 0.5}} className='md:pl-3 h-[90vh] pb-10 overflow-y-scroll flex flex-col-reverse md:flex-row dark:text-white'>
        <motion.div layout transition={{duration : 0.5}} className="basis-[80%] grow">

          <VideoSection key={1} id="playlists" />
          <VideoSection key={2} id="history" />
          <VideoSection key={3} id="liked" />

        </motion.div>
        
        <UserDetails />
    </motion.div>
    </>
}

const UserDetails = ()=>{
   const [info , setInfo] = useState<any>({});
   const [loading,setLoading] = useState(true);

   const getDetails = async()=>{
    const results = await fetch(`/api/library/user`,{
      next : {revalidate : 300},
    })

    if(results.status !== 404 && results.status != 500){
      const {data} = await results.json();
      setInfo(data);
      setLoading(false);
    }
  }

useEffect(()=>{
    getDetails()
},[])

 return <motion.div layout transition={{duration : 0.5}} className="basis-[20%] min-h-max grow-0 items-center pt-[4rem] md:flex flex-col bg-[3red]">
  <motion.div layout transition={{duration : 0.5}} className="flex flex-col items-center">
            <motion.div layout transition={{duration : 0.5}} className="mb-2">
              {loading ? 
              <SekeltonImg width="min-w-[80px] max-w-[80px]" height="min-h-[80px] max-h-[80px]" circle /> :
              <Image width={80} height={80} className="rounded-full bg-grey" alt="userImg" src={info?.snippet?.thumbnails?.medium?.url || img} />
              }
            </motion.div>
            { loading ? 
              <SekeltonText /> :  
            <motion.div layout transition={{duration : 0.5}} className="font-[500]">{info?.snippet?.title}</motion.div>
            }
           </motion.div>
           <motion.div layout transition={{duration : 0.5}} className="my-7 w-full px-6">
            <motion.hr className="mb-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]"/>
            <motion.div layout transition={{duration : 0.5}} className="flex justify-between text-[0.75rem] font-[400] px-5 text-[#b2aca2]"><motion.span transition={{duration : 0.5}}>Subscriptions</motion.span> <motion.span transition={{duration : 0.5}} className="ml-2">{info?.statistics?.subscriberCount}</motion.span></motion.div>
            <motion.hr className="my-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]"/>
            <motion.div layout transition={{duration : 0.5}} className="flex justify-between text-[0.75rem] font-[400] px-5 text-[#b2aca2]"><motion.span transition={{duration : 0.5}}>Uploads</motion.span> <motion.span transition={{duration : 0.5}} className="ml-2">{info?.statistics?.videoCount}</motion.span></motion.div>
            <motion.hr className="my-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]"/>
            <motion.div layout transition={{duration : 0.5}} className="flex justify-between text-[0.75rem] font-[400] px-5 text-[#b2aca2]"><motion.span transition={{duration : 0.5}}>Views</motion.span> <motion.span transition={{duration : 0.5}} className="ml-2">{info?.statistics?.viewCount}</motion.span></motion.div>
            <motion.hr className="my-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]"/>
           </motion.div>
  </motion.div>
}

const VideoSection = ({id} : any)=>{
   const title = id == 'history' ? 'Activities' : id == 'liked' ? 'Liked Videos' : 'Playlists';
   const icon =  id == 'history' ? <AiOutlineHistory/> : id == 'liked' ? <AiOutlineLike/>: <RiPlayListLine/>
   const [see,setSee] = useState(false);
   const toggleSee = ()=>{
         setSee(!see);
   }

   const [items , setItems] = useState<any>([]);
   const [loading,setLoading] = useState(true);

   const getDetails = async()=>{
    const results = await fetch(`/api/library/${id}`,{
      next : {revalidate : 300},
    })

    if(results.status !== 404 && results.status != 500){
      const {data} = await results.json();
      setItems(data);
      setLoading(false);
    }
  }

useEffect(()=>{
    getDetails()
},[])

   return <>
   {(loading || items?.length > 0) && 
    <motion.div layout transition={{duration : 0.5}} className="min-h-max">
        {loading ? 
        <motion.div layout transition={{duration : 0.5}} className='mb-5 mx-2 flex justify-between'>
        <SekeltonText height={'min-h-[2rem]'} width={'w-[20%]'} className="min-w-[12rem]" />
        <SekeltonText height={'min-h-[2.5rem]'} width={'w-[6%]'} className="!rounded-full min-w-[4rem]" /> 
        </motion.div> :

        <motion.div layout transition={{duration : 0.5}} className="flex mx-2 md:mx-1 mb-4 justify-between">
        <motion.div layout transition={{duration : 0.5}} className="flex font-bold text-[1.12rem] md:text-xl justify-center items-center">
           <motion.span layout transition={{duration : 0.5}} className='mr-2 text-[1.7rem] '>{icon}</motion.span> 
            {title}
        </motion.div>
        <motion.div layout transition={{duration : 0.5}} className="actions">
            <motion.button layout transition={{duration : 0.5}} onClick={()=>toggleSee()} className='flex items-center text-sm md:text-md hover:bg-[#1e2d40] text-[#45aeff] rounded-full px-3 py-[0.1rem] md:h-10 mr-3 md:mr-1 my-1'>See All</motion.button>
        </motion.div>
    </motion.div>
     }

     <motion.div layout transition={{duration : 0.5}} className={`flex w-screen md:w-full md:overflow-x-auto ${see && 'justify-evenly flex-wrap'} overflow-x-scroll md:justify-evenly md:flex-wrap`}>
      
      { loading ? <>
         <SkeletonCard/>
         <SkeletonCard/>
         <SkeletonCard/>
         <SkeletonCard/>
         <SkeletonCard/>
      </> : id !== 'playlists' ? 
       id === 'history' ?
       items?.map((item : any , index : any)=>{
        return <>
        {see ? <ActivitiesCard key={index} item={item} /> : index < 5 ? <ActivitiesCard key={index} item={item} /> : <></> }
        </>
      }
      ) 
       :
        items?.map((item : any , index : any)=>{
          return <>
          {see ? <VideoCard key={index} item={item} /> : index < 5 ? <VideoCard key={index} item={item} /> : <></> }
          </>
        }
        ) :
        items?.map((item : any , index : any)=>{
          return <PlaylistCard key={index} item={item} />
        })
      }
   
     </motion.div>

     <motion.hr className="my-4 border-none h-[0.07px] bg-[#5e5e5e36]" />

     </motion.div>
    }
    
    </>
}

const SkeletonCard = ()=>{
  
  return <>

<motion.div layout transition={{duration : 0.5}} className="flex flex-col mx-4 md:mx-[0.1rem] my-2 max-w-[13rem] min-w-[13rem] w-[13rem]">
        <motion.div layout transition={{duration : 0.5}} className="relative w-full pt-[56.25%] overflow-hidden">
        <motion.div layout transition={{duration : 0.5}}  className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
           <SekeltonImg className='!rounded-lg' />
        </motion.div>
        </motion.div>
        <motion.div layout transition={{duration : 0.5}} className="mt-2 pr-6">
            <motion.div layout transition={{duration : 0.5}} className="truncate-2 font-[650] text-[0.8rem] md:text-[0.9rem] whitespace-normal"><SekeltonText/></motion.div>
            <motion.div layout transition={{duration : 0.5}} className="truncate-1 font-[550] text-grey text-[0.7rem] md:text-[0.8rem] whitespace-normal mt-2"><SekeltonText width="min-w-[50%] w-[50%]"/></motion.div>
            <motion.div layout transition={{duration : 0.5}} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]"> <SekeltonText width="min-w-[50%] w-[50%]"/></motion.div>
        </motion.div>
</motion.div>

  </>
}

const VideoCard = ({item}:any)=>{
  
  return <>

<motion.div layout transition={{duration : 0.5}} className="flex flex-col mx-4 md:mx-[0.1rem] my-2 max-w-[13rem] min-w-[13rem] w-[13rem]">
        <motion.div layout transition={{duration : 0.5}} className="relative w-full pt-[56.25%] overflow-hidden">
        <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.id}`} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
            <Image className='rounded-lg dark:bg-[#202324] bg-[#b8b8b8]' src={item?.snippet?.thumbnails?.medium?.url || videoImg} layout='fill' alt='videocardImg' />
        </Link>
        </motion.div>
        <motion.div layout transition={{duration : 0.5}} className="mt-2 pr-6">
            <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.id}`} className="truncate-2 font-[650] text-[0.8rem] md:text-[0.9rem] whitespace-normal">{item?.snippet?.title}</Link>
            <Link href={`/channel/${item?.snippet?.channelId}`} className="truncate-1 font-[550] text-grey text-[0.7rem] md:text-[0.8rem] whitespace-normal mt-2">{item?.snippet?.channelTitle}</Link>
            {item?.statistics?.viewCount ? 
            <motion.div layout transition={{duration : 0.5}} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]"> {CountConverter(item?.statistics?.viewCount)} views &bull; {DateConverter(item?.snippet?.publishedAt)} ago</motion.div>:
            <motion.div layout transition={{duration : 0.5}} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]"> {DateConverter(item?.snippet?.publishedAt)} ago</motion.div> 
            }
        </motion.div>
    </motion.div>

  </>
}

const ActivitiesCard = ({item}:any)=>{

  let isChannel ;
  let url;
  let channelUrl;


  if(item?.snippet?.type === "subscription"){
   url = `/channel/${item?.contentDetails?.subscription?.resourceId?.channelId}`
   channelUrl = `/channel/${item?.contentDetails?.subscription?.resourceId?.channelId}`
   isChannel = true;
  }
  else{
   isChannel = false;
   url = `/channel/${item?.snippet?.channelId}/video/${item?.contentDetails?.playlistItem?.resourceId?.videoId}`
   channelUrl = `/channel/${item?.snippet?.channelId}`
  }

  return <>

<motion.div layout transition={{duration : 0.5}} className="flex flex-col mx-4 md:mx-[0.1rem] my-2 max-w-[13rem] min-w-[13rem] w-[13rem]">
        <motion.div layout transition={{duration : 0.5}} className="relative w-full pt-[56.25%] overflow-hidden">
        <Link href={url} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
            <Image className='rounded-lg dark:bg-[#202324] bg-[#b8b8b8]' src={item?.snippet?.thumbnails?.medium?.url || videoImg} layout='fill' alt='videocardImg' />
        </Link>
        </motion.div>
        <motion.div layout transition={{duration : 0.5}} className="mt-2 pr-6">
            <Link href={url} className="truncate-2 font-[650] text-[0.8rem] md:text-[0.9rem] whitespace-normal">{item?.snippet?.title || item?.snippet?.channelTitle}</Link>
            {isChannel && 
            <Link href={channelUrl} className="truncate-1 font-[550] text-grey text-[0.7rem] md:text-[0.8rem] whitespace-normal mt-2">{item?.snippet?.channelTitle}</Link>
            }
            {item?.statistics?.viewCount ? 
            <motion.div layout transition={{duration : 0.5}} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]"> {CountConverter(item?.statistics?.viewCount)} views &bull; {DateConverter(item?.snippet?.publishedAt)} ago</motion.div>:
            <motion.div layout transition={{duration : 0.5}} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]"> {DateConverter(item?.snippet?.publishedAt)} ago</motion.div> 
            }
        </motion.div>
    </motion.div>

  </>
}

const PlaylistCard = ({item}:any)=>{
  return <>

<motion.div layout transition={{duration : 0.5}} className="flex flex-col mx-4 md:mx-[0.1rem] my-2 max-w-[13rem] min-w-[13rem] w-[13rem]">
        <motion.div layout transition={{duration : 0.5}} className="relative w-full h-full pt-[56.25%] overflow-hidden">
        <Link href={`/channel/${item?.snippet?.channelId}/playlist/${item?.id}`} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
            <Image className='rounded-lg dark:bg-[#202324] bg-[#b8b8b8]' src={item?.snippet?.thumbnails?.medium?.url || videoImg} layout='fill' alt='videocardImg' />
        </Link>
        </motion.div>
        <motion.div layout transition={{duration : 0.5}} className="mt-2 pr-6">
            <Link href={`/channel/${item?.snippet?.channelId}/playlist/${item?.id}`} className="truncate-2 font-[650] text-[0.8rem] md:text-[0.9rem] whitespace-normal">{item?.snippet?.title}</Link>
            <Link href={`/channel/${item?.snippet?.channelId}`} className="truncate-1 font-[550] text-grey text-[0.7rem] md:text-[0.8rem] whitespace-normal mt-2">{item?.snippet?.channelTitle}</Link>
            <motion.div layout transition={{duration : 0.5}} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]"> {item?.contentDetails?.itemCount} Items &bull; {DateConverter(item?.snippet?.publishedAt)} ago</motion.div>
        </motion.div>
    </motion.div>

  </>
}

export default Library;