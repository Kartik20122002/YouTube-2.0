import { motion } from "framer-motion";

const Sekelton = ({width, height, circle = false ,borderRadius = 0, className } : any)=>{
   return <motion.div layout transition={{ duration: 0.5 }} className={`skeletonUi  ${width || 'min-w-full'} ${height || 'min-h-full'} ${className}  ${circle && '!rounded-full'} ${borderRadius && `rounded-[${borderRadius}]`}`}>
   </motion.div>
}

export default Sekelton;