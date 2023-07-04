import Image from "next/legacy/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AiFillHome , AiOutlineHome , AiFillLike , AiOutlineLike } from "react-icons/ai";
import { MdLibraryAdd , MdOutlineLibraryAdd } from 'react-icons/md';
import { useSession } from "next-auth/react";

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
    <Link href="#" className={`w-full dark:text-white flex items-center flex-nowrap p-[5%] ${isLarge ? 'mb-1' : 'mb-3 justify-center'} overflow-hidden rounded-xl font-[350] hover:bg-[rgb(0,0,0,0.05)] dark:hover:bg-[rgb(255,255,255,0.05)]`}>
    <motion.div layout transition={{duration : 0.5}} className="flex items-center">
    <Image src={item?.snippet?.thumbnails?.default?.url} width={isLarge ? 35 : 40} height={isLarge ? 35 : 40} className="rounded-full  bg-[#5a5a5a]" loading="lazy" alt="img" />
    </motion.div>
    {isLarge && <motion.p layout transition={{duration : 0.5}} className="ml-[20px]">{item?.snippet?.title || 'unknown channel'}</motion.p>}
    </Link>
    </motion.div>
}

const SideLinks = ({item , isLarge , index , clicked , changeLink } : any) =>{
  return <Link 
  onClick={()=>changeLink(index)} 
  href={item.link} className={`w-full ${ 'dark:text-white hover:bg-[rgb(0,0,0,0.05)] dark:hover:bg-[rgb(255,255,255,0.05)]'} flex flex-nowrap items-center  ${!isLarge && 'justify-center flex-col mb-5'} p-[5%] mb-1 overflow-hidden rounded-xl font-[350] `}> 
        <motion.div layout transition={{duration : 0.5}} > {clicked == index ? item.icon1 : item.icon2} </motion.div> 
        <motion.p layout transition={{duration : 0.5}} className={ isLarge ? 'ml-5' :'mt-1 text-center text-xs' }>{item.name}</motion.p> 
        </Link>
}

const SubSkel =()=>{
    return <div className="text-white">...loading</div>
}


const Sidebar = ({isLarge } : any )=>{

  const [clicked,setClicked] = useState(0);

  useEffect(()=>{
    console.log('sidebar rendered')
  },[]);
    
    const {status } = useSession();
    const [subs,setSubs] = useState([])

    useEffect(()=>{
     if(status == 'authenticated'){
        const fun = async ()=>{
        try{
          const res = await fetch('/api/subs', {
            next : {revalidate: 60},
            cache : 'force-cache'
          });
          const {subs,ptoken,ntoken} = await res.json();
          setSubs(subs);
        }
  
        catch(err){
          console.log(err);
          setSubs([]);
        }
      }

      fun();
     }
    },[status])

    return <motion.div layout transition={{duration : 0.5}}>

<motion.div layout transition={{duration : 0.5}} className ={`sidebar ${isLarge ? 'w-[15%]' : 'w-[6%]'} fixed overflow-hidden hidden md:block top-0 h-screen pt-24 z-[9] opacity-100 bg-white dark:bg-black`}>

  <motion.div layout transition={{duration : 0.5}} className="sidebar-util w-full h-full pb-10 overflow-y-auto">

    <motion.div layout transition={{duration : 0.5}} className="shortcut-links pl-[3%] w-full">

        {
          links.map((item : any , index : any)=>{
            return <SideLinks key={index} changeLink={setClicked} clicked={clicked} index={index} item={item} isLarge={isLarge} />
          })
        }
       
        <motion.hr layout transition={{duration : 0.5}} className={`m-auto border-0 h-[1px] mt-[7%] bg-white ${isLarge ? 'w-[85%]' : 'w-3/4 mb-10'}`}/>
    </motion.div>
 
    {status == 'authenticated' && 

    <motion.div layout transition={{duration : 0.5}} className="subscribed-list w-full pl-[3%] pb-[15%]">
       {isLarge && 
        <motion.h3 layout transition={{duration : 0.5}} initial={{opacity : isLarge ? 0 : 1}} animate={{opacity : isLarge ? 1 : 0}} className="text-[18px] dark:text-white ml-2 my-5 text-[#5a5a5a]">Subscriptions</motion.h3>
       }

        { subs ? subs?.map((item : any)=>{
         return <Sub item={item} isLarge={isLarge} key={item?.id}/>
        }) : <SubSkel/>}

    </motion.div>
    }

  </motion.div>

</motion.div>

  </motion.div>
}

export default Sidebar;
