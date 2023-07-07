import { signIn, signOut, useSession } from "next-auth/react";
import React, {  useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {FaYoutube , FaMagnifyingGlass , FaThumbsUp , FaBook } from 'react-icons/fa6'
import { AiOutlineMenu } from 'react-icons/ai'

import logo from '@/images/logo.png';
import user from '@/images/user.png';
import logout from '@/images/logout.png';

import Image from "next/legacy/image";
import Link from "next/link";

const Header = ({change } : any)=>{

  const [searchquery , setSearchQuery] = useState('');

  useEffect(()=>{
    console.log('header rendered')
  },[])

    const {status , data : session } = useSession();
    const [search , setSearch] = useState(false);
    const [usermenu , setUsermenu] = useState(false);
    const [profileUrl , setProfileUrl] = useState<any>('');

    const userBtn = ()=>{
        if(status == 'authenticated'){
            setUsermenu((val)=>{return !val})
        }
        if(status == 'unauthenticated') signIn();
    }


    useEffect(()=>{
        if(status == 'authenticated'){
            setProfileUrl(session.user?.image);
        }
        else setProfileUrl('/images/user.png')
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

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef);
    return (
        <div ref={wrapperRef}>
        <nav className="flex flex-wrap md:flex-nowrap bg-white dark:bg-black items-center py-[10px] px-[2%] w-screen h-20 justify-between fixed top-0 z-10">

    <div className="nav-left h-full flex items-center">

       <AiOutlineMenu onClick={()=>{change()}} className="text-[25px] dark:bg-black dark:text-white opacity-60 hidden md:block mr-[25px] cursor-pointer font-thin" />

       <Link href="/"  className="w-[105px] hidden md:block"> 
       <Image src={logo} className="dark:brightness-[6]" loading="lazy" layout="responsive" alt="logo" />
       </Link>


       <Link href="/" className="md:hidden"> <FaYoutube className="text-[red] text-[45px] mr-[25px] logo-small"/></Link>
       
    </div>


    <div className="nav-middle w-auto md:w-[600px] flex items-center">

            <form action="/searchresults" method="post" className="search-box border-2 dark:border-[#353535] w-full h-[40px] rounded-[25px] m-[15px] hidden md:flex items-center">

            <div className="w-[90%] h-full rounded-l-[25px]">
              <input type="text" className="px-[12px] w-full h-full rounded-l-[25px] border-0 outline-0 focus:border-0 dark:bg-black dark:text-white" placeholder="Search" value={searchquery} onChange={(e)=>setSearchQuery(e.target.value)} />
            </div>

            <div className="btn-div w-[10%] h-full p-0 flex justify-center rounded-r-[25px] bg-[rgb(0,0,0,0.05)] border-0 border-l-2 border-l-[rgba(103,103,103,0.68)] hover:bg-[rgb(0,0,0,0.1)]" >
              <button id="searchbtnlg" aria-label='searchbtnlg' className="border-r-[0px] h-full dark:bg-black dark:hover:bg-[#585858fe] rounded-r-[25px] cursor-pointer w-full border-0 flex items-center justify-center" type="submit">
                <FaMagnifyingGlass className="text-black dark:text-white"/>
              </button>
            </div>

            </form>
    </div>


    <div className="nav-right flex justify-center items-center">

        <button id="searchbtnsm" aria-label='searchbtnsm' className="flex items-center justify-center" onClick={()=>{setSearch((search)=>{return !search})}}><FaMagnifyingGlass className="w-[25px] h-[25px] font-bold inline text-white md:hidden mr-8 search"/></button>

        <motion.div transition={{layout:{duration : 1 }}} layout className="usermenu relative">

          <button id="usermenu" aria-label='usermenu' className="profile-section" onClick={()=>{userBtn()}}>
            {status == 'authenticated' ?
            <Image src={profileUrl} alt="user" width={35} height={35} className="mr-0  bg-white rounded-full" />
            :
            <Image src={user} alt="user" width={35} height={35} className="mr-0  bg-white rounded-full" />
            }
          </button>

           {
            usermenu &&

          <motion.div initial={{opacity : 0}} animate={{opacity:1}} className={`user-actions text-black absolute shadow-lg translate-x-[-100%] w-max min-w-[250px] rounded-md py-2 px-[1rem] flex flex-col transition-all dark:bg-[#282828] dark:shadow-[rgb(255,255,255,0.1)]`}> 

           <Link href="/likepage" className="p-[5%] relative w-full flex rounded-[8px] dark:text-white items-center hover:bg-[rgb(0,0,0,0.1)] dark:hover:bg-[rgb(255,255,255,0.1)]"> 
           <div className="w-[1.3rem] m-0 mr-[5%]">
            <FaThumbsUp className="dark:text-black !text-white text-lg"/>
           </div>
           Your Liked Videos
           </Link>

           <hr className="my-[5%] bg-[rgba(0,0,0,0.3)] border-0 h-[0.5px] dark:bg-[rgb(255,255,255,0.3)]"/>

           <Link href="/library" className="p-[5%] relative w-full flex rounded-[8px] dark:text-white items-center hover:bg-[rgb(0,0,0,0.1)] dark:hover:bg-[rgb(255,255,255,0.1)]">
           <div className="w-[1.3rem] m-0 mr-[5%]">
             <FaBook className="dark:text-black !text-white text-lg" />
            </div>
            Library
             </Link>

              <hr className="my-[5%] bg-[rgba(0,0,0,0.3)] border-0 h-[0.5px] dark:bg-[rgb(255,255,255,0.3)]"/>

           <button id="logoutbtn" aria-label='logoutbtn' onClick={()=>{signOut()}} className="p-[5%] relative w-full flex rounded-[8px] dark:text-white items-center hover:bg-[rgb(0,0,0,0.1)] bg-[#ff00009f] dark:bg-[#ff00008a] dark:hover:bg-[rgb(255,255,255,0.1)] logoutbtn" > 
           <div className="w-[1.3rem] m-0 mr-[5%]">
           <Image className="dark:invert" layout="responsive" src={logout} alt="logout" />
           </div>
             LogOut
           </button>

          </motion.div>
           }


        </motion.div>
       
    </div>
    {/*  visible : top 60px mt 0px */}

   
</nav>

{search &&

<motion.form layout="position" transition={{layout :{duration : 2}}} action="/searchresults" method="post" className={`basis-full flex md:hidden sticky items-center justify-center z-[0] transition-all`}>  
  <input type="text" className="border-t-[0] border-x-0 dark:bg-white border-b-[0.5px] border-b-[#606060] outline-0 w-[99%] rounded-sm h-[50px] text-[1.3rem] px-[1%] focus:border-b-[0.7px]" placeholder="Search"  value={searchquery} onChange={(e)=>setSearchQuery(e.target.value)} />
</motion.form>
 }


        </div>
    )
}

export default Header;