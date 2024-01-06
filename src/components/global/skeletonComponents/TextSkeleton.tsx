const Sekelton = ({width, height, className } : any)=>{
      return <div className={`skeletonUi ${width || 'min-w-full'} ${height || 'min-h-[1rem]'} ${className} rounded-lg mb-[0.3rem]`}>
         </div>
 }
 
 export default Sekelton;