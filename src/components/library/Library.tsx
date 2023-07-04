import Link from "next/link";

const Library = ()=>{
    return <div className="w-full h-full">
    welcome to library
    <Link href={'/homepage'}>go to homepage</Link>
    </div>
}

export default Library;