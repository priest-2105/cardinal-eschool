"use client";


import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import cardinalConfig from "@/config";

const popInAnimation = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.5 } },
};

export default function LearningToday() {
 
  // Ref for scroll animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });


return (
    <section
      ref={sectionRef}
      className="bg-[#DAFAFA] min-h-screen relative overflow-hidden px-4 xl:py-36 lg:py-32 md:py-24 sm:py-16 py-16 sm:px-6 lg:px-8"
    >
      <div className="max-w-screen-xl bg-[#1BC2C2] mx-auto px-4 rounded-3xl xl:py-36 lg:py-32 md:py-24 sm:py-16 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
          }}
          className="items-center"
        >
          <motion.div className="space-y-8 text-center" variants={popInAnimation}>
            <motion.h3
              className="text-4xl md:text-2xl lg:text-3xl font-bold text-white leading-tight"
              variants={popInAnimation}
            >
          What are you Learning today?  
          </motion.h3>

            <motion.p
              className="text-lg text-white mx-auto font-semibold max-w-4xl"
              variants={popInAnimation}
            >
            Our platform offers a variety of courses designed to give you the knowledge and skills to start, change, or advance your career. We’ve made the learning experience seamless and accessible, featuring live classes, practical curricula, expert instructors, and peer-to-peer training sessions. Learn from top professionals, no matter where you are.
            Ready to embark on your career journey?
            </motion.p>

       
            <motion.div>
            <motion.a
              className="bg-white text-[#1BC2C2] px-8 py-4 border-2 rounded-full text-lg font-semibold hover:bg-[#1BC2C2] hover:border-white hover:text-white transition-colors"
              variants={popInAnimation}
              href={cardinalConfig.routes.signup}
            >
              Start learning now
            </motion.a>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );

};