import Link from 'next/link';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AiOutlineMore } from 'react-icons/ai';
import { PiShareFatThin } from 'react-icons/pi'
import { LiaDownloadSolid } from 'react-icons/lia'
import { motion } from 'framer-motion';
import Image from 'next/legacy/image';
import { isLargeContext, pageContext } from '@/app/layout';
import SekeltonImg from '../global/skeletonComponents/ImgSkeleton';
import SekeltonText from '../global/skeletonComponents/TextSkeleton';
import { DateConverter } from '@/utils/Functions/Converters/DateConverter';
import { usePathname } from 'next/navigation';


const img = 'https://yt3.googleusercontent.com/ytc/AOPolaQygjiMgnSw5zUP1F_PyEkcGBmfaE8HMq7S_xu_=s176-c-k-c0x00ffffff-no-rj';
const videoImg = 'https://i.ytimg.com/img/no_thumbnail.jpg'

const PlaylistPage = ({ id }: any) => {

    const { setpage } = useContext(pageContext) as any;
    setpage(false);
    const [first, setFirst] = useState<any>(null);

    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className='h-[89vh] overflow-y-scroll dark:text-white'>
            <motion.div layout transition={{ duration: 0.5 }} className='w-full flex flex-wrap h-full'>
                <PlayListInfo id={id} first={first} />
                <PlayListItems id={id} setfirst={(e: any) => setFirst(e)} />
            </motion.div>
        </motion.div>
    </>)
}

const PlayListInfo = ({ id, first }: any) => {
    const [info, setInfo] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const link = usePathname();

    const copyLink = async () => {
        await navigator.clipboard.writeText(`https://youtubepro.vercel.app${link}`);
        alert('Link Copied Successfully');
    }

    const getDetails = async () => {
        const res = await fetch(`/api/playlist/${id}/info`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
            next: { revalidate: 300 }
        });
        if (res.status != 404 && res.status != 500) {
            const { data } = await res.json();
            setInfo(data);
            setLoading(false);
        }
    }

    useEffect(() => {
        getDetails();
    }, []);

    return <motion.div layout transition={{ duration: 0.5 }} className="basis-full md:basis-[30%] grow min-w-[20rem] max-h-full overflow-y-scroll md:px-4">

        <motion.div layout transition={{ duration: 0.5 }} className="relative max-h-full h-full w-full overflow-hidden md:rounded-[15px] p-6">
            {!loading && <Image src={info?.snippet?.thumbnails?.default?.url || videoImg} layout='fill' loading='lazy' className='blur-[40px] !mb-auto !mt-0 !h-[99%] !min-h-[50%] opacity-80 z-0' alt='' />}
            <motion.div layout transition={{ duration: 0.5 }} className="relative max-h-full overflow-y-scroll">
                {/* info */}
                <motion.div layout transition={{ duration: 0.5 }} className="w-full flex flex-wrap md:flex-col">

                    {loading ? <SekeltonImg className="relative pt-[56.25%] rounded-lg" /> :
                        <motion.div layout transition={{ duration: 0.5 }} className="relative pt-[56.25%] w-full h-full">
                            <Link href={first || `/channel/${info?.snippet?.channelId}/playlist/${info?.id}`} className="absolute min-w-full flex items-center cursor-pointer justify-center text-transparent  hover:text-white top-0 min-h-full bg-transparent hover:bg-[#0000009c] z-10 rounded-[4%]">
                                Play
                            </Link>
                            <motion.div layout transition={{ duration: 0.5 }} className="absolute top-0 right-0 bottom-0 left-0 w-full h-full"> <Image src={loading ? videoImg : info?.snippet?.thumbnails?.medium?.url} layout='fill' className='rounded-[4%] dark:bg-[#202324] bg-[#b8b8b8]' loading='lazy' alt='playlistImg' /> </motion.div>
                        </motion.div>}

                    <motion.div layout transition={{ duration: 0.5 }} className="details mt-3 z-10">
                        {loading ? <>
                            <SekeltonText className="mb-9" height="min-h-[1.3rem]" />
                            <SekeltonText className="mb-12" height="min-h-[1.3rem]" width="min-w-[75%] max-w-[80%]" />
                        </> :
                            <motion.div layout transition={{ duration: 0.5 }} className="text-[1.15rem] font-semibold text-white truncate-2">{info?.snippet?.title}</motion.div>
                        }
                        <motion.div layout transition={{ duration: 0.5 }} className="mt-2">
                            {loading ? <SekeltonText width="min-w-[50%] max-w-[50%]" className="mb-2" /> :
                                <Link href={`/channel/${info?.snippet?.channelId}`} className="truncate-1 text-white text-sm hover:opacity-70 font-semibold">{info?.snippet?.channelTitle}</Link>
                            }
                            <div className="flex text-[#b9b9b9] mt-1 font text-[0.8rem]">
                                {loading ? <SekeltonText width="min-w-[60%] max-w-[60%]" /> :
                                    <>
                                        <motion.div layout transition={{ duration: 0.5 }} className="mr-4">{0 || info?.contentDetails?.itemCount} videos</motion.div>
                                        <motion.div layout transition={{ duration: 0.5 }} className="">Last updated {DateConverter(info?.snippet?.publishedAt)} ago</motion.div>
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
                        <Link href={first || `/channel/${'' || info?.snippet?.channelId}/playlist/${info?.id}`} className='w-[45%] py-2 mx-2 my-1 bg-[#181a1b] hover:bg-[#282b2d] text-white z-10 text-center rounded-full'>Play</Link>
                    }
                    {/* <button className='w-[45%] py-2 mx-2 my-1 bg-[#51515163] hover:bg-[#6f6e6e63] z-10 rounded-full'>Shuffle</button> */}
                </motion.div>
                {/* description  */}
                <motion.div layout transition={{ duration: 0.5 }} className="text-white mt-2 hidden md:block">
                    {info?.snippet?.description}
                </motion.div>
            </motion.div>

        </motion.div>

    </motion.div>
}


