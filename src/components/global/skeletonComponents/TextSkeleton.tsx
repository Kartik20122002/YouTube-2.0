const Sekelton = ({width, height, count = 1 , className } : any)=>{
      return <div className={`dark:bg-[#202324] bg-[#b8b8b8] animate-pulse ${width || 'min-w-full'} ${height || 'min-h-[1rem]'} ${className} rounded-lg mb-[0.3rem]`}>
         </div>
 }
 
 export default Sekelton;