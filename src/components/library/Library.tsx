'use client'
import { isLargeContext, pageContext, slideContext } from "@/app/layout";
import Link from "next/link";
import { motion } from "framer-motion";
import { useContext, useState } from "react";
import Image from "next/legacy/image";
import { AiOutlineLike } from "react-icons/ai";
import SekeltonImg from "../global/skeletonComponents/ImgSkeleton";
import SekeltonText from "../global/skeletonComponents/TextSkeleton";
import { DateConverter } from "@/utils/Functions/Converters/DateConverter";
import { CountConverter } from "@/utils/Functions/Converters/CountConverter";
const img = 'https://yt3.googleusercontent.com/ytc/AOPolaQygjiMgnSw5zUP1F_PyEkcGBmfaE8HMq7S_xu_=s176-c-k-c0x00ffffff-no-rj';
const videoImg = 'https://i.ytimg.com/vi/fsNrgCivsZg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBjTNa2oj9zdcd0gdxGRYylfpzalA'

const Library = ()=>{
  const {slide , setslide} = useContext(slideContext) as any;
  const {setpage} = useContext(pageContext) as any;
  setslide(1);
  setpage(false);


    return <>
     <motion.div layout transition={{duration : 0.5}} className='md:pl-3 h-full overflow-y-scroll flex dark:text-white'>
        <motion.div layout transition={{duration : 0.5}} className="basis-[80%] h-full grow">

          <VideoSection id="liked" />

        </motion.div>
        
        <UserDetails />
    </motion.div>
    </>
}

const UserDetails = ()=>{
 return <div className="basis-[20%] grow-0 hidden items-center pt-[4rem] md:flex flex-col bg-[3red]">
  <div className="flex flex-col items-center">
            <div className="mb-2">
              <Image width={80} height={80} className="rounded-full" alt="userImg" src={img} />
            </div>
            <div className="font-[500]">Kartik Hatwar</div>
           </div>
           <div className="mt-7 w-full px-6">
            <hr className="mb-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]"/>
            <div className="flex justify-between text-[0.75rem] font-[400] px-5 text-[#b2aca2]"><span>Subscriptions</span> <span className="ml-2">81</span></div>
            <hr className="my-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]"/>
            <div className="flex justify-between text-[0.75rem] font-[400] px-5 text-[#b2aca2]"><span>Uploads</span> <span className="ml-2">0</span></div>
            <hr className="my-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]"/>
            <div className="flex justify-between text-[0.75rem] font-[400] px-5 text-[#b2aca2]"><span>Likes</span> <span className="ml-2">3,850</span></div>
            <hr className="mt-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]"/>
           </div>
  </div>
}

const VideoSection = ({id} : any)=>{
   const loading = false;
   const title = id == 'history' ? 'History' : id == 'liked' ? 'Liked Videos' : 'Playlists';
   const icon = <AiOutlineLike/>
   const [see,setSee] = useState(false);
   const toggleSee = ()=>{
         setSee(!see);
   }

   return <>
    <motion.div layout transition={{duration : 0.5}}>
        {loading ? 
        <motion.div layout transition={{duration : 0.5}} className='mb-5 mx-2 md:mx-0 flex justify-between'>
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

     <motion.div layout transition={{duration : 0.5}} className="flex w-full justify-center flex-wrap">
      <VideoCard index={0} />
      <VideoCard index={1} />
      <VideoCard index={2} />
      <VideoCard index={3} />
      {see && 
      <>
      <VideoCard index={4} />
      <VideoCard index={5} />
      <VideoCard index={6} />
      <VideoCard index={7} />
      <VideoCard index={8} />
      <VideoCard index={9} />
      <VideoCard index={10} />
      <VideoCard index={11} />
      </>
      }
   
     </motion.div>

     </motion.div>
    
    </>
}

const VideoCard = ({index} : any)=>{
  const {isLarge} = useContext(isLargeContext) as any;
  const title = 'lkjadfkj kajdsfh; jads; jksad; fjkhadspdiufhlkadsjhflkahdsfiuasdflkjnkj'
  const channelName = 'akdjf hlakjdf lkajfd  lkjha sdfkj'
  const views = 61234324;
  const date = Date.now();

  return <>

<motion.div layout transition={{duration : 0.5 , delay : !isLarge ? (index%10)/10 : 0}} className="flex flex-col md:mx-[0.1rem] my-2 md:max-w-[13rem] min-w-4 w-full">
        <motion.div layout transition={{duration : 0.5}} className="relative w-full h-full pt-[56.25%] overflow-hidden">
        <Link href={`/channel/${channelName}/${title}`} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
            <Image className='md:rounded-lg dark:bg-[#202324] bg-[#b8b8b8]' src={videoImg} layout='fill' alt='videocardImg' />
        </Link>
        </motion.div>
        <motion.div layout transition={{duration : 0.5}} className="mt-2 pr-6">
            <Link href={`/channel/${channelName}/${title}`} className="truncate-2 font-[650] text-[0.8rem] md:text-[0.9rem] whitespace-normal">{title}</Link>
            <Link href={`/channel/${channelName}`} className="truncate-1 font-[550] text-grey text-[0.7rem] md:text-[0.8rem] whitespace-normal mt-2">{channelName}</Link>
            <motion.div layout transition={{duration : 0.5}} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]"> {CountConverter(views)} views &bull; {DateConverter(date)} ago</motion.div>
        </motion.div>
    </motion.div>

  </>
}

export default Library;