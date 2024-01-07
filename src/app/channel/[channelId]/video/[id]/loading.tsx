'use client'
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';

import { AiOutlineDislike } from '@react-icons/all-files/ai/AiOutlineDislike';
import { AiOutlineLike } from '@react-icons/all-files/ai/AiOutlineLike';
import { AiOutlineDownload } from '@react-icons/all-files/ai/AiOutlineDownload';

import { useSession } from 'next-auth/react';
import Sekelton from '@/components/global/skeletonComponents/TextSkeleton';
import SekeltonImg from '@/components/global/skeletonComponents/ImgSkeleton';
import { motion } from 'framer-motion'
import { isLargeContext, pageContext, slideContext } from '@/app/layout';



const Videopage = () => {
    const { slide, setslide } = useContext(slideContext) as any;
    const { setpage } = useContext(pageContext) as any;
    const { isLarge, setIsLarge } = useContext(isLargeContext) as any;
  
    setpage(true);
    setslide(-1);
    setIsLarge(false);



    return (<>
            <motion.div layout transition={{ duration: 0.5 }} className="h-screen transition-all relative overflow-y-scroll pb-8">
                <motion.div layout transition={{ duration: 0.5 }} className="flex w-full flex-col md:flex-row justify-between">
                    <VideoSectionSkeleton />
                    <SideRowSkeleton />
                </motion.div>
            </motion.div>
    </>)
}

const VideoSectionSkeleton = () => {

    const { status, data: session } = useSession();

    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className=" md:basis-[64%] shrink md:pb-[5rem] md:h-[89vh] overflow-y-scroll">

            <motion.div layout transition={{ duration: 0.5 }} className="w-full relative pt-[56.25%] overflow-hidden">

                <SekeltonImg width={'w-full'} height={'h-full'} className='absolute top-0 left-0 bottom-0 right-0' />

            </motion.div>

            <motion.h3 className="px-1 md:px-0 pt-4  truncate-1 dark:text-white text-[1.2rem] font-semibold w-full"><Sekelton height={'h-6'} width={'w-[95%] md:w-full'} className="mx-auto  md:mx-0" /></motion.h3>

            <VideoInfoSkeleton />

            <motion.div layout transition={{ duration: 0.5 }} className="h-fit-content w-full px-2 md:px-0 mt-4 dark:text-white">

                <Sekelton height={'h-24'} className="mb-4" /> 

                <Sekelton width="min-w-[20%] max-w-[20%]" className="my-1" />

                {status == 'authenticated' &&
                    <CommentFormSkeleton />
                }

            </motion.div>
        </motion.div>
    </>)
}