const PlayListItems = ({ id, setfirst }: any) => {

    const [items, setItems] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const getDetails = async () => {
        const res = await fetch(`/api/playlist/${id}/items`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
            next: { revalidate: 300 },
            cache: 'force-cache'
        });
        if (res.status != 404 && res.status != 500) {
            const { data } = await res.json();
            setfirst(`/channel/${data[0]?.snippet?.channelId}/video/${data[0]?.contentDetails?.videoId}`);
            setItems(data);
            setLoading(false);
        }
    }

    useEffect(() => {
        getDetails();
    }, []);

    return <>
        <div className="mt-4 mb-2 ml-2 md:hidden font-bold text-2xl">Playlist Items</div>
        <motion.div layout transition={{ duration: 0.5 }} className="items max-h-full overflow-y-scroll basis-full md:basis-[70%] grow ">
            {loading ? <>
                <PlayListItemSkeleton />
                <PlayListItemSkeleton />
                <PlayListItemSkeleton />
                <PlayListItemSkeleton />
                <PlayListItemSkeleton />
            </> :
                items?.map((item: any, index: any) => {
                    return <PlayListItem key={index} index={index + 1} item={item} />
                })
            }

        </motion.div>
    </>
}

const PlayListItem = ({ index, item }: any) => {
    return <>
        <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.contentDetails?.videoId}`} className="flex flex-col md:items-center md:flex-row w-full max-w-full overflow-x-hidden py-2 mb-2">
            <motion.div layout transition={{ duration: 0.5 }} className="hidden md:flex items-center justify-center basis-[4%]">{index}</motion.div>
            <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.contentDetails?.videoId}`} className="basis-[20%] shrink-0 h-full ">
                <motion.div layout transition={{ duration: 0.5 }} className="w-full h-full relative pt-[56.25%] overflow-hidden">
                    <Image src={item?.snippet?.thumbnails?.medium?.url || videoImg} loading='lazy' className='absolute md:rounded-lg top-0 dark:bg-[#202324] bg-[#b8b8b8] right-0 bottom-0 left-0 !w-full !h-full !min-w-0 !min-h-0' layout='fill' alt='itemImg' />
                </motion.div>
            </Link>
            <motion.div layout transition={{ duration: 0.5 }} className="grow shrink basis-[60%] ml-3 mb-auto">
                <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.contentDetails?.videoId}`} className="text-[1.1rem] mt-2 md:mt-0 font-semibold truncate-1">{item?.snippet?.title}</Link>
                <motion.div layout transition={{ duration: 0.5 }} className="w-full flex flex-wrap">
                    <Link href={`/channel/${item?.snippet?.channelId}`} className="text-[#aeadad] dark:hover:text-white hover:text-black text-[0.9rem] max-w-[50%] truncate mr-1">{item?.snippet?.channelTitle} </Link>
                    <motion.div layout transition={{ duration: 0.5 }} className="text-[#b9b9b9] text-[0.9rem]"> &bull; 2.1M views &bull; {DateConverter(item?.contentDetails?.videoPublishedAt)} ago</motion.div>
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


export default PlaylistPage;

