"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const cardAnimation = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function CoreValues() {
  const features = [
    {
      title: "Accessibility",
      description:
        "We believe that education should be accessible to everyone, regardless of their geographical location, financial situation, or physical abilities. We strive to provide affordable and flexible learning options that cater to diverse needs and preferences. Our goal is to break down barriers and create an inclusive learning environment that fosters equal opportunities for all.",
      icon: "/assets/img/pages/team/elements.png",

      iconBg: "bg-[#4A90E2]",
    },
    {
      title: "Flexibility",
      description:
        "We understand that our students have different learning styles, schedules, and preferences. We offer flexible learning pathways, including self-paced and instructor-led options, to accommodate diverse needs and lifestyles. Our flexible approach enables students to learn at their own pace, anytime, and anywhere.",
      icon: "/assets/img/pages/team/Group 206.png",
      iconBg: "bg-[#9BC53D]",
    },
    {
      title: "Personalization",
      description:
        "We believe that every student is unique, with their own strengths, weaknesses, and learning goals. We strive to provide personalized learning experiences that cater to individual needs, interests, and abilities. Our personalized approach enables students to take ownership of their learning, set achievable goals, and celebrate their successes.",
      icon: "/assets/img/pages/team/Group 211.png",
      iconBg: "bg-[#4A90E2]",
    },
    {
      title: "Community",
      description:
        "We believe that learning is a social and collaborative process. We foster a sense of community among our students, instructors, and staff, promoting mutual respect, support, and open communication. Our community-driven approach enables students to connect with peers, share ideas, and learn from one another.",
      icon:"/assets/img/pages/team/Group 208.png",
      iconBg: "bg-[#FF69B4]",
    },
    {
      title: "Student Centric",
      description:
        "We put our students at the heart of everything we do. We listen to their feedback, concerns, and suggestions, and use this information to improve our services and programs. Our student-centric approach ensures that our students receive the support, guidance, and resources they need to succeed.",
      icon: "/assets/img/pages/team/Group 212.png",
      iconBg: "bg-[#FF5733]",
    },
    {
        title: "Intergity",
        description:
          "We operate with integrity, transparency, and accountability in all aspects of our business. We uphold the highest standards of academic honesty, ethics, and professionalism. Our commitment to integrity ensures that our students, tutors, and partners can trust us to deliver high-quality education and services.",
        icon: "/assets/img/pages/team/Group 213.png",
        iconBg: "bg-[#1BC2C2]",
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
            Our Core Values
          </h2> 
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
                <Image
                  src={feature.icon}
                  alt={feature.title}
                  width={80}
                  height={80}/>
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
