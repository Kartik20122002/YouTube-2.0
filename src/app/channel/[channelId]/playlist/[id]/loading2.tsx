'use client'
import React from 'react';
import { motion } from 'framer-motion';
import SekeltonImg from '@/components/global/skeletonComponents/ImgSkeleton';
import SekeltonText from '@/components/global/skeletonComponents/TextSkeleton';

const PlaylistPage = ({ id }: any) => {

    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className='h-[89vh] overflow-y-scroll dark:text-white'>
            <motion.div layout transition={{ duration: 0.5 }} className='w-full flex flex-wrap h-full'>
                <PlayListInfoSkeleton />
                <PlayListItemSkeleton />
            </motion.div>
        </motion.div>
    </>)
}

const PlayListInfoSkeleton = () => {

    return <motion.div layout transition={{ duration: 0.5 }} className="basis-full md:basis-[30%] grow min-w-[20rem] max-h-full overflow-y-scroll md:px-4">

        <motion.div layout transition={{ duration: 0.5 }} className="relative max-h-full h-full w-full overflow-hidden md:rounded-[15px] p-6">
            <motion.div layout transition={{ duration: 0.5 }} className="relative max-h-full overflow-y-scroll">
          
                <motion.div layout transition={{ duration: 0.5 }} className="w-full flex flex-wrap md:flex-col">

                    <SekeltonImg className="relative pt-[56.25%] rounded-lg" /> 

                    <motion.div layout transition={{ duration: 0.5 }} className="details mt-3 z-10">
                     
                            <SekeltonText className="mb-9" height="min-h-[1.3rem]" />
                            <SekeltonText className="mb-12" height="min-h-[1.3rem]" width="min-w-[75%] max-w-[80%]" />
                       
                        <motion.div layout transition={{ duration: 0.5 }} className="mt-2">
                            <SekeltonText width="min-w-[50%] max-w-[50%]" className="mb-2" /> 
                            <motion.div layout transition={{ duration: 0.5 }} className="flex text-[#b9b9b9] mt-1 font text-[0.8rem]">
                                 <SekeltonText width="min-w-[60%] max-w-[60%]" />
                            </motion.div>
                        </motion.div>
                        <motion.div layout transition={{ duration: 0.5 }} className="flex items-center mt-4">
                                    <SekeltonImg circle width="min-w-[2.5rem] max-w-[2.5rem] mx-1" height="min-h-[2.5rem] max-h-[2.5rem]" />
                                    <SekeltonImg circle width="min-w-[2.5rem] max-w-[2.5rem] mx-1" height="min-h-[2.5rem] max-h-[2.5rem]" />
                                    <SekeltonImg circle width="min-w-[2.5rem] max-w-[2.5rem] mx-1" height="min-h-[2.5rem] max-h-[2.5rem]" />
                        </motion.div>
                    </motion.div>

                </motion.div>

                <motion.div layout transition={{ duration: 0.5 }} className="mt-6 z-10 flex justify-center flex-wrap w-full">
                    <SekeltonImg width="min-w-[45%] max-w-[45%]" height="min-h-[2.5rem]" className="!rounded-full" /> 
                </motion.div>
                
            </motion.div>

        </motion.div>

    </motion.div>
}


const PlayListItemSkeleton = () => {
    return <>
        <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col md:items-center md:flex-row w-full max-w-full overflow-x-hidden py-2 mb-2">
            <motion.div layout transition={{ duration: 0.5 }} className="hidden md:flex items-center justify-center basis-[4%]">{ }</motion.div>

            <motion.div layout transition={{ duration: 0.5 }} className="basis-[20%] shrink-0 h-full ">
                <SekeltonImg className="relative pt-[56.25%] md:rounded-lg" />
            </motion.div>

            <motion.div layout transition={{ duration: 0.5 }} className="grow shrink basis-[60%] ml-3 mb-auto">
                <SekeltonText width="min-w-[60%] max-w-[60%]" height="min-h-[1.2rem]" className="mt-2 md:mt-0" />
                <motion.div layout transition={{ duration: 0.5 }} className="w-full flex flex-wrap">
                    <SekeltonText width="min-w-[40%] max-w-[40%]" />
                </motion.div>
            </motion.div>
        </motion.div>
    </>
}


export default PlaylistPage;

