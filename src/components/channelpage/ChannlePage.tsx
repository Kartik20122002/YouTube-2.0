import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { AiFillDislike, AiFillLike, AiOutlineArrowRight, AiOutlineDislike, AiOutlineDownload, AiOutlineLike, AiOutlineSave, AiOutlineShareAlt } from 'react-icons/ai';
import Image from 'next/legacy/image';
import { isLargeContext, pageContext } from '@/app/layout';

export const revalidate = 300;

const img = 'https://yt3.googleusercontent.com/ytc/AOPolaQygjiMgnSw5zUP1F_PyEkcGBmfaE8HMq7S_xu_=s176-c-k-c0x00ffffff-no-rj';
const videoImg = 'https://i.ytimg.com/an_webp/ACcHtH2avVs/mqdefault_6s.webp?du=3000&sqp=CJKlxKUG&rs=AOn4CLAGR_IsXYDEk7UYkO2c-KG6YF4dRg'

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
    <div className='overflow-y-scroll h-screen dark:text-white'>
        <ChannelInfo id={channelId}/>
    </div>
    </>)
}

const ChannelInfo = ({id}:any)=>{
    const [sub,setSub] = useState<any>(0);
    const toggleSub = ()=>{
        setSub(1-sub);
    }
    return <>
    <div className="flex flex-wrap h-1/2 md:h-fit md:mt-6">

        <div className="basis-full relative md:min-w-[15rem] h-1/2 md:h-auto md:basis-[15%] md:px-8 ">
            <div className="w-full h-full  md:h-full md:relative md:pb-[100%] overflow-hidden">
            <div className="absolute w-full h-full top-0 md:right-0 md:bottom-0 md:left-0">
            <Image className='md:rounded-full md:!min-h-full md:!h-full !h-[10%]' src={img} layout='fill' alt='channelImg' loading='lazy' />
            </div>
            </div>
        </div>


        <div className="basis-[60%] flex min-w-max pl-3 md:pl-0 flex-col justify-center items-start grow">
            <div className="text-[2rem]">Channel Name</div>
            <div className="mb-2 flex text-[0.9rem]">
                <div className="text-[#979696] mr-3 hover:text-[#c0bebe] font-semibold">@Channel Tag</div>
                <div className="text-[#979696] mr-3">1.12M subcribers</div>
                <div className="text-[#979696] mr-3">80 videos</div>
            </div>
            <Link href={''} className="text-[0.9rem] text-[#979696] hover:text-[#c0bebe] flex items-center">Official YouTube Channel of the Indian Space Research Organisation <AiOutlineArrowRight className='ml-2 font-semibold'/></Link>
        </div>

        <div className="flex items-center justify-end px-6 grow">
        {sub == 1 ? 
         <button onClick={()=>toggleSub()} className='bg-[#cfcfcf57] dark:text-[#959595cd] py-1 px-4 rounded-full text-lg text-black font-semibold hover:opacity-70'>Subscribed</button>
         :
         <button onClick={()=>toggleSub()} className='bg-white py-1 px-4 rounded-full text-lg text-black font-semibold hover:opacity-70'>Subscribe</button>
         }
        </div>
    </div>
    </>
}



export default ChannelPage;

