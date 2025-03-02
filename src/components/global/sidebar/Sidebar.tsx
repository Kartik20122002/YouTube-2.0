import Image from "next/legacy/image";
import Link from "next/link";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import useSWR from 'swr';

import { AiFillHome, AiOutlineHome, AiFillLike, AiOutlineLike, AiOutlineHistory, AiOutlineDown } from "react-icons/ai";
import { MdLibraryAdd, MdOutlineLibraryAdd } from 'react-icons/md';
import { RiPlayList2Line } from "react-icons/ri";

import { signOut, useSession } from "next-auth/react";
import { slideContext } from "@/app/layout";
import Loader from "../loader/Loader";
import Sekelton from "@/components/global/skeletonComponents/ImgSkeleton";
import SekeletonTxt from "@/components/global/skeletonComponents/TextSkeleton"

const subFetcher = async ()=>{
    const res = await fetch('/api/subs');
    const { subs, ptoken, ntoken } = await res.json();
    return subs;
}

const playlistFetcher = async (email : string) => {
  try {
    const res = await fetch('/api/library/myPlaylists/list' , {
      method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email })  
    });

    const { myPlaylists } = await res.json();
    return myPlaylists;
    
  }

  catch (err) {
    console.log(err);
    return [];
  }
}

const links = [
  {
    name: 'Home',
    link: '/',
    icon1: <AiFillHome className="text-xl" />,
    icon2: <AiOutlineHome className="text-xl" />,
  },
  {
    name: 'Library',
    link: '/library',
    icon1: <MdLibraryAdd className="text-xl" />,
    icon2: <MdOutlineLibraryAdd className="text-xl" />
  },
  {
    name: 'History',
    link: '/history',
    icon1: <AiOutlineHistory className="text-xl" />,
    icon2: <AiOutlineHistory className="text-xl" />
  },
  { 
    name: 'Liked Videos',
    link: '/likepage',
    icon1: <AiFillLike className="text-xl" />,
    icon2: <AiOutlineLike className="text-xl" />
  },
];

