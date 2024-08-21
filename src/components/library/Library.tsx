import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/legacy/image";
import { AiOutlineHistory, AiOutlineLike } from "react-icons/ai";
import SekeltonImg from "../global/skeletonComponents/ImgSkeleton";
import SekeltonText from "../global/skeletonComponents/TextSkeleton";
import { DateConverter } from "@/utils/Functions/Converters/DateConverter";
import { CountConverter } from "@/utils/Functions/Converters/CountConverter";
import { RiPlayListLine } from "react-icons/ri";
import { useSession } from "next-auth/react";
import useSWR from "swr";
const img = 'https://yt3.googleusercontent.com/ytc/AOPolaQygjiMgnSw5zUP1F_PyEkcGBmfaE8HMq7S_xu_=s176-c-k-c0x00ffffff-no-rj';
const videoImg = 'https://i.ytimg.com/img/no_thumbnail.jpg'

const LibraryUserFetcher = async () => {
  const results = await fetch(`/api/library/user`)

  if (results.status !== 404 && results.status != 500) {
    const { data } = await results.json();
    return data;
  }
}

const LibraryDetailsFetcher =  async (id : any , email : any) => {
  try {
    if(id === 'history'){
      if (typeof window !== "undefined") {
        let historyStr = localStorage.getItem('history');

        if (!historyStr) {
          const res = await fetch(`/api/history`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),
            next: { tags: ['history'] }
          });

          if (res.status != 500 && res.status != 404) {
            const { videoItems } = await res.json();
            localStorage.setItem('history', JSON.stringify(videoItems));
            return videoItems;
          }
        } else {
          let historyItems = JSON.parse(historyStr);
          return historyItems;
        }
      } else {
        const res = await fetch(`/api/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email }),
          next: { tags: ['history'] }
        });

        if (res.status != 500 && res.status != 404) {
          const { videoItems } = await res.json();
          return videoItems;
        }
      }
    }
    else if(id === 'myPlaylists/list'){
      const results = await fetch(`/api/library/${id}`,{
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ email })
      })

    
      if (results.status !== 404 && results.status != 500) {
        const {myPlaylists}  = await results.json();
        return myPlaylists;
      } else { return [] }
    }
    else{
      const results = await fetch(`/api/library/${id}`)
    
      if (results.status !== 404 && results.status != 500) {
        const { data } = await results.json();
        return data;
      } else { return [] }
    }
   
  } catch (error) {
    return [];
  }
}

const LibraryPage = () => {

  return <>
    <motion.div layout transition={{ duration: 0.5 }} className='md:pl-3 h-[90vh] pb-10 overflow-y-scroll flex flex-col-reverse md:flex-row dark:text-white'>
      <motion.div layout transition={{ duration: 0.5 }} className="basis-[80%] grow">

        <VideoSection key={4} id="myPlaylists/list"/>
        <VideoSection key={1} id="playlists" />
        <VideoSection key={2} id="history" />
        <VideoSection key={3} id="liked" />

      </motion.div>

      <UserDetails />
    </motion.div>
  </>
}

const UserDetails = () => {
  const {data :info , error , isLoading : loading} = useSWR('libUser',()=>LibraryUserFetcher(),{
    refreshInterval : 3600000 , // 60 minutes
    dedupingInterval : 900000, // 15 minutes
    revalidateOnReconnect: true,
    revalidateIfStale: true,
  })

  return <motion.div layout transition={{ duration: 0.5 }} className="basis-[20%] min-h-max grow-0 items-center pt-[4rem] md:flex flex-col bg-[3red]">
    <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col items-center">
      <motion.div layout transition={{ duration: 0.5 }} className="mb-2">
        {loading ?
          <SekeltonImg width="min-w-[80px] max-w-[80px]" height="min-h-[80px] max-h-[80px]" circle /> :
          <Image width={80} height={80} className="rounded-full bg-grey" alt="userImg" src={info?.snippet?.thumbnails?.medium?.url || img} />
        }
      </motion.div>
      {loading ?
        <SekeltonText /> :
        <motion.div layout transition={{ duration: 0.5 }} className="font-[500]">{info?.snippet?.title}</motion.div>
      }
    </motion.div>
    <motion.div layout transition={{ duration: 0.5 }} className="my-7 w-full px-6">
      <motion.hr className="mb-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]" />
      <motion.div layout transition={{ duration: 0.5 }} className="flex justify-between text-[0.75rem] font-[400] px-5 text-[#b2aca2]"><motion.span transition={{ duration: 0.5 }}>Subscriptions</motion.span> <motion.span transition={{ duration: 0.5 }} className="ml-2">{info?.statistics?.subscriberCount}</motion.span></motion.div>
      <motion.hr className="my-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]" />
      <motion.div layout transition={{ duration: 0.5 }} className="flex justify-between text-[0.75rem] font-[400] px-5 text-[#b2aca2]"><motion.span transition={{ duration: 0.5 }}>Uploads</motion.span> <motion.span transition={{ duration: 0.5 }} className="ml-2">{info?.statistics?.videoCount}</motion.span></motion.div>
      <motion.hr className="my-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]" />
      <motion.div layout transition={{ duration: 0.5 }} className="flex justify-between text-[0.75rem] font-[400] px-5 text-[#b2aca2]"><motion.span transition={{ duration: 0.5 }}>Views</motion.span> <motion.span transition={{ duration: 0.5 }} className="ml-2">{info?.statistics?.viewCount}</motion.span></motion.div>
      <motion.hr className="my-[0.6rem] border-none h-[0.07px] bg-[#5e5e5e36]" />
    </motion.div>
  </motion.div>
}

const VideoSection = ({ id }: any) => {
  const { data: session } = useSession();
  const title = id == 'history' ? 'History' : id == 'liked' ? 'Liked Videos' : id === 'playlists' ? 'Youtube Playlists' : 'Playlists';
  const icon = id == 'history' ? <AiOutlineHistory /> : id == 'liked' ? <AiOutlineLike /> : <RiPlayListLine />
  const [see, setSee] = useState(false);
  const toggleSee = () => {
    setSee(!see);
  }

  const {data : items , error , isLoading : loading} = useSWR(['libUser',id],()=>LibraryDetailsFetcher(id,session?.user?.email),{
    refreshInterval : 3600000 , // 60 minutes
    dedupingInterval : 900000, // 15 minutes
    revalidateOnReconnect: true,
    revalidateIfStale: true,
  })


  return <>
    {(loading || items?.length > 0) &&
      <motion.div layout transition={{ duration: 0.5 }} className="min-h-max">
        {loading ?
          <motion.div layout transition={{ duration: 0.5 }} className='mb-5 mx-2 flex justify-between'>
            <SekeltonText height={'min-h-[2rem]'} width={'w-[20%]'} className="min-w-[12rem]" />
            <SekeltonText height={'min-h-[2.5rem]'} width={'w-[6%]'} className="!rounded-full min-w-[4rem]" />
          </motion.div> :

          <motion.div layout transition={{ duration: 0.5 }} className="flex mx-2 md:mx-1 mb-4 justify-between">
            <motion.div layout transition={{ duration: 0.5 }} className={`flex font-bold text-[1.12rem] md:text-xl ${items?.length > 5 ? 'justify-center items-center' : 'justify-start items-center'}  `}>
              <motion.span layout transition={{ duration: 0.5 }} className='mr-2 text-[1.7rem] '>{icon}</motion.span>
              {title}
            </motion.div>
            {items.length > 3 ?
            <motion.div layout transition={{ duration: 0.5 }} className="actions">
              <motion.button layout transition={{ duration: 0.5 }} onClick={() => toggleSee()} className='flex items-center text-sm md:text-md hover:dark:bg-[#1e2d40] hover:bg-[#2c65b0] text-[#45aeff] rounded-full px-3 py-[0.1rem] md:h-10 mr-3 md:mr-1 my-1'>See All</motion.button>
            </motion.div> : null}
          </motion.div>
        }

        <motion.div layout transition={{ duration: 0.5 }} className={`flex w-screen md:w-full md:overflow-x-auto ${see && 'justify-evenly flex-wrap'} overflow-x-scroll md:justify-evenly md:flex-wrap`}>

          { loading ? <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            </> :

            id === 'playlists' ? items?.map((item: any, index: any) => {
              return <>{ see ? <PlaylistCard key={`play_${index}`} item={item} /> : index < 4 ? <PlaylistCard key={index} item={item} /> : <></>}</> 
            }) :

            id === 'history' ? items?.map((item: any, index: any) => {
                return <> {see ? <HistoryCard key={`hist_${index}`} item={item} /> : index < 4 ? <HistoryCard key={index} item={item} /> : <></>}</>
            }) :

            id === 'myPlaylists/list' ? items?.map((item:any,index:any)=>{
              return <>{see ? <UserPlaylistCard key={`userPlay_${index}`} item={item} /> : index < 4 ? <UserPlaylistCard key={index} item={item} /> : <></>} </>
            })
              :

            items?.map((item: any, index: any) => {
              return <> {see ? <VideoCard key={`liked_${index}`} item={item} /> : index < 4 ? <VideoCard key={index} item={item} /> : <></>}</>
            }) 
            
          }

        </motion.div>

        <motion.hr className="my-4 border-none h-[0.07px] bg-[#5e5e5e36]" />

      </motion.div>
    }

  </>
}

const SkeletonCard = () => {

  return <>

    <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col mx-4 md:mx-[0.1rem] my-2 max-w-[13rem] min-w-[13rem] w-[13rem]">
      <motion.div layout transition={{ duration: 0.5 }} className="relative w-full pt-[56.25%] overflow-hidden">
        <motion.div layout transition={{ duration: 0.5 }} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
          <SekeltonImg className='!rounded-lg' />
        </motion.div>
      </motion.div>
      <motion.div layout transition={{ duration: 0.5 }} className="mt-2 pr-6">
        <motion.div layout transition={{ duration: 0.5 }} className="truncate-2 font-[650] text-[0.8rem] md:text-[0.9rem] whitespace-normal"><SekeltonText /></motion.div>
        <motion.div layout transition={{ duration: 0.5 }} className="truncate-1 font-[550] text-grey text-[0.7rem] md:text-[0.8rem] whitespace-normal mt-2"><SekeltonText width="min-w-[50%] w-[50%]" /></motion.div>
        <motion.div layout transition={{ duration: 0.5 }} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]"> <SekeltonText width="min-w-[50%] w-[50%]" /></motion.div>
      </motion.div>
    </motion.div>

  </>
}

const VideoCard = ({ item }: any) => {

  return <>

    <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col mx-4 md:mx-[0.1rem] my-2 max-w-[13rem] min-w-[13rem] w-[13rem]">
      <motion.div layout transition={{ duration: 0.5 }} className="relative w-full pt-[56.25%] overflow-hidden">
        <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.id}`} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
          <Image className='rounded-lg dark:bg-[#202324] bg-[#b8b8b8]' src={item?.snippet?.thumbnails?.medium?.url || videoImg} layout='fill' alt='videocardImg' />
        </Link>
      </motion.div>
      <motion.div layout transition={{ duration: 0.5 }} className="mt-2 pr-6">
        <Link href={`/channel/${item?.snippet?.channelId}/video/${item?.id}`} className="truncate-2 font-[650] text-[0.8rem] md:text-[0.9rem] whitespace-normal">{item?.snippet?.title}</Link>
        <Link href={`/channel/${item?.snippet?.channelId}`} className="truncate-1 font-[550] text-grey text-[0.7rem] md:text-[0.8rem] whitespace-normal mt-2">{item?.snippet?.channelTitle}</Link>
        {item?.statistics?.viewCount ?
          <motion.div layout transition={{ duration: 0.5 }} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]"> {CountConverter(item?.statistics?.viewCount)} views &bull; {DateConverter(item?.snippet?.publishedAt)} ago</motion.div> :
          <motion.div layout transition={{ duration: 0.5 }} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]"> {DateConverter(item?.snippet?.publishedAt)} ago</motion.div>
        }
      </motion.div>
    </motion.div>

  </>
}

