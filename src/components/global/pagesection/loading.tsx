
import { motion } from "framer-motion"
import { isLargeContext } from "@/app/layout"
import { useContext } from "react"
import SkeletonImg from '@/components/global/skeletonComponents/ImgSkeleton';
import SkeletonTxt from '@/components/global/skeletonComponents/TextSkeleton';
import 'react-loading-skeleton/dist/skeleton.css'

export const VideoContainerSkeleton = () => {
  const { isLarge, setIsLarge } = useContext(isLargeContext) as any;
  return <>
    <motion.div layout initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }} className={`px-0 w-full ${isLarge ? 'md:w-[19rem]' : 'md:w-[21rem]'} items-center mb-4 flex flex-col justify-evenly cursor-pointer`}>

      <motion.div className={`flex pt-[56.25%] h-full w-full relative md:rounded-md`} layout transition={{ duration: 0.5 }}>
        <SkeletonImg className="md:rounded-xl absolute top-0 right-0 h-full w-full" />
      </motion.div>

      <motion.div layout transition={{ duration: 0.5 }} className={`flex w-full md:items-start items-center mt-3`}>

        <motion.div className="mr-4">
          <SkeletonImg circle className="h-9 w-9" />
        </motion.div>

        <motion.div layout transition={{ duration: 0.5 }} className="text-sm w-full">
          <SkeletonTxt />
          <SkeletonTxt />
          <SkeletonTxt width={'w-1/2'} />
          <motion.div layout transition={{ duration: 0.5 }} className="text-[#5a5a5a] flex"> <SkeletonTxt width={'w-[25%]'} className={`mr-1 rounded-lg h-2`} /> &bull;  <SkeletonTxt width={'w-[25%]'} className={`ml-1 rounded-lg h-2`} /></motion.div>
        </motion.div>

      </motion.div>

    </motion.div>
  </>
}




const PageSectionSkeleton = () => {

  const isLarge = useContext(isLargeContext);

  return <motion.div layout transition={{ duration: 0.5 }} className="flex flex-wrap justify-evenly h-[92vh] w-full overflow-y-scroll pt-5 pb-[10%]" id="mainpage">

    {Array.from({ length: 20 }, (_, index) => {
      return <VideoContainerSkeleton key={index} />;
    })}
  </motion.div>
}


export default PageSectionSkeleton