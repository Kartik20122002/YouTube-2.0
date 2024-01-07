'use client'
import { pageContext } from "@/app/layout"
import { useContext, useState } from "react"
import PageSkeleton from "@/components/global/pagesection/loading";
import {motion} from 'framer-motion'


const PageSection = () => {
  const { setpage } = useContext(pageContext) as any;

  const [filter, setFilter] = useState(0);
  setpage(false);

  const filters = [
    { name: 'All', id: 0 },
    { name: 'Film & Animation', id: 1 },
    { name: 'Music', id: 10 },
    { name: 'News & Politics', id: 25 },
    { name: 'Gaming', id: 20 },
    { name: 'Science & Technology', id: 28 },
    { name: 'Sports', id: 17 },
    { name: 'Pets & Animals', id: 15 },
    { name: 'Entertainment', id: 24 },
    { name: 'Autos & Vehicals', id: 2 },
    { name: 'People & Blogs', id: 22 },
    { name: 'Comedy', id: 23 },
    { name: 'Howto & Style', id: 26 },
  ]

  return <>
      <motion.div layout transition={{duration : 0.5}} className="w-full flex dark:text-white dark:bg-black bg-white overflow-x-scroll mb-3 mx-1 md:mx-0 snap-x">
        {
          filters?.map((item: any) => {
            return <div key={item.id} onClick={() => setFilter(item.id)} className={`${filter === item.id ? 'dark:bg-white bg-black dark:text-black text-white' : 'bg-[rgb(0,0,0,0.05)] hover:bg-[rgba(0,0,0,0.14)] dark:bg-[rgba(255,254,254,0.16)] dark:hover:bg-[rgba(255,254,254,0.22)]'}  snap-start transition-colors duration-300 font-semibold text-[0.9rem] cursor-pointer min-w-[max-content] rounded-md px-3 py-[0.3rem] text-center mx-2`}>{item.name}</div>
          })
        }
      </motion.div>
    
     <PageSkeleton />
  </>
}


export default PageSection;