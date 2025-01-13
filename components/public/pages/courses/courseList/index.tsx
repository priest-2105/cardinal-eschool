"use client";

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';

interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  students: number;
  plan: 'Basic Plan' | 'Standard Plan' | 'Premium Plan' | 'Group Sessions';
  image: string;
}

const courses: Course[] = [
  {
    id: 1,
    title: "Mathematics",
    description: "Master fundamental mathematical concepts and problem-solving skills",
    instructor: "Dr. Emily Mathews",
    students: 150,
    plan: "Basic Plan",
    image: "/assets/img/pages/courses/Rectangle 1471.png"
  },
  {
    id: 2,
    title: "English Literature",
    description: "Explore classic and contemporary literature while improving writing skills",
    instructor: "Prof. William Wordsworth",
    students: 120,
    plan: "Standard Plan",
    image: "/assets/img/pages/courses/Rectangle 1472.png"
  },
  {
    id: 3,
    title: "Biology",
    description: "Discover the wonders of life sciences and ecological systems",
    instructor: "Dr. Sarah Darwin",
    students: 200,
    plan: "Premium Plan",
    image: "/assets/img/pages/courses/Rectangle 1470.png"
  },
  {
    id: 4,
    title: "Physics",
    description: "Understand the fundamental laws governing the universe",
    instructor: "Prof. Albert Einstein Jr.",
    students: 100,
    plan: "Basic Plan",
    image: "/assets/img/pages/courses/Rectangle 1470.png"
  },
  {
    id: 5,
    title: "Chemistry",
    description: "Explore the composition, structure, and properties of matter",
    instructor: "Dr. Marie Curie II",
    students: 80,
    plan: "Standard Plan",
    image: "/assets/img/pages/courses/Rectangle 1470.png"
  },
  {
    id: 6,
    title: "World History",
    description: "Journey through time and understand global historical events",
    instructor: "Prof. Howard Zinn",
    students: 180,
    plan: "Premium Plan",
    image: "/assets/img/pages/courses/Rectangle 1470.png"
  },
  {
    id: 7,
    title: "Geography",
    description: "Explore the Earth's landscapes, peoples, places, and environments",
    instructor: "Dr. Jane Goodall",
    students: 90,
    plan: "Group Sessions",
    image: "/assets/img/pages/courses/Rectangle 1470.png"
  },
  {
    id: 8,
    title: "Computer Science",
    description: "Learn programming, algorithms, and computational thinking",
    instructor: "Prof. Ada Lovelace",
    students: 130,
    plan: "Premium Plan",
    image: "/assets/img/pages/courses/Rectangle 1470.png"
  },
  {
    id: 9,
    title: "Art History",
    description: "Discover the world's great artworks and artistic movements",
    instructor: "Dr. Vincent van Gogh III",
    students: 160,
    plan: "Standard Plan",
    image: "/assets/img/pages/courses/Rectangle 1470.png"
  },
  {
    id: 10,
    title: "Music Theory",
    description: "Understand the language of music and improve composition skills",
    instructor: "Maestro Wolfgang Mozart",
    students: 70,
    plan: "Group Sessions",
    image: "/assets/img/pages/courses/Rectangle 1470.png"
  }
];

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <Image
        className="h-48 w-full object-cover"
        src={course.image}
        alt={course.title}
        width={300}
        height={200}
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          {course.description}
        </p>
        <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
          {/* <span><b>Instructor:</b> {course.instructor}</span> */}
          {/* <span>{course.students} students</span> */}
        </div>
        <div className="text-right text-sm font-semibold text-[#1BC2C2]">
          Available in: {course.plan}
        </div>
      </div>
    </motion.div>
  );
};

const CourseList: React.FC = () => {
 const sectionRef = useRef(null);
  const [triggerOnce, setTriggerOnce] = useState(false);
  const isInView = useInView(sectionRef, { margin: "-100px" });

  useEffect(() => {
    if (isInView && !triggerOnce) {
      setTriggerOnce(true);  
    }
  }, [isInView, triggerOnce]);

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

  return (
    <div ref={sectionRef} className="bg-[#C9F4F4] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-extrabold text-gray-900 text-center mb-8"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          }}
        >
          Our Courses
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CourseList;

