'use client'
import Image from "next/legacy/image"
import Link from "next/link"
import megan from "@/images/megan.png"
import { motion } from "framer-motion"
import { isLargeContext } from "@/app/layout"
import { useContext } from "react"

const PageSection = ({items } : any)=>{
    const isLarge = useContext(isLargeContext);

    return <motion.div layout transition={{duration : 0.5}} className="flex flex-wrap justify-evenly h-[100vh] overflow-y-scroll pt-5 pb-[10%]" id="mainpage">
           {items?.map((item : any , index : any)=>{
               return <VideoContainer index={index} key={index} isLarge={isLarge} item={item} />
           })}
          </motion.div>
}

const VideoContainer = ({item , index ,isLarge}:any)=>{
    let views = 29;
    return <>

<motion.div whileHover={{ scale: 1.1, transition: { duration: 0.5 ,delay : 3 }}} layout transition={{duration : 0.5 , delay : !isLarge ? (index%10)/10 : 0}} className= {`px-0 h-[21rem] md:h-[18rem] w-full md:w-[22rem] items-center mb-4 flex flex-col justify-between`}>

  <Link className={`h-[18rem] md:h-[12.5rem] w-full`} href={`/videopage/${item?.id}`}>

  <motion.div className={`flex h-full w-full relative md:rounded-md`} layout transition={{duration : 0.5}}>
    <Image src={item.snippet.thumbnails.medium.url} className="md:rounded-xl bg-skeleton dark:bg-skeletonDark" layout="fill" alt="video" />
  </motion.div>

  </Link>

<motion.div layout transition={{duration : 0.5}} className={`flex w-full md:items-start items-center px-2 mt-2`}>

    <Link href="" className="mr-4 min-w-[40px] w-[40px] h-[40px]"> 
    <Image className="rounded-full h-[40px] bg-[#b8b8b8]" layout="responsive" src={megan} loading="lazy" alt="s" />
    </Link> 

    <motion.div layout transition={{duration : 0.5}} className="text-sm">
        <Link className="text-black dark:text-white font-semibold text-[15px] mb-[5px] truncate-2" href="">{item?.snippet?.title}</Link>
        <div className="flex md:block w-full">
        <Link className="text-[#5a5a5a]" href=""> <p>{item?.snippet?.channelTitle}</p></Link>
        <p className="text-[#5a5a5a]"> {views} Views &bull; 3 days ago</p>
        </div>
    </motion.div>
</motion.div>
</motion.div> 

  </>
}

export default PageSection;