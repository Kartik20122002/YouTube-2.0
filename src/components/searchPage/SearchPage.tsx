import Image from "next/legacy/image";
import Link from "next/link";
import {RiPlayListLine} from 'react-icons/ri';

const img = 'https://yt3.googleusercontent.com/ytc/AOPolaQygjiMgnSw5zUP1F_PyEkcGBmfaE8HMq7S_xu_=s176-c-k-c0x00ffffff-no-rj';
const videoImg = 'https://i.ytimg.com/vi/fsNrgCivsZg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBjTNa2oj9zdcd0gdxGRYylfpzalA'

const SearchPage = ({query}:any)=>{
    return<>
     <div className="flex flex-col  overflow-y-scroll h-full pb-[3rem] w-full">
        <ChannelCard/>
        <VideoCard/>
        <PlaylistCard/>
        <VideoCard/>
        <VideoCard/>
     </div>
    </>
}

const VideoCard = ()=>{
    return <>
    <Link href={''} className="md:w-[90%] md:max-w-[1200px] mx-auto mb-4 dark:text-white flex flex-col md:flex-row w-full">
        <div  className="basis-[25%] shrink-0 md:min-w-[200px] grow">
        <div className="w-full h-full relative overflow-hidden pt-[56.25%]">
            <Image src={videoImg} className="!absolute md:rounded-lg !min-w-0 !min-h-0 !w-full !h-full top-0 left-0 right-0 bottom-0" layout="fill" alt="videoImg" loading="lazy" />
        </div>
        </div>
        <div className="basis-[75%] grow ml-1 md:ml-4 mt-1">
            <div className="truncate-2 text-[1.1rem] md:w-[70%] font-[400]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit molestias, odit nobis dolores repudiandae optio unde. Numquam sequi nobis ab!, ipsum dolor sit amet consectetur adipisicing elit. Dolore praesentium quia magni, iste deleniti expedita? Eligendi assumenda obcaecati aliquid distinctio.</div>
            <div className="text-grey text-sm md:w-[70%]">1 day ago</div>
            <Link href={''} className="text-grey md:w-[70%] dark:hover:text-white hover:text-black text-sm">take u forward</Link>
            <div className="text-grey text-sm truncate-1 md:w-[70%]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, eveniet nulla beatae qui hic amet asperiores tempore quaerat non error in expedita possimus quae tempora? Unde sed libero et eveniet officiis soluta aliquam? Fugiat commodi nulla hic molestiae obcaecati praesentium.</div>
        </div>
    </Link>
    </>
}

const SkeletonCard = ()=>{
    return <>
    <Link href={''} className="md:w-[90%] md:max-w-[1200px] mx-auto mb-4 dark:text-white flex flex-col md:flex-row w-full">
        <div  className="basis-[25%] shrink-0 md:min-w-[200px] grow">
        <div className="w-full h-full relative overflow-hidden pt-[56.25%]">
            <Image src={videoImg} className="!absolute md:rounded-lg !min-w-0 !min-h-0 !w-full !h-full top-0 left-0 right-0 bottom-0" layout="fill" alt="videoImg" loading="lazy" />
        </div>
        </div>
        <div className="basis-[75%] grow ml-1 md:ml-4 mt-1">
            <div className="truncate-2 text-[1.1rem] md:w-[70%] font-[400]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit molestias, odit nobis dolores repudiandae optio unde. Numquam sequi nobis ab!, ipsum dolor sit amet consectetur adipisicing elit. Dolore praesentium quia magni, iste deleniti expedita? Eligendi assumenda obcaecati aliquid distinctio.</div>
            <div className="text-grey text-sm md:w-[70%]">1 day ago</div>
            <Link href={''} className="text-grey md:w-[70%] dark:hover:text-white hover:text-black text-sm">take u forward</Link>
            <div className="text-grey text-sm truncate-1 md:w-[70%]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, eveniet nulla beatae qui hic amet asperiores tempore quaerat non error in expedita possimus quae tempora? Unde sed libero et eveniet officiis soluta aliquam? Fugiat commodi nulla hic molestiae obcaecati praesentium.</div>
        </div>
    </Link>
    </>
}

