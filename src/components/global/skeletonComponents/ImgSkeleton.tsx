const Sekelton = ({width, height, circle = false ,borderRadius = 0, className } : any)=>{
   return <div className={`dark:bg-[#202324] bg-[#b8b8b8] animate-pulse ${width || 'min-w-full'} ${height || 'min-h-full'} ${className}  ${circle && '!rounded-full'} ${borderRadius && `rounded-[${borderRadius}]`}`}>
   </div>
}

export default Sekelton;