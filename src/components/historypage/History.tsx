'use client'
import Image from "next/legacy/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { isLargeContext } from "@/app/layout"
import { useContext, useEffect, useState } from "react"
import PageSkeleton from "@/components/global/pagesection/loading";
import ImgSkeleton from '@/components/global/skeletonComponents/ImgSkeleton';
import { DateConverter } from "@/utils/Functions/Converters/DateConverter"
import { useSession } from "next-auth/react"



const History = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/history`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: session?.user?.email }),
                    next: { revalidate: 300 }
                });

                if (res.status != 500 && res.status != 404) {
                    const { videoItems } = await res.json();
                    setItems(videoItems);
                    setLoading(false);
                }
                else throw new Error("History not found")

            }
            catch (error) {
                console.log('page error', error);
                setItems([]);
                setLoading(false);
            }

        }
        fetchData();
    }, [session])


    return <>
        {
            loading ? <PageSkeleton /> :
                <motion.div layout transition={{ duration: 0.5 }} className="flex  flex-wrap justify-evenly h-[95vh] overflow-y-scroll pt-5 pb-[10%] dark:bg-black bg-white" id="mainpage">

                    <motion.div layout transition={{ duration: 0.5 }} className="flex flex-wrap justify-evenly w-full">
                        {items?.map((item: any, index: any) => {
                            return <VideoContainer key={index} item={item} />
                        })}
                    </motion.div>
                </motion.div>
        }
    </>
}

const VideoContainer = ({ item }: any) => {

    const { isLarge, setIsLarge } = useContext(isLargeContext) as any;

    const { id, channelId, title, channelTitle, videoImg, channelImg, timestamp } = item;

    const time = DateConverter(timestamp);

    return <>

        <motion.div whileHover={{ scale: 1.1, transition: { duration: 0.5, delay: 3 } }} layout transition={{ duration: 0.5 }}
            className={`px-0 w-full ${isLarge ? 'md:w-[19rem]' : 'md:w-[21rem]'} items-center mb-7 md:max-h-[12rem] flex flex-col justify-between`}>

            <Link className={`w-full overflow-hidden relative pt-[56.25%] md:rounded-xl`} href={`/channel/${channelId}/video/${id}`}>
                <Image src={videoImg} className="md:rounded-xl !absolute !min-w-0 !min-h-0 !w-full !h-full !top-0 !right-0 !bottom-0 !left-0 dark:bg-[#202324] bg-[#b8b8b8]" layout="fill" alt="video" />
            </Link>

            <motion.div layout transition={{ duration: 0.5 }} className={`flex w-full md:items-start relative items-center px-2 mt-2`}>

                <Link href={`/channel/${channelId}`} className="mr-4 min-w-[40px] w-[40px] h-[40px]">
                    {channelImg ?
                        <Image className="rounded-full h-[40px] dark:bg-[#202324] bg-[#b8b8b8]" layout="responsive" width={40} height={40} src={channelImg} loading="lazy" alt="channelImg" />
                        :
                        <ImgSkeleton className="w-[40px] h-[40px] rounded-full" />
                    }
                </Link>

                <motion.div layout transition={{ duration: 0.5 }} className="text-sm w-full">
                    <Link className="text-black dark:text-white font-semibold text-[15px] mb-[5px] truncate-2" href={`/channel/${channelId}/video/${id}`}>{title}</Link>
                    <motion.div layout transition={{ duration: 0.5 }} className="flex flex-wrap md:flex-col w-full">
                        <Link className="text-grey mr-2 basis-auto shrink truncate-1 hover:text-[#c0bebe]" href={`/channel/${channelId}`}> <p>{channelTitle}</p></Link>
                        <motion.div layout transition={{ duration: 0.5 }} className="text-grey flex flex-wrap grow truncate-1 whitespace-normal">Viewed <span className="ml-1">{time} ago</span></motion.div>
                    </motion.div>
                </motion.div>

            </motion.div>
        </motion.div>

    </>
}

export default History;