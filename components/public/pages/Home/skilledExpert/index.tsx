"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import cardinalConfig from "@/config";

const SkilledExpert = () => {
 
   const sectionRef = useRef(null);
    const [triggerOnce, setTriggerOnce] = useState(false);
    const isInView = useInView(sectionRef, { margin: "-100px" });
  
    useEffect(() => {
      if (isInView && !triggerOnce) {
        setTriggerOnce(true);  
      }
    }, [isInView, triggerOnce]);
  
  
  const imageAnimation = {
    hidden: { opacity: 0, scale: 0.8 },  // Start smaller and invisible
    visible: { 
      opacity: 1, 
      scale: 1,  // Scale to normal size
      transition: { duration: 0.8, type: "spring", stiffness: 120 }
    },
  };

  return (
    <section ref={sectionRef} className="bg-[#fff] h-fit relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 xl:py-36 lg:py-32 md:py-24 sm:py-16 py-16 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
        
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            <h1 className="text-xl md:text-4xl lg:text-6xl font-bold text-[#242424] leading-tight">
              Highly Skilled Experts & Experienced Tutors
            </h1>
            <p className="text-lg text-gray-900 font-semibold max-w-2xl">
              At Cardinal E-School, our innovative platform connects learners worldwide, providing personalized education for a brighter future. <br />
              We believe education should be accessible (Learn anywhere, at anytime), Flexible (Choose your pace, your path), Personalized (Expert teachers, tailored lessons).
            </p>
            <motion.div className="mt-8">
            <motion.a
              className="bg-[#1BC2C2] cursor-pointer text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#19a8a8] transition-colors"
               href={cardinalConfig.routes.login}
            >
              Start learning now
            </motion.a>
            </motion.div>

          </div>

          {/* Right Column - Images */}
          <div className="relative lg:block">
            <div className="grid gap-2 items-end grid-cols-2">
              {/* Bottom Image */}
              <motion.div
                variants={imageAnimation}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="relative rounded-3xl ms-4 w-fit col-span-2 mt-2 ml-12"
              >
                <Image
                 onDragStart={(event) => event.preventDefault()}
                  src="/assets/img/pages/homepage/bb5b3d32-e25f-47fe-8a20-8f83a1e5ef9e 1.png"
                  alt="Student with megaphone"
                  width={600}
                  height={600}
                  className="object-cover"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};


export default SkilledExpert;