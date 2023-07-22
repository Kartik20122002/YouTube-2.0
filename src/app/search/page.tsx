'use client'
import { slideContext } from "@/app/layout";
import SearchPage from "@/components/searchPage/SearchPage";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";


const Searchpage = ()=>{
  const searchParams = useSearchParams()
  const {slide , setslide} = useContext(slideContext) as any;
 
  const query = searchParams.get('query')
  useEffect(()=>{
    setslide(-1);
  })

  return <SearchPage query={query}/>
}

export default Searchpage;