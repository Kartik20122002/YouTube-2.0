'use client'
import { useEffect, useState , cache, useContext } from "react";
import PageSection from "../global/pagesection/pagesection";
import { motion } from "framer-motion";
import PageSkeleton from "../global/pagesection/loading";
import { slideContext } from "@/app/layout";
import { signOut } from "next-auth/react";

export const revalidate = 0

const LikePage = ({param} : any)=>{
  const {slide , setslide} = useContext(slideContext) as any;
  setslide(2);

   const [data,setData] = useState([]);
   const [loading , setLoading] = useState(true);
    useEffect(()=>{
       const fetchData = async ()=>{
        try{
          const res = await fetch(`/api/page/liked/${param?.token || 'notoken'}`,{
            next: {revalidate : 300},
          });
          const {videos,ptoken,ntoken} = await res.json();
          setLoading(false);
          setData(videos);
        }
        catch(error){
          console.log('likepage error' , error);
          signOut();
        }
       
       }

       fetchData();
    },[])

    return <motion.div layout transition={{duration : 0.5}}>
        {loading ? <><PageSkeleton/></>:<PageSection items={data}/>}
    </motion.div>

}

export default LikePage;