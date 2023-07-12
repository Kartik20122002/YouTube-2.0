import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineDownload, AiOutlineLike, AiOutlineSave, AiOutlineSend, AiOutlineShareAlt } from 'react-icons/ai';
import megan from '@/images/megan.png'
import Image from 'next/legacy/image';
import { useSession } from 'next-auth/react';
import Sekelton from '../global/skeletonComponents/TextSkeleton';
import SekeltonImg from '../global/skeletonComponents/ImgSkeleton';
import {motion} from 'framer-motion'

const Videopage = ({id,channelId} : any)=>{ 

    const [videoDetails , setVideoDetails] = useState<any>({});
    const [channelDetails , setChannelDetails] = useState<any>({});
    const [commentDetails,setComments] = useState<any>([]);
    const [related,setRelated] = useState<any>([]);
    const [loading , setLoading] = useState(true);

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
                const {video,channel,comments,related} = await res.json();
                setVideoDetails(video);
                setChannelDetails(channel);
                setComments(comments);
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
       console.log('reunned')
    },[])

    return (<>
    <div className="h-screen transition-all overflow-y-scroll pb-8">
       <div className="flex w-full flex-col md:flex-row justify-between">

        {videoDetails && channelDetails && commentDetails &&
        <VideoSection video={videoDetails} channel={channelDetails} comments={commentDetails} loading={loading} id={id}/>
        }
    
        { related && <SideRow related={related}/>}

        

       </div>


    </div>
    </>)
}

