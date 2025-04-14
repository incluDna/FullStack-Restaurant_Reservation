'use client'

import React from 'react';

export default function ReviewInteractiveCard( {children,contentName}:
    {children:React.ReactNode,contentName:string}){
    return(
        <div className='w-full h-[300px] rounded-lg shadow-lg'>
             {/* onMouseOver={(e)=>onCardMouseAction(e)}
             onMouseOut={(e)=>onCardMouseAction(e)}> */}
            no use this
            {children}
        </div>
    )
}