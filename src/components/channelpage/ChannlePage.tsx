import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineHistory } from 'react-icons/ai';
import { RiPlayListLine } from 'react-icons/ri'
import { motion } from 'framer-motion';
import Image from 'next/legacy/image';
import { isLargeContext } from '@/app/layout';
import { CountConverter } from '@/utils/Functions/Converters/CountConverter';
import SekeltonImg from '../global/skeletonComponents/ImgSkeleton';
import SekeltonText from '../global/skeletonComponents/TextSkeleton';
import { DateConverter } from '@/utils/Functions/Converters/DateConverter';
import { signIn, useSession } from 'next-auth/react';
import useSWR, { useSWRConfig } from 'swr';

const videoImg = 'https://i.ytimg.com/vi/fsNrgCivsZg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBjTNa2oj9zdcd0gdxGRYylfpzalA'

const channelFetcher = async (id : any) => {
    try{
        const results = await fetch('/api/channel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        })
    
        if (results.status !== 404 && results.status != 500) {
            const { channelDetails, isSub, subIdres } = await results.json();
    
            return {
                sub: isSub,
                subId: subIdres,
                channel : channelDetails,
            }
        }
        else return {
            sub : false,
            subId : '',
            channel : {}
        }
    }
    catch(error){
        return {
            sub : false,
            subId : '',
            channel : {}
        }
    }
}

const ChannelVideosFetcher = async (id : any ,type : any) => {
    try{
        const results = await fetch(`/api/channel/${type}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        })
    
        if (results.status !== 404 && results.status != 500) {
            const { data } = await results.json();
            return data;
        }
        return [];
    }
    catch(err){
        return [];
    }
}

const ChannelPage = ({ channelId }: any) => {

    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className='overflow-y-scroll h-screen pb-[10rem] dark:bg-black bg-white dark:text-white'>
            <ChannelInfo id={channelId} />
            <VideoSection id={channelId} type={"activities"} />
            <VideoSection id={channelId} type={"playlists"} />
        </motion.div>
    </>)
}

const ChannelInfo = ({ id }: any) => {
    const [sub, setSub] = useState<any>(false);
    const [subId, setSubId] = useState('');
    const { status } = useSession();
    const { mutate } = useSWRConfig()

    const {data , error , isLoading : loading} = useSWR(id,()=>channelFetcher(id))

    useEffect(()=>{
        if(data){
            setSub(data?.sub);
            setSubId(data?.subId);
        }
    },[data]);

    const toggleSub = () => {
        if (status == 'authenticated') {
            subscribe();
        }
        else signIn("google");
    }

    const subscribe = async () => {
        try {
            const res = await fetch(`/api/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, subId: subId, toSub: !sub })
            })

            if (res.status === 200) {
                if (sub) {
                    const { flag, data } = await res.json();
                    if (flag) setSub(false);
                }
                else {
                    const { flag, data } = await res.json();
                    setSubId(data);
                    if (flag) setSub(true)
                }
                mutate('subs')
            }

        }
        catch (err) {
            console.log(err);
        }
    }



    return <>
        <motion.div layout transition={{ duration: 0.5 }} className="flex relative flex-wrap dark:bg-black bg-white md:mt-6">

            <motion.div layout transition={{ duration: 0.5 }} className="basis-full relative md:min-w-[15rem] h-full md:basis-[15%] md:px-8 ">
                <motion.div layout transition={{ duration: 0.5 }} className="w-full h-full md:relative md:pb-[100%] pb-[40%] overflow-hidden">
                    <motion.div layout transition={{ duration: 0.5 }} className="absolute w-full h-full top-0 md:right-0 md:bottom-0 md:left-0">
                        {loading ? <SekeltonImg className='md:!rounded-full' /> :
                            <Image className='md:rounded-full dark:bg-[#202324] bg-[#b8b8b8] md:!min-h-full md:!h-full !h-[10%]' src={data?.channel?.snippet?.thumbnails?.medium?.url} layout='fill' alt='channelImg' loading='lazy' />}
                    </motion.div>
                </motion.div>
            </motion.div>


            <motion.div layout transition={{ duration: 0.5 }} className="basis-[60%] shrink-0 mt-2 md:mt-0 flex min-w-min pl-3 md:pl-0 flex-col justify-center items-start grow">
                <motion.div layout transition={{ duration: 0.5 }} className="text-[2rem] w-full">{!loading ? data?.channel?.snippet?.title : <SekeltonText height={'min-h-[2rem]'} width={'w-3/4'} />}</motion.div>
                {loading ? <SekeltonText /> : <>
                    <motion.div layout transition={{ duration: 0.5 }} className="mb-2 mt-1 md:mt-0 flex flex-wrap text-[0.9rem]">
                        <motion.div layout transition={{ duration: 0.5 }} className="text-[#979696] mr-3 hover:text-[#c0bebe] cursor-pointer font-semibold">{data?.channel?.snippet?.customUrl || <SekeltonText />}</motion.div>
                        <motion.div layout transition={{ duration: 0.5 }} className="text-[#979696] mr-3 text-center">{CountConverter(data?.channel?.statistics?.subscriberCount)} Subcribers</motion.div>
                        <motion.div layout transition={{ duration: 0.5 }} className="text-[#979696] mr-3 text-center">{CountConverter(data?.channel?.statistics?.videoCount)} Videos</motion.div>
                    </motion.div>
                </>}

                {loading ? <SekeltonText /> :
                    <Link href={`/channel/${id}`} className="text-[0.9rem] whitespace-normal truncate-1 max-w-[100vw] w-full text-[#979696] hover:text-[#c0bebe] flex items-center">{data?.channel?.snippet?.description} </Link>
                }
            </motion.div>

            <motion.div layout transition={{ duration: 0.5 }} className="flex items-center justify-end my-1 px-6 grow">
                {loading ? <SekeltonText width={'max-w-[7rem]'} height={'min-h-[2.3rem]'} className='w-[7rem] h-[2.3rem] !rounded-full cursor-pointer' /> : <>{sub ?
                    <motion.button layout transition={{ duration: 0.5 }} onClick={() => toggleSub()} className='bg-[#cfcfcf57] dark:text-[#959595cd] py-1 px-4 rounded-full text-lg text-black font-semibold hover:opacity-70'>Subscribed</motion.button>
                    :
                    <motion.button onClick={() => toggleSub()} className='dark:bg-white dark:text-black bg-black text-white py-1 px-4 rounded-full md:text-lg font-semibold hover:opacity-70'>Subscribe</motion.button>
                }</>}
            </motion.div>
        </motion.div>
    </>
}

