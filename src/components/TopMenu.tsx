'use client'
import Link from "next/link"
import { motion } from "framer-motion"

export default function TopMenu() {

    return (
        <div className="w-full h-[60px] bg-[#FFECAD] absolute z-30 flex">
            {/* Logo */}
            <motion.div className="h-full w-[60px] flex-shrink-0 flex items-center justify-center bg-[#F89640]"
            whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }} >
                <Link href={'/'}>
                        <img className="h-[52px]" alt="Logo" src="/images/logo.jpg" />
                </Link>
            </motion.div>

            {/* Queue Stuff */}

            {/* If logged in then show profile */}
            
            {/* Login */}
            <Link href={'/login'}>
                <motion.div className="h-full w-fit text-white bg-[#F89640] items-center flex px-16 absolute right-0"
                whileHover={{ backgroundColor: "#5A2934", fontSize: "17px" }} 
                transition={{ duration: 0.3 }}>
                    Login
                </motion.div>
            </Link>
        </div>
    )
}