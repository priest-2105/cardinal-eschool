"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const PopularCourses = () => {
  const courses = [
    { name: "Science", label: "SCIENCE", img: "/assets/img/pages/homepage/Rectangle 1470.png" },
    { name: "Mathematics", label: "MATH", img: "/assets/img/pages/homepage/Rectangle 1471.png" },
    { name: "English", label: "ENGLISH", img: "/assets/img/pages/homepage/Rectangle 1472.png" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,   
        delayChildren: 0.3,    
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    triggerOnce: false, 
    margin: "-100px",  // Adjust trigger margin as needed
  });

  return (
    <section ref={sectionRef} className="text-center py-16 bg-[#E9FFFF]">
      {/* Title Animation */}
      <motion.h1
        className="text-4xl font-extrabold text-gray-800"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: -20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
      >
        Our Most Popular Courses
      </motion.h1>

      <motion.p
        className="text-gray-600 font-medium mt-4"
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: -10 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.2 } },
        }}
      >
        Expert-led online courses for students and professionals
      </motion.p>

      {/* Cards Animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="flex flex-wrap justify-center space-x-8 mt-8"
      >
        {courses.map((course, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="cursor-pointer"
            whileHover={{ scale: 1.05 }} 
          >
            <Image
              className="rounded-lg w-96 h-80"
              height={320}
              width={320}
              src={course.img}
              alt={course.name}
            />
            <div className="py-2 text-center">
              <h1 className="text-2xl font-extrabold text-gray-800">{course.name}</h1>
              <p className="max-w-60 text-center font-semibold ms-auto me-auto py-2">
                Get on your studies and track your study progress now.{" "}
                <span className="text-blue-700 font-bold">Get Started</span>
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default PopularCourses;
