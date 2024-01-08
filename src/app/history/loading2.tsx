'use client'
import { pageContext } from "@/app/layout"
import { useContext } from "react"
import PageSkeleton from "@/components/global/pagesection/loading";


const HistorySkeleton = ({ page }: any) => {
  const { setpage } = useContext(pageContext) as any;
  setpage(false);


  return <PageSkeleton /> 
}

export default HistorySkeleton;