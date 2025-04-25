'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function NotificationCard() {

    const notiStatus = useSelector((state: RootState) => state.notiStatus);
    const queueNumber = useSelector((state: RootState) => state.queueNumber);

    // status === 1 : waiting for queue
    // status === 2 : queue is called
    
    // delay for animation
    const [expanded, setExpanded] = useState(false);
    const [visible, setVisible] = useState(false);

    const text = notiStatus === 1 ? `Waiting for ${queueNumber} queue..` : notiStatus === 2 ? "Your queue is called !" : "" ;

    useEffect(() => {  
        setVisible(false);  
        setExpanded(false);
        
        const timer1 = setTimeout(() => {
            setVisible(true);
        }, 0.2 * 1000);
        
        const timer2 = setTimeout(() => {
            setExpanded(true);
        }, 1 * 1000);

        return () => {
            clearTimeout(timer1); 
            clearTimeout(timer2);
            setVisible(false);  
            setExpanded(false);
        } 
    }, [notiStatus]);

    return (      
        <div
        className={`fixed bottom-4 left-1/2 z-50 transform -translate-x-1/2 transition-all duration-300 ease-in-out
            h-[50px] rounded-full flex items-center justify-start content-center px-[10px] gap-[7px]
            ${ notiStatus === 2 ? "bg-red-500" : "bg-yellow-400" }
            ${ visible && notiStatus !== 0 ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0" }
            ${ expanded ? "w-[220px]" : "w-[50px] bg-yellow-400"}`}
        >               
            <Image
                src="/images/notification.svg"
                alt="i"
                width={30}
                height={30}
                className= { `${expanded && notiStatus === 2 ? "animate-wiggle" : ""}`}
            />               
            <span className={`text-white 
            transition-opacity duration-300 delay-100 ease-in-out
            font-inter text-nowrap 
            ${ expanded && notiStatus !== 0 ? "opacity-100" : "opacity-0" }`}>
                {text}
            </span>
        </div>
      );
}