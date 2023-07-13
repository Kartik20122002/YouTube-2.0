'use client'
import Image from "next/legacy/image"
import Link from "next/link"
import megan from "@/images/megan.png"
import { motion } from "framer-motion"
import { isLargeContext, pageContext } from "@/app/layout"
import { useContext, useEffect, useState } from "react"
import PageSkeleton from "@/components/global/pagesection/loading";
import { signOut } from "next-auth/react"
import ImgSkeleton from '@/components/global/skeletonComponents/ImgSkeleton';

const dynamic = 'force-dynamic'

export const revalidate = 300;

const PageSection = ({page} : any)=>{
    const {isLarge , setIsLarge} = useContext(isLargeContext) as any;
    const {setpage} = useContext(pageContext) as any;
    setpage(false);
    const [items,setItems] = useState<any>([]);
    const [token,setToken] = useState('');
    const [loading,setLoading] = useState(true);
    const [imgs , setImgs] = useState<any>([]);
   
    const fetchData = async ()=>{
      try{
        const res = await fetch(`/api/page/${page}/${token}`,{
          next: {revalidate : 300},
        });

        if(res.status != 500 && res.status != 404){
          const {videos , ptoken , ntoken} = await res.json();
          setItems(videos);
          setToken(ntoken);
          setLoading(false);
        }
        else throw new Error('some error hai yaar')

      }
      catch(error){
        console.log('page error' , error);
        signOut();
      }
     
     }

     const fun = async () =>{
      let channelIds = [] as any;
      items.map((item:any)=>{channelIds.push(item?.snippet.channelId)});
      const channelsImgRes = await fetch(`/api/channels_for_page`,{
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify(channelIds),
        cache :'force-cache'
      });
      const channelsImgData = await channelsImgRes.json();

      for(let i = 0 ; i < items.length ; i++){
        for(let j = 0 ; j < channelsImgData.length ; j++){
          if(items[i].snippet.channelTitle == channelsImgData[j].snippet.title){
            const newArray = imgs;
            newArray[i] = channelsImgData[j].snippet.thumbnails.default.url;
            setImgs(newArray);
          }
        }
      } 
    }

     useEffect(()=>{
      fetchData();
     },[])

     useEffect(()=>{
        if(items?.length !== 0){
          fun();
        }
     },[items])

    return loading ? <PageSkeleton/> : 
         <motion.div layout transition={{duration : 0.5}} className="flex flex-wrap justify-evenly h-[100vh] overflow-y-scroll pt-5 pb-[10%]" id="mainpage">
          <div className="flex flex-wrap justify-evenly w-full">
           {items?.map((item : any , index : any)=>{
             return <VideoContainer index={index} imgs={imgs} key={index} isLarge={isLarge} item={item} />
            })}
          </div>
          </motion.div>
}

const VideoContainer = ({item , index ,isLarge , imgs}:any)=>{

  let views = item?.statistics?.viewCount as any;
  let viewss = views + '' as string;
  if(views >= 1000){views = views/1000; viewss = Math.trunc(views) + 'K'}
  if(views >= 1000){views = views/1000; viewss = Math.trunc(views) + 'M'}
  if(views >= 1000){views = views/1000; viewss = Math.trunc(views) + 'B'}

  let d1 = new Date(item?.snippet?.publishedAt) as any;
  let d2 = new Date() as any;
  let date = Math.abs(d2-d1) as any;
  date = date/(1000*60);
  let time = Math.trunc(date) + " mins" 
  if(date >= 60){ date = date/60; time = Math.trunc(date) + " hours";
  if(date >= 24){ date = date/24; time = Math.trunc(date) + " days";
  if(date >= 31){ date = date/30.4167; time = Math.trunc(date) + " months";
  if(date >= 12){ date = date/12; time = Math.trunc(date) + " years";
  }}}}

    return <>

<motion.div whileHover={{ scale: 1.1, transition: { duration: 0.5 ,delay : 3 }}} layout transition={{duration : 0.5 , delay : !isLarge ? (index%10)/10 : 0}} className= {`px-0  md:h-[18rem] w-full md:w-[22rem] items-center mb-7 flex flex-col justify-between`}>

  <Link className={`relative md:h-[12.5rem] w-full`} href={`/channel/${item?.snippet?.channelId}/video/${item?.id}`}>

  <motion.div className={`flex h-full w-full relative pt-[56.25%] md:pt-0 md:rounded-md`} layout transition={{duration : 0.5}}>
    <Image src={item.snippet.thumbnails.medium.url} className="md:rounded-xl dark:bg-[#202324] bg-[#b8b8b8]" layout="fill" alt="video" />
  </motion.div>

  </Link>

<motion.div layout transition={{duration : 0.5}} className={`flex w-full md:items-start relative items-center px-2 mt-2`}>

    <Link href="" className="mr-4 min-w-[40px] w-[40px] h-[40px]"> 
    { imgs[index] ?
    <Image className="rounded-full h-[40px] dark:bg-[#202324] bg-[#b8b8b8]" layout="responsive" width={40} height={40} src={imgs[index]} loading="lazy" alt="channelImg" /> 
    : 
    <ImgSkeleton className="w-[40px] h-[40px] rounded-full"/>
    }
    </Link> 

    <motion.div layout transition={{duration : 0.5}} className="text-sm">
        <Link className="text-black dark:text-white font-semibold text-[15px] mb-[5px] truncate-2" href={`/channel/${item?.snippet?.channelId}/video/${item?.id}`}>{item?.snippet?.title}</Link>
        <div className="flex md:flex-col w-full">
        <Link className="text-[#979696] mr-2" href=""> <p>{item?.snippet?.channelTitle}</p></Link>
        <p className="text-[#979696]"> <span className="mr-1">{viewss} Views</span> &bull; <span className="ml-1">{time} ago</span></p>
        </div>
    </motion.div>
</motion.div>
</motion.div> 

  </>
}

export default PageSection;