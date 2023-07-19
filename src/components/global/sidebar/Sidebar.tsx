import Image from "next/legacy/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiFillHome , AiOutlineHome , AiFillLike , AiOutlineLike } from "react-icons/ai";
import { MdLibraryAdd , MdOutlineLibraryAdd } from 'react-icons/md';
import { useSession } from "next-auth/react";
import { slideContext } from "@/app/layout";
import Loader from "../loader/Loader";
import Sekelton from "@/components/global/skeletonComponents/ImgSkeleton";
import SekeletonTxt from "@/components/global/skeletonComponents/TextSkeleton"
export const dynamic = 'force-dynamic'

const links = [
  {
    name : 'Home',
    link : '/',
    icon1: <AiFillHome className="text-xl"/>,
    icon2: <AiOutlineHome className="text-xl"/>,
  },
  {
    name : 'Library',
    link : '/library',
    icon1 : <MdLibraryAdd className="text-xl"/>,
    icon2 : <MdOutlineLibraryAdd className="text-xl"/>
  },
  {
    name : 'Liked Videos',
    link : '/likepage',
    icon1 : <AiFillLike className="text-xl"/>,
    icon2 : <AiOutlineLike className="text-xl"/>
  },
];

const Sub = ({item , isLarge}:any)=>{
    return <motion.div layout transition={{duration : 0.5}} >
    <Link href={`/channel/${item?.snippet?.resourceId?.channelId}`} className={`w-full dark:text-white flex items-center flex-nowrap p-[5%] ${isLarge ? 'mb-1' : 'mb-3 justify-center'} overflow-hidden rounded-xl font-[350] hover:bg-[rgb(0,0,0,0.05)] dark:hover:bg-[rgb(255,255,255,0.05)]`}>
    <motion.div layout transition={{duration : 0.5}} className="flex  w-fit items-center">
    <Image src={item?.snippet?.thumbnails?.default?.url} width={isLarge ? 35 : 40} height={isLarge ? 35 : 40} className="rounded-full  bg-[#5a5a5a]" loading="lazy" alt="img" />
    </motion.div>
    {isLarge && <motion.p layout transition={{duration : 0.5}} className="ml-[20px]">{item?.snippet?.title || 'unknown channel'}</motion.p>}
    </Link>
    </motion.div>
}

const SideLinks = ({item , isLarge , index} : any) =>{
  const {slide , setslide} = useContext(slideContext) as any;

  return <Link 
  onClick={()=>setslide(index)} 
  href={item.link} className={`w-full ${ 'dark:text-white hover:bg-[rgb(0,0,0,0.05)] dark:hover:bg-[rgb(255,255,255,0.05)]'} flex flex-nowrap items-center  ${!isLarge && 'justify-center flex-col mb-5'} p-[5%] mb-1 overflow-hidden rounded-xl font-[350] `}> 
        <motion.div layout transition={{duration : 0.5}} > {slide == index ? item.icon1 : item.icon2} </motion.div> 
        <motion.div layout transition={{duration : 0.5}} className={ isLarge ? 'ml-5' :'mt-1 text-center text-xs' }>{item.name}</motion.div> 
        </Link>
}

const Sidebar = ({isLarge , IsVideoPage } : any )=>{

  useEffect(()=>{
    console.log('sidebar rendered')
  },[]);
    
    const {status } = useSession();
    const [subs,setSubs] = useState([]);
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
     if(status == 'authenticated'){
        const fun = async ()=>{
        try{
          const res = await fetch('/api/subs',{ next : {revalidate : 300} , cache : 'force-cache'});
          const {subs,ptoken,ntoken} = await res.json();
          setSubs(subs);
          setLoading(false);
        }
  
        catch(err){
          console.log(err);
          setSubs([]);
          setLoading(false);
        }
      }

      fun();
     }
    },[status])

    return <motion.div layout transition={{duration : 0.5}}>

<motion.div layout transition={{duration : 0.5}} className ={`${ isLarge ? 'w-[15%]' : IsVideoPage ? 'w-0' :'w-[6%]'} fixed overflow-hidden hidden md:block top-0 h-screen pt-24 z-[9] opacity-100 bg-white dark:bg-black`}>

  <motion.div layout transition={{duration : 0.5}} className="w-full h-full pb-10 overflow-y-auto">

    <motion.div layout transition={{duration : 0.5}} className="shortcut-links pl-[3%] w-full">

        {
          links.map((item : any , index : any)=>{
            return <SideLinks key={index} index={index} item={item} isLarge={isLarge} />
          })
        }
       
        <motion.hr layout transition={{duration : 0.5}} className={`m-auto border-0 h-[1px] mt-[7%] bg-white ${isLarge ? 'w-[85%]' : 'w-3/4 mb-10'}`}/>
    </motion.div>
 
    { status == 'authenticated' && <>
      { loading ? <SubSkeleton isLarge={isLarge} /> : 
    <motion.div layout transition={{duration : 0.5}} className="subscribed-list w-full pl-[3%] pb-[15%]">
       {isLarge && 
        <motion.h3 layout transition={{duration : 0.5}} initial={{opacity : isLarge ? 0 : 1}} animate={{opacity : isLarge ? 1 : 0}} className="text-[18px] dark:text-white ml-2 my-5 text-[#5a5a5a]">Subscriptions</motion.h3>
       }

        { subs ? subs?.map((item : any)=>{
         return <Sub item={item} isLarge={isLarge} key={item?.id}/>
        }) : <Loader/>}

    </motion.div> }
    </>

    }

  </motion.div>

</motion.div>

  </motion.div>
}

export default Sidebar;


const SubSkeleton = ({isLarge} : any)=>{
   return <motion.div layout transition={{duration : 0.5}} className="subscribed-list w-full pl-[3%] pb-[15%]">
   {isLarge && 
    <motion.h3 layout transition={{duration : 0.5}} initial={{opacity : isLarge ? 0 : 1}} animate={{opacity : isLarge ? 1 : 0}} className="text-[18px] dark:text-white ml-2 my-5 text-[#5a5a5a]">Subscriptions</motion.h3>
   }

  <SubsSkeleton isLarge={isLarge}/>
  <SubsSkeleton isLarge={isLarge}/>
  <SubsSkeleton isLarge={isLarge}/>
  <SubsSkeleton isLarge={isLarge}/>
  <SubsSkeleton isLarge={isLarge}/>
  <SubsSkeleton isLarge={isLarge}/>
  <SubsSkeleton isLarge={isLarge}/>
   
</motion.div>
}

const SubsSkeleton = ({isLarge}:any)=>{
  return <motion.div layout transition={{duration : 0.5}} >
  <motion.div className={`w-full dark:text-white flex items-center flex-nowrap p-[5%] ${isLarge ? 'mb-1' : 'mb-3 justify-center'} overflow-hidden rounded-xl font-[350] hover:bg-[rgb(0,0,0,0.05)] dark:hover:bg-[rgb(255,255,255,0.05)]`}>
  <motion.div layout transition={{duration : 0.5}} className="flex w-fit items-center">
  <Sekelton  width={isLarge ? 'min-w-[35px]' : 'min-w-[40px]'} height={isLarge ? 'min-h-[35px]' : 'min-h-[40px]'} circle />
  </motion.div>
  {isLarge && <motion.div layout transition={{duration : 0.5}} className="ml-[20px] flex w-full"><SekeletonTxt height={'min-h-[1.2rem]'}/></motion.div>}
  </motion.div>
  </motion.div>
}