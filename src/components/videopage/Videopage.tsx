import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineDownload, AiOutlineLike, AiOutlineSave, AiOutlineShareAlt } from 'react-icons/ai';
import Image from 'next/legacy/image';
import { useSession } from 'next-auth/react';
import Sekelton from '../global/skeletonComponents/TextSkeleton';
import SekeltonImg from '../global/skeletonComponents/ImgSkeleton';
import {motion} from 'framer-motion'
import {DateConverter} from "@/utils/Functions/Converters/DateConverter";
import {CountConverter} from "@/utils/Functions/Converters/CountConverter";
import { isLargeContext, pageContext } from '@/app/layout';
import parse from 'html-react-parser'

export const revalidate = 300;
const img = 'https://yt3.googleusercontent.com/ytc/AOPolaQygjiMgnSw5zUP1F_PyEkcGBmfaE8HMq7S_xu_=s176-c-k-c0x00ffffff-no-rj';
const Videopage = ({id,channelId} : any)=>{ 

    const [videoDetails , setVideoDetails] = useState<any>({});
    const [channelDetails , setChannelDetails] = useState<any>({});
    const [commentDetails,setComments] = useState<any>([]);
    const [related,setRelated] = useState<any>([]);
    const [loading , setLoading] = useState(true);
    const {setpage} = useContext(pageContext) as any;
    const {isLarge , setIsLarge} = useContext(isLargeContext) as any;
    setpage(true);
    
    const getDetails = async ()=>{
        try{
            const res = await fetch(`/api/video/${id}`,{
                method : 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body : JSON.stringify({id,channelId}),
                next : {revalidate : 300}
              })
            
            if(res.status != 404 && res.status != 500){
                const {video,channel,related} = await res.json();
                setVideoDetails(video);
                setChannelDetails(channel);
                setRelated(related);
                setLoading(false);
            }
        }
        catch(err){
            console.log(err);
        }
    }
    
    useEffect(()=>{
       getDetails();
       setIsLarge(false);
    },[])

    return (<>
    <motion.div layout transition={{duration : 0.5}} className="h-screen transition-all overflow-y-scroll pb-8">
       <motion.div layout transition={{duration : 0.5}} className="flex w-full flex-col md:flex-row justify-between">
        <VideoSection video={videoDetails} channel={channelDetails} channelId={channelId} comments={commentDetails} loading={loading} id={id}/>
        <SideRow loading={loading} related={related}/>
       </motion.div>
    </motion.div>
    </>)
}

