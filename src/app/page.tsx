"use client";

import { motion } from 'framer-motion'

export default function Home() {

  return (
      <main className="flex flex-col items-center w-full h-full relative bg-white">
        
        {/* TOPBAR */}

        {/* Welcome */}
        <div className="flex flex-col w-full h-screen items-center justify-center space-y-2">
          <h1 className="text-[100px]">Welcome to SCAM !</h1>
          <motion.button className="bg-[#595959] text-white text-2xl px-[60px] py-5" 
          whileHover={{ backgroundColor: "#393939", scale: 1.02 }} 
          transition={{ duration: 0.3 }}>Browse Restaurants</motion.button>
        </div>

        {/* Best Reviewed Restaurant */}
        <div className='flex flex-col w-full h-screen bg-[#393939] px-20 py-10'>

          <h1 className='text-white text-[80px] font-medium'>Best Reviewed Restaurant</h1>

          <div className='flex flex-row w-full h-full py-10'>
            {/* Get Best Reviewed Restaurant */}
            <div className='bg-[#FF7B00] w-1/2 items-center justify-center flex'>
              {/* To be Implemented */}
              <h1 className='text-white text-3xl'>Image</h1>
            </div>
            <div className='bg-white w-1/2'>
              {/* To be Implemented */}
            </div>
          </div>

        </div>

        {/* Who are we */}
        <div className='flex flex-row w-full h-screen'>

          <div className='h-full w-1/2 bg-[#969696] flex flex-col px-10 py-2'>
            <h1 className='text-white text-[80px]'>Who are we ?</h1>
            <p className='text-white text-xl'>
              We are a website created to help you easily view and reserve restaurants. Allow you to use your time in something more useful than waiting.
            </p>
          </div>

          <div className='bg-[#FF7B00] w-1/2 items-center justify-center flex'>
              {/* To be Implemented */}
              <h1 className='text-white text-3xl'>Image</h1>
          </div>

        </div>

        {/* What you can do */}
        <div className='flex flex-row w-full h-screen'>

          <div className='bg-[#FF7B00] w-1/2 items-center justify-center flex'>
              {/* To be Implemented */}
              <h1 className='text-white text-3xl'>Image</h1>
          </div>

          <div className='h-full w-1/2 bg-[#969696] flex flex-col px-10 py-2 space-y-3'>

            <h1 className='text-white text-[80px]'>What you can do ?</h1>

            {/* Browse Restaurants (Add Link) */}
            <p className='text-white text-2xl'>You can browse all reservations by clicking at</p>
            <motion.button className="bg-[#595959] text-white text-2xl px-[60px] py-5 w-2/3" 
            whileHover={{ backgroundColor: "#393939", scale: 1.02 }} 
            transition={{ duration: 0.3 }}>Browse Restaurants</motion.button>

            {/* Reserve / Queue (Add Link) */}
            <p className='text-white text-2xl'>Then, select one and reserve or create queue</p>
            <div className='flex flex-row w-full h-fit space-x-4 items-center'>
              <motion.button className="bg-[#595959] text-white text-2xl px-[60px] py-5 w-fit" 
              whileHover={{ backgroundColor: "#393939", scale: 1.02 }} 
              transition={{ duration: 0.3 }}>Get In Line</motion.button>
              <p className='text-white text-2xl'>or</p>
              <motion.button className="bg-[#595959] text-white text-2xl px-[60px] py-5 w-fit" 
              whileHover={{ backgroundColor: "#393939", scale: 1.02 }} 
              transition={{ duration: 0.3 }}>Reserve</motion.button>
            </div>

          </div>

        </div>

        {/* Register */}
        <div className='flex flex-row w-full h-screen'>

          <div className='h-full w-1/2 bg-[#969696] flex flex-col px-10 py-2'>
            <h1 className='text-white text-[80px]'>Let's Get Started !</h1>
            <p className='text-white text-3xl mb-5'>
              Click here to create your account !
            </p>
            <motion.button className="bg-[#595959] text-white text-2xl px-[60px] py-5 w-fit" 
              whileHover={{ backgroundColor: "#393939", scale: 1.02 }} 
              transition={{ duration: 0.3 }}>Register</motion.button>
          </div>

          <div className='bg-[#FF7B00] w-1/2 items-center justify-center flex'>
              {/* To be Implemented */}
              <h1 className='text-white text-3xl'>Image</h1>
          </div>

        </div>

        {/* Bottom Image */}
        <div className='bg-[#FF7B00] w-full h-screen items-center justify-center flex'>
              {/* To be Implemented */}
              <h1 className='text-white text-3xl'>Image</h1>
        </div>

      </main>
  );
}

