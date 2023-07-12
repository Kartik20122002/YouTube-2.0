'use client'
import { motion } from "framer-motion"
import { isLargeContext } from "@/app/layout"
import { useContext } from "react"
import SkeletonImg from '@/components/global/skeletonComponents/ImgSkeleton';
import SkeletonTxt from '@/components/global/skeletonComponents/TextSkeleton';
import 'react-loading-skeleton/dist/skeleton.css'

export const VideoContainerSkeleton = ()=>{

  return <>
  <motion.div layout transition={{duration : 0.5}} className= {`px-0 md:h-[18rem] w-full md:w-[22rem] items-center mb-4 flex flex-col justify-evenly cursor-pointer`}>

        <motion.div className={`flex pt-[56.25%] md:h-[12.5rem] h-full w-full relative md:rounded-md`} layout transition={{duration : 0.5}}>
          <SkeletonImg className="md:rounded-lg absolute top-0 right-0 h-full w-full"/>
        </motion.div>

      <motion.div layout transition={{duration : 0.5}} className={`flex w-full md:items-start items-center mt-3`}>

            <motion.div className="mr-4"> 
            <SkeletonImg circle className="h-9 w-9"/>
            </motion.div> 

            <motion.div layout transition={{duration : 0.5}} className="text-sm w-full">
                <SkeletonTxt/>
                <SkeletonTxt/>
                <SkeletonTxt width={'w-1/2'}/>
                <div className="text-[#5a5a5a] flex"> <SkeletonTxt width={'w-[25%]'} className={`mr-1 rounded-lg h-2`}/> &bull;  <SkeletonTxt width={'w-[25%]'} className={`ml-1 rounded-lg h-2`}/></div>
            </motion.div>

      </motion.div>

    </motion.div> 
</>
}

 


const PageSectionSkeleton = ()=>{

    const isLarge = useContext(isLargeContext);

    return <motion.div layout transition={{duration : 0.5}} className="flex flex-wrap justify-evenly h-[92vh] w-full overflow-y-scroll pt-5 pb-[10%]" id="mainpage">

               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
               <VideoContainerSkeleton/>
            
          
</motion.div>
}


export default PageSectionSkeleton