const VideoSection = ({video,channel,comments,loading,id,channelId} : any)=>{

const {status , data : session } = useSession();

const commentsCount = CountConverter(video?.statistics?.commentCount || 0)

    return (<>
<motion.div layout transition={{duration : 0.5}} className=" md:basis-[64%] shrink md:pb-[5rem] md:h-[89vh] overflow-y-scroll">

<motion.div layout transition={{duration : 0.5}} className="w-full relative pt-[56.25%] overflow-hidden">

 <iframe allowFullScreen src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`} className='absolute top-0 left-0 bottom-0 right-0 w-full h-full' loading='eager' onPlay={()=>console.log('played')} /> 

</motion.div>

<motion.h3 className="px-1 md:px-0 pt-4  truncate-1 dark:text-white text-[1.2rem] font-semibold w-full">{ loading ?  <Sekelton height={'h-6'} width={'w-[95%] md:w-full'} className="mx-auto  md:mx-0"/> : video?.snippet?.title}</motion.h3>

 {loading ? <VideoInfoSkeleton/> : <VideoInfo status={status} id={id} channelId={channelId} video={video} channel={channel} loading={loading}/>}

 <motion.div layout transition={{duration : 0.5}} className="h-fit-content w-full px-2 md:px-0 mt-4 dark:text-white">

  {loading ? <Sekelton height={'h-24'} className="mb-4"/> : <Description loading={loading} video={video}/>}

   {loading ? <Sekelton width="min-w-[20%] max-w-[20%]" className="my-1"/> : <motion.h4 className='hidden md:block my-1'>{commentsCount} Comments</motion.h4>}

{ status == 'authenticated' && 
    <CommentForm img={session?.user?.image}/>
}

<Comments id={id} />

 </motion.div>
</motion.div>
    </>)
}

const VideoInfo = ({status ,id , channelId, video,channel,loading} : any)=>{
    const [rate,setRate] = useState<any>(0)
    const [sub,setSub] = useState<any>(false);

const getAuthDetails = async ()=>{
    try{
        const res = await fetch(`/api/video/auth/${id}`,{
            method : 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body : JSON.stringify({id,channelId}),
            next : {revalidate : 300}
          })
        
        if(res.status != 404 && res.status != 500){
            const {rating,subscription} = await res.json();
            if(rating[0].rating == 'none') setRate(0);
            if(rating[0].rating == 'like') setRate(1);
            if(rating[0].rating == 'dislike') setRate(-1);
            if(subscription.length > 0) setSub(true);
        }
    }
    catch(err){
        console.log(err);
    }
}

useEffect(()=>{
    if(status=='authenticated'){
       getAuthDetails();
    }
},[status])

    const toggleSub = ()=>{
        setSub(!sub);
    }

    const likes = CountConverter(video?.statistics?.likeCount || 0);
    const subscribers = CountConverter(channel?.statistics?.subscriberCount || 0);

    return (<>
    <motion.div layout transition={{duration : 0.5}} className="flex flex-col flex-wrap md:flex-row md:items-center px-1 md:px-0 justify-center mt-5 text-[#5a5a5a] w-full">
 
<motion.div layout transition={{duration : 0.5}} className="justify-between flex w-full min-w-min md:basis-[40%] grow md:max-w-full md:text-md text-xs">

    <motion.div layout transition={{duration : 0.5}} className={`flex items-center w-[70%]`}>
        <Link href={`/channel/${channelId}`} className=" min-w-[45px] min-h-[45px]">
        {
            loading ? 
            <SekeltonImg width={'min-w-[45px]'} height={'min-h-[45px]'} circle/>
            :
            <Image width={45} height={45} alt={'channel'} className='rounded-full dark:bg-[#202324] bg-[#b8b8b8]' src={channel?.snippet?.thumbnails?.default?.url}/>
        }
        </Link>

        <motion.div layout transition={{duration : 0.5}} className="ml-3">
             {loading ? <Sekelton width={'w-full'}/> :<Link href={`/channel/${channelId}`} className="text-lg font-bold text-black dark:text-white truncate-1 w-full overflow-hidden"> {video?.snippet?.channelTitle}</Link>} 
             {loading ? <Sekelton width={'w-full'}/> : <motion.div layout transition={{duration : 0.5}} className="text-sm w-full"> {subscribers} subscribers </motion.div> }
        </motion.div>
    </motion.div>

    <motion.div layout transition={{duration : 0.5}} className="w-min items-center justify-center flex">
        {sub == true ? 
         <motion.button onClick={()=>toggleSub()} className='bg-[#cfcfcf57] dark:text-[#959595cd] py-1 px-4 rounded-full text-lg text-black font-semibold hover:opacity-70'>Subscribed</motion.button>
         :
         <motion.button onClick={()=>toggleSub()} className='bg-white py-1 px-4 rounded-full text-lg text-black font-semibold hover:opacity-70'>Subscribe</motion.button>
         }
    </motion.div>
</motion.div>

<motion.div layout transition={{duration : 0.5}} className="dark:text-white max-w-full md:basis-[60%] grow flex text-xs md:text-md overflow-x-scroll md:overflow-x-auto flex-nowrap md:flex-wrap md:px-0 justify-between items-center mt-4 md:mt-0 md:justify-end" id="buttons">
    
    <motion.div layout transition={{duration : 0.5}} className="flex h-10 items-center mr-3 md:mr-1 my-1">

   <Link href={'#'} className='flex dark:bg-[#6c6c6c57] bg-[#cfcfcf57] pr-2 pl-4 h-full rounded-l-full items-center'>
    {
        rate == 1 ?
        <AiFillLike className='text-[1.2rem] md:text-[1.5rem]'/> : 
        <AiOutlineLike className='text-[1.2rem] md:text-[1.5rem]'/> 
    }
    <span className='px-3'>{likes}</span>
    </Link>

    <Link  href={'#'} className='flex dark:bg-[#6c6c6c57] bg-[#cfcfcf57] pl-2 pr-4  h-10 rounded-r-full items-center'>
    {
        rate == -1 ?
        <AiFillDislike className='text-[1.2rem] md:text-[1.5rem]'/> :
        <AiOutlineDislike className='text-[1.2rem] md:text-[1.5rem]'/>
    }
    </Link>

    </motion.div>

    <motion.button className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mr-3 md:mr-1 my-1'> <AiOutlineShareAlt className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Share</motion.button>
    <motion.button className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mr-3 md:mr-1 my-1'> <AiOutlineSave className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Save</motion.button>
    <Link href={'#'} className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mr-3 my-1'><AiOutlineDownload className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Download</Link>
    
</motion.div>
</motion.div>
    </>)
}

const VideoInfoSkeleton = ()=>{
    const loading = true;
    return <motion.div layout transition={{duration : 0.5}} className="flex flex-col flex-wrap md:flex-row md:items-center justify-center mt-5 text-[#5a5a5a] w-full">

    <motion.div layout transition={{duration : 0.5}} className="flex md:basis-[40%] grow md:text-md text-xs basis-full mb-2 px-2">
        <motion.div layout transition={{duration : 0.5}} className={`flex items-center ${loading && 'w-1/3'}`}>
            <motion.div layout transition={{duration : 0.5}} className="min-w-[45px] min-h-[45px]">
                <SekeltonImg width={'min-w-[45px]'} height={'min-h-[45px]'} circle/>
            </motion.div>
    
            <motion.div layout transition={{duration : 0.5}} className="ml-2 min-w-full">
                 <Sekelton width={'w-full mb-1'} height={'h-5'}/>  
                 <Sekelton width={'w-full'} height={'h-3'}/> 
            </motion.div>
        </motion.div>
        <motion.div layout transition={{duration : 0.5}} className="ml-auto w-1/2 flex items-center justify-end">
            <Sekelton width={'w-3/4'} height={'h-3/4'} rounded className="!rounded-full max-w-[10rem] "/>
        </motion.div>
    </motion.div>
    
    <motion.div layout transition={{duration : 0.5}} className="dark:text-white w-screen md:w-auto flex text-xs md:text-md overflow-x-scroll md:overflow-x-auto flex-nowrap md:flex-wrap basis-[100%] shrink grow md:basis-[60%] px-1 md:px-0 justify-between mt-4 md:mt-0 md:justify-end" id="buttons">
        
        <motion.div layout transition={{duration : 0.5}} className="flex h-10 items-center mr-3 md:mr-1 mb-4">
    
       <Link href={'#'} className='flex dark:bg-[#6c6c6c57] bg-[#cfcfcf57] pr-2 pl-4 h-full rounded-l-full items-center'>
            <AiOutlineLike className='text-[1.2rem] md:text-[1.5rem]'/>
        <motion.span className='px-3'><Sekelton width={'w-6'}/></motion.span>
        </Link>
    
        <Link  href={'#'} className='flex dark:bg-[#6c6c6c57] bg-[#cfcfcf57] pl-2 pr-4  h-10 rounded-r-full items-center'>
            <AiOutlineDislike className='text-[1.2rem] md:text-[1.5rem]'/>
        </Link>
    
        </motion.div>
    
        <motion.div layout transition={{duration : 0.5}} className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mb-4 mr-3 md:mr-1'> <AiOutlineShareAlt className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Share</motion.div>
        <motion.div layout transition={{duration : 0.5}} className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mb-4 mr-3 md:mr-1'> <AiOutlineSave className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Save</motion.div>
        <motion.div layout transition={{duration : 0.5}} className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mr-3 md:mb-4'><AiOutlineDownload className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Download</motion.div>
        
    </motion.div>
    </motion.div>
}

const Description = ({loading , video} : any)=>{
    const [largeDesc , setLargeDesc] = useState(false);

    return (<> <motion.div layout transition={{duration : 0.5}} onClick={()=>{if(!largeDesc){setLargeDesc(true)}}} className={`bg-white py-3 px-3 dark:bg-[#212121] ${!largeDesc && 'cursor-pointer'} rounded-lg w-full h-fit-content mb-4`}>
    <motion.div layout transition={{duration : 0.5}} className="flex flex-wrap">
    <motion.span layout transition={{duration : 0.5}}className='mr-2 text-sm'>{CountConverter(video?.statistics?.viewCount)} views</motion.span>
    <motion.span layout transition={{duration : 0.5}} className='mr-2 text-sm'>{DateConverter(video?.snippet?.publishedAt)} ago</motion.span>
    <motion.div layout transition={{duration : 0.5}} className="dark:text-white opacity-30 truncate-2">
         {
            !loading && video?.snippet?.tags?.map((tag:any , index: any) =>{
                 return  <motion.span key={index} className='mr-1 '>#{tag}</motion.span>
            })
         }
    </motion.div>
    </motion.div>

    <motion.div onClick={()=>setLargeDesc(!largeDesc)} layout transition={{duration : 0.5}} className={`${!largeDesc ? 'h-1' : 'h-fit'} hidden md:block overflow-hidden mt-1`}>
        {parse(video?.snippet?.description)}
    </motion.div>
    {/* {largeDesc && 
    <motion.div layout transition={{duration : 0.5}} onClick={()=>setLargeDesc(false)} className="mt-3 text-white hover:opacity-80 cursor-pointer">Show Less</motion.div>
    } */}

    </motion.div>
 </>)
}


const CommentForm = ({img} : any)=>{

    const [comment,setComment] = useState<any>('');

    return (<>
    
    <motion.form method="post" className="mt-4 hidden md:flex items-start">

    {
    img ? <Image src={img} width={45} height={45} alt={'commentImg'} className='rounded-full' /> :
    <SekeltonImg width={'min-w-[45px]'} height={'min-h-[45px]'} circle/>
    }
    

    <motion.div layout transition={{duration : 0.5}} className="basis-auto w-full ml-6 flex flex-col">

    <motion.input value={comment} onChange={(e)=>setComment(e.target.value)} className='w-full bg-transparent text-lg focus:outline-none focus:border-white transition-colors border-b border-[#5a5a5a]' type="text" name="commenttoadd" id="commenttoadd" placeholder="Write comments..." />

    <motion.div layout transition={{duration : 0.5}} className="btns w-full flex justify-end transition-colors mt-3">
        <motion.button className='mr-4 opacity-90 hover:opacity-100'>Cancel</motion.button>
        <motion.button className={`ml-4 ${comment =='' ? 'bg-[#212121] cursor-not-allowed' : 'bg-[#3ea6ff] hover:bg-[#77bcf8]'} py-[.3rem] px-3 rounded-full dark:text-black`}>Comment</motion.button>
    </motion.div>

    </motion.div>
  </motion.form>
    </>)
}

const Comments = ({id}:any)=>{

    const [comments,setComments] = useState([]);
    const [loading,setLoading] = useState(true);

    const getDetails = async ()=>{
        try{
            const res = await fetch(`/api/video/${id}/comments`,{
                method : 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body : JSON.stringify({id}),
                next : {revalidate : 300}
              })
            
            if(res.status != 404 && res.status != 500){
                const {data} = await res.json();
                setComments(data);
                setLoading(false);
            }
        }
        catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        getDetails();
    },[]);

    return (<>
    <motion.div layout transition={{duration : 0.5}} className="hidden md:block pb-2">
     {
     loading ? <></> : 
     comments?.map((item : any , index : any)=>{
        return <Comment key={index} item={item} />
     })
     }
</motion.div>
    </>)
}