const PlaylistCard = ()=>{
    return <>
    <Link href={''} className="md:w-[90%] md:max-w-[1200px] mx-auto mb-4 dark:text-white flex flex-col md:flex-row w-full">
        <div  className="basis-[25%] shrink-0 relative md:min-w-[200px] grow">
        <div className="absolute bottom-0 w-full h-fit z-10">
            <div className="bg-[#7a7979a1] relative mt-auto md:rounded-b-lg px-1 py-1">
                <RiPlayListLine className="text-xl"/>
            </div>
        </div>
        <div className="w-full h-full relative overflow-hidden pt-[56.25%]">
            <Image src={videoImg} className="!absolute md:rounded-lg !min-w-0 !min-h-0 !w-full !h-full top-0 left-0 right-0 bottom-0" layout="fill" alt="videoImg" loading="lazy" />
        </div>
        </div>
        <div className="basis-[75%] grow ml-1 md:ml-4 mt-1">
            <div className="truncate-2 text-[1.1rem] md:w-[70%] font-[400]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit molestias, odit nobis dolores repudiandae optio unde. Numquam sequi nobis ab!, ipsum dolor sit amet consectetur adipisicing elit. Dolore praesentium quia magni, iste deleniti expedita? Eligendi assumenda obcaecati aliquid distinctio.</div>
            <div className="text-grey text-sm md:w-[70%]">1 day ago</div>
            <Link href={''} className="text-grey md:w-[70%] dark:hover:text-white hover:text-black text-sm">take u forward</Link>
            <div className="text-grey text-sm truncate-1 md:w-[70%]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, eveniet nulla beatae qui hic amet asperiores tempore quaerat non error in expedita possimus quae tempora? Unde sed libero et eveniet officiis soluta aliquam? Fugiat commodi nulla hic molestiae obcaecati praesentium.</div>
        </div>
    </Link>
    </>
}


const ChannelCard = ()=>{
    return <>
    <Link href={''} className="md:w-[90%] md:max-w-[1200px] mx-auto my-4 dark:text-white flex flex-col md:flex-row w-full">
        
       <Link href={''}  className="basis-[25%] shrink-0 md:min-w-[200px] grow">
        <div className="w-1/2 max-w-[200px] mx-auto">
        <div className="w-full relative overflow-hidden pt-[100%]">
            <Image src={img} className="!absolute rounded-full !min-w-0 !min-h-0 !w-full !h-full top-0 left-0 right-0 bottom-0" layout="fill" alt="videoImg" loading="lazy" />
        </div>
        </div>
        </Link>
        
        <div className="basis-[75%] grow ml-1 md:ml-4 mt-2">
            <div className="truncate-2 text-[1.1rem] md:w-[70%] font-[400]">Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit molestias, odit nobis dolores repudiandae optio unde. Numquam sequi nobis ab!, ipsum dolor sit amet consectetur adipisicing elit. Dolore praesentium quia magni, iste deleniti expedita? Eligendi assumenda obcaecati aliquid distinctio.</div>
            <div className="text-grey text-sm md:w-[70%]">1 day ago</div>
            <Link href={''} className="text-grey md:w-[70%] dark:hover:text-white hover:text-black text-sm">take u forward</Link>
            <div className="text-grey text-sm truncate-1 md:w-[70%]">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Est, eveniet nulla beatae qui hic amet asperiores tempore quaerat non error in expedita possimus quae tempora? Unde sed libero et eveniet officiis soluta aliquam? Fugiat commodi nulla hic molestiae obcaecati praesentium.</div>
        </div>
    </Link>

    <hr className="border-none min-h-[2px] my-4 h-[0.5px] w-full md:w-[95%] bg-[#5c5b5b3e]" />
    </>
}

export default SearchPage;