"use client";

import React, { useRef, useEffect } from "react";
import Image from "next/image";

const CourseCategories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    { name: "Mathematics", icon: "/assets/img/pages/homepage/Group 94.png" },
    { name: "Science", icon: "/assets/img/pages/homepage/Group 103.png" },
    { name: "Biology", icon: "/assets/img/pages/homepage/Group 98.png" },
    { name: "English", icon: "/assets/img/pages/homepage/Group 100.png" },
    { name: "Geography", icon: "/assets/img/pages/homepage/Group 101.png" },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      }); 
      resetAutoScroll();
    }
  };

  const autoScroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: 300, // Auto-scroll to the right
        behavior: "smooth",
      });
    }
  };

  const startAutoScroll = () => {
    autoScrollInterval.current = setInterval(autoScroll, 4000); // Auto-scroll every 4 seconds
  };

  const resetAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
    startAutoScroll();
  };

  useEffect(() => {
    startAutoScroll();

    // Clean up the interval on component unmount
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, []);

  return (
    <section className="text-center py-16 bg-[#E9FFFF]">
      <h1 className="text-4xl font-extrabold text-gray-800">
        Browse Course by Categories
      </h1>
      <p className="text-gray-600 font-medium mt-4">
        Expert-led online courses for students and professionals
      </p>

      <div className="flex ms-auto me-auto items-center mt-8">
        {/* Left Arrow */}
        <button
          onClick={() => scroll("left")}
          className="bg-[#1BC2C2] text-white rounded-full p-3 xl:ms-24 lg:ms-16 md:ms-6 shadow-md mr-4"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>

        {/* Category Cards */}
        <div
          ref={scrollRef}
          className="flex space-x-4 ms-auto me-auto overflow-x-auto no-scrollbar"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 w-60 py-14 text-center flex-shrink-0"
              style={{ scrollSnapAlign: "center" }}
            >
              <Image
                className="mx-auto"
                src={category.icon}
                width={50}
                height={50}
                alt={category.name}
              />
              <h3 className="mt-4 text-lg font-bold text-gray-800">
                {category.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll("right")}
          className="bg-[#1BC2C2] text-white rounded-full p-3 shadow-md ml-4 xl:me-24 lg:me-16 md:me-6"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </section>
  );
};

export default CourseCategories;
