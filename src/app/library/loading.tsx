import { motion } from "framer-motion";
import SekeltonImg from "../../components/global/skeletonComponents/ImgSkeleton";
import SekeltonText from "../../components/global/skeletonComponents/TextSkeleton";

const LibraryPageSkeleton = () => {

  return <>
    <motion.div layout transition={{ duration: 0.5 }} className='md:pl-3 h-[90vh] pb-10 overflow-y-scroll flex flex-col-reverse md:flex-row dark:text-white'>
      <motion.div layout transition={{ duration: 0.5 }} className="basis-[80%] grow">

        <VideoSectionSkeleton />
        <VideoSectionSkeleton />
        <VideoSectionSkeleton />

      </motion.div>

      <UserDetailSkeleton />
    </motion.div>
  </>
}

const UserDetailSkeleton = () => {


  return <motion.div layout transition={{ duration: 0.5 }} className="basis-[20%] min-h-max grow-0 items-center pt-[4rem] md:flex flex-col bg-[3red]">
    <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col items-center">
      <motion.div layout transition={{ duration: 0.5 }} className="mb-2">
          <SekeltonImg width="min-w-[80px] max-w-[80px]" height="min-h-[80px] max-h-[80px]" circle /> 
      </motion.div>
        <SekeltonText /> 
    </motion.div>
    <motion.div layout transition={{ duration: 0.5 }} className="my-7 w-full px-6">
      <motion.hr className="mb-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]" />
      <motion.div layout transition={{ duration: 0.5 }} className="flex justify-between text-[0.75rem] font-[400] px-5 text-[#b2aca2]"><motion.span transition={{ duration: 0.5 }}>Subscriptions</motion.span> <motion.span transition={{ duration: 0.5 }} className="ml-2"></motion.span></motion.div>
      <motion.hr className="my-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]" />
      <motion.div layout transition={{ duration: 0.5 }} className="flex justify-between text-[0.75rem] font-[400] px-5 text-[#b2aca2]"><motion.span transition={{ duration: 0.5 }}>Uploads</motion.span> <motion.span transition={{ duration: 0.5 }} className="ml-2"></motion.span></motion.div>
      <motion.hr className="my-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]" />
      <motion.div layout transition={{ duration: 0.5 }} className="flex justify-between text-[0.75rem] font-[400] px-5 text-[#b2aca2]"><motion.span transition={{ duration: 0.5 }}>Views</motion.span> <motion.span transition={{ duration: 0.5 }} className="ml-2"></motion.span></motion.div>
      <motion.hr className="my-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]" />
    </motion.div>
  </motion.div>
}

const VideoSectionSkeleton = () => {

  return <motion.div layout transition={{ duration: 0.5 }} className="min-h-max">
          <motion.div layout transition={{ duration: 0.5 }} className='mb-5 mx-2 flex justify-between'>
            <SekeltonText height={'min-h-[2rem]'} width={'w-[20%]'} className="min-w-[12rem]" />
            <SekeltonText height={'min-h-[2.5rem]'} width={'w-[6%]'} className="!rounded-full min-w-[4rem]" />
          </motion.div>

        <motion.div layout transition={{ duration: 0.5 }} className={`flex w-screen md:w-full md:overflow-x-auto overflow-x-scroll md:justify-evenly md:flex-wrap`}>

            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />

        </motion.div>

        <motion.hr className="my-4 border-none h-[0.07px] bg-[#5e5e5e36]" />

      </motion.div>
    
}

const SkeletonCard = () => {

  return <>

    <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col mx-4 md:mx-[0.1rem] my-2 max-w-[13rem] min-w-[13rem] w-[13rem]">
      <motion.div layout transition={{ duration: 0.5 }} className="relative w-full pt-[56.25%] overflow-hidden">
        <motion.div layout transition={{ duration: 0.5 }} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
          <SekeltonImg className='!rounded-lg' />
        </motion.div>
      </motion.div>
      <motion.div layout transition={{ duration: 0.5 }} className="mt-2 pr-6">
        <motion.div layout transition={{ duration: 0.5 }} className="truncate-2 font-[650] text-[0.8rem] md:text-[0.9rem] whitespace-normal"><SekeltonText /></motion.div>
        <motion.div layout transition={{ duration: 0.5 }} className="truncate-1 font-[550] text-grey text-[0.7rem] md:text-[0.8rem] whitespace-normal mt-2"><SekeltonText width="min-w-[50%] w-[50%]" /></motion.div>
        <motion.div layout transition={{ duration: 0.5 }} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]"> <SekeltonText width="min-w-[50%] w-[50%]" /></motion.div>
      </motion.div>
    </motion.div>

  </>
}


export default LibraryPageSkeleton;