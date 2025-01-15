"use client";


import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import cardinalConfig from "@/config";

const popInAnimation = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.5 } },
};

const isDesktop = window.innerWidth >= 1024;  

export default function HeroSection() {
  const features = [
    { name: "Accessibility" },
    { name: "Flexibility" },
    { name: "Personalization" },
    { name: "Community" },
  ];

  // Ref for scroll animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="bg-[#C9F4F4] min-h-screen relative overflow-hidden"
    >
      <div className="max-w-screen-2xl mx-auto px-4 xl:py-36 lg:py-32 md:py-24 sm:py-16 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
          }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left Column - Text Content */}
          <motion.div className="space-y-8" variants={popInAnimation}>
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-[#242424] leading-tight"
              variants={popInAnimation}
            >
              Connect, Learn, Thrive: Personalized Education without Borders
            </motion.h1>

            <motion.p
              className="text-lg text-gray-900 font-semibold max-w-2xl"
              variants={popInAnimation}
            >
              Cardinal E-School is here for you with expert online learning,
              tailored to your needs.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4"
              variants={popInAnimation}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full"
                  variants={popInAnimation}
                  transition={{ delay: index * 0.3 }}
                >
                  <CheckCircle2 className="h-5 w-5 text-[#1BC2C2]" />
                  <span className="text-gray-700 font-medium">
                    {feature.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div>
            <motion.a
              className="bg-[#1BC2C2] cursor-pointer text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-[#19a8a8] transition-colors"
              variants={popInAnimation}
              href={cardinalConfig.routes.login}
            >
              Start learning now
            </motion.a>
            </motion.div>

          </motion.div>



         {/* Right Column - Images */}
            <div className="relative lg:block">
             <div className="grid gap-2 items-end grid-cols-2">
               {/* Top Image */}
          
               <motion.div 
                drag={isDesktop} 
                dragConstraints={{ left: -5, right: 5, top: -5, bottom: 5 }}   
               variants={popInAnimation} 
               className="relative ms-auto rounded-3xl ">
            
                 <div className="absolute -bottom-0 -left-12 rounded-full p-2">        
                 <Image
                 onDragStart={(event) => event.preventDefault()}
                  src="/assets/img/pages/homepage/stars.png"
                  alt="Star"  
                  width={30}
                  height={30}
                  className="object-cover"
                />
                </div>

                <Image
                  onDragStart={(event) => event.preventDefault()}
                  src="/assets/img/pages/homepage/Rectangle 1452.png"
                  alt="Student using tablet"
                  width={280}
                  height={100}
                  className="object-cover"
                />
                <div className="absolute -top-6 -right-6 rounded-full p-2">
                <Image
                  src="/assets/icons/checkmark-circle-02.png"
                  alt="Student using tablet"
                  width={80}
                  height={80}
                  className="object-cover"
                />
                </div>
                </motion.div>

              {/* Top Right Image */}
              <motion.div 
              drag={isDesktop} 
              dragConstraints={{ left: -5, right: 5, top: -5, bottom: 5 }}
              variants={popInAnimation} 
              className="relative w-fit -mb-4 rounded-3xl">
                
              <div className="absolute -top-16 right-16 rounded-full p-2">        
                <Image
                  onDragStart={(event) => event.preventDefault()}
                  src="/assets/img/pages/homepage/Ellipse 1866.png"
                  alt="Star"  
                  width={30}
                  height={30}
                  className="object-cover ms-auto"
                />
                </div>
                
                <Image
                 onDragStart={(event) => event.preventDefault()}
                  src="/assets/img/pages/homepage/Rectangle 1454.png"
                  alt="Student learning"
                  width={280}
                  height={400}
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-2 h-2 rounded-full bg-white/70" />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Bottom Image */}
              <motion.div 
              drag={isDesktop} 
              dragConstraints={{ left: -5, right: 5, top: -5, bottom: 5 }}
              variants={popInAnimation} 
              className="relative rounded-3xl  ms-4  w-fit col-span-2 mt-2 ml-12">
                <Image
                  src="/assets/img/pages/homepage/Rectangle 1453.png"
                 onDragStart={(event) => event.preventDefault()}
                  alt="Student with megaphone"
                  width={400}
                  height={400}
                  className="object-cover"
                />

                <div className="absolute top-8 -right-16 rounded-full p-2">
                <Image
                  src="/assets/img/pages/homepage/stars (1).png"
                  alt="Student with megaphone"
                  onDragStart={(event) => event.preventDefault()}
                  width={30}
                  height={30}
                  className="object-cover"
                />
                </div>

                <div className="absolute -top-4 -right-4"> 
                <Image                  
                  onDragStart={(event) => event.preventDefault()}
                  src="/assets/img/pages/homepage/group199.png"
                  alt="Student using tablet circles"
                  width={180}
                  height={280}
                  className="object-cover"
                /> 
                </div>
              </motion.div>

            </div>
            </div>
 
        </motion.div>
      </div>
    </section>
  );
}