const HistoryCard = ({ item }: any) => {
  const { id, channelId, title, channelTitle, videoImg, channelImg, timestamp } = item;

  const url = `/channel/${channelId}/video/${id}`
  const channelUrl = `/channel/${channelId}`

  return <>

    <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col mx-4 md:mx-[0.1rem] my-2 max-w-[13rem] min-w-[13rem] w-[13rem]">
      <motion.div layout transition={{ duration: 0.5 }} className="relative w-full pt-[56.25%] overflow-hidden">
        <Link href={url} className="h-full absolute top-0 right-0 left-0 bottom-0">
          <Image className='rounded-lg dark:bg-[#202324] bg-[#b8b8b8]' src={videoImg} layout='fill' alt='videocardImg' />
        </Link>
      </motion.div>
      <motion.div layout transition={{ duration: 0.5 }} className="mt-2 pr-6">
        <Link href={url} className="truncate-2 font-[650] text-[0.8rem] md:text-[0.9rem] whitespace-normal">{title}</Link>
        <Link href={channelUrl} className="truncate-1 font-[550] text-grey text-[0.7rem] md:text-[0.8rem] whitespace-normal mt-2">{channelTitle}</Link>
        <motion.div layout transition={{ duration: 0.5 }} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]">Watched {DateConverter(timestamp)} ago</motion.div>
      </motion.div>
    </motion.div>

  </>
}

