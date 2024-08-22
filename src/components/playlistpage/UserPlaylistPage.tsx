import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { AiOutlineMore } from 'react-icons/ai';
import { PiShareFatThin } from 'react-icons/pi'
import { LiaDownloadSolid } from 'react-icons/lia'
import { motion } from 'framer-motion';
import Image from 'next/legacy/image';
import SekeltonImg from '../global/skeletonComponents/ImgSkeleton';
import SekeltonText from '../global/skeletonComponents/TextSkeleton';
import { DateConverter } from '@/utils/Functions/Converters/DateConverter';
import { usePathname } from 'next/navigation';
import useSWR from 'swr';

const videoImg = 'https://i.ytimg.com/img/no_thumbnail.jpg'

const playlistInfoFetcher = async (id : any) => {
    const res = await fetch(`/api/library/myPlaylists/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
    });
    if (res.status != 404 && res.status != 500) {
        const { playlist } = await res.json();
        return playlist;
    }
    return {};
}



const UserPlaylistPage = ({ id }: any) => {

    const {data : playlist , error , isLoading : loading} = useSWR(['playlist',id],()=>playlistInfoFetcher(id),{
        refreshInterval : 3600000 , // 60 minutes
        dedupingInterval : 900000, // 15 minutes
        revalidateOnReconnect: true,
        revalidateIfStale: true,
    })

    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className='h-[89vh] overflow-y-scroll dark:text-white'>
            <motion.div layout transition={{ duration: 0.5 }} className='w-full flex flex-wrap h-full'>
                <PlayListInfo id={id} playlist={playlist} loading={loading} />
                <PlayListItems id={id} playlist={playlist} loading={loading} />
            </motion.div>
        </motion.div>
    </>)
}

const PlayListInfo = ({ playlist , loading }: any) => {
    const link = usePathname();


    const copyLink = async () => {
        await navigator.clipboard.writeText(`https://youtubepro.vercel.app${link}`);
        alert('Link Copied Successfully');
    }

    const itemsStr = playlist?.items || JSON.stringify([]);
    const items = JSON.parse(itemsStr);
    const firstItem = items[0] || null;
    

    return <motion.div layout transition={{ duration: 0.5 }} className="basis-full md:basis-[30%] grow min-w-[20rem] max-h-full overflow-y-scroll md:px-4">

        <motion.div layout transition={{ duration: 0.5 }} className="relative max-h-full h-full w-full overflow-hidden md:rounded-[15px] p-6">
            {!loading && <Image src={videoImg} layout='fill' loading='lazy' className='blur-[40px] !mb-auto !mt-0 !h-[99%] !min-h-[50%] opacity-80 z-0' alt='' />}
            <motion.div layout transition={{ duration: 0.5 }} className="relative max-h-full overflow-y-scroll">
                {/* info */}
                <motion.div layout transition={{ duration: 0.5 }} className="w-full flex flex-wrap md:flex-col">

                    {loading ? <SekeltonImg className="relative pt-[56.25%] rounded-lg" /> :
                        <motion.div layout transition={{ duration: 0.5 }} className="relative pt-[56.25%] w-full h-full">
                            <Link href={`/channel/${firstItem.channelId}/video/${firstItem.videoId}`} className="absolute min-w-full flex items-center cursor-pointer justify-center text-transparent  hover:text-white top-0 min-h-full bg-transparent hover:bg-[#0000009c] z-10 rounded-[4%]">
                                Play
                            </Link>
                            <motion.div layout transition={{ duration: 0.5 }} className="absolute top-0 right-0 bottom-0 left-0 w-full h-full"> <Image src={loading ? videoImg : firstItem.img} layout='fill' className='rounded-[4%] dark:bg-[#202324] bg-[#b8b8b8]' loading='lazy' alt='playlistImg' /> </motion.div>
                        </motion.div>}

                    <motion.div layout transition={{ duration: 0.5 }} className="details mt-3 z-10">
                        {loading ? <>
                            <SekeltonText className="mb-9" height="min-h-[1.3rem]" />
                            <SekeltonText className="mb-12" height="min-h-[1.3rem]" width="min-w-[75%] max-w-[80%]" />
                        </> :
                            <motion.div layout transition={{ duration: 0.5 }} className="text-[1.15rem] font-semibold text-white truncate-2">{playlist.name}</motion.div>
                        }
                        <motion.div layout transition={{ duration: 0.5 }} className="mt-2">
                            {/* {loading ? <SekeltonText width="min-w-[50%] max-w-[50%]" className="mb-2" /> :
                                <Link href={`/channel/${firstItem.channelId}`} className="truncate-1 text-white text-sm hover:opacity-70 font-semibold">{firstItem.channelTitle}</Link>
                            } */}
                            <div className="flex text-[#b9b9b9] mt-1 font text-[0.8rem]">
                                {loading ? <SekeltonText width="min-w-[60%] max-w-[60%]" /> :
                                    <>
                                        <motion.div layout transition={{ duration: 0.5 }} className="mr-4">{0 || items.length} videos</motion.div>
                                        <motion.div layout transition={{ duration: 0.5 }} className="">Last updated {DateConverter(Number(playlist.updatedAt))} ago</motion.div>
                                    </>
                                }
                            </div>
                        </motion.div>
                        <motion.div layout transition={{ duration: 0.5 }} className="flex items-center mt-4">
                            {loading ?
                                <>
                                    <SekeltonImg circle width="min-w-[2.5rem] max-w-[2.5rem] mx-1" height="min-h-[2.5rem] max-h-[2.5rem]" />
                                    <SekeltonImg circle width="min-w-[2.5rem] max-w-[2.5rem] mx-1" height="min-h-[2.5rem] max-h-[2.5rem]" />
                                    <SekeltonImg circle width="min-w-[2.5rem] max-w-[2.5rem] mx-1" height="min-h-[2.5rem] max-h-[2.5rem]" />
                                </> :
                                <>
                                    <motion.button onClick={() => copyLink()} layout transition={{ duration: 0.5 }} className='text-[1.5rem] p-2 m-1 text-white rounded-full bg-[#6564645d]'><PiShareFatThin /></motion.button>
                                    <motion.button layout transition={{ duration: 0.5 }} className='text-[1.5rem] p-2 m-1 text-white rounded-full bg-[#6564645d]'><LiaDownloadSolid /></motion.button>
                                    <motion.button layout transition={{ duration: 0.5 }} className='text-[1.5rem] p-2 m-1 text-white rounded-full bg-[#6564645d]'><AiOutlineMore /></motion.button>
                                </>}
                        </motion.div>
                    </motion.div>

                </motion.div>
                {/* buttons */}
                <motion.div layout transition={{ duration: 0.5 }} className="mt-6 z-10 flex justify-center flex-wrap w-full">
                    {loading ? <SekeltonImg width="min-w-[45%] max-w-[45%]" height="min-h-[2.5rem]" className="!rounded-full" /> :
                        <Link href={`/channel/${'' || firstItem.channelId}/video/${firstItem.videoId}`} className='w-[45%] py-2 mx-2 my-1 bg-[#181a1b] hover:bg-[#282b2d] text-white z-10 text-center rounded-full'>Play</Link>
                    }
                    {/* <button className='w-[45%] py-2 mx-2 my-1 bg-[#51515163] hover:bg-[#6f6e6e63] z-10 rounded-full'>Shuffle</button> */}
                </motion.div>
                {/* description  */}
                <motion.div layout transition={{ duration: 0.5 }} className="text-white mt-2 hidden md:block">
                    {/* {info?.snippet?.description} */}
                </motion.div>
            </motion.div>

        </motion.div>

    </motion.div>
}


