"use client";

import { motion, useInView } from 'framer-motion'
import { useRef } from "react";

export default function Home() {

  return (
      <main className="flex flex-col items-center w-full h-full relative bg-[#FAF9F6]">

        {/* Welcome */}
        <div className="flex flex-col w-full h-screen items-center justify-center">
          <h2 className="text-[50px]">Welcome to</h2>
          <h1 className="text-[150px] mb-10">
            <span className="text-[#F59C04]">S</span>
            <span className="text-[#1FA49F]">C</span>
            <span className="text-[#F59C04]">A</span>
            <span className="text-[#1FA49F]">M</span>
            <span className="text-[#5A2934]"> !</span>
          </h1>
          {/* #FF7B00 Old Button Hover Color */}
          <motion.button className="bg-[#F89640] text-white text-2xl px-[60px] py-5" 
          whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }} 
          transition={{ duration: 0.3 }}>Browse Restaurants</motion.button>
        </div>

        {/* Best Reviewed Restaurant */}
        <div className='flex flex-col w-full h-[80vh] bg-[#F89640] px-20 py-10'>

          <h1 className='text-white text-[80px] font-medium'>Best Reviewed Restaurant</h1>

          <div className='flex flex-row w-full h-full py-10'>
            {/* Get Best Reviewed Restaurant */}
            <div className='bg-[#3D3C3B] w-1/2 items-center justify-center flex'>
              {/* To be Implemented */}
              <h1 className='text-white text-3xl'>Image</h1>
            </div>
            <div className='bg-white w-1/2'>
              {/* To be Implemented */}
            </div>
          </div>

        </div>

        {/* Who are we */}
        <div className='flex flex-row w-full h-[80vh]'>

          <div className='h-full w-1/2 bg-[#75C4CD] flex flex-col px-20 py-2 flex items-center justify-center'>
            <h1 className='text-white text-[80px] mb-2'>Who are we ?</h1>
            <p className='text-white text-xl text-center'>
              We are a website created to help you easily view and reserve restaurants. Allow you to use your time in something more useful than waiting.
            </p>
          </div>

          <div className='bg-[#3D3C3B] w-1/2 items-center justify-center flex'>
              <motion.img className="h-full object-cover" alt="Restaurant" src="/images/HomePage1.jpg"
                whileInView={{ opacity: 1 }}
                initial={{ opacity: 0.2 }}
                transition={{ duration: 0.7 }}
                viewport={{ amount: 0.6 }}
              />
          </div>

        </div>

        {/* What you can do */}
        <div className='flex flex-row w-full h-[80vh]'>

          <div className='bg-[#3D3C3B] w-1/2 items-center justify-center flex'>
            <motion.img className="w-full h-full object-cover" alt="Restaurant" src="/images/HomePage2.jpg"
                whileInView={{ opacity: 1 }}
                initial={{ opacity: 0.2 }}
                transition={{ duration: 0.7 }}
                viewport={{ amount: 0.6 }}
              />
          </div>

          <div className='h-full w-1/2 bg-[#75C4CD] flex flex-col px-10 py-2 space-y-4 flex items-center justify-center'>

            <h1 className='text-white text-[80px]'>What you can do ?</h1>

            {/* Browse Restaurants (Add Link) */}
            <p className='text-white text-2xl'>You can browse all reservations by clicking at</p>
            <motion.button className="bg-[#F89640] text-white text-2xl px-[60px] py-5 w-2/3" 
            whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }} 
            transition={{ duration: 0.3 }}>Browse Restaurants</motion.button>

            {/* Reserve / Queue (Add Link) */}
            <p className='text-white text-2xl'>Then, select one and reserve or create queue</p>
            <div className='flex flex-row w-full h-fit space-x-4 items-center justify-center'>
              <motion.button className="bg-[#F89640] text-white text-2xl px-[60px] py-5 w-fit" 
              whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }} 
              transition={{ duration: 0.3 }}>Get In Line</motion.button>
              <p className='text-white text-2xl'>or</p>
              <motion.button className="bg-[#F89640] text-white text-2xl px-[60px] py-5 w-fit" 
              whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }} 
              transition={{ duration: 0.3 }}>Reserve</motion.button>
            </div>

          </div>

        </div>

        {/* Register */}
        <div className='flex flex-row w-full h-[80vh]'>

          <div className='h-full w-1/2 bg-[#75C4CD] flex flex-col px-10 py-2 flex items-center justify-center space-y-4'>
            <h1 className='text-white text-[70px]'>Let's Get Started !</h1>
            <p className='text-white text-3xl mb-5'>
              Click here to create your account !
            </p>
            <motion.button className="bg-[#F89640] text-white text-2xl px-[60px] py-5 w-fit" 
              whileHover={{ backgroundColor: "#5A2934", scale: 1.02 }}
              transition={{ duration: 0.5 }}>Register</motion.button>
          </div>

          <div className='bg-[#3D3C3B] w-1/2 items-center justify-center flex'>
            <motion.img className="h-full w-full object-cover" alt="Restaurant" src="/images/HomePage3.jpg"
              whileInView={{ opacity: 1 }}
              initial={{ opacity: 0.2 }}
              transition={{ duration: 0.7 }}
              viewport={{ amount: 0.6 }}
              whileHover={{ zoom: 1.02 }}
            />
          </div>

        </div>

        {/* Bottom Image */}
        <div className='bg-[#3D3C3B] w-full h-[80vh] items-center justify-center flex'>
          <motion.img className="w-[90vw] h-4/5 object-cover" alt="Restaurant" src="/images/HomePage4.jpg"
            whileInView={{ opacity: 1 }}
            initial={{ opacity: 0.2 }}
            transition={{ duration: 0.7 }}
            viewport={{ amount: 0.6 }}
            whileHover={{ scale: 1.02 }}
          />
        </div>

      </main>
  );
}

