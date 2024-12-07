'use client'
import Link from 'next/link';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import { MdRadioButtonChecked } from "@react-icons/all-files/md/MdRadioButtonChecked";
import { MdRadioButtonUnchecked } from "@react-icons/all-files/md/MdRadioButtonUnchecked";
import { AiOutlineDislike } from '@react-icons/all-files/ai/AiOutlineDislike';
import { AiFillLike } from '@react-icons/all-files/ai/AiFillLike';
import { AiFillDislike } from '@react-icons/all-files/ai/AiFillDislike';
import { AiOutlineLike } from '@react-icons/all-files/ai/AiOutlineLike';
import { AiOutlineDownload } from '@react-icons/all-files/ai/AiOutlineDownload';

import Image from 'next/legacy/image';
import { signIn, useSession } from 'next-auth/react';
import Sekelton from '../global/skeletonComponents/TextSkeleton';
import SekeltonImg from '../global/skeletonComponents/ImgSkeleton';
import { motion } from 'framer-motion'
import { DateConverter } from "@/utils/Functions/Converters/DateConverter";
import { CountConverter } from "@/utils/Functions/Converters/CountConverter";
import { isLargeContext, pageContext, slideContext } from '@/app/layout';
import parse from 'html-react-parser'
import useSWR, { mutate } from 'swr';
import { MdPlaylistAdd } from 'react-icons/md';
import { internalMutate } from 'swr/_internal';


const videoDetailsFetcher = async (id: any, channelId: any) => {
    try {
        const res = await fetch(`/api/video/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, channelId })
        })

        if (res.status != 404 && res.status != 500) {
            const { video, channel } = await res.json();
            return {
                video,
                channel
            }

        }
    }
    catch (err) {
        console.log(err);
    }
}
const videoAuthDetailsFetcher = async (id: any, channelId: any) => {
    try {
        const res = await fetch(`/api/video/auth/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, channelId })
        })

        if (res.status != 404 && res.status != 500) {
            const { rating, subscription } = await res.json();

            return {
                rateRes: rating[0].rating === 'none' ? 0 : rating[0].rating == 'like' ? 1 : -1,
                subRes: subscription.length > 0 ? true : false,
                subIdRes: subscription.length > 0 ? subscription[0]?.id : null,
            }
        }
    }
    catch (err) {
        console.log(err);
    }
}

