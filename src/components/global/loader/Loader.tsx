'use client'
import { FaYoutube } from "react-icons/fa6";
import { motion } from "framer-motion";

const Loader = () => {
    return <motion.div layout transition={{ duration: 0.5 }} className="w-full h-full flex flex-col justify-center dark:bg-black bg-white items-center text-white">

        <motion.div layout animate={{ scale : 1.1}} transition={{ repeat: Infinity, duration: 1.5  }} className="text-[red] text-[2.5rem] ">
            <FaYoutube />
        </motion.div>
        <motion.div layout transition={{ duration: 0.5 }} className="w-full text-center">
            Loading
        </motion.div>
    </motion.div>
}

export default Loader;