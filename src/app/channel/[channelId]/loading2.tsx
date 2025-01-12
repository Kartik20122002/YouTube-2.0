'use client'
import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { isLargeContext } from '@/app/layout';
import SekeltonImg from '@/components/global/skeletonComponents/ImgSkeleton';
import SekeltonText from '@/components/global/skeletonComponents/TextSkeleton';

const ChannelPageSkeleton = () => {

    return <motion.div layout transition={{ duration: 0.5 }} className='overflow-y-scroll h-screen pb-[10rem] dark:bg-black bg-white dark:text-white'>
            <ChannelInfoSkeleton />
            <VideoSectionSkeleton />
            <VideoSectionSkeleton />
        </motion.div>
}

const ChannelInfoSkeleton = () => {
 
    return <>
        <motion.div layout transition={{ duration: 0.5 }} className="flex relative flex-wrap dark:bg-black bg-white md:mt-6">

            <motion.div layout transition={{ duration: 0.5 }} className="basis-full relative md:min-w-[15rem] h-full md:basis-[15%] md:px-8 ">
                <motion.div layout transition={{ duration: 0.5 }} className="w-full h-full md:relative md:pb-[100%] pb-[40%] overflow-hidden">
                    <motion.div layout transition={{ duration: 0.5 }} className="absolute w-full h-full top-0 md:right-0 md:bottom-0 md:left-0">
                        <SekeltonImg className='md:!rounded-full' />
                    </motion.div>
                </motion.div>
            </motion.div>


            <motion.div layout transition={{ duration: 0.5 }} className="basis-[60%] shrink-0 mt-2 md:mt-0 flex min-w-min pl-3 md:pl-0 flex-col justify-center items-start grow">
                <motion.div layout transition={{ duration: 0.5 }} className="text-[2rem] w-full"><SekeltonText height={'min-h-[2rem]'} width={'w-3/4'} /></motion.div>
                 <SekeltonText />
                <SekeltonText /> 
            </motion.div>

            <motion.div layout transition={{ duration: 0.5 }} className="flex items-center justify-end my-1 px-6 grow">
                <SekeltonText width={'max-w-[7rem]'} height={'min-h-[2.3rem]'} className='w-[7rem] h-[2.3rem] !rounded-full cursor-pointer' />
            </motion.div>
        </motion.div>
    </>
}

const VideoSectionSkeleton = () => {

    return ( <>

            <motion.hr layout transition={{ duration: 0.5 }} className='my-6 border-none h-[0.1px] bg-[#69696945]' />

            <motion.div layout transition={{ duration: 0.5 }} className="md:mx-2 dark:bg-black bg-white">
                 <motion.div layout transition={{ duration: 0.5 }} className='mb-5 mx-2 md:mx-0 flex justify-between'>
                        <SekeltonText height={'min-h-[2rem]'} width={'w-[20%]'} className="min-w-[12rem]" />
                        <SekeltonText height={'min-h-[2.5rem]'} width={'w-[6%]'} className="!rounded-full min-w-[4rem]" />
                    </motion.div> 

                <SkeletonGallery />

            </motion.div>
        </>
        )
}

const SkeletonGallery = () => {
    const { isLarge } = useContext(isLargeContext) as any;
    return <>
        <motion.div layout transition={{ duration: 0.5 }} className="justify-evenly flex-wrap dark:bg-black bg-white flex">
                <SkeletonCard index={0} />
                <SkeletonCard index={1} />
                <SkeletonCard index={2} />
                {!isLarge && <>
                <SkeletonCard index={3} />
                <SkeletonCard index={4} />
                <SkeletonCard index={5} />
                </>
                }
        </motion.div>
    </>
}

const SkeletonCard = ({ index }: any) => {
    const { isLarge } = useContext(isLargeContext) as any;
    return <>
        <motion.div layout transition={{ duration: 0.5, delay: !isLarge ? (index % 10) / 10 : 0 }} className="flex flex-col md:mx-2 my-2 md:max-w-[20rem] min-w-6 w-full">
            <motion.div layout transition={{ duration: 0.5 }} className="relative w-full h-full pt-[56.25%] overflow-hidden">
                <motion.div layout transition={{ duration: 0.5 }} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
                    <SekeltonImg className="md:!rounded-lg" />
                </motion.div>
            </motion.div>
            <motion.div layout transition={{ duration: 0.5 }} className="mt-1 w-full">
                <motion.div layout transition={{ duration: 0.5 }} className="truncate-2 text-[0.9rem] md:text-[1rem] whitespace-normal "><SekeltonText /></motion.div>
                <motion.div layout transition={{ duration: 0.5 }} className="text-[#979696] w-[50%] text-[0.8rem] md:text-[1rem]"><SekeltonText width={'min-w-[50%]'} /></motion.div>
            </motion.div>
        </motion.div>
    </>
}


export default ChannelPageSkeleton;

