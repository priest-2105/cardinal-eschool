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
      className="bg-white"
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex bg-[#1BC2C2] items-center rounded-lg shadow-md p-6 justify-between cursor-pointer"
      >
        <h2 className="text-lg font-medium text-white">{question}</h2>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-white"
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
          className="mt-4 text-[#1BC2C2] rounded-lg shadow-md p-6"
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
      question: "What is Cardinal E-School?",
      answer: "Cardinal E-School is an online educational platform offering courses, tutoring, and resources for students worldwide.",
    },
    {
      question: "What ages/grades do you serve?",
      answer: "We cater to students for all grades, including primary school pupils, high school students, and professional test-takers.",
    },
    {
      question: "How do I contact Cardinal E-School?",
      answer: "Email: admin@cardinale-school.com WhatsApp: +234-811-181-1995, or Live Chat on any of our social media channels.",
    },
    {
      question: "How do I enroll in Cardinal E-School?",
      answer: "Sign up on our website, fill out the assessment form, and follow the simple registration guide.",
    },
    {
      question: "What courses do you offer?",
      answer: "We offer school subjects (English, Math, Science), African Languages (Yoruba, Hausa, Igbo), Foreign Languages (French, Spanish), and Test Preparation Courses (SAT, IELTS, TOEFL, GRE).",
    },
    {
      question: "Are courses self-paced or instructor-led?",
      answer: "Both options are available.",
    },
    {
      question: "Can I customize my course schedule?",
      answer: "Yes, you can. You only need to speak with our academic advisors.",
    },
    {
      question: "How do I join the live class?",
      answer: "Log in to your student dashboard to join the live class.",
    },
    {
      question: "Can I cancel or refund my enrollment?",
      answer: "Speak to our admin representative for our refund policy.",
    },
    {
      question: "Are there resources available for test-takers?",
      answer: "Yes, test-takers are provided with prep materials suitable for their needs.",
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
          We've got answers!
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
