"use client";

import cardinalConfig from "@/config";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const JobOpenings = () => {
  const contactSectionRef = useRef<HTMLDivElement | null>(null);
  const [viewAll, setViewAll] = useState(false); // State to manage view toggle
 
  const jobPositions = [
    { title: "Mathematics Tutor", location: "Remote" },
    { title: "Music Instructor", location: "Remote" },
    { title: "Hausa Tutor", location: "Remote" },
    { title: "Data Analysis Instructor", location: "Remote" },
    { title: "Science Teacher", location: "Remote" },
  ];

  // Limit positions displayed when not viewing all
  const displayedPositions = viewAll ? jobPositions : jobPositions.slice(0, 3);

  return (
    <section className="bg-gray-50 py-16 px-6 md:px-16 relative" id="">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-4xl font-bold text-gray-800 text-center mb-12"
        >
          Open Positions ({jobPositions.length})
        </motion.h1>

        {/* Job Positions List */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-6 relative"
        >
          {displayedPositions.map((job, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="flex justify-between items-center bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg text-[#1BC2C2] font-semibold">{job.title}</h2>
              <span className="text-sm font-medium text-gray-500">{job.location}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Opacity Gradient */}
        {/* {!viewAll && (
          <div className="absolute bottom-[0px] w-full h-16 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent pointer-events-none"></div>
        )} */}

        {/* View More / Less Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => setViewAll(!viewAll)}
            className="bg-teal-600 text-white px-6 py-2 rounded-3xl hover:bg-[#1BC2C2]  transition-all"
          >
            {viewAll ? "View Less" : "View More"}
          </button>
        </div>

        {/* Contact Section */}
        <motion.div
          ref={contactSectionRef}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="mt-16 text-center bg-teal-100 rounded-3xl p-8"
        >
          <div className="text-center">
            <p className="text-lg text-gray-700">
              Send your resume to:
              <span className="font-semibold block text-gray-800">
                online@cardinalschools.com
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Use the subject you'll be teaching as the subject of the email.
            </p>
          </div>
          <div className="mt-4">
          <a
            href={cardinalConfig.routes.contactUs} 
            className="mt-8 bg-[#17A1A1] text-white px-6 py-2 rounded-3xl hover:bg-[#1BC2C2]  transition-all"
          >
            Contact Us
          </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JobOpenings;
