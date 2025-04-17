"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSubjects } from "@/lib/api/public/fetchsubjects"; 
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";

interface Course {
  id: number;
  name: string;
  description: string;
}

const CourseCard: React.FC<{ course: Course }> = ({ course }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.name}</h3>
      <p className="text-gray-600 text-sm">{course.description || "No description available"}</p>
    </motion.div>
  );
};

const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-300 rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded"></div>
    </div>
  );
};

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [visibleCourses, setVisibleCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const token = useSelector((state: RootState) => state.auth?.token);

  const COURSES_PER_LOAD = 5;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const response = await getSubjects(token);
        const fetchedCourses = response.map((subject: { id: number; name: string }) => ({
          id: subject.id,
          name: subject.name,
          description: `Learn more about ${subject.name}`,
        }));
        setCourses(fetchedCourses);
        setVisibleCourses(fetchedCourses.slice(0, 9)); 
      } catch (err) {
        setError("Failed to fetch courses. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token]);

  const loadMoreCourses = () => {
    const nextOffset = offset + COURSES_PER_LOAD;
    setVisibleCourses(courses.slice(0, nextOffset + 8)); 
    setOffset(nextOffset);
  };

  if (loading) {
    return(
    <div className="bg-[#C9F4F4] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  </div>);
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-[#C9F4F4] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl font-extrabold text-gray-900 text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Courses
        </motion.h2>
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
              },
            },
          }}
        >
          {visibleCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </motion.div>
        {visibleCourses.length < courses.length && (
          <div className="text-center mt-8">
            <button
              onClick={loadMoreCourses}
              className="bg-[#1BC2C2] text-white px-6 py-2 rounded-md hover:bg-[#139797] transition"
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;

