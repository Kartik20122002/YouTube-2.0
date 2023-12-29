'use client'
import { pageContext, slideContext } from "@/app/layout";
import SearchPage from "@/components/searchPage/SearchPage";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext, useEffect } from "react";


const Searchpage = () => {
  const searchParams = useSearchParams()
  const { slide, setslide } = useContext(slideContext) as any;
  const { setpage } = useContext(pageContext) as any;
  setpage(false);
  setslide(-1);

  const query = searchParams.get('query')

  return <SearchPage query={query} />
}

export default Searchpage;