const relativeDownloadFetcher = async (id: any) => {
    try {
        const res = await fetch(`/api/video/${id}/reldowns`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })

        if (res.status != 404 && res.status != 500) {
            const { linksStr, relatedVideosStr } = await res.json();
            const Links = JSON.parse(linksStr)
            const relatedVideos = JSON.parse(relatedVideosStr);

            return {
                related: relatedVideos,
                links: Links,
            }
        }

    }
    catch (err) {
        console.log(err);
    }
}
const commentsFetcher = async (id: any) => {
    try {
        const res = await fetch(`/api/video/${id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        })

        if (res.status != 404 && res.status != 500) {
            const { data } = await res.json();
            return data;
        }
    }
    catch (err) {
        console.log(err);
    }
}

const dataContext = createContext<any>(null);

const Videopage = ({ id, channelId }: any) => {
    const { status, data: session } = useSession();
    const { setslide } = useContext(slideContext) as any;
    const { setpage , myPlaylists } = useContext(pageContext) as any;
    const { setIsLarge } = useContext(isLargeContext) as any;

    setpage(true);
    setslide(-1);

    useEffect(() => setIsLarge(false), []);

    const [downloading, setDownloading] = useState<boolean>(false);
    const [addToPlaylist, setAddToPlaylist] = useState<boolean>(false);
    const [createPlaylist, setCreatePlaylist] = useState<boolean>(false);

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    function useOutsideAlerter(ref: any) {
        useEffect(() => {
            function handleClickOutside(event: any) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setDownloading(false);
                    setAddToPlaylist(false);
                }
            }
            document.addEventListener("mouseup", handleClickOutside);

        }, [ref]);
    }


    const saveToHistory = async (video: any, channel: any) => {

        fetch(`/api/history/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

            body: JSON.stringify({
                id: id,
                channelId: channelId,
                title: video?.snippet?.title || "Untitled",
                channelTitle: video?.snippet?.channelTitle || "Untitled",
                videoImg: video?.snippet?.thumbnails?.medium?.url || video?.snippet?.thumbnails?.default?.url,
                channelImg: channel?.snippet?.thumbnails?.default?.url || "",
                email: session?.user?.email
            }),
        })

        if (typeof window !== "undefined") {
            const saveObj = {
                id: id,
                channelId: channelId,
                title: video?.snippet?.title || "Untitled",
                channelTitle: video?.snippet?.channelTitle || "Untitled",
                videoImg: video?.snippet?.thumbnails?.medium?.url || video?.snippet?.thumbnails?.default?.url,
                channelImg: channel?.snippet?.thumbnails?.default?.url || "",
                timestamp: Date.now()
            }

            let historyStr = localStorage.getItem('history');

            if (!historyStr) {
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
                    let historyItemsOld = videoItems as Array<any>;
                    let historyItems = [] as any;
                    historyItems.push(saveObj);
                    historyItemsOld?.forEach(item => { if (item.id !== id) historyItems.push(item); })
                    while (historyItems.length > 24) historyItems.pop();
                    localStorage.setItem('history', JSON.stringify(historyItems));
                }
            } else {
                const historyItemsOld = JSON.parse(historyStr) as Array<any>;
                let historyItems = [] as any;
                historyItems.push(saveObj);
                historyItemsOld?.forEach(item => { if (item.id !== id) historyItems.push(item); })
                while (historyItems.length > 24) historyItems.pop();
                localStorage.setItem('history', JSON.stringify(historyItems));
            }
        }

    }

    const { data: videoData, error: videoError, isLoading: loading } = useSWR(['video', id], () => videoDetailsFetcher(id, channelId), {
        revalidateIfStale: true,
        revalidateOnReconnect: true,
        refreshInterval: 900000,
        dedupingInterval: 900000,
    });

    const { video, channel } = videoData || { video: {}, channel: {} };


    const { data: relData, error, isLoading: loading2 } = useSWR(['relDown', id], () => relativeDownloadFetcher(id), {
        revalidateIfStale: true,
        revalidateOnReconnect: true,
        refreshInterval: 3600000,
        dedupingInterval: 3600000,
    });

    const { related, links } = relData || { related: [], links: [] }


    useEffect(() => {
        if (videoData) saveToHistory(video, channel)
    }, [videoData])

    return (<>
        <dataContext.Provider value={{ id, channelId, video, channel, loading, loading2, links, related, downloading, setDownloading, addToPlaylist, setAddToPlaylist , createPlaylist , setCreatePlaylist , myPlaylists }}>
            <motion.div layout transition={{ duration: 0.5 }} className="h-screen transition-all relative overflow-y-scroll pb-8">
                <motion.div layout transition={{ duration: 0.5 }} className="flex w-full flex-col md:flex-row justify-between">
                    <VideoSection />
                    <SideRow />
                    {
                        (downloading) && <motion.div ref={wrapperRef} className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]"><DownloadModal /></motion.div>
                    }

                    {
                        (addToPlaylist) && <motion.div ref={wrapperRef} className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]"><PlaylistModal /></motion.div>
                    }

                    {
                        (createPlaylist) && <motion.div className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]"><CreatePlaylistModal /></motion.div>
                    }
                </motion.div>
            </motion.div>
        </dataContext.Provider>
    </>)
}