const PlayListItems = ({ loading, playlist }: any) => {

    const itemsStr = playlist?.items || JSON.stringify([]);
    const items = JSON.parse(itemsStr);



    return <>
        <motion.div layout transition={{ duration: 0.5 }} className="mt-4 mb-2 ml-2 md:hidden font-bold text-2xl">Playlist Items</motion.div>
        <motion.div layout transition={{ duration: 0.5 }} className="items max-h-full overflow-y-scroll basis-full md:basis-[70%] grow ">
            {loading ? <>
                {Array.from({ length: 5 }, (_, index) => {
                    return <PlayListItemSkeleton key={index} />;
                })}
            </> :
                items?.map((item: any, index: any) => {
                    return <PlayListItem key={index} index={index + 1} item={item} />
                })
            }

        </motion.div>
    </>
}

const PlayListItem = ({ index, item }: any) => {

    const {videoId , title , img , channelTitle , channelId , publishedAt} = item;

    return <>
        <Link href={`/channel/${channelId}/video/${videoId}`} className="flex flex-col md:items-center md:flex-row w-full max-w-full overflow-x-hidden py-2 mb-2">
            <motion.div layout transition={{ duration: 0.5 }} className="hidden md:flex items-center justify-center basis-[4%]">{index}</motion.div>
            <Link href={`/channel/${channelId}/video/${videoId}`} className="basis-[20%] shrink-0 h-full ">
                <motion.div layout transition={{ duration: 0.5 }} className="w-full h-full relative pt-[56.25%] overflow-hidden">
                    <Image src={img || videoImg} loading='lazy' className='absolute md:rounded-lg top-0 dark:bg-[#202324] bg-[#b8b8b8] right-0 bottom-0 left-0 !w-full !h-full !min-w-0 !min-h-0' layout='fill' alt='itemImg' />
                </motion.div>
            </Link>
            <motion.div layout transition={{ duration: 0.5 }} className="grow shrink basis-[60%] ml-3 mb-auto">
                <Link href={`/channel/${channelId}/video/${videoId}`} className="text-[1.1rem] mt-2 md:mt-0 font-semibold truncate-1">{title}</Link>
                <motion.div layout transition={{ duration: 0.5 }} className="w-full flex flex-wrap">
                    <Link href={`/channel/${channelId}`} className="text-[#aeadad] dark:hover:text-white hover:text-black text-[0.9rem] max-w-[50%] truncate mr-1">{channelTitle} </Link>
                    <motion.div layout transition={{ duration: 0.5 }} className="text-[#b9b9b9] text-[0.9rem]"> &bull; {DateConverter(publishedAt)} ago</motion.div>
                </motion.div>
            </motion.div>
        </Link>

    </>
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


export default UserPlaylistPage;

