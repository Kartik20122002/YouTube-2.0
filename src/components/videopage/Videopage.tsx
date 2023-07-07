import React from 'react';
import YouTube from 'react-youtube';

const Videopage = ({id} : any)=>{ 
    return (<>
    <div className="w-full h-full">
       <YouTube videoId={id} loading='eager' className='w-full h-full' onReady={()=>console.log('ready')} onPlay={()=>console.log('played')} onEnd={()=>console.log('ended')} />
    </div>
    </>)
}

export default Videopage;