const VideoSection = ({ id, type }: any) => {
    const [see, setSee] = useState(false);
    const heading = type == 'activities' ? 'Recently Upload' : 'Playlists';
    const icon = type == 'activities' ? <AiOutlineHistory /> : <RiPlayListLine />

    const {data : items , error , isLoading : loading} = useSWR([id,type],()=>ChannelVideosFetcher(id,type),{
        refreshInterval : 900000 , // 15 minutes
        dedupingInterval : 900000,
        revalidateOnReconnect: true,
        revalidateIfStale: true,
    })

    const toggleSee = () => { setSee(!see) }

    return <>

        {(loading || items?.length > 0) && <>
            <motion.hr layout transition={{ duration: 0.5 }} className='my-6 border-none h-[0.1px] bg-[#69696945]' />

            <motion.div layout transition={{ duration: 0.5 }} className="md:mx-2 dark:bg-black bg-white">
                {loading ?
                    <motion.div layout transition={{ duration: 0.5 }} className='mb-5 mx-2 md:mx-0 flex justify-between'>
                        <SekeltonText height={'min-h-[2rem]'} width={'w-[20%]'} className="min-w-[12rem]" />
                        <SekeltonText height={'min-h-[2.5rem]'} width={'w-[6%]'} className="!rounded-full min-w-[4rem]" />
                    </motion.div> :

                    <motion.div layout transition={{ duration: 0.5 }} className="flex mx-2 md:mx-0 mb-4 justify-between">
                        <motion.div layout transition={{ duration: 0.5 }} className="flex font-bold text-lg md:text-xl items-center">
                            <motion.span layout transition={{ duration: 0.5 }} className='mr-2'>{icon}</motion.span>
                            {heading}
                        </motion.div>
                        <motion.div layout transition={{ duration: 0.5 }} className="actions">
                            <motion.button layout transition={{ duration: 0.5 }} onClick={() => toggleSee()} className='flex items-center text-sm md:text-md hover:bg-[#1e2d40] text-[#45aeff] rounded-full px-3 py-[0.1rem] md:h-10 mr-3 md:mr-1 my-1'>See All</motion.button>
                        </motion.div>
                    </motion.div>
                }

                {
                    type == 'activities' ? <VideoGallery loading={loading} see={see} items={items} />
                        : <PlayListGallery loading={loading} see={see} items={items} />
                }

            </motion.div>
        </>
        }
    </>
}

export const VideoGallery = ({ see, items, loading }: any) => {
    const { isLarge } = useContext(isLargeContext) as any;
    return <>
        <motion.div layout transition={{ duration: 0.5 }} className="justify-evenly flex-wrap dark:bg-black bg-white flex">
            {loading ? <>
                <SkeletonCard index={0} />
                <SkeletonCard index={1} />
                <SkeletonCard index={2} />
                {!isLarge && <SkeletonCard index={3} />}
            </> :

                items?.map((val: any, index: any) => {
                    if (see) return <VideoCard key={index} item={val} index={index} />;
                    else if (!isLarge ? index < 4 : index < 3) return <VideoCard key={index} item={val} index={index} />;
                })
            }
        </motion.div>
    </>
}