const Sidebar = ({ isLarge, IsVideoPage , setMyPlaylists }: any) => {
  const { status, data: session } = useSession();
  const [show, setShow] = useState(false);

  const { data : subs, error : isError, isLoading : loading } = useSWR(status === 'authenticated' ? 'subs' : null,()=>subFetcher(),{
    refreshInterval : 3600000 , // 60 minutes
    dedupingInterval : 300000, // 5 minutes
    revalidateOnReconnect: true,
    revalidateIfStale: true,
  })

  const {data : list , error , isLoading : loading1} = useSWR(status === 'authenticated' ? 'myPlaylists' : null,()=>playlistFetcher(session?.user?.email as string),{
    refreshInterval : 3600000 , // 60 minutes
    dedupingInterval : 900000, // 15 minutes
    revalidateOnReconnect: true,
    revalidateIfStale: true,
  })


  useEffect(()=>{
    if(list && list.length > 0){
      setMyPlaylists(list);
    }
  },[list]);

  useEffect(() => {
    const getHistory = async () => {
      if (typeof window !== "undefined") {

        const res = await fetch(`/api/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: session?.user?.email }),
          next: { tags: ['history'] }
        });

        if (res.status != 500 && res.status != 404) {
          const { videoItems } = await res.json();
          localStorage.setItem('history', JSON.stringify(videoItems));
        }

      }
    }

    if (status == 'authenticated') {
      getHistory();
    }
  }, [status])

  return <motion.div layout transition={{ duration: 0.5 }}>

    <motion.div layout transition={{ duration: 0.5 }} className={`${isLarge ? 'w-[15%]' : IsVideoPage ? 'w-0' : 'w-[6%]'} fixed overflow-hidden hidden md:block top-0 h-screen pt-[10vh] z-[9] opacity-100 bg-white dark:bg-black`}>

      <motion.div layout transition={{ duration: 0.5 }} className="w-full h-full pb-10 overflow-y-auto">

        <motion.div layout transition={{ duration: 0.5 }} className="shortcut-links pl-[3%] w-full">

          {
            links.map((item: any,index : any) => {
              return <SideLinks key={index} item={item} isLarge={isLarge} index={index} />
            })
          }

          {status == 'authenticated' && list &&
            <>
              <motion.button whileTap={{scale : 0.9}} transition={{ duration: 0.5 }} onClick={() => { setShow(!show) }} className={`w-full dark:text-white hover:bg-[rgb(0,0,0,0.05)] dark:hover:bg-[rgb(255,255,255,0.05)] flex flex-nowrap items-center  ${!isLarge && 'justify-center flex-col-reverse mb-5'} p-[5%] mb-1 overflow-hidden rounded-xl font-[350] `}>
                <motion.div layout transition={{ duration: 0.5 }} > <AiOutlineDown /> </motion.div>
                <motion.div layout transition={{ duration : 0.5}} className={isLarge ? 'ml-5' : 'mt-1 text-center text-xs'}>Show {show ? 'Less' : 'More'}</motion.div>
              </motion.button>

              {
                <motion.div className={`${!show && 'max-h-0'} overflow-y-hidden`}>
                  {loading1 ? 
                  Array.from({ length: 4 }, (_, index) => {
                    return <SubItemSkeleton key={index} isLarge={isLarge} />
                  }):
                    <>
                      {
                        list?.map((item: any, index: any) => {
                          return <Link key={index} href={`/library/userplaylist/${item._id}`} className={`w-full ${'dark:text-white hover:bg-[rgb(0,0,0,0.05)] dark:hover:bg-[rgb(255,255,255,0.05)]'} flex flex-nowrap items-center  ${!isLarge && 'justify-center flex-col mb-5'} p-[5%] mb-1 overflow-hidden rounded-xl font-[350] `}>
                            <motion.div layout transition={{ duration: 0.5 }} > <RiPlayList2Line /> </motion.div>
                            <motion.div layout transition={{ duration: 0.5 }} className={isLarge ? 'ml-5' : 'mt-1 truncate-1 text-center text-xs'}>{item?.name}</motion.div>
                          </Link>
                        })
                      }
                    </>}
                </motion.div>
              }
            </>
          }



          <motion.hr layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }} className={`m-auto border-0 h-[1px] mt-[7%] bg-white ${isLarge ? 'w-[85%]' : 'w-3/4 mb-10'}`} />
        </motion.div>

        {status == 'authenticated' && <>
          {loading ? <SubSkeleton isLarge={isLarge} /> :
            <motion.div layout transition={{ duration: 0.5 }} className="subscribed-list w-full pl-[3%] pb-[15%]">
              {isLarge &&
                <motion.h3 layout transition={{ duration: 0.5 }} initial={{ opacity: isLarge ? 0 : 1 }} animate={{ opacity: isLarge ? 1 : 0 }} className="text-[18px] dark:text-white ml-2 my-5 text-[#5a5a5a]">Subscriptions</motion.h3>
              }

              {subs ? subs?.map((item: any , index : any) => {
                return <Sub item={item} isLarge={isLarge} index={index} key={item?.id} />
              }) : <Loader />}

            </motion.div>}
        </>

        }

      </motion.div>

    </motion.div>

  </motion.div>
}

const SideLinks = ({ item, isLarge, index }: any) => {
  const { slide } = useContext(slideContext) as any;

  return <motion.div layout
    whileTap={{scale : 0.95}}
    transition={{ duration: 0.5 }} className="relative cursor-pointer">
    <Link href={item.link} className={`w-full ${slide != index && 'hover:bg-[rgb(0,0,0,0.05)] dark:hover:bg-[rgba(255,254,254,0.16)] dark:hover:border-[rgba(255,254,254,0.16)]'} dark:text-white dark:border-y-[0.01rem] dark:border-transparent flex flex-nowrap items-center  ${!isLarge && 'justify-center flex-col mb-5'} p-[5%] mb-1 overflow-hidden rounded-xl font-[350] `}>
      <motion.div layout transition={{ duration: 0.5 }} > {slide == index ? item.icon1 : item.icon2} </motion.div>
      <motion.div layout transition={{ duration: 0.5 }} className={isLarge ? 'ml-5' : 'mt-1 text-center text-xs'}>{item.name}</motion.div>
    </Link>

    {slide == index && <motion.div className="activeLink" layoutId="underline" />}
  </motion.div>
}

const Sub = ({ item, isLarge , index }: any) => {
  return <motion.div
    whileTap={{scale : 0.9}}
    initial={{opacity: 0 }}
    whileInView={{opacity: 1  , transition: {duration: 0.5 , delay: (1/100)*index + 0.05 }}}
    viewport={{once: true}}
   layout transition={{ duration: 0.5 }} >
    <Link href={`/channel/${item?.snippet?.resourceId?.channelId}`} className={`w-full dark:text-white flex items-center flex-nowrap p-[5%] ${isLarge ? 'mb-1' : 'mb-3 justify-center'} overflow-hidden rounded-xl font-[350] hover:bg-[rgb(0,0,0,0.05)] dark:hover:bg-[rgba(255,254,254,0.16)]`}>
      <motion.div layout transition={{ duration: 0.5 }} className="flex min-w-[2rem] w-[2rem] items-center">
        <Image src={item?.snippet?.thumbnails?.default?.url} width={isLarge ? 35 : 40} height={isLarge ? 35 : 40} className={`rounded-full bg-[#5a5a5a]`} loading="lazy" alt="img" />
      </motion.div>
      {isLarge && <motion.p layout transition={{ duration: 0.5 }} className="ml-[20px] truncate-1">{item?.snippet?.title || 'unknown channel'}</motion.p>}
    </Link>
  </motion.div>
}

const SubSkeleton = ({ isLarge }: any) => {
  return <motion.div layout initial={{ opacity: 0 }}
    animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="subscribed-list w-full pl-[3%] pb-[15%]">
    {isLarge &&
      <motion.h3 layout transition={{ duration: 0.5 }} initial={{ opacity: isLarge ? 0 : 1 }} animate={{ opacity: isLarge ? 1 : 0 }} className="text-[18px] dark:text-white ml-2 my-5 text-[#5a5a5a]">Subscriptions</motion.h3>
    }

    {
      Array.from({ length: 7 }, (_, index) => {
        return <SubItemSkeleton key={index} isLarge={isLarge} />
      })
    }

  </motion.div>
}

const SubItemSkeleton = ({ isLarge }: any) => {
  return <motion.div layout transition={{ duration: 0.5 }} >
    <motion.div className={`w-full dark:text-white flex items-center flex-nowrap p-[5%] ${isLarge ? 'mb-1' : 'mb-3 justify-center'} overflow-hidden rounded-xl font-[350] hover:bg-[rgb(0,0,0,0.05)] dark:hover:bg-[rgb(255,255,255,0.05)]`}>
      <motion.div layout transition={{ duration: 0.5 }} className="flex w-fit items-center">
        <Sekelton width={isLarge ? 'min-w-[35px]' : 'min-w-[40px]'} height={isLarge ? 'min-h-[35px]' : 'min-h-[40px]'} circle />
      </motion.div>
      {isLarge && <motion.div layout transition={{ duration: 0.5 }} className="ml-[20px] flex w-full"><SekeletonTxt height={'min-h-[1.2rem]'} /></motion.div>}
    </motion.div>
  </motion.div>
}


export default Sidebar;