import { useContext, useEffect, useState  } from "react";
import PageSection from "../global/pagesection/pagesection";
import { motion } from "framer-motion";
import PageSkeleton from "../global/pagesection/loading";
import { slideContext } from "@/app/layout";
import { signOut } from "next-auth/react";

export const revalidate = 60

const HomePage = ({param} : any)=>{
  const {slide , setslide} = useContext(slideContext) as any;
  setslide(0);
   
   const [data,setData] = useState([]);
   const [loading , setLoading] = useState(true);

    useEffect(()=>{
       const fetchData = async ()=>{
        try {
          const res = await fetch(`/api/page/popular/${param?.token || 'notoken'}`,{
            next : {revalidate : 300}
          });
            if(res.status != 200){
              console.log(res.statusText);
            }
            else{
              const {videos,ptoken,ntoken} = await res.json();
              setLoading(false);
              setData(videos);
            }
        } catch (error) {
          console.log('homepage error' ,  error);
          signOut();
        }
        
       }

       fetchData();
    },[])

    return <motion.div layout transition={{duration : 0.5}} className="w-full flex justify-center">
        {loading ? <><PageSkeleton/></>:<PageSection items={data}/>}
    </motion.div>

}

export default HomePage;