const PlaylistCard = ({ item }: any) => {
  return <>

    <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col mx-4 md:mx-[0.1rem] my-2 max-w-[13rem] min-w-[13rem] w-[13rem]">
      <motion.div layout transition={{ duration: 0.5 }} className="relative w-full h-full pt-[56.25%] overflow-hidden">
        <Link href={`/channel/${item?.snippet?.channelId}/playlist/${item?.id}`} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
          <Image className='rounded-lg dark:bg-[#202324] bg-[#b8b8b8]' src={item?.snippet?.thumbnails?.medium?.url || videoImg} layout='fill' alt='videocardImg' />
        </Link>
      </motion.div>
      <motion.div layout transition={{ duration: 0.5 }} className="mt-2 pr-6">
        <Link href={`/channel/${item?.snippet?.channelId}/playlist/${item?.id}`} className="truncate-2 font-[650] text-[0.8rem] md:text-[0.9rem] whitespace-normal">{item?.snippet?.title || item?.name}</Link>
        {/* <Link href={`/channel/${item?.snippet?.channelId}`} className="truncate-1 font-[550] text-grey text-[0.7rem] md:text-[0.8rem] whitespace-normal mt-2">{item?.snippet?.channelTitle}</Link> */}
        <motion.div layout transition={{ duration: 0.5 }} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]"> {item?.contentDetails?.itemCount} Items &bull; {DateConverter(item?.snippet?.publishedAt)} ago</motion.div>
      </motion.div>
    </motion.div>

  </>
}

