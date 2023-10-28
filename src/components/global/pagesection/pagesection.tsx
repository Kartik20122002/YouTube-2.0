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
import { DateConverter } from "@/utils/Functions/Converters/DateConverter"
import { CountConverter } from "@/utils/Functions/Converters/CountConverter"

export const revalidate = 300;



const PageSection = ({page} : any)=>{
    const {isLarge , setIsLarge} = useContext(isLargeContext) as any;
    const {setpage} = useContext(pageContext) as any;
    setpage(false);
    const [items,setItems] = useState<any>([]);
    const [imgs , setImgs] = useState([]);
    const [token,setToken] = useState('');
    const [loading,setLoading] = useState(true);
    const [filter,setFilter] = useState(0);

    const filters = [
      { name : 'All' , id  : 0},
      { name : 'Film & Animation' , id : 1} ,
      { name : 'Music' , id : 10} ,
      { name : 'News & Politics' , id : 25} ,
      { name : 'Gaming' , id : 20} ,
      { name : 'Science & Technology' , id : 28} ,
      { name : 'Sports' , id : 17} ,
      { name : 'Pets & Animals' , id : 15} ,
      { name : 'Entertainment' , id : 24} ,
      { name : 'Autos & Vehicals' , id : 2} ,
      { name : 'People & Blogs' , id : 22} ,
      { name : 'Comedy' , id : 23} ,
      { name : 'Howto & Style' , id : 26} ,
    ]

    const fetchData = async ()=>{
      try{
        const res = await fetch(`/api/page/${page}`,{
          method : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body : JSON.stringify({filter}),
          next : {revalidate : 300}
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


     const [mapOfChannels,setMapOfChannels] = useState<any>({});
 
     const fun = async () =>{
      let channelIds = [] as any;

      items?.map((item:any,index : any)=>{ channelIds.push(item?.snippet.channelId)});

      const channelsImgRes = await fetch(`/api/channels_for_page`,{
        method : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body : JSON.stringify(channelIds),
        cache :'force-cache'
      });

      
      const channelsImgData = await channelsImgRes.json();
    
      const mapOfChannelst = {} as any;
      
      const channelInfo = channelsImgData.data;

      
        for(let j = 0 ; j < channelInfo?.length ; j++){
          mapOfChannelst[channelInfo[j]?.id] = channelInfo[j]?.snippet?.thumbnails.default?.url;
        }

        setMapOfChannels(mapOfChannelst);
      
    }

    useEffect(()=>{
      if(items?.length > 0) fun();
    },[items]);


     useEffect(()=>{
      setLoading(true);
      fetchData();
     },[filter])

    return <>
    {page == 'popular' && 
    <div className="w-full flex dark:text-white overflow-x-scroll mb-3 mx-1 md:mx-0 snap-x">
      {
        filters?.map((item : any)=>{
          return <div key={item.id} onClick={()=>setFilter(item.id)} className={`${filter === item.id ? 'dark:bg-white bg-black dark:text-black text-white' : 'bg-[rgb(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.14)] dark:bg-[rgba(255,254,254,0.16)] dark:hover:bg-[rgba(255,254,254,0.22)]'}  snap-start transition-colors duration-300 font-semibold text-[0.9rem] cursor-pointer min-w-[max-content] rounded-md px-3 py-[0.3rem] text-center mx-2`}>{item.name}</div>
        })
      }
    </div>
    }
    {
     loading ? <PageSkeleton/> : 
         <motion.div layout transition={{duration : 0.5}} className="flex flex-wrap justify-evenly h-[95vh] overflow-y-scroll pt-5 pb-[10%]" id="mainpage">

          <motion.div layout transition={{duration : 0.5}} className="flex flex-wrap justify-evenly w-full">
           {items?.map((item : any , index : any)=>{
             return <VideoContainer index={index} imgs={imgs} key={index} mapOfChannels={mapOfChannels} isLarge={isLarge} item={item} />
            })}
          </motion.div>
          </motion.div>
}
          </>
}

const VideoContainer = ({item , imgs , index ,isLarge , mapOfChannels}:any)=>{


  const views = CountConverter(item?.statistics?.viewCount);
  const time = DateConverter(item?.snippet?.publishedAt);

    return <>

<motion.div whileHover={{ scale: 1.1, transition: { duration: 0.5 ,delay : 3 }}} layout transition={{duration : 0.5}} className= {`px-0 w-full ${isLarge ? 'md:w-[19rem]' : 'md:w-[21rem]'} items-center mb-7 flex flex-col justify-between`}>

  <Link className={`w-full overflow-hidden relative pt-[56.25%] md:rounded-xl`} href={`/channel/${item?.snippet?.channelId}/video/${item?.id}`}>
    <Image src={item.snippet.thumbnails.medium.url} className="md:rounded-xl !absolute !min-w-0 !min-h-0 !w-full !h-full !top-0 !right-0 !bottom-0 !left-0 dark:bg-[#202324] bg-[#b8b8b8]" layout="fill" alt="video" />
  </Link>

<motion.div layout transition={{duration : 0.5}} className={`flex w-full md:items-start relative items-center px-2 mt-2`}>

    <Link href={`/channel/${item?.snippet?.channelId}`} className="mr-4 min-w-[40px] w-[40px] h-[40px]"> 
    { mapOfChannels[item?.snippet?.channelId] ?
    <Image className="rounded-full h-[40px] dark:bg-[#202324] bg-[#b8b8b8]" layout="responsive" width={40} height={40} src={mapOfChannels[item?.snippet?.channelId]} loading="lazy" alt="channelImg" /> 
    : 
    <ImgSkeleton className="w-[40px] h-[40px] rounded-full"/>
    }
    </Link> 

    <motion.div layout transition={{duration : 0.5}} className="text-sm w-full">
        <Link className="text-black dark:text-white font-semibold text-[15px] mb-[5px] truncate-2" href={`/channel/${item?.snippet?.channelId}/video/${item?.id}`}>{item?.snippet?.title}</Link>
        <motion.div layout transition={{duration : 0.5}} className="flex flex-wrap md:flex-col w-full">
        <Link className="text-grey mr-2 basis-auto shrink truncate-1 hover:text-[#c0bebe]" href={`/channel/${item?.snippet?.channelId}`}> <p>{item?.snippet?.channelTitle}</p></Link>
        <motion.div layout transition={{duration : 0.5}} className="text-grey flex flex-wrap grow truncate-1 whitespace-normal"> <span className="mr-1">{views} Views</span> &bull; <span className="ml-1">{time} ago</span></motion.div>
        </motion.div>
    </motion.div>
</motion.div>
</motion.div> 

  </>
}

export default PageSection;