const VideoSection = () => {

    const { video, loading, id, channelId } = useContext(dataContext);
    const { status, data: session } = useSession();

    const commentsCount = video?.statistics?.commentCount || 0;

    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className=" md:basis-[64%] shrink md:pb-[5rem] md:h-[89vh] overflow-y-scroll">

            <motion.div layout transition={{ duration: 0.5 }} className="w-full relative pt-[56.25%] overflow-hidden">

                <motion.iframe allow='autoplay' allowFullScreen src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0`} className='absolute top-0 left-0 bottom-0 right-0 w-full h-full' loading='eager' />

            </motion.div>

            <motion.h3 className="px-1 md:px-0 pt-4  truncate-1 dark:text-white text-[1.2rem] font-semibold w-full">{loading ? <Sekelton height={'h-6'} width={'w-[95%] md:w-full'} className="mx-auto  md:mx-0" /> : video?.snippet?.title}</motion.h3>

            {loading ? <VideoInfoSkeleton /> : <VideoInfo />}

            <motion.div layout transition={{ duration: 0.5 }} className="h-fit-content w-full px-2 md:px-0 mt-4 dark:text-white">

                {loading ? <Sekelton height={'h-24'} className="mb-4" /> : <Description />}

                {loading ? <Sekelton width="min-w-[20%] max-w-[20%]" className="my-1" /> :
                    <motion.h4 className='hidden md:block my-1'>{commentsCount} Comments</motion.h4>}

                {status == 'authenticated' &&
                    <CommentForm img={session?.user?.image} id={id} channelId={channelId} />
                }

                <Comments id={id} />

            </motion.div>
        </motion.div>
    </>)
}

const VideoInfo = () => {
    const [rate, setRate] = useState<any>(0)
    const [sub, setSub] = useState<any>(false);
    const [subId, setSubId] = useState<any>('');
    const { status } = useSession();
    const { id, channelId, video, channel, loading, loading2, addToPlaylist, setAddToPlaylist, downloading, setDownloading } = useContext(dataContext);
    mutate('history');

    const { data: authData, error: videoError, isLoading: authLoading } = useSWR(status === 'authenticated' ? ['authvideo', id] : null, () => videoAuthDetailsFetcher(id, channelId), {
        revalidateIfStale: true,
        revalidateOnReconnect: true,
        refreshInterval: 900000,
        dedupingInterval: 900000,
    });

    const { rateRes, subRes, subIdRes } = authData || { rateRes: 0, subRes: false, subIdRes: '' };

    useEffect(() => {
        if (authData) {
            setRate(rateRes);
            setSubId(subIdRes);
            setSub(subRes);
        }
    }, [authData]);


    const toggleSub = async () => {
        if (status == 'authenticated') {
            try {
                const res = await fetch(`/api/subscribe`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: channelId, subId: subId, toSub: !sub })
                });

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
                    mutate(['authvideo', id])
                    mutate('subs');
                }

            }
            catch (err) {
                console.log(err);
            }
        }
        else signIn("google");
    }

    const toggleRate = async (rating: any) => {
        if (status == 'authenticated') {
            try {
                const res = await fetch(`/api/rate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id, rating: rating })
                })

                if (res.status === 200) {
                    const { flag } = await res.json();
                    if (flag) {
                        if (rating == 'none') setRate(0);
                        if (rating == 'like') setRate(1);
                        if (rating == 'dislike') setRate(-1);
                    }
                    mutate(['liked', 0]);
                    mutate(['authvideo', id]);
                }

            }
            catch (err) {
                console.log(err);
            }
        }
        else signIn("google");
    }

    const subscribers = CountConverter(channel?.statistics?.subscriberCount || 0);

    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col flex-wrap md:flex-row md:items-center px-1 md:px-0 justify-center mt-5 text-[#5a5a5a] w-full">

            <motion.div layout transition={{ duration: 0.5 }} className="justify-between flex w-full min-w-min md:basis-[40%] grow md:max-w-full md:text-md text-xs">

                <motion.div layout transition={{ duration: 0.5 }} className={`flex items-center w-[70%]`}>
                    <Link href={`/channel/${channelId}`} className=" min-w-[45px] min-h-[45px]">
                        {
                            loading ?
                                <SekeltonImg width={'min-w-[45px]'} height={'min-h-[45px]'} circle />
                                :
                                <Image width={45} height={45} alt={'channel'} className='rounded-full dark:bg-[#202324] bg-[#b8b8b8]' src={channel?.snippet?.thumbnails?.default?.url} />
                        }
                    </Link>

                    <motion.div layout transition={{ duration: 0.5 }} className="ml-3">
                        {loading ? <Sekelton width={'w-full'} /> : <Link href={`/channel/${channelId}`} className="text-lg font-bold text-black dark:text-white truncate-1 w-full overflow-hidden"> {video?.snippet?.channelTitle}</Link>}
                        {loading ? <Sekelton width={'w-full'} /> : <motion.div layout transition={{ duration: 0.5 }} className="text-sm w-full"> {subscribers} subscribers </motion.div>}
                    </motion.div>
                </motion.div>

                <motion.div layout transition={{ duration: 0.5 }} className="w-min items-center justify-center flex">
                    {sub == true ?
                        <motion.button onClick={() => toggleSub()} className='bg-[#cfcfcf57] border-[0.01rem] dark:border-[#cfcfcf40] dark:text-[#c7c7c7cd] py-1 px-4 rounded-full text-lg text-black font-semibold hover:opacity-70'>Subscribed</motion.button>
                        :
                        <motion.button onClick={() => toggleSub()} className='dark:bg-white bg-black py-1 px-4 rounded-full text-lg dark:text-black text-white font-semibold hover:opacity-70'>Subscribe</motion.button>
                    }
                </motion.div>
            </motion.div>

            <motion.div layout transition={{ duration: 0.5 }} className=" dark:text-white max-w-full md:basis-[60%] grow flex text-xs md:text-md overflow-x-scroll md:overflow-x-auto flex-nowrap md:flex-wrap md:px-0 justify-between items-center mt-4 md:mt-0 md:justify-end" id="buttons">

                <motion.div layout transition={{ duration: 0.5 }} className="flex h-10 items-center mr-3 md:mr-6 my-1">

                    {
                        rate == 1 ?
                            <motion.div onClick={() => toggleRate('none')} layout transition={{ duration: 0.5 }} className='flex dark:border dark:border-[#6262624a] dark:!border-r-[#ffffff28] dark:bg-[#6c6c6c57] cursor-pointer bg-[#cfcfcf57] hover:dark:bg-[#6c6c6c68] hover:bg-[#cfcfcf73] pr-2 pl-4 h-full rounded-l-full items-center'>
                                <AiFillLike className='text-[1.2rem] md:text-[1.5rem]' />
                                <motion.span className='px-3'>{CountConverter(video?.statistics?.likeCount || 0)}</motion.span>
                            </motion.div> :
                            <motion.div onClick={() => toggleRate('like')} layout transition={{ duration: 0.5 }} className='flex dark:border dark:border-[#6262624a] dark:!border-r-[#ffffff23] dark:bg-[#6c6c6c57] cursor-pointer bg-[#cfcfcf57] hover:dark:bg-[#6c6c6c68] hover:bg-[#cfcfcf73] pr-2 pl-4 h-full rounded-l-full items-center'>
                                <AiOutlineLike className='text-[1.2rem] md:text-[1.5rem]' />
                                <motion.span className='px-3'>{CountConverter(video?.statistics?.likeCount || 0)}</motion.span>
                            </motion.div>
                    }

                    {
                        rate == -1 ?
                            <motion.div onClick={() => toggleRate('none')} layout transition={{ duration: 0.5 }} className='flex dark:bg-[#6c6c6c57] dark:border-[0.01rem] dark:border-[#6262624a] cursor-pointer bg-[#cfcfcf57] hover:dark:bg-[#6c6c6c68] hover:bg-[#cfcfcf73] pl-2 pr-4  h-10 rounded-r-full items-center'>
                                <AiFillDislike className='text-[1.2rem] md:text-[1.5rem]' />
                            </motion.div> :
                            <motion.div onClick={() => toggleRate('dislike')} layout transition={{ duration: 0.5 }} className='flex cursor-pointer dark:bg-[#6c6c6c57] dark:border-[0.01rem] dark:border-[#6262624a] bg-[#cfcfcf57] hover:dark:bg-[#6c6c6c68] hover:bg-[#cfcfcf73] pl-2 pr-4  h-10 rounded-r-full items-center'>
                                <AiOutlineDislike className='text-[1.2rem] md:text-[1.5rem]' />
                            </motion.div>
                    }

                </motion.div>

                <motion.button disabled={loading2} layout transition={{ duration: 0.5 }} onClick={() => { if (!addToPlaylist) { setAddToPlaylist(true) } }} className={`flex items-center ${loading2 && 'skeletonUi text-transparent cursor-progress'} dark:bg-[#6c6c6c57] bg-[#cfcfcf57] hover:dark:bg-[#6c6c6c68] hover:bg-[#cfcfcf73] dark:border-[0.01rem] dark:border-[#6262624a] rounded-full px-4 h-10 mr-3 my-1`}>
                    <MdPlaylistAdd className='sm:mr-2 text-[1.2rem] md:text-[1.5rem]' /> <span className='hidden sm:flex'> Add to Playlist</span>
                </motion.button>


                {/* <motion.button disabled={loading2} layout transition={{ duration: 0.5 }} onClick={() => { if (!downloading) { setDownloading(true) } }} className={`flex items-center ${loading2 && 'skeletonUi text-transparent cursor-progress'} dark:bg-[#6c6c6c57] bg-[#cfcfcf57] hover:dark:bg-[#6c6c6c68] hover:bg-[#cfcfcf73] dark:border-[0.01rem] dark:border-[#6262624a] rounded-full px-4 h-10 mr-3 my-1`}>
                    <AiOutlineDownload className='mr-2 text-[1.2rem] md:text-[1.5rem]' /> Download
                </motion.button> */}


            </motion.div>

        </motion.div>
    </>)
}

