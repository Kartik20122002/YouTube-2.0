'use client'
import { FaYoutube } from "react-icons/fa6";

const ErrorPage = ()=>{
    return <div className="text-white w-full h-full flex flex-col text-lg items-center justify-center">
    <FaYoutube className="text-[4rem] text-[red] mb-2"/>
    Sorry , Please try Logout and SignIn again.
    </div>
}

export default ErrorPage;