const Comment = ({item}:any)=>{
    const [readmore , setReadmore] = useState(false);
    
    return <div className="flex mt-6 justify-between">
    <div className="basis-[5%] flex justify-center items-start">
        <Link href={`/channel/${item?.snippet?.topLevelComment?.snippet?.authorChannelId?.value}`} className="w-[45px] h-[45px] rounded-full">
            <Image width={45} height={45} src={item?.snippet?.topLevelComment?.snippet?.authorProfileImageUrl} className='rounded-full' loading='lazy' alt='commentImg' />
        </Link>
    </div>

    <div className="basis-[95%] grow ml-3 flex flex-col">
        <div className="flex text-[0.85rem] font-semibold"> <Link href={`/channel/${item?.snippet?.topLevelComment?.snippet?.authorChannelId?.value}`}>{item?.snippet?.topLevelComment?.snippet?.authorDisplayName}</Link> <span className='ml-3 font-[500] text-[#959595cd] text-'>{DateConverter(item?.snippet?.topLevelComment?.snippet?.updatedAt)} ago</span></div>

        <div onClick={()=>{setReadmore(!readmore)}} className={`text-[0.95rem] ${!readmore && 'truncate-5'} mt-1 font-[500]`}>{parse(item?.snippet?.topLevelComment?.snippet?.textDisplay)}</div>

        <div className="flex items-center mt-3">
            <AiOutlineLike className='text-[1.5rem] mr-2'/>
            <span className='text-[0.9rem]'>{CountConverter(item?.snippet?.topLevelComment?.snippet?.likeCount)}</span>
            <AiOutlineDislike className='text-[1.5rem] ml-2' />
        </div>
    </div>
   </div>
}

