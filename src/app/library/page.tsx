'use client'
import LibraryPage from "@/components/library/Library";
import { useContext } from "react";
import { pageContext, slideContext } from "../layout";

const Library = () => {
    const { slide, setslide } = useContext(slideContext) as any;
    const { setpage } = useContext(pageContext) as any;
    setslide(1);
    setpage(false);


    return <LibraryPage />
}

export default Library;