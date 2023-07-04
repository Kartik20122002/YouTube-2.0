import { useEffect, useState  } from "react";
import PageSection from "../global/pagesection/pagesection";
import { motion } from "framer-motion";
import PageSkeleton from "../global/pagesection/loading";

export const revalidate = 60

const HomePage = ({param} : any)=>{

   const [data,setData] = useState([]);
   const [loading , setLoading] = useState(true);
    useEffect(()=>{
       const fetchData = async ()=>{
        const res = await fetch(`/api/page/popular/${param?.token || 'notoken'}`);
          const {videos,ptoken,ntoken} = await res.json();
          setLoading(false);
          setData(videos);
       }

       fetchData();
    },[])

    return <motion.div layout transition={{duration : 0.5}} className="w-full flex justify-center">
        {loading ? <><PageSkeleton/></>:<PageSection items={data}/>}
    </motion.div>

}

export default HomePage;