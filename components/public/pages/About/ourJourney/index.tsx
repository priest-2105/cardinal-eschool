"use client";


import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const popInAnimation = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.5 } },
};

export default function OurJourney() {
  

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

        
      
        <div className="relative lg:block">
      
            <motion.div 
                variants={popInAnimation} 
                className="relative ms-auto rounded-3xl ">

            <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold py-8 text-[#242424] leading-tight"
            variants={popInAnimation}
          >
            Our Journey began in
            2018...  </motion.h1>


            {/* <div className="relative aspect-w-16 aspect-h-9 w-full h-auto"> */}
            <Image
            onDragStart={(event) => event.preventDefault()}
            src="/assets/img/pages/about/bb5b3d32-e25f-47fe-8a20-8f83a1e5ef9e.png"
            alt="young girl"
            width={500}
            height={400}
            className="rounded-lg"
            />
            {/* </div> */}

            
                </motion.div>
            </div>

     

       {/* Right Column - Images */}
       <motion.div className="space-y-8" variants={popInAnimation}>
 
          <motion.p
            className="text-lg text-gray-900 font-semibold max-w-2xl"
            variants={popInAnimation}
          >
         Cardinal E-School was founded in 2018 by young passionate educators driven to transform traditional learning. Recognizing the limitations of classroom education, we leveraged technology to create an innovative platform offering personalized, accessible education worldwide. With a dedicated team, Cardinal E-School developed proprietary curriculum and infrastructure, launching with a small student body that grew through referrals, partnerships, and continuous improvement. 
         </motion.p>

         <motion.p 
        className="text-lg text-gray-900 font-semibold max-w-2xl"
        variants={popInAnimation}>
        Today, Cardinal E-School embodies its founding principles: personalized learning, expert instruction, accessibility, and community support. The school offers tiered pricing ($60-$120/month) with flexible plans (Basic, Standard, Premium) and add-ons (additional contacts, specialized tutoring, group sessions). 
        </motion.p>

        <motion.p 
        className="text-lg text-gray-900 font-semibold max-w-2xl"
        variants={popInAnimation}>
        Additionally, Cardinal E-School provides comprehensive test preparation services, including SAT, IELTS, GRE, GMAT, and academic subject-specific coaching. Expert tutors guide students through tailored study plans, practice tests, and strategic test-taking techniques.   </motion.p>

        <motion.p 
        className="text-lg text-gray-900 font-semibold max-w-2xl"
        variants={popInAnimation}>
        By fostering academic excellence and test confidence, Cardinal E-School empowers students to achieve their educational goals. With a focus on value, competitiveness, and scalability, Cardinal E-School empowers students, fosters innovation, and redefines education. Its story serves as a testament to the power of innovative learning solutions. 
        </motion.p>
 
        </motion.div>


      </motion.div>
    </div>
  </section>
  );
};