export const PlayListGallery = ({ see, items, loading }: any) => {
    const { isLarge } = useContext(isLargeContext) as any;
    return <>
        <motion.div layout transition={{ duration: 0.5 }} className="justify-evenly dark:bg-black bg-white flex-wrap flex">
            {loading ? <>
                <SkeletonCard index={0} />
                <SkeletonCard index={1} />
                <SkeletonCard index={2} />
                {!isLarge && <SkeletonCard index={3} />}
            </> :

                items?.map((item: any, index: any) => {
                    if (see) return <PlayListCard item={item} key={index} index={index} />;
                    else if (!isLarge ? index < 4 : index < 3) return <PlayListCard item={item} key={index} index={index} />;
                })}
        </motion.div>
    </>
}

const VideoCard = ({ index, item }: any) => {
    const { isLarge } = useContext(isLargeContext) as any;
    const time = DateConverter(item?.snippet?.publishedAt);
    return <>
        <motion.div layout transition={{ duration: 0.5, delay: !isLarge ? (index % 10) / 10 : 0 }} className="flex flex-col md:mx-2 my-2 md:max-w-[20rem] min-w-6 w-full">
            <motion.div layout transition={{ duration: 0.5 }} className="relative w-full h-full pt-[56.25%] overflow-hidden">
                <Link href={`/channel/${item?.snippet?.channelId}/${item?.snippet?.type === 'upload' ? `/video/${item?.contentDetails?.upload?.videoId}` : `/playlist/${item?.contentDetails?.playlistItem?.playlistId}`}`} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
                    <Image className='md:rounded-lg dark:bg-[#202324] bg-[#b8b8b8]' src={item?.snippet?.thumbnails?.medium?.url || videoImg} layout='fill' alt='videocardImg' />
                </Link>
            </motion.div>
            <motion.div layout transition={{ duration: 0.5 }} className="mt-1">
                <Link href={`/channel/${item?.snippet?.channelId}/${item?.snippet?.type === 'upload' ? `/video/${item?.contentDetails?.upload?.videoId}` : `/playlist/${item?.contentDetails?.playlistItem?.playlistId}`}`} className="truncate-2 text-[0.9rem] md:text-[1rem] whitespace-normal ">{item?.snippet?.title || 'no title'}</Link>
                <motion.div layout transition={{ duration: 0.5 }} className="text-[#979696] text-[0.8rem] md:text-[1rem]">{time} ago &bull; {item?.snippet?.type}</motion.div>
            </motion.div>
        </motion.div>
    </>
}

const SkeletonCard = ({ index }: any) => {
    const { isLarge } = useContext(isLargeContext) as any;
    return <>
        <motion.div layout transition={{ duration: 0.5, delay: !isLarge ? (index % 10) / 10 : 0 }} className="flex flex-col md:mx-2 my-2 md:max-w-[20rem] min-w-6 w-full">
            <motion.div layout transition={{ duration: 0.5 }} className="relative w-full h-full pt-[56.25%] overflow-hidden">
                <motion.div layout transition={{ duration: 0.5 }} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
                    <SekeltonImg className="md:!rounded-lg" />
                </motion.div>
            </motion.div>
            <motion.div layout transition={{ duration: 0.5 }} className="mt-1 w-full">
                <motion.div layout transition={{ duration: 0.5 }} className="truncate-2 text-[0.9rem] md:text-[1rem] whitespace-normal "><SekeltonText /></motion.div>
                <motion.div layout transition={{ duration: 0.5 }} className="text-[#979696] w-1/2 text-[0.8rem] md:text-[1rem]"><SekeltonText width={'min-w-[50%]'} /></motion.div>
            </motion.div>
        </motion.div>
    </>
}

const PlayListCard = ({ index, item }: any) => {
    const { isLarge } = useContext(isLargeContext) as any;
    const time = DateConverter(item?.snippet?.publishedAt);
    return <>
        {item?.contentDetails?.itemCount > 0 &&
            <motion.div layout transition={{ duration: 0.5, delay: !isLarge ? (index % 10) / 10 : 0 }} className="flex flex-col md:mx-2 my-2 md:max-w-[20rem] min-w-6 w-full">
                <motion.div layout transition={{ duration: 0.5 }} className="relative w-full h-full pt-[56.25%] overflow-hidden">
                    <Link href={`/channel/${item?.snippet?.channelId}/playlist/${item?.id}`} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
                        <Image className='md:rounded-lg dark:bg-[#202324] bg-[#b8b8b8]' src={item?.snippet?.thumbnails?.medium?.url || videoImg} layout='fill' alt='videocardImg' />
                    </Link>
                </motion.div>
                <motion.div layout transition={{ duration: 0.5 }} className="mt-1">
                    <Link href={`/channel/${item?.snippet?.channelId}/playlist/${item?.id}`} className="truncate-2 text-[0.9rem] md:text-[1rem] whitespace-normal ">{item?.snippet?.title || 'no title'}</Link>
                    <motion.div layout transition={{ duration: 0.5 }} className="text-[#979696] text-[0.8rem] md:text-[1rem]">{time} ago &bull; {item?.contentDetails?.itemCount} items</motion.div>
                </motion.div>
            </motion.div>
        }
    </>
}

export default ChannelPage;

