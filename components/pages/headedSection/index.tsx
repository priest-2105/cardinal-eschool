"use client";


import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const popInAnimation = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.5 } },
};

export default function HeadedSection() {

  // Ref for scroll animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });


  return (
    <section
    ref={sectionRef}
    className="bg-[#C9F4F4] min-h-screen relative overflow-hidden items-start"
  >

    <div className="relative max-w-screen-2xl ms-auto me-auto h-screen overflow-hidden">
      <Image
        src="/assets/img/pages/about/Rectangle 1501.png" 
        alt="Full-Screen Rounded Image"
        fill
        className="object-cover rounded-[30px]"  
      />
    </div>

    <div className="max-w-screen-2xl mx-auto px-4 xl:py-36 lg:py-32 md:py-24 items-start sm:py-16 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
        }}
        className="grid lg:grid-cols-2 gap-12 items-start"
      >
        {/* Left Column - Text Content */}

        
      
        <div className="relative lg:block">
      
            <motion.div 
                drag={true} 
                dragConstraints={{ left: -5, right: 5, top: -5, bottom: 5 }}   
                variants={popInAnimation} 
                className="relative ms-auto rounded-3xl ">

            <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold py-8 text-[#242424] leading-tight"
            variants={popInAnimation}
          >
            Where We Are Headed</motion.h1>
        
            
                </motion.div>
            </div>

     

       {/* Right Column - Images */}
       <motion.div className="space-y-8" variants={popInAnimation}>
 
          <motion.p
            className="text-lg text-gray-900 font-semibold max-w-2xl"
            variants={popInAnimation}
          >
        As the name suggests, Cardinal E-School provides a progressive approach to education, offering a dynamic alternative to conventional learning institutions. Our platform emphasizes practical, hands-on learning powered by cutting-edge digital technology, designed to equip students with the skills they need in today’s fast-evolving world.
            </motion.p>

         <motion.p 
        className="text-lg text-gray-900 font-semibold max-w-2xl"
        variants={popInAnimation}>
        At Cardinal E-School, we believe that empowered learning transforms lives and fuels growth. That’s why our carefully curated courses and programs are crafted to guide students toward achieving excellence in their careers and passions. Through our training, they become pillars of innovation and change within their communities, while also contributing to Global economic development.
        </motion.p>

        <motion.p 
        className="text-lg text-gray-900 font-semibold max-w-2xl"
         variants={popInAnimation}>      
        By the year 2030, Cardinal E-School aims to equip over five million global citizens with essential skills that pave the way for personal growth and a prosperous future for the entire African continent.
        </motion.p>

        
        </motion.div>


      </motion.div>
    </div>
  </section>
  );
};

