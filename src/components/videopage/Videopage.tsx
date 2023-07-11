import Link from 'next/link';
import React, { useState } from 'react';
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineDownload, AiOutlineLike, AiOutlineSave, AiOutlineSend, AiOutlineShareAlt } from 'react-icons/ai';
import YouTube from 'react-youtube';
import megan from '@/images/megan.png'
import Image from 'next/legacy/image';

const Videopage = ({id,channelId} : any)=>{ 

    const [rating,setRating] = useState<any>(0)
    const [largeDesc , setLargeDesc] = useState(false);
    const [comment,setComment] = useState<any>('');

    return (<>
    <div className="w-screen h-screen container play-container transition-all overflow-y-scroll pb-8">
       <div className="row flex flex-col md:flex-row justify-between">

        <div className="video-player basis-[64%] shrink h-full">

            <div className="player w-full h-full relative pt-[56.25%] overflow-hidden">

             <iframe src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`} className='absolute top-0 left-0 bottom-0 right-0 w-full h-full' loading='eager' onPlay={()=>console.log('played')} /> 

            </div>
            
            <h3 className="video-title pt-4 truncate-1 dark:text-white text-[1.2rem] font-semibold w-full">Video.snippet.title Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae, recusandae cumque dolorem ullam, ipsum, dolor vitae quod laudantium quae magni accusantium! Corporis repudiandae ducimus voluptate maxime aliquid quae vel odio!</h3>

            <div className="video-info flex flex-col md:flex-row md:items-center justify-center mt-5 text-[#5a5a5a] w-full">

                <div className="flex md:basis-[40%] md:text-md text-xs basis-full mb-2 px-1 md:px-0">
                    <div className="flex items-center">
                        <div className="min-w-[45px] min-h-[45px]">
                        <Image width={45} height={45} className='rounded-full' src={megan}/>
                        </div>

                        <div className="ml-2">
                            <div className="text-lg font-bold text-black dark:text-white"> Take U Forward </div>
                            <div className="text-sm"> 123k subscribers </div>
                        </div>
                    </div>
                    <div className="ml-auto">
                         {/* <button className='bg-[#cfcfcf57] dark:text-white text-black py-2 px-6 rounded-full font-semibold hover:opacity-70'>Subscribed</button> */}
                         <button className='bg-white py-2 px-6 rounded-full font-semibold hover:opacity-70'>Subscribe</button>
                    </div>
                </div>

                <div className=" dark:text-white flex text-xs md:text-md overflow-x-scroll md:overflow-x-auto flex-nowrap md:flex-wrap basis-[100%] md:basis-[60%] px-1 md:px-0 justify-between mt-4 md:mt-0 md:justify-end" id="buttons">
                    
                    <div className="flex h-10 items-center mr-1 mb-4">

                   <Link href={'#'} className='flex dark:bg-[#6c6c6c57] bg-[#cfcfcf57] pr-2 pl-4 h-full rounded-l-full items-center'>
                    {
                        rating == 1 ?
                        <AiFillLike className='text-[1.5rem]'/> : 
                        <AiOutlineLike className='text-[1.5rem]'/> 
                    }
                    <span className='px-3'>5k</span>
                    </Link>

                    <Link  href={'#'} className='flex dark:bg-[#6c6c6c57] bg-[#cfcfcf57] pl-2 pr-4  h-10 rounded-r-full items-center'>
                    {
                        rating == -1 ?
                        <AiFillDislike className='text-[1.5rem]'/> :
                        <AiOutlineDislike className='text-[1.5rem]'/>
                    }
                    </Link>

                    </div>

                    <button className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mb-4 mr-1'> <AiOutlineShareAlt className='mr-2 text-[1.5rem]'/> Share</button>
                    <button className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mb-4 mr-1'> <AiOutlineSave className='mr-2 text-[1.5rem]'/> Save</button>
                    <Link href={'#'} className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] rounded-full px-4 h-10 mb-4'><AiOutlineDownload className='mr-2 text-[1.5rem]'/> Download</Link>
                    
                </div>
            </div>

             <div className="h-fit-content mt-4 dark:text-white">

             <div onClick={()=>{if(!largeDesc){setLargeDesc(true)}}} className={`bg-white py-3 px-3 dark:bg-[#212121] ${!largeDesc && 'cursor-pointer'} md:rounded-lg w-full h-fit-content mb-4`}>
                <div className="flex flex-wrap">
                <span className='mr-2'>69K views</span>
                <span className='mr-2'>1 year ago</span>
                <div className="tag ">
                    <span className='mr-1 dark:text-white opacity-30'>#progamming</span>
                    <span className='mr-1 dark:text-white opacity-30'>#coding</span>
                    <span className='mr-1 dark:text-white opacity-30'>#CodeBeyond</span>
                </div>
                </div>

                <div className={`${!largeDesc && 'truncate-3'} mt-1`}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio dolorum aperiam nemo voluptas eius fugit voluptate obcaecati, quam reprehenderit corrupti pariatur. Reprehenderit ipsa voluptatum excepturi mollitia impedit quam molestiae ipsam similique recusandae, maiores aut, neque nulla quia atque. Quod repellendus sed dolor aliquid optio facilis minus quia vero sit dolorem. Quis illum molestias possimus autem doloremque fugiat quaerat quidem nisi mollitia recusandae vitae non velit cum explicabo eligendi doloribus odit suscipit commodi, et sequi voluptatum labore ipsam minus facilis. Harum corporis saepe est perspiciatis iure deserunt placeat sequi, nihil ducimus accusamus, error ex. Distinctio magnam commodi tempora iste laudantium hic illo voluptate possimus beatae, libero dolore minus vel voluptates id eius consequuntur perspiciatis nam fugiat cumque consectetur soluta numquam quo animi odit! Voluptates voluptas hic ea nostrum ratione consequuntur, exercitationem facilis quam perferendis quis cumque aliquam nulla tempore dolor aperiam ipsam perspiciatis dolore omnis beatae quo dolores ipsum totam. Quis porro praesentium quisquam quod, cupiditate itaque fuga culpa dolorem minima odit veniam cumque magnam laudantium modi tempore consequuntur labore quibusdam eveniet corporis perspiciatis in natus dolore! Voluptate dolores libero ipsa vero, expedita est enim illo incidunt velit, minima ea distinctio eos rerum suscipit blanditiis quos consequuntur, in magnam odio. Laudantium. ipsum dolor sit amet, consectetur adipisicing elit. Placeat, quis quasi pariatur amet quisquam error, fuga voluptatibus aspernatur non voluptatem dolorem nihil nisi mollitia cum voluptatum exercitationem! Obcaecati a magnam exercitationem eligendi tempore nihil quos modi odio voluptates impedit aliquam eius aspernatur sequi amet, sint vero necessitatibus iure facilis sunt. ipsum dolor sit, amet consectetur adipisicing elit. Qui, temporibus officia nihil quis quia, voluptatem expedita libero ullam illum doloremque eos recusandae, odit excepturi doloribus molestiae quas eaque beatae impedit!
                </div>
                {largeDesc && 
                <div onClick={()=>setLargeDesc(false)} className="mt-3 text-white hover:opacity-80 cursor-pointer">Show Less</div>
                }

             </div>
               

              <h4 className='hidden md:block my-1'>135 Comments</h4>

              <form method="post" className="mt-2 flex items-start">
                <Image src={megan} width={45} height={45} className='rounded-full' />

                <div className="basis-auto w-full ml-6 flex flex-col">

                <input value={comment} onChange={(e)=>setComment(e.target.value)} className='w-full bg-transparent text-lg focus:outline-none focus:border-white transition-colors border-b border-[#5a5a5a]' type="text" name="commenttoadd" id="commenttoadd" placeholder="Write comments..." />

                <div className="btns w-full flex justify-end transition-colors mt-3">
                    <button className='mr-4 opacity-90 hover:opacity-100'>Cancel</button>
                    <button className={`ml-4 ${comment =='' ? 'bg-[#212121] cursor-not-allowed' : 'bg-[#3ea6ff] hover:bg-[#77bcf8]'} py-[.3rem] px-3 rounded-full dark:text-black`}>Comment</button>
                </div>

                </div>
              </form>

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

             </div>
        </div>

        <div className="right-sidebar basis-[33%] flex flex-col">
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
          <SideVideo/>
        </div>

       </div>


    </div>
    </>)
}

const SideVideo = ()=>{
    return (<>
<div className="side-video-list flex flex-wrap justify-between mb-2">

<Link href={'#'} className="flex basis-[35%] justify-center items-center "> <Image src={'https://images.pexels.com/photos/16982925/pexels-photo-16982925/free-photo-of-fashion-man-people-woman.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'} width={160} height={90} className='bg-[#5a5a5a] rounded-md' loading="lazy" alt="." /> </Link>

<div className="vid-info basis-[63%] pt-1">
    <Link href={"#"} className="text-sm md:text-lg md:leading-5 mb-1 truncate-2">videoTitle Lorem ipsum dolor sit amet consectetur adipisicing elit. Adipisci ea quibusdam iusto numquam et tenetur illo minus harum voluptate quas!</Link>
    <p className="text-[#606060] font-medium text-sm"><a href="#">channelTitle</a></p>
    <p className="text-[#606060] font-medium text-sm">3 days ago</p>
</div>

</div>
    </>)
}

export default Videopage;