const UserPlaylistCard = ({ item }: any) => {
  const {name , updatedAt} = item;
  const items = JSON.parse(item?.items || "[]");
  
  return <>

    <motion.div layout transition={{ duration: 0.5 }} className="flex flex-col mx-4 md:mx-[0.1rem] my-2 max-w-[13rem] min-w-[13rem] w-[13rem]">
      <motion.div layout transition={{ duration: 0.5 }} className="relative w-full h-full pt-[56.25%] overflow-hidden">
        <Link href={`/library/userplaylist/${item?._id}`} className="w-full h-full absolute top-0 right-0 left-0 bottom-0">
          <Image className='rounded-lg dark:bg-[#202324] bg-[#b8b8b8]' src={item?.thumbnail || videoImg} layout='fill' alt='videocardImg' />
        </Link>
      </motion.div>
      <motion.div layout transition={{ duration: 0.5 }} className="mt-2 pr-6">
        <Link href={`/library/userplaylist/${item?._id}`} className="truncate-2 font-[650] text-[0.8rem] md:text-[0.9rem] whitespace-normal">{name}</Link>
        {/* <Link href={`/channel/${item?.snippet?.channelId}`} className="truncate-1 font-[550] text-grey text-[0.7rem] md:text-[0.8rem] whitespace-normal mt-2">{item?.snippet?.channelTitle}</Link> */}
        <motion.div layout transition={{ duration: 0.5 }} className="text-grey font-[500] text-[0.5rem] md:text-[0.8rem]"> {items?.length} Items &bull; {DateConverter(Number(updatedAt))} ago</motion.div>
      </motion.div>
    </motion.div>

  </>
}

export default LibraryPage;