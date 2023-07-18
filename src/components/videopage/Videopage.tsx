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

export const revalidate = 300;

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
    <div className="h-screen transition-all overflow-y-scroll pb-8">
       <div className="flex w-full flex-col md:flex-row justify-between">
        <VideoSection video={videoDetails} channel={channelDetails} channelId={channelId} comments={commentDetails} loading={loading} id={id}/>
        <SideRow loading={loading} related={related}/>
       </div>
    </div>
    </>)
}

const VideoSection = ({video,channel,comments,loading,id,channelId} : any)=>{

const {status , data : session } = useSession();

const commentsCount = CountConverter(video?.statistics?.commentCount || 0)

    return (<>
<div className=" md:basis-[64%] shrink h-full">

<div className="w-full h-full relative pt-[56.25%] overflow-hidden">

 <iframe allowFullScreen src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`} className='absolute top-0 left-0 bottom-0 right-0 w-full h-full' loading='eager' onPlay={()=>console.log('played')} /> 

</div>

<h3 className="px-1 md:px-0 pt-4  truncate-1 dark:text-white text-[1.2rem] font-semibold w-full">{ loading ?  <Sekelton height={'h-6'} width={'w-[95%] md:w-full'} className="mx-auto  md:mx-0"/> : video?.snippet?.title}</h3>

 {loading ? <VideoInfoSkeleton/> : <VideoInfo status={status} id={id} channelId={channelId} video={video} channel={channel} loading={loading}/>}

 <div className="h-fit-content w-full px-2 md:px-0 mt-4 dark:text-white">

  {loading ? <Sekelton height={'h-24'} className="mb-4"/> : <Description loading={loading} video={video}/>}

   <h4 className='hidden md:block my-1'>{commentsCount} Comments</h4>

{ status == 'authenticated' && 
    <CommentForm img={session?.user?.image}/>
}

 </div>
</div>
    </>)
}

const VideoInfo = ({status ,id , channelId, video,channel,loading} : any)=>{
    const [rate,setRate] = useState<any>(0)
    const [sub,setSub] = useState<any>(0);

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
            if(subscription.length > 0) setSub(1);
            else setSub(0);
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
        setSub(1-sub);
    }

    const likes = CountConverter(video?.statistics?.likeCount || 0);
    const subscribers = CountConverter(channel?.statistics?.subscriberCount || 0);

    return (<>
    <div className="flex flex-col flex-wrap md:flex-row md:items-center px-1 md:px-0 justify-center mt-5 text-[#5a5a5a] w-full">

<div className="justify-between flex w-full min-w-min md:basis-[40%] grow md:max-w-full md:text-md text-xs">

    <div className={`flex items-center w-[70%]`}>
        <Link href={`/channel/${channelId}`} className=" min-w-[45px] min-h-[45px]">
        {
            loading ? 
            <SekeltonImg width={'min-w-[45px]'} height={'min-h-[45px]'} circle/>
            :
            <Image width={45} height={45} alt={'channel'} className='rounded-full dark:bg-[#202324] bg-[#b8b8b8]' src={channel?.snippet?.thumbnails?.default?.url}/>
        }
        </Link>

        <div className="ml-3">
             {loading ? <Sekelton width={'w-full'}/> :<Link href={`/channel/${channelId}`} className="text-lg font-bold text-black dark:text-white truncate-1 w-full overflow-hidden"> {video?.snippet?.channelTitle}</Link>} 
             {loading ? <Sekelton width={'w-full'}/> : <div className="text-sm w-full"> {subscribers} subscribers </div> }
        </div>
    </div>

    <div className="w-min items-center justify-center flex">
        {sub == 1 ? 
         <button onClick={()=>toggleSub()} className='bg-[#cfcfcf57] dark:text-[#959595cd] py-1 px-4 rounded-full text-lg text-black font-semibold hover:opacity-70'>Subscribed</button>
         :
         <button onClick={()=>toggleSub()} className='bg-white py-1 px-4 rounded-full text-lg text-black font-semibold hover:opacity-70'>Subscribe</button>
         }
    </div>
</div>

<div className="dark:text-white max-w-full md:basis-[60%] grow flex text-xs md:text-md overflow-x-scroll md:overflow-x-auto flex-nowrap md:flex-wrap md:px-0 justify-between items-center mt-4 md:mt-0 md:justify-end" id="buttons">
    
    <div className="flex h-10 items-center mr-3 md:mr-1 my-1">

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

    </div>

    <button className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mr-3 md:mr-1 my-1'> <AiOutlineShareAlt className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Share</button>
    <button className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mr-3 md:mr-1 my-1'> <AiOutlineSave className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Save</button>
    <Link href={'#'} className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mr-3 my-1'><AiOutlineDownload className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Download</Link>
    
</div>
</div>
    </>)
}

const VideoInfoSkeleton = ()=>{
    const loading = true;
    return <div className="flex flex-col flex-wrap md:flex-row md:items-center justify-center mt-5 text-[#5a5a5a] w-full">

    <div className="flex md:basis-[40%] grow md:text-md text-xs basis-full mb-2 px-2">
        <div className={`flex items-center ${loading && 'w-1/3'}`}>
            <div className="min-w-[45px] min-h-[45px]">
                <SekeltonImg width={'min-w-[45px]'} height={'min-h-[45px]'} circle/>
            </div>
    
            <div className="ml-2 min-w-full">
                 <Sekelton width={'w-full mb-1'} height={'h-5'}/>  
                 <Sekelton width={'w-full'} height={'h-3'}/> 
            </div>
        </div>
        <div className="ml-auto w-1/2 flex items-center justify-end">
            <Sekelton width={'w-3/4'} height={'h-3/4'} rounded className="!rounded-full max-w-[10rem] "/>
        </div>
    </div>
    
    <div className="dark:text-white w-screen md:w-auto flex text-xs md:text-md overflow-x-scroll md:overflow-x-auto flex-nowrap md:flex-wrap basis-[100%] shrink grow md:basis-[60%] px-1 md:px-0 justify-between mt-4 md:mt-0 md:justify-end" id="buttons">
        
        <div className="flex h-10 items-center mr-3 md:mr-1 mb-4">
    
       <Link href={'#'} className='flex dark:bg-[#6c6c6c57] bg-[#cfcfcf57] pr-2 pl-4 h-full rounded-l-full items-center'>
            <AiOutlineLike className='text-[1.2rem] md:text-[1.5rem]'/>
        <span className='px-3'><Sekelton width={'w-6'}/></span>
        </Link>
    
        <Link  href={'#'} className='flex dark:bg-[#6c6c6c57] bg-[#cfcfcf57] pl-2 pr-4  h-10 rounded-r-full items-center'>
            <AiOutlineDislike className='text-[1.2rem] md:text-[1.5rem]'/>
        </Link>
    
        </div>
    
        <div className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mb-4 mr-3 md:mr-1'> <AiOutlineShareAlt className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Share</div>
        <div className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mb-4 mr-3 md:mr-1'> <AiOutlineSave className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Save</div>
        <div className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mr-3 md:mb-4'><AiOutlineDownload className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Download</div>
        
    </div>
    </div>
}

const Description = ({loading , video} : any)=>{
    const [largeDesc , setLargeDesc] = useState(false);

    const views = CountConverter(video?.statistics?.viewCount || 0);
    const time = DateConverter(video?.snippet?.publishedAt);

    return (<> <motion.div layout transition={{duration : 0.5}} onClick={()=>{if(!largeDesc){setLargeDesc(true)}}} className={`bg-white py-3 px-3 dark:bg-[#212121] ${!largeDesc && 'cursor-pointer'} rounded-lg w-full h-fit-content mb-4`}>
    <div className="flex flex-wrap">
    <span className='mr-2'>{views} views</span>
    <span className='mr-2'>{time} ago</span>
    <div className="dark:text-white opacity-30 truncate-2">
         {
            !loading && video?.snippet?.tags?.map((tag:any , index: any) =>{
                 return  <span key={index} className='mr-1 '>#{tag}</span>
            })
         }
    </div>
    </div>

    <motion.div layout transition={{duration : 0.5}} className={`${!largeDesc ? 'h-0' : 'h-fit'}  overflow-hidden whitespace-normal mt-1`}>
        {video?.snippet?.description}
    </motion.div>
    {largeDesc && 
    <motion.div layout transition={{duration : 0.5}} onClick={()=>setLargeDesc(false)} className="mt-3 text-white hover:opacity-80 cursor-pointer">Show Less</motion.div>
    }

    </motion.div>
 </>)
}


const CommentForm = ({img} : any)=>{

    const [comment,setComment] = useState<any>('');

    return (<>
    
    <form method="post" className="mt-2 hidden md:flex items-start">

    {
    img ? <Image src={img} width={45} height={45} alt={'commentImg'} className='rounded-full' /> :
    <SekeltonImg width={'min-w-[45px]'} height={'min-h-[45px]'} circle/>
    }
    

    <div className="basis-auto w-full ml-6 flex flex-col">

    <input value={comment} onChange={(e)=>setComment(e.target.value)} className='w-full bg-transparent text-lg focus:outline-none focus:border-white transition-colors border-b border-[#5a5a5a]' type="text" name="commenttoadd" id="commenttoadd" placeholder="Write comments..." />

    <div className="btns w-full flex justify-end transition-colors mt-3">
        <button className='mr-4 opacity-90 hover:opacity-100'>Cancel</button>
        <button className={`ml-4 ${comment =='' ? 'bg-[#212121] cursor-not-allowed' : 'bg-[#3ea6ff] hover:bg-[#77bcf8]'} py-[.3rem] px-3 rounded-full dark:text-black`}>Comment</button>
    </div>

    </div>
  </form>
    </>)
}

const Comments = ()=>{
    return (<>
    <div className="comments hidden md:block">

{/* <% for(let i = 0 ; i < comments.length ; i++){ %>

<%  let d1 = new Date(comments[i].snippet.topLevelComment.snippet.publishedAt);%>
<%  let d2 = new Date();%>
<%  let date = Math.abs(d2-d1);%>
<%  let time = 0;%>
<%  date = date/(1000*60); time = Math.trunc(date) +" mins" %>
<%  if(date >= 60){ date = date/60; time = Math.trunc(date) + " hours";%>
<%  if(date >= 24){ date = date/24; time = Math.trunc(date) + " days"%>
<%  if(date >= 31){ date = date/30.4167; time = Math.trunc(date) + " months"%>
<%  if(date >= 12){ date = date/12; time = Math.trunc(date) + " years"}%>
<%  }}}%>

<% let authorImage = comments[i].snippet.topLevelComment.snippet.authorProfileImageUrl %>
<% let authorName =  comments[i].snippet.topLevelComment.snippet.authorDisplayName%>
<% let authorChannel = "/channelpage?c=" + comments[i].snippet.topLevelComment.snippet.authorChannelId.value%>

<% let comment = comments[i].snippet.topLevelComment.snippet.textOriginal%>
<% let likes = comments[i].snippet.topLevelComment.snippet.likeCount%> */}

{/* <div className="commentsection">
  <a href='<%=authorChannel%>'>  <img src="<%=authorImage%>" loading="lazy" /> </a>
    <div className="person-details">
        <a href='<%=authorChannel%>'> <h3>authorName <span>2 hours ago</span></h3> </a>
        <p className="person-comment"> Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quam itaque hic sit.comment</p>

        <div className="comment-actions">
            <img src="./images/like.png" loading="lazy" />
            <span>4k</span>
            <img src="./images/dislike.png" loading="lazy" />
        </div>

    </div>

</div> */}

{/* <%}%> */}

</div>
    </>)
}

const SideRow = ({loading , related}:any)=>{
   return (<>
   <div className="md:basis-[33%] mt-6 md:mt-0 basis-full flex flex-col px-1">
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
    </div>
   </>)
}

const SideVideo = ({item} : any)=>{

const time = DateConverter(item.snippet.publishedAt);

    return (<>
<div className="flex flex-wrap w-full justify-between mb-8 px-3 md:px-0">

<div className="basis-[35%]">
<Link href={`/channel/${item?.snippet?.channelId}/video/${item?.id?.videoId}`} className="flex w-full h-full relative pt-[56.25%] overflow-hidden justify-center items-center"> 
<Image layout='fill' className='dark:bg-[#202324] bg-[#b8b8b8] absolute top-0 right-0 left-0 bottom-0 h-full w-full rounded-md' loading="lazy" alt="." src={item?.snippet?.thumbnails?.default?.url || item?.snippet?.thumbnails?.medium?.url}  /> 
</Link>
</div>

<div className="basis-[64%] pt-1 ">
    <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.id?.videoId}`} className="text-md dark:text-white md:text-lg md:leading-5 mb-1 truncate-2">{item.snippet.title}</Link>
    <p className="text-[#606060] font-medium text-sm"><Link className='hover:text-[#888888]' href={`/channel/${item?.snippet?.channelId}`}>{item?.snippet?.channelTitle}</Link></p>
    <p className="text-[#606060] font-medium text-sm">{time} ago</p>
</div>

</div>
    </>)
}

const SideVideoSkeleton = ()=>{
    return (<>
    <div className="flex w-full justify-between mb-6 px-3 md:px-0">
    <div className="basis-[35%]">
    <div className="w-full h-full relative pt-[56.25%] overflow-hidden"> 
    <SekeltonImg className="rounded-md absolute top-0 right-0 bottom-0 left-0 w-full h-full"/>
    </div>
    </div>

<div className="flex flex-col basis-[64%] shrink-0 pt-1">
    <Sekelton className="mb-1"/>
    <Sekelton className="mb-1"/>
    <Sekelton width={'w-1/2'} height={'h-3'}/>
    <Sekelton width={'w-1/3'} height={'h-3'}/>
</div>

</div>
    </>)
}

export default Videopage;

