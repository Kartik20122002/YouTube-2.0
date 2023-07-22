'use client'
import { signIn, signOut, useSession } from "next-auth/react";
import React, {  useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaMagnifyingGlass} from 'react-icons/fa6';
import { AiFillLike, AiOutlineSearch } from "react-icons/ai";
import { MdKeyboardBackspace, MdLibraryAdd } from 'react-icons/md';
import { AiOutlineMenu , AiOutlineLogout } from 'react-icons/ai'
import { useRouter } from "next/navigation";

import logo from '@/images/logo.png';
import user from '@/images/user.png';

import Image from "next/legacy/image";
import Link from "next/link";

const Header = ({change } : any)=>{

  const router = useRouter();

  const [searchquery , setSearchQuery] = useState('');

  const searchOps = (e : any) =>{
    e.preventDefault();
    router.push(`/search?query=${searchquery}`);
  }

  useEffect(()=>{
    console.log('header rendered')
  },[])

    const {status , data : session } = useSession();
    const [usermenu , setUsermenu] = useState(false);
    const [search , setSearch] = useState(false);
    const [profileUrl , setProfileUrl] = useState<any>('/images/user.png');

    const userBtn = ()=>{
        if(status == 'authenticated'){
            setUsermenu((val)=>{return !val})
        }
        if(status == 'unauthenticated') signIn();
    }


    useEffect(()=>{
        if(status == 'authenticated')
            setProfileUrl(session.user?.image);
    },[status]);

    function useOutsideAlerter(ref:any) {
      useEffect(() => {
        function handleClickOutside(event:any) {
          if (ref.current && !ref.current.contains(event.target)) {
            setUsermenu(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [ref]);
    }

    const toggle = ()=>{
      setSearch(!search);
    }

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);
    return (
        <div ref={wrapperRef}>
    
    <nav className="flex flex-wrap md:flex-nowrap bg-white dark:bg-black items-center pt-1 md:pt-0 w-screen h-fit justify-between fixed top-0 z-10">
    
    <div className={`basis-[25%] h-full ${search ? 'hidden' : 'flex'} md:flex items-center justify-evenly`}>

       <AiOutlineMenu onClick={()=>{change()}} className="text-[25px] dark:bg-black dark:text-white opacity-60 hidden md:block cursor-pointer font-thin" />

       <Link href="/"  className="w-full md:w-[105px] block"> 
       <Image src={logo} className="dark:brightness-[6]" loading="lazy" layout="responsive" alt="logo" />
       </Link>

    </div>


    <div className={`hidden h-full basis-[70%] grow md:max-w-[600px] md:flex items-center`}>

            <form onSubmit={(e)=>searchOps(e)} className="border-2 dark:border-[#353535] w-full h-[40px] rounded-[25px] mx-2 flex items-center">

            <div className="basis-[90%] h-full rounded-l-[25px]">
              <input required type="text" className="px-[12px] w-full h-full rounded-l-full border-0 outline-0 focus:border-0 dark:bg-black dark:text-white" placeholder="Search" value={searchquery} onChange={(e)=>setSearchQuery(e.target.value)} />
            </div>

            <div className="grow basis-[10%] h-full p-0 flex justify-center rounded-r-[25px] bg-[rgb(0,0,0,0.05)] border-0 border-l-2 border-l-[rgba(103,103,103,0.68)] hover:bg-[rgb(0,0,0,0.1)]" >
              <button className="border-r-[0px] h-full dark:bg-black dark:hover:bg-[#585858fe] rounded-r-[25px] cursor-pointer w-full border-0 flex items-center justify-center" type="submit">
                <FaMagnifyingGlass className="text-black dark:text-white"/>
              </button>
            </div>

            </form>
    </div>

    <div className={`dark:text-white flex ${search ? 'hidden' : 'flex'} justify-end md:hidden grow basis-[50%]`}><AiOutlineSearch onClick={()=>toggle()} className="text-2xl cursor-pointer mr-6 font-black"/></div>

    <div className={`nav-right ${search ? 'hidden' : 'flex'} md:flex basis-[10%] h-full justify-center items-center`}>
        
        <div className="w-full h-full relative">

          <button id="usermenu" aria-label='usermenu' className="flex h-full w-full justify-center items-center" onClick={()=>{userBtn()}}>
            {status == 'authenticated' ?
            <Image src={profileUrl} alt="user" width={35} height={35} className="mr-0 bg-white rounded-full" />
            :
            <Image src={user} alt="user" width={35} height={35} className="mr-0 bg-white rounded-full" />
            }
          </button>

           {
            usermenu &&

          <div className={`user-actions text-black absolute shadow-lg translate-x-[-80%] w-max min-w-[250px] rounded-md py-2 px-[1rem] flex flex-col transition-all dark:bg-[#282828] dark:shadow-[rgb(255,255,255,0.1)]`}> 

           <Link href="/likepage" className="p-[5%] relative w-full flex rounded-[8px] dark:text-white items-center hover:bg-[rgb(0,0,0,0.1)] dark:hover:bg-[rgb(255,255,255,0.1)]"> 
           <div className="w-[1.3rem] m-0 mr-[5%]">
            <AiFillLike className="dark:text-black !text-white text-lg"/>
           </div>
           Your Liked Videos
           </Link>

           <hr className="my-[5%] bg-[rgba(0,0,0,0.3)] border-0 h-[0.5px] dark:bg-[rgb(255,255,255,0.3)]"/>

           <Link href="/library" className="p-[5%] relative w-full flex rounded-[8px] dark:text-white items-center hover:bg-[rgb(0,0,0,0.1)] dark:hover:bg-[rgb(255,255,255,0.1)]">
           <div className="w-[1.3rem] m-0 mr-[5%]">
             <MdLibraryAdd className="dark:text-black !text-white text-lg" />
            </div>
            Library
             </Link>

              <hr className="my-[5%] bg-[rgba(0,0,0,0.3)] border-0 h-[0.5px] dark:bg-[rgb(255,255,255,0.3)]"/>

           <button id="logoutbtn" aria-label='logoutbtn' onClick={()=>{signOut({callbackUrl: "/"})}} className="p-[5%] relative w-full flex rounded-[8px] dark:text-white items-center hover:bg-[rgb(0,0,0,0.1)] bg-[#ff00009f] dark:bg-[#ff00008a] dark:hover:bg-[rgb(255,255,255,0.1)] logoutbtn" > 
           <div className="w-[1.3rem] m-0 mr-[5%]">
           <AiOutlineLogout className="dark:text-white text-black"/>
           </div>
             LogOut
           </button>

          </div>
           }


        </div>
       
    </div>
    
    
    <div className={`dark:text-white mt-2  ${!search ? 'hidden' : 'flex'} flex md:hidden justify-evenly basis-full`}>
      <button onClick={()=>toggle()} className="basis-[10%]"><MdKeyboardBackspace className="text-2xl"/></button>
      <form onSubmit={(e)=>searchOps(e)} className=" basis-[85%] ">

            <div className="basis-full h-full rounded-full">
              <input required type="text" className="px-[12px] py-2 w-full h-full rounded-full border-2 dark:border-[#353535] outline-0 dark:bg-black dark:text-white" placeholder="Search" value={searchquery} onChange={(e)=>setSearchQuery(e.target.value)} />
            </div>

            </form>
    </div> 
    
   
</nav>

        </div>
    )
}

export default Header;