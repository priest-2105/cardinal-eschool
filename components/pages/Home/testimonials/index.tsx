"use client";

import React, { useState } from "react";

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

  return (
    <div className="bg-[#E9FFFF] py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Testimonials from Cardinal E-School members</h2>
        <p className="text-lg text-gray-600 mb-8">
          Here are the testimonials given by some of our customers, we hope you
          can also be part of us to learn together.
        </p>
        <div className="relative">
          {/* Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#1BC2C2] text-white p-3 rounded-full shadow-lg hover:bg-teal-600"
          >
            &#8592;
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#1BC2C2] text-white p-3 rounded-full shadow-lg hover:bg-teal-600"
          >
            &#8594;
          </button>

          {/* Testimonial Card */}
          <div className="flex items-center justify-center">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`${
                  index === currentIndex ? "block" : "hidden"
                } bg-white rounded-2xl shadow-lg p-6 w-11/12 max-w-md mx-auto`}
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold">{testimonial.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{testimonial.plan}</p>
                <p className="text-gray-700">{testimonial.testimonial}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
