"use client";


import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const popInAnimation = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.5 } },
};

export default function FoundersQuote() {
 

  // Ref for scroll animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });


  return (
    <section
    ref={sectionRef}
    className="bg-[#1BC2C2] relative overflow-hidden"
  >
    <div className="max-w-screen-2xl mx-auto  px-4 xl:py-36 lg:py-32 md:py-24 items-start sm:py-16 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
        }}
        className="mx-auto items-center"
      >
    
       <motion.div className="space-y-8  mx-auto" variants={popInAnimation}>
 
          <motion.p
            className="text-2xl text-white mx-auto font-medium"
            variants={popInAnimation}
          >
        “Education is the cornerstone of empowerment, and every individual deserves access to quality learning, regardless of geographical boundaries. 
        At Cardinal E-School, we are committed to bridging the gap between traditional classroom learning and innovative online education, fostering a community of curious minds and lifelong learners.”
         </motion.p>

         <motion.p
            className="text-3xl text-white  font-semibold max-w-4xl"
            variants={popInAnimation}
          >
        -Olalekan Okewole, Founder
         </motion.p>

        
        </motion.div>
      </motion.div>
    </div>
  </section>
  );
};