const SideRow = ({loading , related}:any)=>{
   return (<>
   <motion.div layout transition={{duration : 0.5}} className="md:basis-[33%] mt-6 md:mt-0 basis-full h-[89vh] overflow-y-scroll flex flex-col px-1">
    {
        loading ? <>
          <SideVideoSkeleton/>
          <SideVideoSkeleton/>
          <SideVideoSkeleton/>
          <SideVideoSkeleton/>
          <SideVideoSkeleton/>
          <SideVideoSkeleton/>
          <SideVideoSkeleton/>
          <SideVideoSkeleton/>
        </> :
        related?.map((item : any , index : any)=>{
           return <SideVideo key={index} item={item} />
        })
    }
    </motion.div>
   </>)
}

const SideVideo = ({item} : any)=>{

    return (<>
<motion.div layout transition={{duration : 0.5}} className=" flex flex-wrap w-fulljustify-between mb-3 px-3 md:px-0">

<motion.div layout transition={{duration : 0.5}} className="basis-[35%] mr-2 h-full">

<Link href={`/channel/${item?.snippet?.channelId}/video/${item?.id?.videoId}`} className="flex w-full h-full relative pt-[56.25%] overflow-hidden justify-center items-center"> 
<Image layout='fill' className='dark:bg-[#202324] bg-[#b8b8b8] absolute top-0 right-0 left-0 bottom-0 h-full w-full rounded-md' loading="lazy" alt="." src={item?.snippet?.thumbnails?.medium?.url || item?.snippet?.thumbnails?.default?.url}  /> 
</Link>
</motion.div>

<motion.div layout transition={{duration : 0.5}} className="basis-[60%] pt-1 overflow-hidden ">
    <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.id?.videoId}`} className="text-md w-full dark:text-white md:text-lg md:leading-5 mb-1 truncate-2">{item.snippet.title}</Link>
    <div className="flex flex-wrap">
    <p className="text-[#606060] font-medium text-sm"><Link className='hover:text-[#888888] mr-1' href={`/channel/${item?.snippet?.channelId}`}>{item?.snippet?.channelTitle} &bull;</Link></p>
    <p className="text-[#606060] font-medium text-sm ">{DateConverter(item.snippet.publishedAt)} ago</p>
    </div>
</motion.div>

</motion.div>
    </>)
}

const SideVideoSkeleton = ()=>{
    return (<>
    <motion.div layout transition={{duration : 0.5}} className="flex w-full justify-between mb-6 px-3 md:px-0">
    <motion.div layout transition={{duration : 0.5}} className="basis-[35%]">
    <motion.div layout transition={{duration : 0.5}} className="w-full h-full relative pt-[56.25%] overflow-hidden"> 
    <SekeltonImg className="rounded-md absolute top-0 right-0 bottom-0 left-0 w-full h-full"/>
    </motion.div>
    </motion.div>

<motion.div layout transition={{duration : 0.5}} className="flex flex-col basis-[64%] shrink-0 pt-1">
    <Sekelton className="mb-1"/>
    <Sekelton className="mb-1"/>
    <Sekelton width={'w-1/2'} height={'h-3'}/>
    <Sekelton width={'w-1/3'} height={'h-3'}/>
</motion.div>

</motion.div>
    </>)
}

export default Videopage;

