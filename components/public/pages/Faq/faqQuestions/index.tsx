"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

// Animation variants
const popInAnimation = {
  hidden: { opacity: 0, scale: 0.9, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.5 } },
};

// Props type for FAQItem
interface FAQItemProps {
  question: string;
  answer: string;
  animationDelay: number;
}

// FAQItem Component
const FAQItem: React.FC<FAQItemProps> = ({ question, answer, animationDelay }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={popInAnimation}
      transition={{ delay: animationDelay }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer"
      >
        <h2 className="text-lg font-medium text-gray-800">{question}</h2>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-600"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.div>
      </div>

      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={popInAnimation}
          className="mt-4 text-gray-600"
        >
          {answer}
        </motion.div>
      )}
    </motion.div>
  );
};

// FaqQuestions Component
const FaqQuestions = () => {
  const faqItems = [
    {
      question: "What is the return policy?",
      answer: "You can return any item within 30 days of purchase for a full refund.",
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping typically takes 5-7 business days for standard delivery.",
    },
    {
      question: "Is customer support available 24/7?",
      answer: "Yes, our customer support is available 24/7 to assist you.",
    },
    {
      question: "Can I change my order after placing it?",
      answer: "You can modify your order within 24 hours of placing it.",
    },
  ];

  // Ref for scroll animations
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="bg-gray-100 min-h-screen py-16 px-4 lg:px-20"
    >
      <motion.div
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
        }}
        className="max-w-screen-xl mx-auto"
      >
        {/* Header */}
        <motion.h1
          className="text-4xl font-extrabold text-gray-800 text-center mb-8"
          variants={popInAnimation}
        >
          Got Questions? <br/>
          We’ve got answers!
        </motion.h1>

        {/* FAQ Items */}
        <motion.div
          className="space-y-6"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
        >
          {faqItems.map((item, index) => (
            <FAQItem
              key={index}
              question={item.question}
              answer={item.answer}
              animationDelay={index * 0.2}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FaqQuestions;
