"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Onyeka Samuel",
      plan: "Basic Plan member",
      testimonial:
        "I think Cardinal E-School is very good, with experienced mentors making me understand the courses I take here.",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "Jane Doe",
      plan: "Premium Plan member",
      testimonial:
        "The resources provided by Cardinal E-School have been incredibly helpful in my learning journey.",
      image: "https://via.placeholder.com/150",
    },
    {
      name: "John Smith",
      plan: "Standard Plan member",
      testimonial:
        "The personalized sessions helped me focus better on my studies. Highly recommend it!",
      image: "https://via.placeholder.com/150",
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const cardVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.5 } },
  };

  return (
    <div className="bg-[#E9FFFF] xl:py-36 max-xl:py-36 max-lg:py-32 max-md:py-20 max-sm:py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Text Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          className="lg:w-1/2 text-center lg:text-left"
        >
          <h2 className="text-4xl font-bold mb-4">
            Testimonials from Cardinal E-School members
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Here are the testimonials given by some of our customers, we hope
            you can also be part of us to learn together.
          </p>
          {/* Navigation Buttons */}
          <div className="flex justify-center lg:justify-start gap-4 mt-4">
            <button
              onClick={handlePrev}
              className="bg-[#1BC2C2] text-white p-3 rounded-full font-bold shadow-lg hover:bg-teal-600"
            >
              <ArrowLeft size={24} />
            </button>
            <button
              onClick={handleNext}
              className="bg-[#1BC2C2] text-white p-3 rounded-full font-bold shadow-lg hover:bg-teal-600"
            >
              <ArrowRight size={24} />
            </button>
          </div>
        </motion.div>

        {/* Carousel Section */}
        <div className="lg:w-1/2">
          <motion.div
            drag="x"
            dragConstraints={{ left: -10, right: 10 }}
            className="relative w-full overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-2xl shadow-lg p-6 w-full"
              >
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold">
                  {testimonials[currentIndex].name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  {testimonials[currentIndex].plan}
                </p>
                <p className="text-gray-700">
                  {testimonials[currentIndex].testimonial}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
