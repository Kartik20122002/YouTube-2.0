import { slideContext } from "@/app/layout";
import Link from "next/link";
import { useContext } from "react";
import { AiFillHome, AiFillLike, AiOutlineHome, AiOutlineLike } from "react-icons/ai";
import { MdLibraryAdd, MdOutlineLibraryAdd } from "react-icons/md";

const links = [
  {
    name: 'Home',
    link: '/',
    icon1: <AiFillHome className="text-xl" />,
    icon2: <AiOutlineHome className="text-xl" />,
  },
  {
    name: 'Library',
    link: '/library',
    icon1: <MdLibraryAdd className="text-xl" />,
    icon2: <MdOutlineLibraryAdd className="text-xl" />
  },
  {
    name: 'Liked Video',
    link: '/likepage',
    icon1: <AiFillLike className="text-xl" />,
    icon2: <AiOutlineLike className="text-xl" />
  },
];


const BottomBar = () => {
  const { slide, setslide } = useContext(slideContext) as any;

  return (<>
    <div className="fixed bottom-0 w-full flex md:hidden h-[6vh] dark:bg-black bg-white">
      <div className="w-full flex">
        {links?.map((link: any, index: any) => {
          return <Link key={index} onClick={() => setslide(index)} href={link.link} className="flex flex-col basis-auto justify-center items-center grow dark:bg-black bg-white dark:text-white">
            {slide === index ? link.icon1 : link.icon2}
            <div className="title text-[0.6rem]">{link.name}</div>
          </Link>
        })}
      </div>
    </div>
  </>)
}

export default BottomBar;