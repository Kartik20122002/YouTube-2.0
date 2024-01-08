'use client'
import SekeltonImg from "@/components/global/skeletonComponents/ImgSkeleton";
import SekeltonText from "@/components/global/skeletonComponents/TextSkeleton";

const SearchPage = () => {
    return <>
        <div className="flex flex-col  overflow-y-scroll h-[90vh] pb-[1rem] w-full">
            {Array.from({ length: 10 }, (_, index) => {
                    return <SkeletonCard key={index} />;
            })}
        </div>
    </>
}


const SkeletonCard = () => {
    return <>
        <div className="md:w-[90%] md:max-w-[1200px] mx-auto mb-4 dark:text-white flex flex-col md:flex-row w-full">
            <div className="basis-[25%] shrink-0 md:min-w-[200px] grow">
                <div className="w-full h-full relative overflow-hidden pt-[56.25%]">
                    <SekeltonImg className="absolute md:rounded-lg top-0 left-0 bottom-0 right-0" />
                </div>
            </div>
            <div className="basis-[75%] grow ml-1 md:ml-4 mt-1">
                <div className=" md:w-[70%]">
                    <SekeltonText height="min-h-[1.2rem] mb-2" />
                    <SekeltonText height="min-h-[1.2rem] mb-2" width="w-[80%]" />
                </div>
                <div className="md:w-[70%]"><SekeltonText height="min-h-[0.8rem]" width="min-w-[25%] max-w-[25%]" /></div>
                <div className="text-grey md:w-[70%] dark:hover:text-white hover:text-black text-sm"><SekeltonText height="min-h-[0.8rem]" width="min-w-[35%] max-w-[35%]" /></div>
                <div className="text-grey text-sm truncate-1 md:w-[70%]"><SekeltonText height="min-h-[0.8rem]" width="w-[90%]" /></div>
            </div>
        </div>
    </>
}

export default SearchPage;