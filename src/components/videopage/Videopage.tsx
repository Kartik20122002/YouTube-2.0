import Link from 'next/link';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CgSpinner } from "react-icons/cg";
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from "react-icons/md";
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineDownload, AiOutlineLike, AiOutlineSave, AiOutlineShareAlt } from 'react-icons/ai';
import Image from 'next/legacy/image';
import { signIn, useSession } from 'next-auth/react';
import Sekelton from '../global/skeletonComponents/TextSkeleton';
import SekeltonImg from '../global/skeletonComponents/ImgSkeleton';
import { motion } from 'framer-motion'
import { DateConverter } from "@/utils/Functions/Converters/DateConverter";
import { CountConverter } from "@/utils/Functions/Converters/CountConverter";
import { isLargeContext } from '@/app/layout';
import parse from 'html-react-parser'
import { redirect, usePathname } from 'next/navigation';
import axios from 'axios';

const downloadContext = createContext<any>(null);

const Videopage = ({ id, channelId }: any) => {

    const [videoDetails, setVideoDetails] = useState<any>({});
    const [channelDetails, setChannelDetails] = useState<any>({});
    const [related, setRelated] = useState<any>([]);
    const [loading, setLoading] = useState(true);
    const { status, data: session } = useSession();
    const [downloading, setDownloading] = useState<boolean>(false);
    const { isLarge, setIsLarge } = useContext(isLargeContext) as any;

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);

    function useOutsideAlerter(ref: any) {
        useEffect(() => {
            function handleClickOutside(event: any) {
                if (ref.current && !ref.current.contains(event.target)) {
                    setDownloading(false);
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

    const getDetails = async () => {
        try {
            const res = await fetch(`/api/video/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, channelId }),
                next: { revalidate: 300 },
                cache: 'force-cache'
            })

            if (res.status != 404 && res.status != 500) {
                const { video, channel, related } = await res.json();
                setVideoDetails(video);
                setChannelDetails(channel);
                setRelated(related);
                setLoading(false);

                if (status === "authenticated") {
                    saveToHistory(video, channel);
                }

            }
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getDetails();
        setIsLarge(false);
    }, [])

    return (<>
        <downloadContext.Provider value={{ downloading, setDownloading }}>
            <motion.div layout transition={{ duration: 0.5 }} className="h-screen transition-all relative overflow-y-scroll pb-8">
                <motion.div layout transition={{ duration: 0.5 }} className="flex w-full flex-col md:flex-row justify-between">
                    <VideoSection video={videoDetails} channel={channelDetails} channelId={channelId} loading={loading} id={id} />
                    <SideRow loading={loading} related={related} />
                    {
                        downloading && <motion.div ref={wrapperRef} className="absolute top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%]"><DownloadModal id={id} /></motion.div>
                    }
                </motion.div>
            </motion.div>
        </downloadContext.Provider>
    </>)
}

const VideoSection = ({ video, channel, loading, id, channelId }: any) => {

    const { status, data: session } = useSession();

    const commentsCount = video?.statistics?.commentCount || 0;

    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className=" md:basis-[64%] shrink md:pb-[5rem] md:h-[89vh] overflow-y-scroll">

            <motion.div layout transition={{ duration: 0.5 }} className="w-full relative pt-[56.25%] overflow-hidden">

                <motion.iframe allowFullScreen src={`https://www.youtube.com/embed/${id}?rel=0&autoplay=1`} className='absolute top-0 left-0 bottom-0 right-0 w-full h-full' loading='eager' onPlay={() => console.log('played')} />

            </motion.div>

            <motion.h3 className="px-1 md:px-0 pt-4  truncate-1 dark:text-white text-[1.2rem] font-semibold w-full">{loading ? <Sekelton height={'h-6'} width={'w-[95%] md:w-full'} className="mx-auto  md:mx-0" /> : video?.snippet?.title}</motion.h3>

            {loading ? <VideoInfoSkeleton /> : <VideoInfo id={id} channelId={channelId} video={video} channel={channel} loading={loading} />}

            <motion.div layout transition={{ duration: 0.5 }} className="h-fit-content w-full px-2 md:px-0 mt-4 dark:text-white">

                {loading ? <Sekelton height={'h-24'} className="mb-4" /> : <Description loading={loading} video={video} />}

                {loading ? <Sekelton width="min-w-[20%] max-w-[20%]" className="my-1" /> : <motion.h4 className='hidden md:block my-1'>{commentsCount} Comments</motion.h4>}

                {status == 'authenticated' &&
                    <CommentForm img={session?.user?.image} id={id} channelId={channelId} />
                }

                <Comments id={id} />

            </motion.div>
        </motion.div>
    </>)
}

const VideoInfo = ({ id, channelId, video, channel, loading }: any) => {
    const [rate, setRate] = useState<any>(0)
    const [sub, setSub] = useState<any>(false);
    const [subId, setSubId] = useState<any>('');
    const link = usePathname();
    const { status, data: session } = useSession();
    const { downloading, setDownloading } = useContext(downloadContext);

    const getAuthDetails = async () => {
        try {
            const res = await fetch(`/api/video/auth/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, channelId }),
                next: { revalidate: 300 }
            })

            if (res.status != 404 && res.status != 500) {
                const { rating, subscription } = await res.json();
                if (rating[0].rating == 'none') setRate(0);
                if (rating[0].rating == 'like') setRate(1);
                if (rating[0].rating == 'dislike') setRate(-1);
                if (subscription.length > 0) {
                    setSub(true);
                    const id = subscription[0]?.id;
                    if (id) setSubId(id);
                }
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    const subscribe = async () => {
        try {
            const res = await fetch(`/api/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: channelId, subId: subId, toSub: !sub }),
                next: { revalidate: 300 }
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
            }

        }
        catch (err) {
            console.log(err);
        }
    }

    const rateit = async (torate: any) => {
        try {
            const res = await fetch(`/api/rate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, rating: torate }),
                next: { revalidate: 300 }
            })

            if (res.status === 200) {
                const { flag } = await res.json();
                if (flag) {
                    if (torate == 'none') setRate(0);
                    if (torate == 'like') setRate(1);
                    if (torate == 'dislike') setRate(-1);
                }
            }

        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if (status == 'authenticated') {
            getAuthDetails();
        }
    }, [status])

    const toggleSub = () => {
        if (status == 'authenticated') {
            subscribe();
        }
        else signIn("google");
    }

    const toggleRate = (rating: any) => {
        if (status == 'authenticated') {
            rateit(rating);
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
                        <motion.button onClick={() => toggleSub()} className='bg-[#cfcfcf57] dark:text-[#959595cd] py-1 px-4 rounded-full text-lg text-black font-semibold hover:opacity-70'>Subscribed</motion.button>
                        :
                        <motion.button onClick={() => toggleSub()} className='dark:bg-white bg-black py-1 px-4 rounded-full text-lg dark:text-black text-white font-semibold hover:opacity-70'>Subscribe</motion.button>
                    }
                </motion.div>
            </motion.div>

            <motion.div layout transition={{ duration: 0.5 }} className=" dark:text-white max-w-full md:basis-[60%] grow flex text-xs md:text-md overflow-x-scroll md:overflow-x-auto flex-nowrap md:flex-wrap md:px-0 justify-between items-center mt-4 md:mt-0 md:justify-end" id="buttons">

                <motion.div layout transition={{ duration: 0.5 }} className="flex h-10 items-center mr-3 md:mr-6 my-1">

                    {
                        rate == 1 ?
                            <motion.div onClick={() => toggleRate('none')} layout transition={{ duration: 0.5 }} className='flex border-r dark:border-[#ffffff28] dark:bg-[#6c6c6c57] cursor-pointer bg-[#cfcfcf57] hover:dark:bg-[#6c6c6c68] hover:bg-[#cfcfcf73] pr-2 pl-4 h-full rounded-l-full items-center'>
                                <AiFillLike className='text-[1.2rem] md:text-[1.5rem]' />
                                <span className='px-3'>{CountConverter(video?.statistics?.likeCount || 0)}</span>
                            </motion.div> :
                            <motion.div onClick={() => toggleRate('like')} layout transition={{ duration: 0.5 }} className='flex  border-r dark:border-[#ffffff23] dark:bg-[#6c6c6c57] cursor-pointer bg-[#cfcfcf57] hover:dark:bg-[#6c6c6c68] hover:bg-[#cfcfcf73] pr-2 pl-4 h-full rounded-l-full items-center'>
                                <AiOutlineLike className='text-[1.2rem] md:text-[1.5rem]' />
                                <span className='px-3'>{CountConverter(video?.statistics?.likeCount || 0)}</span>
                            </motion.div>
                    }

                    {
                        rate == -1 ?
                            <motion.div onClick={() => toggleRate('none')} layout transition={{ duration: 0.5 }} className='flex dark:bg-[#6c6c6c57] cursor-pointer bg-[#cfcfcf57] hover:dark:bg-[#6c6c6c68] hover:bg-[#cfcfcf73] pl-2 pr-4  h-10 rounded-r-full items-center'>
                                <AiFillDislike className='text-[1.2rem] md:text-[1.5rem]' />
                            </motion.div> :
                            <motion.div onClick={() => toggleRate('dislike')} layout transition={{ duration: 0.5 }} className='flex cursor-pointer dark:bg-[#6c6c6c57] bg-[#cfcfcf57] hover:dark:bg-[#6c6c6c68] hover:bg-[#cfcfcf73] pl-2 pr-4  h-10 rounded-r-full items-center'>
                                <AiOutlineDislike className='text-[1.2rem] md:text-[1.5rem]' />
                            </motion.div>
                    }

                </motion.div>

                {/* <motion.button onClick={() => copyLink()} className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] hover:dark:bg-[#6c6c6c68] hover:bg-[#cfcfcf73] rounded-full px-4 h-10 mr-3 md:mr-1 my-1'> <AiOutlineShareAlt className='mr-2 text-[1.2rem] md:text-[1.5rem]' /> Share</motion.button> */}
                {/* <motion.button className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] hover:dark:bg-[#6c6c6c68] hover:bg-[#cfcfcf73] rounded-full px-4 h-10 mr-3 md:mr-1 my-1'> <AiOutlineSave className='mr-2 text-[1.2rem] md:text-[1.5rem]'/> Save</motion.button> */}

                <motion.button onClick={() => { if (!downloading) { setDownloading(true) } }} className='flex items-center dark:bg-[#6c6c6c57] bg-[#cfcfcf57] hover:dark:bg-[#6c6c6c68] hover:bg-[#cfcfcf73] rounded-full px-4 h-10 mr-3 my-1'>
                    <AiOutlineDownload className='mr-2 text-[1.2rem] md:text-[1.5rem]' /> Download
                </motion.button>

            </motion.div>

        </motion.div>
    </>)
}

const VideoInfoSkeleton = () => {

    const loading = true;
    return <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col flex-wrap md:flex-row md:items-center justify-center mt-5 text-[#5a5a5a] w-full">

        <motion.div layout transition={{ duration: 0.5 }} className="flex md:basis-[40%] grow md:text-md text-xs basis-full mb-2 px-2">
            <motion.div layout transition={{ duration: 0.5 }} className={`flex items-center ${loading && 'w-1/3'}`}>
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

                <motion.div className='flex pr-2 pl-4 h-10 rounded-l-full items-center'>
                    <AiOutlineLike className='text-[1.2rem] md:text-[1.5rem] text-transparent' />
                    <motion.span className='px-3'><div className={'w-6'} /></motion.span>
                </motion.div>

                <motion.div className='flex pl-2 pr-4 h-10 rounded-r-full items-center'>
                    <AiOutlineDislike className='text-[1.2rem] text-transparent md:text-[1.5rem]' />
                </motion.div>

            </motion.div>

            <motion.div className='cursor-default dark:bg-[#202324] bg-[#b8b8b8] animate-pulse flex items-center  text-transparent  text-xs md:text-md  rounded-full px-4 h-10 mr-3 mb-4'>
                <AiOutlineDownload className='mr-2 text-[1.2rem] md:text-[1.5rem]' /> Download
            </motion.div>


        </motion.div>
    </motion.div>
}

const Description = ({ loading, video }: any) => {
    const [largeDesc, setLargeDesc] = useState(false);

    return (<> <motion.div layout transition={{ duration: 0.5 }} onClick={() => { if (!largeDesc) { setLargeDesc(true) } }} className={`py-3 px-3 dark:bg-[#6c6c6c57] bg-[#cfcfcf57] ${!largeDesc && 'cursor-pointer'} rounded-lg w-full h-fit-content mb-4`}>
        <motion.div layout transition={{ duration: 0.5 }} className="flex w-full flex-wrap">
            <motion.span layout transition={{ duration: 0.5 }} className='mr-2 min-w-max text-[0.8rem] md:text-md'>{CountConverter(video?.statistics?.viewCount)} views</motion.span>
            <motion.span layout transition={{ duration: 0.5 }} className='mr-2 min-w-max text-[0.8rem] md:text-md'>{DateConverter(video?.snippet?.publishedAt)} ago</motion.span>
            <motion.div layout transition={{ duration: 0.5 }} className="dark:text-white opacity-30 truncate-2">
                {
                    !loading && video?.snippet?.tags?.map((tag: any, index: any) => {
                        return <motion.span key={index} className='mr-1 '>#{tag}</motion.span>
                    })
                }
            </motion.div>
        </motion.div>

        <motion.div onClick={() => setLargeDesc(!largeDesc)} layout transition={{ duration: 0.5 }} className={`${!largeDesc ? 'h-1' : 'h-fit'} hidden md:block overflow-hidden mt-1`}>
            {parse(video?.snippet?.description)}
        </motion.div>
        {/* {largeDesc && 
    <motion.div layout transition={{duration : 0.5}} onClick={()=>setLargeDesc(false)} className="mt-3 text-white hover:opacity-80 cursor-pointer">Show Less</motion.div>
    } */}

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
                body: JSON.stringify({ id, channelId, comment }),
                next: { revalidate: 300 }
            })

            if (res.status === 200) {
                setComment('');
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

        <motion.form onSubmit={(e) => videoComment(e)} className="mt-4 hidden md:flex items-start">

            {
                img ? <Image src={img} width={45} height={45} alt={'commentImg'} className='rounded-full bg-grey' /> :
                    <SekeltonImg width={'min-w-[45px]'} height={'min-h-[45px]'} circle />
            }


            <motion.div layout transition={{ duration: 0.5 }} className="basis-auto w-full ml-6 flex flex-col">

                <motion.input value={comment} autoComplete='off' onChange={(e) => setComment(e.target.value)} className='w-full bg-transparent text-lg focus:outline-none focus:dark:border-white focus:border-black transition-colors border-b border-[#5a5a5a]' type="text" name="commenttoadd" id="commenttoadd" placeholder="Write comments..." />

                <motion.div layout transition={{ duration: 0.5 }} className="btns w-full flex justify-end transition-colors mt-3">
                    <motion.button onClick={() => setComment('')} type='reset' className='mr-4 opacity-90 hover:opacity-100'>Cancel</motion.button>
                    <motion.button type='submit' className={`ml-4 ${comment == '' ? 'dark:bg-[#212121] bg-grey cursor-not-allowed' : 'bg-[#3ea6ff] hover:bg-[#77bcf8]'} py-[.3rem] px-3 rounded-full dark:text-black`}>Comment</motion.button>
                </motion.div>

            </motion.div>
        </motion.form>
    </>)
}

const Comments = ({ id }: any) => {

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);

    const getDetails = async () => {
        try {
            const res = await fetch(`/api/video/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
                next: { revalidate: 300 }
            })

            if (res.status != 404 && res.status != 500) {
                const { data } = await res.json();
                setComments(data);
                setLoading(false);
            }
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getDetails();
    }, []);

    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className="hidden md:block pb-2">
            {
                loading ? <></> :
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
            <motion.div layout transition={{ duration: 0.5 }} className="flex text-[0.85rem] font-semibold"> <Link href={`/channel/${item?.snippet?.topLevelComment?.snippet?.authorChannelId?.value}`}>{item?.snippet?.topLevelComment?.snippet?.authorDisplayName}</Link> <span className='ml-3 font-[500] text-[#959595cd] text-'>{DateConverter(item?.snippet?.topLevelComment?.snippet?.updatedAt)} ago</span></motion.div>

            <motion.div layout transition={{ duration: 0.5 }} onClick={() => { setReadmore(!readmore) }} className={`text-[0.95rem] ${!readmore && 'truncate-5'} mt-1 font-[500]`}>{parse(item?.snippet?.topLevelComment?.snippet?.textDisplay)}</motion.div>

            <motion.div layout transition={{ duration: 0.5 }} className="flex items-center mt-3">
                <AiOutlineLike className='text-[1.5rem] mr-2' />
                <span className='text-[0.9rem]'>{CountConverter(item?.snippet?.topLevelComment?.snippet?.likeCount)}</span>
                <AiOutlineDislike className='text-[1.5rem] ml-2' />
            </motion.div>
        </motion.div>
    </motion.div>
}

const SideRow = ({ loading, related }: any) => {
    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className="md:basis-[33%] mt-6 md:mt-0 basis-full h-[89vh] overflow-y-scroll flex flex-col px-1">
            {
                loading ? <>
                    <SideVideoSkeleton />
                    <SideVideoSkeleton />
                    <SideVideoSkeleton />
                    <SideVideoSkeleton />
                    <SideVideoSkeleton />
                    <SideVideoSkeleton />
                    <SideVideoSkeleton />
                    <SideVideoSkeleton />
                </> :
                    related?.map((item: any, index: any) => {
                        return <SideVideo key={index} item={item} />
                    })
            }
        </motion.div>
    </>)
}

const SideVideo = ({ item }: any) => {

    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className=" flex flex-wrap w-fulljustify-between mb-3 px-3 md:px-0">

            <motion.div layout transition={{ duration: 0.5 }} className="basis-[35%] mr-2 h-full">

                <Link href={`/channel/${item?.channelId}/video/${item?.videoId}`} className="flex w-full h-full relative pt-[56.25%] overflow-hidden justify-center items-center">
                    <Image layout='fill' className='dark:bg-[#202324] bg-[#b8b8b8] absolute top-0 right-0 left-0 bottom-0 h-full w-full rounded-md' loading="lazy" alt="." src={item?.thumbnail[0]?.url || item?.thumbnail[1]?.url} />
                </Link>
            </motion.div>

            <motion.div layout transition={{ duration: 0.5 }} className="basis-[60%] pt-1 overflow-hidden ">
                <Link href={`/channel/${item?.channelId}/video/${item?.videoId}`} className="text-md w-full dark:text-white md:text-lg md:leading-5 mb-1 truncate-2">{item?.title}</Link>
                <motion.div layout transition={{ duration: 0.5 }} className="flex flex-wrap flex-col">
                    <p className="text-[#606060] font-medium text-sm"><Link className='hover:text-[#888888] mr-1' href={`/channel/${item?.channelId}`}>{item?.channelTitle}</Link></p>
                    <p className="text-[#606060] font-medium text-sm ">{CountConverter(item?.viewCount)}  &bull; {item?.publishedTimeText}</p>
                </motion.div>
            </motion.div>

        </motion.div>
    </>)
}

const SideVideoSkeleton = () => {
    return (<>
        <motion.div layout transition={{ duration: 0.5 }} className="flex w-full justify-between mb-6 px-3 md:px-0">

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

const DownloadModal = ({ id }: any) => {
    const { downloading, setDownloading } = useContext(downloadContext) as any;
    const [started, setStarted] = useState('');
    const [progressbar, setProgress] = useState(0);

    const qualities = [
        { id: 1, name: 'Full HD (1080p)', link: '1080' },
        { id: 2, name: 'HD (720p)', link: '720' },
        { id: 3, name: 'Standard (480p)', link: '480' },
        { id: 4, name: 'Low (360p)', link: '360' },
    ]
    const [downloadId, setDownloadId] = useState(0);



    const beginDownload = async (downloadid: string) => {
        setProgress(45);
        try {
            const options = {
                method: 'GET',
                url: 'https://youtube-video-downloader-4k-and-8k-mp3.p.rapidapi.com/progress.php',
                params: {
                    id: downloadid
                },
                headers: {
                    'X-RapidAPI-Key': '79f25e9d42mshed666ecd3dda012p1ed78ejsnaa144f427d4e',
                    'X-RapidAPI-Host': 'youtube-video-downloader-4k-and-8k-mp3.p.rapidapi.com'
                }
            };


            const interval = setInterval(async () => {
                const response = await axios.request(options);

                if (response.status === 200) {
                    const { data } = response;
                    const { success, progress, download_url } = data;
                    if (success === 1) {
                        setProgress(0);
                        setStarted('finished');
                        const url = download_url;
                        window.open(url, '_blank');
                        clearInterval(interval);
                        setDownloading(false);
                    }
                    else setProgress(75);
                }

            }, 3000);

        } catch (error) {
            console.error(error);
        }
    }

    const downloader = async () => {
        setStarted('started');
        setProgress(25);
        const options = {
            method: 'GET',
            url: 'https://youtube-video-downloader-4k-and-8k-mp3.p.rapidapi.com/download.php',
            params: {
                format: qualities[downloadId - 1]?.link,
                url: `https://www.youtube.com/watch?v=${id}`
            },
            headers: {
                'X-RapidAPI-Key': '79f25e9d42mshed666ecd3dda012p1ed78ejsnaa144f427d4e',
                'X-RapidAPI-Host': 'youtube-video-downloader-4k-and-8k-mp3.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            if (response.status === 200) {
                const { data } = response;
                const { id } = data;
                beginDownload(id);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return <>
        <motion.div layout className="rounded-lg w-fit h-fit shadow-lg px-6 py-2 bg-white dark:bg-[#212121]">
            <motion.div layout className="my-2 dark:text-white text-black w-full text-lg">Download Quality</motion.div>
            <motion.div layout className="w-fit sm:w-[20rem] py-2">
                {
                    qualities.map((item: any, index: any) => {
                        return <motion.div layout onClick={() => setDownloadId(item.id)}
                            key={item.id} className="w-full duration-[.4s] hover:bg-[#4645453f] rounded-lg px-2 h-fit py-3 mb-1 cursor-pointer dark:text-white flex items-center">
                            {item.id === downloadId ? <MdRadioButtonChecked className='text-[#3ea6ff] text-2xl' /> : <MdRadioButtonUnchecked className='text-2xl' />}
                            <motion.span className="ml-3 opacity-80 w-[80%] text-[0.9rem] h-fit">{item.name}</motion.span>
                        </motion.div>

                    })
                }
            </motion.div>
            {started === 'started' && <motion.div className="min-w-[100%] bg-white min-h-2 w-20 h-2 rounded-full">
                <motion.div className={`min-w-[${progressbar}%] w-0 duration-100 bg-[#3ea6ff] min-h-2 h-2 rounded-full`}></motion.div>
            </motion.div>}
            <motion.div layout className="flex mt-2 justify-end dark:text-white">
                <motion.div className="px-4 py-2 duration-[.4s] font-bold text-[0.9rem] rounded-full cursor-pointer hover:bg-[#cfcfcf73] hover:dark:bg-[rgba(255,255,255,0.2)] mr-3" onClick={() => setDownloading(false)} >Cancel</motion.div>
                <motion.button disabled={downloadId == 0} onClick={() => downloader()} className={`px-4 py-2 duration-[.4s] font-bold text-[0.9rem] rounded-full  mr-1 ${downloadId !== 0 ? 'text-[#3ea6ff] hover:dark:bg-[#263850] hover:bg-[#3ea5ff54] cursor-pointer' : 'text-[#5a5a5a] cursor-not-allowed'}`}>Download</motion.button>
            </motion.div>
        </motion.div>
    </>
}



export default Videopage;
