"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, DollarSign, BookOpen, Users, BarChart } from "lucide-react";

const cardAnimation = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturesSection() {
  const features = [
    {
      title: "Experienced Mentors",
      description:
        "Experienced mentors are invaluable guides who bring a wealth of knowledge and insights from years of practice in their field. They provide essential guidance, support, and feedback, helping mentees navigate challenges, avoid common pitfalls, and achieve their goals.",
      icon: Users,
      iconBg: "bg-[#4A90E2]",
    },
    {
      title: "Personalized Teaching",
      description:
        "Personalized teaching tailors learning experiences to meet each student's unique needs, abilities, and goals. Rather than a one-size-fits-all approach, personalized teaching recognizes that students have diverse backgrounds, learning styles, and paces.",
      icon: BookOpen,
      iconBg: "bg-[#9BC53D]",
    },
    {
      title: "Track Your Progress",
      description:
        "Through tools like assessments, progress reports, and visual dashboards, students can see their advancement in real-time and understand where they are on their learning journey. This transparency not only helps in keeping students motivated but also enables targeted instruction to meet individual needs.",
      icon: BarChart,
      iconBg: "bg-[#4A90E2]",
    },
    {
      title: "Flexible Learning",
      description:
        "Learn at your own pace. By providing multiple pathways to reach learning goals, flexible learning empowers students to customize their educational journey, making education more accessible, inclusive, and aligned with individual lifestyles.",
      icon: Clock,
      iconBg: "bg-[#FF69B4]",
    },
    {
      title: "Affordable prices",
      description:
        "Our affordable pricing makes education accessible to a wider range of learners, ensuring that quality education and growth are not limited by financial constraints. By providing cost-effective access to all resources rates, our platforms can reach more students and support those who might otherwise miss out due to cost barriers.",
      icon: DollarSign,
      iconBg: "bg-[#FF5733]",
    },
  ];

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    triggerOnce: false, 
    margin: "-100px",  
  });

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="grid max-w-screen-2xl grid-cols-1 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why we are a level above the rest
          </h2>
          <p className="text-lg text-gray-600">
            Welcome to Cardinal E-School, where education knows no borders. Our
            innovative platform connects learners worldwide, providing
            personalized education for a brighter future.
          </p>
          <button className="mt-8 bg-[#1BC2C2] text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#19a8a8] transition-colors">
            Start learning now
          </button>
        </div>

        {/* Feature Cards */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 transition-transform hover:scale-105"
              variants={cardAnimation}
            >
              <div
                className={`${feature.iconBg} text-white w-12 h-12 rounded-xl flex items-center justify-center mb-6`}
              >
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