const VideoInfoSkeleton = () => {

    return <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col flex-wrap md:flex-row md:items-center justify-center mt-5 text-[#5a5a5a] w-full">

        <motion.div layout transition={{ duration: 0.5 }} className="flex md:basis-[40%] grow md:text-md text-xs basis-full mb-2 px-2">
            <motion.div layout transition={{ duration: 0.5 }} className={`flex items-center w-1/3`}>
                <motion.div layout transition={{ duration: 0.5 }} className="min-w-[45px] min-h-[45px]">
                    <SekeltonImg width={'min-w-[45px]'} height={'min-h-[45px]'} circle />
                </motion.div>

                <motion.div layout transition={{ duration: 0.5 }} className="ml-2 min-w-full">
                    <Sekelton width={'w-full mb-1'} height={'h-5'} />
                    <Sekelton width={'w-full'} height={'h-3'} />
                </motion.div>
            </motion.div>
            <motion.div layout transition={{ duration: 0.5 }} className="ml-auto w-1/2 flex items-center justify-end">
                <Sekelton width={'w-3/4'} height={'h-3/4'} rounded className="!rounded-full max-w-[10rem] " />
            </motion.div>
        </motion.div>

        <motion.div layout transition={{ duration: 0.5 }} className="dark:text-white  w-screen md:w-auto flex text-xs md:text-md overflow-x-scroll md:overflow-x-auto flex-nowrap md:flex-wrap basis-[100%] shrink grow md:basis-[60%] px-1 md:px-0 justify-between mt-4 md:mt-0 md:justify-end" id="buttons">

            <motion.div layout transition={{ duration: 0.5 }} className="flex h-10 dark:bg-[#202324] bg-[#b8b8b8] animate-pulse rounded-full items-center mr-3 md:mr-1 mb-4">

                <motion.div layout transition={{ duration: 0.5 }} className='flex pr-2 pl-4 h-10 rounded-l-full items-center'>
                    <AiOutlineLike className='text-[1.2rem] md:text-[1.5rem] text-transparent' />
                    <motion.span layout transition={{ duration: 0.5 }} className='px-3'><motion.div layout transition={{ duration: 0.5 }} className={'w-6'} /></motion.span>
                </motion.div>

                <motion.div layout transition={{ duration: 0.5 }} className='flex skeletonUi pl-2 pr-4 h-10 rounded-r-full items-center'>
                    <AiOutlineDislike className='text-[1.2rem] text-transparent md:text-[1.5rem]' />
                </motion.div>

            </motion.div>

            <motion.div className='cursor-default dark:bg-[#202324] bg-[#b8b8b8] skeletonUi flex items-center  text-transparent  text-xs md:text-md  rounded-full px-4 h-10 mr-3 mb-4'>
                <MdPlaylistAdd className='sm:mr-2 text-[1.2rem] md:text-[1.5rem]' /> <span className='hidden sm:flex'> Add to Playlist</span>
            </motion.div>

            <motion.div className='cursor-default dark:bg-[#202324] bg-[#b8b8b8] skeletonUi flex items-center  text-transparent  text-xs md:text-md  rounded-full px-4 h-10 mr-3 mb-4'>
                <AiOutlineDownload className='mr-2 text-[1.2rem] md:text-[1.5rem]' /> Download
            </motion.div>


        </motion.div>
    </motion.div>
}

const Description = () => {
    const [largeDesc, setLargeDesc] = useState(false);
    const { loading, video } = useContext(dataContext);

    return (<> <motion.div layout transition={{ duration: 0.5 }} onClick={() => { if (!largeDesc) { setLargeDesc(true) } }} className={`py-3 px-3 dark:bg-[#6c6c6c57] bg-[#cfcfcf57] ${!largeDesc && 'cursor-pointer'} rounded-lg w-full h-fit-content mb-4`}>
        <motion.div layout transition={{ duration: 0.5 }} className="flex w-full flex-wrap">
            <motion.span layout transition={{ duration: 0.5 }} className='mr-2 min-w-max text-[0.8rem] md:text-md'>{CountConverter(video?.statistics?.viewCount)} views</motion.span>
            <motion.span layout transition={{ duration: 0.5 }} className='mr-2 min-w-max text-[0.8rem] md:text-md'>{DateConverter(video?.snippet?.publishedAt)} ago</motion.span>
            <motion.div layout transition={{ duration: 0.5 }} className="dark:text-white opacity-30 truncate-2">
                {
                    !loading && video?.snippet?.tags?.map((tag: any, index: any) => {
                        return <motion.span layout transition={{ duration: 0.5 }} key={index} className='mr-1 '>#{tag}</motion.span>
                    })
                }
            </motion.div>
        </motion.div>

        <motion.pre onClick={() => setLargeDesc(!largeDesc)} layout transition={{ duration: 0.5 }} className={`${!largeDesc ? 'h-6' : 'h-fit'} hidden md:block overflow-hidden mt-1`}>
            {parse(video?.snippet?.description)}
        </motion.pre>

    </motion.div>
    </>)
}

const CommentForm = ({ img, channelId, id }: any) => {
    const [comment, setComment] = useState<any>('');

    const commenting = async () => {
        try {
            const res = await fetch(`/api/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, channelId, comment })
            })

            if (res.status === 200) {
                setComment('');
                setTimeout(() => mutate(['comments', id]), 20000);
            }

        }
        catch (err) {
            console.log(err);
        }
    }

    const videoComment = (e: any) => {
        e.preventDefault();
        commenting();
    }


    return (<>

        <motion.form onSubmit={(e: any) => videoComment(e)} className="mt-4 hidden md:flex items-start">

            {
                img ? <Image src={img} width={45} height={45} alt={'commentImg'} className='rounded-full bg-grey' /> :
                    <SekeltonImg width={'min-w-[45px]'} height={'min-h-[45px]'} circle />
            }


            <motion.div layout transition={{ duration: 0.5 }} className="basis-auto w-full ml-6 flex flex-col">

                <motion.input value={comment} autoComplete='off' onChange={(e: any) => setComment(e.target.value)} className='w-full bg-transparent text-lg focus:outline-none focus:dark:border-white focus:border-black transition-colors border-b border-[#5a5a5a]' type="text" name="commenttoadd" id="commenttoadd" placeholder="Write comments..." />

                <motion.div layout transition={{ duration: 0.5 }} className="btns w-full flex justify-end transition-colors mt-3">
                    <motion.button layout transition={{ duration: 0.5 }} onClick={() => setComment('')} type='reset' className='mr-4 opacity-90 hover:opacity-100'>Cancel</motion.button>
                    <motion.button layout transition={{ duration: 0.5 }} type='submit' className={`ml-4 ${comment == '' ? 'dark:bg-[#212121] bg-grey cursor-not-allowed' : 'bg-[#3ea6ff] hover:bg-[#77bcf8]'} py-[.3rem] px-3 rounded-full dark:text-black`}>Comment</motion.button>
                </motion.div>

            </motion.div>
        </motion.form>
    </>)
}

const Comments = ({ id }: any) => {

    const { data: comments, error: videoError, isLoading: loading } = useSWR(['comments', id], () => commentsFetcher(id), {
        revalidateIfStale: true,
        revalidateOnReconnect: true,
        refreshInterval: 900000,
        dedupingInterval: 900000,
    });

    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className="hidden w-full overflow-x-hidden md:block pb-2">
            {
                loading ? null :
                    comments?.map((item: any, index: any) => {
                        return <Comment key={index} item={item} />
                    })
            }
        </motion.div>
    </>)
}

const Comment = ({ item }: any) => {
    const [readmore, setReadmore] = useState(false);

    return <motion.div layout transition={{ duration: 0.5 }} className="flex mt-6 justify-between">
        <motion.div layout transition={{ duration: 0.5 }} className="basis-[5%] flex justify-center items-start">
            <Link href={`/channel/${item?.snippet?.topLevelComment?.snippet?.authorChannelId?.value}`} className="w-[45px] h-[45px] rounded-full">
                <Image width={45} height={45} src={item?.snippet?.topLevelComment?.snippet?.authorProfileImageUrl} className='rounded-full dark:bg-[#202324] bg-[#b8b8b8]' loading='lazy' alt='commentImg' />
            </Link>
        </motion.div>


        <motion.div layout transition={{ duration: 0.5 }} className="basis-[95%] grow ml-3 flex flex-col">
            <motion.div layout transition={{ duration: 0.5 }} className="flex text-[0.85rem] font-semibold"> <Link href={`/channel/${item?.snippet?.topLevelComment?.snippet?.authorChannelId?.value}`}>{item?.snippet?.topLevelComment?.snippet?.authorDisplayName}</Link>
                <motion.span layout transition={{ duration: 0.5 }} className='ml-3 font-[500] text-[#959595cd] text-'>
                    {DateConverter(item?.snippet?.topLevelComment?.snippet?.updatedAt)} ago</motion.span>
            </motion.div>

            <motion.div layout transition={{ duration: 0.5 }} onClick={() => { setReadmore(!readmore) }} className={`text-[0.95rem] ${!readmore && 'truncate-5'} mt-1 font-[500]`}>{parse(item?.snippet?.topLevelComment?.snippet?.textDisplay)}</motion.div>

            <motion.div layout transition={{ duration: 0.5 }} className="flex items-center mt-3">
                <AiOutlineLike className='text-[1.5rem] mr-2' />
                <motion.span layout transition={{ duration: 0.5 }} className='text-[0.9rem]'>{CountConverter(item?.snippet?.topLevelComment?.snippet?.likeCount)}</motion.span>
                <AiOutlineDislike className='text-[1.5rem] ml-2' />
            </motion.div>
        </motion.div>
    </motion.div>
}

const SideRow = () => {
    const { related, loading2 } = useContext(dataContext);
    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className="md:basis-[33%] mt-6 md:mt-0 basis-full h-[89vh] overflow-y-scroll flex flex-col px-1">
            {
                loading2 ? Array.from({ length: 10 }, (_, index) => {
                    return <SideVideoSkeleton key={index} />;
                }) :
                    related?.map((item: any, index: any) => {
                        return <SideVideo key={index} item={item} />
                    })
            }
        </motion.div>
    </>)
}

const SideVideo = ({ item }: any) => {

    const { id, title, published, author, short_view_count_text, view_count, length_seconds, thumbnails } = item;

    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className=" flex flex-wrap w-fulljustify-between mb-3 px-3 md:px-0">

            <motion.div layout transition={{ duration: 0.5 }} className="basis-[35%] mr-2 h-full">
                <Link href={`/channel/${author?.id}/video/${id}`} className="flex w-full h-full relative pt-[56.25%] overflow-hidden justify-center items-center">
                    <Image layout='fill' className='dark:bg-[#202324] bg-[#b8b8b8] absolute top-0 right-0 left-0 bottom-0 h-full w-full rounded-md' loading="lazy" alt="." placeholder="blur" blurDataURL={thumbnails[0]?.url || "@/images/noimg.png"} src={thumbnails[1]?.url || thumbnails[0]?.url} />
                </Link>
            </motion.div>

            <motion.div layout transition={{ duration: 0.5 }} className="basis-[60%] pt-1 overflow-hidden ">
                <Link href={`/channel/${author?.id}/video/${id}`} className="text-md w-full dark:text-white md:text-lg md:leading-5 mb-1 truncate-2">{title}</Link>
                <motion.div layout transition={{ duration: 0.5 }} className="flex flex-wrap flex-col">
                    <motion.p layout transition={{ duration: 0.5 }} className="text-[#606060] font-medium text-sm"><Link className='hover:text-[#888888] mr-1' href={`/channel/${author.id}`}>{author.name}</Link></motion.p>
                    <motion.p layout transition={{ duration: 0.5 }} className="text-[#606060] font-medium text-sm ">{short_view_count_text || CountConverter(view_count)}  &bull; {published}</motion.p>
                </motion.div>
            </motion.div>

        </motion.div>
    </>)
}

const SideVideoSkeleton = () => {
    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className="flex w-full cursor-progress justify-between mb-6 px-3 md:px-0">

            <motion.div layout transition={{ duration: 0.5 }} className="basis-[35%]">
                <motion.div layout transition={{ duration: 0.5 }} className="w-full h-full relative pt-[56.25%] overflow-hidden">
                    <SekeltonImg className="rounded-md absolute top-0 right-0 bottom-0 left-0 w-full h-full" />
                </motion.div>
            </motion.div>

            <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col basis-[64%] shrink-0 pt-1">
                <Sekelton className="mb-1" />
                <Sekelton className="mb-1" />
                <Sekelton width={'w-1/2'} height={'h-3'} />
                <Sekelton width={'w-1/3'} height={'h-3'} />
            </motion.div>

        </motion.div>
    </>)
}

const PlaylistModal = () => {
    const { setAddToPlaylist, myPlaylists , setCreatePlaylist , id , video ,channelId } = useContext(dataContext) as any;
    const [selected, setSelected] = useState('');
    const [loading , setLoading] = useState(false);
    const {data : session} = useSession();

    const addToPlaylist = async ()=>{

        try {


            const bodyData = {
                videoId : id,
                title : video?.snippet?.title,
                img : video?.snippet?.thumbnails?.high?.url || video?.snippet?.thumbnails?.medium?.url ||  video?.snippet?.thumbnails?.default?.url || "",
                channelTitle : video?.snippet?.channelTitle,
                channelId : channelId,
                publishedAt: video?.snippet?.publishedAt
            }

            setLoading(true);

            const res = await fetch(`/api/library/myPlaylists/addItem`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ playlistId : selected , bodyData : bodyData , email : session?.user?.email })
            })

            if (res.status === 200) {
                mutate('myPlaylists');
                mutate(['libUser','myPlaylists/list'])
                setAddToPlaylist(false);
                setLoading(false)
            }
            else{
                setLoading(false);
            }

        }
        catch (err) {
            setLoading(false);
            console.log(err);
        }

    }
    

    return <>
        <motion.div layout className="rounded-lg w-fit h-fit shadow-lg px-6 py-2 bg-white dark:bg-[#212121]">
            <motion.div layout className="my-2 dark:text-white text-black w-full text-lg">Your Playlists</motion.div>
            <motion.div layout className="w-fit sm:w-[20rem] py-2">
                {
                    myPlaylists?.map((item: any, index: any) => {
                        const { name  } = item;
                        return <motion.div key={index} layout onClick={() => setSelected(item._id)}
                            className="w-full duration-[.4s] hover:bg-[#4645453f] rounded-lg px-2 h-fit py-3 mb-1 cursor-pointer dark:text-white flex items-center">
                            {item._id === selected ? <MdRadioButtonChecked className='text-[#3ea6ff] text-2xl' /> : <MdRadioButtonUnchecked className='text-2xl' />}
                            <motion.span className="ml-3 opacity-80 w-[80%] text-[0.9rem] h-fit">{name}</motion.span>
                        </motion.div>

                    })
                }
            </motion.div>


            <motion.div layout className="flex mt-2 justify-end dark:text-white">
                <motion.div className={`px-4 py-2 duration-[.4s] font-bold text-[0.9rem] rounded-full mr-1 text-[#3ea6ff] hover:dark:bg-[#263850] hover:bg-[#3ea5ff54] cursor-pointer`} onClick={()=>setCreatePlaylist(true)}>Create New</motion.div>
                <motion.div className="px-4 py-2 duration-[.4s] font-bold text-[0.9rem] rounded-full cursor-pointer hover:bg-[#cfcfcf73] hover:dark:bg-[rgba(255,255,255,0.2)] mr-3" onClick={() => setAddToPlaylist(false)} >Cancel</motion.div>
                <motion.button className={`px-4 py-2 duration-[.4s] font-bold text-[0.9rem] rounded-full mr-1 ${(selected !== '' && !loading) ? 'text-[#3ea6ff] hover:dark:bg-[#263850] hover:bg-[#3ea5ff54] cursor-pointer' : 'text-[#5a5a5a] cursor-not-allowed'}`} disabled={selected === '' || loading} onClick={()=>addToPlaylist()}>Add</motion.button>
            </motion.div>

        </motion.div>
    </>
}

const CreatePlaylistModal = () => {
    const { setAddToPlaylist , setCreatePlaylist , myPlaylists } = useContext(dataContext) as any;
    const { status, data: session } = useSession();
    
    setAddToPlaylist(false);
    const [name ,setName] = useState("");

    const createPlaylist = async ()=>{
        

        try {

            myPlaylists.forEach((item: { name: string; }) => {
                if(item.name === name){
                    setName("");
                    return;
                }
            });

            const res = await fetch(`/api/library/myPlaylists/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name : name , email : session?.user?.email })
            })

            if (res.status === 200) {
                setName("");
                mutate('myPlaylists');
                setCreatePlaylist(false);
                setAddToPlaylist(true);
            }

        }
        catch (err) {
            console.log(err);
        }

    }



    return <>
        <motion.div layout className="rounded-lg w-fit h-fit shadow-lg px-6 py-2 bg-white dark:bg-[#212121]">
            <motion.div layout className="my-2 dark:text-white text-black w-full text-lg">Create Playlist</motion.div>
            <motion.div layout className="w-fit sm:w-[20rem] py-2">

                <input value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder='Title' className='w-full text-white bg-transparent px-2 py-1  outline-none border-white border-b-[0.1px]' />

            </motion.div>


            <motion.div layout className="flex mt-2 justify-end dark:text-white">
                <motion.div className="px-4 py-2 duration-[.4s] font-bold text-[0.9rem] rounded-full cursor-pointer hover:bg-[#cfcfcf73] hover:dark:bg-[rgba(255,255,255,0.2)] mr-3" onClick={()=>{setName(""); setCreatePlaylist(false); }} >Cancel</motion.div>
                <motion.div className={`px-4 py-2 duration-[.4s] font-bold text-[0.9rem] rounded-full mr-1 ${name !== "" ? 'text-[#3ea6ff] hover:dark:bg-[#263850] hover:bg-[#3ea5ff54] cursor-pointer' : 'text-[#5a5a5a] cursor-not-allowed'}`} onClick={()=>createPlaylist()}>Create</motion.div>
            </motion.div>

        </motion.div>
    </>
}

const DownloadModal = () => {
    const { setDownloading, links } = useContext(dataContext) as any;
    const [downloadUrl, setDownloadUrl] = useState('');

    return <>
        <motion.div layout className="rounded-lg w-fit h-fit shadow-lg px-6 py-2 bg-white dark:bg-[#212121]">
            <motion.div layout className="my-2 dark:text-white text-black w-full text-lg">Download Quality</motion.div>
            <motion.div layout className="w-fit sm:w-[20rem] py-2">
                {
                    links?.map((item: any, index: any) => {
                        const { url, qualityLabel, quality } = item;
                        return <motion.div key={index} layout onClick={() => setDownloadUrl(url)}
                            className="w-full duration-[.4s] hover:bg-[#4645453f] rounded-lg px-2 h-fit py-3 mb-1 cursor-pointer dark:text-white flex items-center">
                            {url === downloadUrl ? <MdRadioButtonChecked className='text-[#3ea6ff] text-2xl' /> : <MdRadioButtonUnchecked className='text-2xl' />}
                            <motion.span className="ml-3 opacity-80 w-[80%] text-[0.9rem] h-fit">{qualityLabel === '720p' ? 'HD (720p)' : qualityLabel === '360p' ? 'Medium (360p)' : `${qualityLabel || quality}`}</motion.span>
                        </motion.div>

                    })
                }
            </motion.div>

            <motion.div layout className="flex mt-2 justify-end dark:text-white">
                <motion.div className="px-4 py-2 duration-[.4s] font-bold text-[0.9rem] rounded-full cursor-pointer hover:bg-[#cfcfcf73] hover:dark:bg-[rgba(255,255,255,0.2)] mr-3" onClick={() => setDownloading(false)} >Cancel</motion.div>
                <Link href={(downloadUrl == '') ? '#' : downloadUrl} target={(downloadUrl == '') ? '_self' : '_blank'} type='download' className={`px-4 py-2 duration-[.4s] font-bold text-[0.9rem] rounded-full  mr-1 ${(downloadUrl !== '') ? 'text-[#3ea6ff] hover:dark:bg-[#263850] hover:bg-[#3ea5ff54] cursor-pointer' : 'text-[#5a5a5a] cursor-not-allowed'}`}>Download</Link>
            </motion.div>
        </motion.div>
    </>
}



export default Videopage;
