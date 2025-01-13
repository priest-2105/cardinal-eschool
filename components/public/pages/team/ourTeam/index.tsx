"use client";

import { motion } from "framer-motion";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

// Team data
const teamMembers = [
     {
        name: "Olalekan Okewole",
        position: "Founder",
        qualifications: "M.A. Design, Adobe Certified Expert",
        image: "https://via.placeholder.com/150",
      },
      {
        name: "Fawaz Bailey",
        position: "Software Engineer",
        qualifications: "B.Sc Computer Science, React Specialist",
        image: "https://via.placeholder.com/150",
      },
      {
        name: "Yusuf AbdulHameed",
        position: "Backend Engineer",
        qualifications: "B.Sc Computer Science, Tableau Certified",
        image: "https://via.placeholder.com/150",
    },
    {
        name: "Michael Smith",
        position: "Product Manager",
        qualifications: "MBA, Agile Certified Practitioner",
        image: "https://via.placeholder.com/150",
    },
];

const TeamSection = () => {
  return (
    <section className="bg-gray-50 py-32 px-6 md:px-16" id="ourteam">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.h1
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="text-4xl font-bold text-gray-800 text-center mb-12"
        >
          Meet Our Team
        </motion.h1>

        {/* Team Members Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <img
                src={member.image}
                alt={`${member.name}'s photo`}
                className="w-full h-48 object-cover"
              />
              {/* Content */}
              <div className="p-6 text-center">
                <h2 className="text-xl font-semibold text-gray-800">{member.name}</h2>
                <p className="text-sm text-teal-500 font-medium">{member.position}</p>
                <p className="text-gray-600 text-sm mt-2">{member.qualifications}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