const VideoInfoSkeleton = () => {

    const loading = true;
    return <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col flex-wrap md:flex-row md:items-center justify-center mt-5 text-[#5a5a5a] w-full">

        <motion.div layout transition={{ duration: 0.5 }} className="flex md:basis-[40%] grow md:text-md text-xs basis-full mb-2 px-2">
            <motion.div layout transition={{ duration: 0.5 }} className={`flex items-center ${loading && 'w-1/3'}`}>
                <motion.div layout transition={{ duration: 0.5 }} className="min-w-[45px] min-h-[45px]">
                    <SekeltonImg width={'min-w-[45px]'} height={'min-h-[45px]'} circle />
                </motion.div>

                <motion.div layout transition={{ duration: 0.5 }} className="ml-2 min-w-full">
                    <Sekelton width={'w-full mb-1'} height={'h-5'} />
                    <Sekelton width={'w-full'} height={'h-3'} />
                </motion.div>
            </motion.div>
            <motion.div layout transition={{ duration: 0.5 }} className="ml-auto w-1/2 flex items-center justify-end">
                <Sekelton width={'w-3/4'} height={'h-3/4'} rounded className="!rounded-full max-w-[10rem] " />
            </motion.div>
        </motion.div>

        <motion.div layout transition={{ duration: 0.5 }} className="dark:text-white  w-screen md:w-auto flex text-xs md:text-md overflow-x-scroll md:overflow-x-auto flex-nowrap md:flex-wrap basis-[100%] shrink grow md:basis-[60%] px-1 md:px-0 justify-between mt-4 md:mt-0 md:justify-end" id="buttons">

            <motion.div layout transition={{ duration: 0.5 }} className="flex h-10 dark:bg-[#202324] bg-[#b8b8b8] animate-pulse rounded-full items-center mr-3 md:mr-1 mb-4">

                <motion.div layout transition={{ duration: 0.5 }} className='flex pr-2 pl-4 h-10 rounded-l-full items-center'>
                    <AiOutlineLike className='text-[1.2rem] md:text-[1.5rem] text-transparent' />
                    <motion.span layout transition={{ duration: 0.5 }} className='px-3'><motion.div layout transition={{ duration: 0.5 }} className={'w-6'} /></motion.span>
                </motion.div>

                <motion.div layout transition={{ duration: 0.5 }} className='flex pl-2 pr-4 h-10 rounded-r-full items-center'>
                    <AiOutlineDislike className='text-[1.2rem] text-transparent md:text-[1.5rem]' />
                </motion.div>

            </motion.div>

            <motion.div className='cursor-default dark:bg-[#202324] bg-[#b8b8b8] animate-pulse flex items-center  text-transparent  text-xs md:text-md  rounded-full px-4 h-10 mr-3 mb-4'>
                <AiOutlineDownload className='mr-2 text-[1.2rem] md:text-[1.5rem]' /> Download
            </motion.div>


        </motion.div>
    </motion.div>
}

const DescriptionSkeleton = () => {
    const [largeDesc] = useState(false);

    return  <motion.div layout transition={{ duration: 0.5 }}  className={`py-3 px-3 dark:bg-[#6c6c6c57] bg-[#cfcfcf57] ${!largeDesc && 'cursor-pointer'} rounded-lg w-full h-fit-content mb-4`}/>
}

const CommentFormSkeleton = () => {
    const [comment, setComment] = useState<any>('');

    return (<>

        <motion.form className="mt-4 hidden md:flex items-start">

            <SekeltonImg width={'min-w-[45px]'} height={'min-h-[45px]'} circle />

            <motion.div layout transition={{ duration: 0.5 }} className="basis-auto w-full ml-6 flex flex-col">

                <motion.input value={comment} autoComplete='off' onChange={(e) => setComment(e.target.value)} className='w-full bg-transparent text-lg focus:outline-none focus:dark:border-white focus:border-black transition-colors border-b border-[#5a5a5a]' type="text" name="commenttoadd" id="commenttoadd" placeholder="Write comments..." />

                <motion.div layout transition={{ duration: 0.5 }} className="btns w-full flex justify-end transition-colors mt-3">
                    <motion.button layout transition={{ duration: 0.5 }} onClick={() => setComment('')} type='reset' className='mr-4 opacity-90 hover:opacity-100'>Cancel</motion.button>
                    <motion.button disabled={true} layout transition={{ duration: 0.5 }} type='submit' className={`ml-4 dark:bg-[#212121] bg-grey cursor-not-allowed py-[.3rem] px-3 rounded-full dark:text-black`}>Comment</motion.button>
                </motion.div>

            </motion.div>
        </motion.form>
    </>)
}



const SideRowSkeleton = () => {
    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className="md:basis-[33%] mt-6 md:mt-0 basis-full h-[89vh] overflow-y-scroll flex flex-col px-1">
            
        {Array.from({ length: 10 }, (_, index) => {
                    return <SideVideoSkeleton key={index} />;
        })}
                
        </motion.div>
    </>)
}



const SideVideoSkeleton = () => {
    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className="flex w-full justify-between mb-6 px-3 md:px-0">

            <motion.div layout transition={{ duration: 0.5 }} className="basis-[35%]">
                <motion.div layout transition={{ duration: 0.5 }} className="w-full h-full relative pt-[56.25%] overflow-hidden">
                    <SekeltonImg className="rounded-md absolute top-0 right-0 bottom-0 left-0 w-full h-full" />
                </motion.div>
            </motion.div>

            <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col basis-[64%] shrink-0 pt-1">
                <Sekelton className="mb-1" />
                <Sekelton className="mb-1" />
                <Sekelton width={'w-1/2'} height={'h-3'} />
                <Sekelton width={'w-1/3'} height={'h-3'} />
            </motion.div>

        </motion.div>
    </>)
}





export default Videopage;