const VideoSection = ({video,channel,comments,loading,id} : any)=>{

const {status , data : session } = useSession();

const commentsCount = converter(video?.statistics?.commentCount || 0)

    return (<>
<div className=" md:basis-[64%] shrink h-full">

<div className="w-full h-full relative pt-[56.25%] overflow-hidden">

 <iframe allowFullScreen src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`} className='absolute top-0 left-0 bottom-0 right-0 w-full h-full' loading='eager' onPlay={()=>console.log('played')} /> 

</div>

<h3 className="video-title pt-4 truncate-1 dark:text-white text-[1.2rem] font-semibold w-full">{ loading ?  <Sekelton className="w-full"/> : video?.snippet?.title}</h3>

   <VideoInfo video={video} channel={channel} loading={loading}/>

 <div className="h-fit-content w-full px-2 md:px-0 mt-4 dark:text-white">

   <Descrption loading={loading} video={video}/>

   <h4 className='hidden md:block my-1'>{commentsCount} Comments</h4>

{ status == 'authenticated' && 
    <CommentForm img={session?.user?.image}/>
}

 </div>
</div>
    </>)
}

const VideoInfo = ({video,channel,loading} : any)=>{
    const [rating,setRating] = useState<any>(0)

    const likes = converter(video?.statistics?.likeCount || 0);
    const subscribers = converter(channel?.statistics?.subscriberCount || 0);

    return (<>
    <div className="flex flex-col flex-wrap md:flex-row md:items-center justify-center mt-5 text-[#5a5a5a] w-full">

<div className="flex md:basis-[40%] grow md:text-md text-xs basis-full mb-2 px-2 md:px-0">
    <div className={`flex items-center ${loading && 'w-1/3'}`}>
        <div className="min-w-[45px] min-h-[45px]">
        {
            loading ? 
            <SekeltonImg width={'min-w-[45px]'} height={'min-h-[45px]'} circle/>
            :
            <Image width={45} height={45} className='rounded-full' src={channel?.snippet?.thumbnails?.default?.url}/>
        }
        </div>

        <div className="ml-2 min-w-full">
             {loading ? <Sekelton width={'w-full'}/> :<div className="text-lg font-bold text-black dark:text-white truncate-1 w-full"> {video?.snippet?.channelTitle}</div>} 
             {loading ? <Sekelton width={'w-full'}/> : <div className="text-sm w-full"> {subscribers} subscribers </div> }
        </div>
    </div>
    <div className="ml-auto">
         {/* <button className='bg-[#cfcfcf57] dark:text-white text-black py-2 px-6 rounded-full font-semibold hover:opacity-70'>Subscribed</button> */}
         <button className='bg-white py-1 ml-3 px-4 rounded-full text-lg text-black font-semibold hover:opacity-70'>Subscribe</button>
    </div>
</div>

<div className="dark:text-white w-screen md:w-auto flex text-xs md:text-md overflow-x-scroll md:overflow-x-auto flex-nowrap md:flex-wrap basis-[100%] shrink grow md:basis-[60%] px-1 md:px-0 justify-between mt-4 md:mt-0 md:justify-end" id="buttons">
    
    <div className="flex h-10 items-center mr-3 md:mr-1 mb-4">

   <Link href={'#'} className='flex dark:bg-[#6c6c6c57] bg-[#cfcfcf57] pr-2 pl-4 h-full rounded-l-full items-center'>
    {
        rating == 1 ?
        <AiFillLike className='text-[1.2rem] md:text-[1.5rem]'/> : 
        <AiOutlineLike className='text-[1.2rem] md:text-[1.5rem]'/> 
    }
    <span className='px-3'>{likes}</span>
    </Link>

    <Link  href={'#'} className='flex dark:bg-[#6c6c6c57] bg-[#cfcfcf57] pl-2 pr-4  h-10 rounded-r-full items-center'>
    {
        rating == -1 ?
        <AiFillDislike className='text-[1.2rem] md:text-[1.5rem]'/> :
        <AiOutlineDislike className='text-[1.2rem] md:text-[1.5rem]'/>
    }
    </Link>

    </div>

    <button className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mb-4 mr-3 md:mr-1'> <AiOutlineShareAlt className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Share</button>
    <button className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mb-4 mr-3 md:mr-1'> <AiOutlineSave className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Save</button>
    <Link href={'#'} className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mr-3 md:mb-4'><AiOutlineDownload className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Download</Link>
    
</div>
</div>
    </>)
}

const Descrption = ({loading , video} : any)=>{
    const [largeDesc , setLargeDesc] = useState(false);

    const views = converter(video?.statistics?.viewCount || 0);

    let d1 = new Date(video?.snippet?.publishedAt) as any;
    let d2 = new Date() as any;
    let date = Math.abs(d2-d1) as any;
    date = date/(1000*60);
    let time = Math.trunc(date) + " mins" 
    if(date >= 60){ date = date/60; time = Math.trunc(date) + " hours";
    if(date >= 24){ date = date/24; time = Math.trunc(date) + " days";
    if(date >= 31){ date = date/30.4167; time = Math.trunc(date) + " months";
    if(date >= 12){ date = date/12; time = Math.trunc(date) + " years";
    }}}}


    return (<> <motion.div layout transition={{duration : 0.5}} onClick={()=>{if(!largeDesc){setLargeDesc(true)}}} className={`bg-white py-3 px-3 dark:bg-[#212121] ${!largeDesc && 'cursor-pointer'} rounded-lg w-full h-fit-content mb-4`}>
    <div className="flex flex-wrap">
    <span className='mr-2'>{views} views</span>
    <span className='mr-2'>{time} ago</span>
    <div className="tag">
         {
            !loading && video?.snippet.tags.map((tag:any , index: any) =>{
                 return  <span key={index} className='mr-1 dark:text-white opacity-30'>#{tag}</span>
            })
         }
    </div>
    </div>

    <motion.div layout transition={{duration : 0.5}} className={`${!largeDesc ? 'h-0' : 'h-fit'}  overflow-hidden  mt-1`}>
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
    
    <form method="post" className="mt-2 flex items-start">
    
    <Image src={img} width={45} height={45} className='rounded-full' />

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

const SideRow = ({related}:any)=>{
   return (<>
   <div className="md:basis-[33%] flex flex-col">
    {
        related.map((item : any , index : any)=>{
           return <SideVideo key={index} item={item} />
        })
    }
    </div>
   </>)
}

const SideVideo = ({item} : any)=>{

    let d1 = new Date(item.snippet.publishedAt) as any;
    let d2 = new Date() as any;
    let date = Math.abs(d2-d1) as any;
    date = date/(1000*60);
    let time = Math.trunc(date) + " mins" 
    if(date >= 60){ date = date/60; time = Math.trunc(date) + " hours";
    if(date >= 24){ date = date/24; time = Math.trunc(date) + " days";
    if(date >= 31){ date = date/30.4167; time = Math.trunc(date) + " months";
    if(date >= 12){ date = date/12; time = Math.trunc(date) + " years";
    }}}}

    return (<>
<div className="side-video-list flex flex-wrap justify-between mb-6">

<Link href={`/channel/${item?.snippet?.channelId}/video/${item?.id?.videoId}`} className="flex basis-[35%] justify-center items-center  "> <Image src={item?.snippet?.thumbnails?.default?.url || item?.snippet?.thumbnails?.medium?.url} width={160} height={90} className='bg-[#5a5a5a] rounded-md' loading="lazy" alt="." /> </Link>

<div className="vid-info basis-[64%] pt-1">
    <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.id?.videoId}`} className="text-md dark:text-white md:text-lg md:leading-5 mb-1 truncate-2">{item.snippet.title}</Link>
    <p className="text-[#606060] font-medium text-sm"><Link href="#">{item?.snippet?.channelTitle}</Link></p>
    <p className="text-[#606060] font-medium text-sm">{time} ago</p>
</div>

</div>
    </>)
}

export default Videopage;

const converter = (val : any)=>{
    let str = val + '' as string;
  if(val >= 1000){val = val/1000; str = Math.trunc(val) + 'K'}
  if(val >= 1000){val = val/1000; str = Math.trunc(val) + 'M'}
  if(val >= 1000){val = val/1000; str = Math.trunc(val) + 'B'}
  return str;
}