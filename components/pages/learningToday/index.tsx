"use client";


import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
      className="bg-[#DAFAFA] min-h-screen relative overflow-hidden"
    >
      <div className="max-w-screen-2xl bg-[#1BC2C2] mx-auto px-4 xl:py-36 lg:py-32 md:py-24 sm:py-16 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
          }}
          className="items-center"
        >
          <motion.div className="space-y-8" variants={popInAnimation}>
            <motion.h3
              className="text-4xl md:text-2xl lg:text-3xl font-bold text-white leading-tight"
              variants={popInAnimation}
            >
              Connect, Learn, Thrive: Personalized Education without Borders
            </motion.h3>

            <motion.p
              className="text-lg text-white font-semibold max-w-2xl"
              variants={popInAnimation}
            >
              Cardinal E-School is here for you with expert online learning,
              tailored to your needs.
            </motion.p>

            <motion.button
              className="bg-[#1BC2C2] text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#19a8a8] transition-colors"
              variants={popInAnimation}
            >
              Start learning now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );

};