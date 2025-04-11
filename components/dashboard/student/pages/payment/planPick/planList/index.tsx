"use client";

import { motion } from "framer-motion";

interface Plan {
  sub_id: string;
  id: number;
  title: string;
  price: string;
  duration: string;
  features: string[];
}

const PlanList: React.FC<{ onPlanSelect: (plan: Plan) => void }> = ({ onPlanSelect }) => {
  const pricingPlans: Plan[] = [
    {
      sub_id: "",
      id: 1,
      title: "Basic Plan",
      price: "$60",
      duration: "/ Month",
      features: [
        "For students needing occasional guidance",
        "Register 2 school subjects only",
        "1 session per course weekly",
        "Access to private classes and resources",
        "Monthly Progress Report",
        "In-class Activities",
        "Take-home Assessments",
        "Not available for Test Preppers",
      ],
    },
    {
      sub_id: "",
      id: 2,
      title: "Standard Plan",
      price: "$90",
      duration: "/ Month",
      features: [
        "For students requiring regular support",
        "Register 2 school subjects only",
        "2 sessions per course weekly",
        "Monthly Progress Report",
        "In-class Activities",
        "Take-home Assessments",
        "Available for Test Preppers",
      ],
    },
    {
      sub_id: "",
      id: 3,
      title: "Premium Plan",
      price: "$120",
      duration: "/ Month",
      features: [
        "For students needing intensive personalized attention",
        "Register 2 school subjects only",
        "3 sessions per course weekly",
        "Monthly Progress Report",
        "In-class Activities",
        "Take-home Assessments",
        "Available for Test Preppers",
        "Access to exclusive premium content and resources",
      ],
    },
   
    {
      sub_id: "",
      id: 4,
      title: "Group Sessions",
      price: "$40",
      duration: "/ Session",
      features: [
        "For interactive and collaborative learning",
        "1 group session weekly",
        "Monthly Progress Report",
        "In-class Activities",
        "Regular feedback and tracking",
        "Available for Test Preppers",
      ],
    },
    {
      sub_id: "",
      id: 5,
      title: "Custom Plan",
      price: "",
      duration: "Speak to Support",
      features: [
        "For those who need a scalable custom plan",
        "1 group session weekly",
        "Monthly Progress Report",
        "In-class Activities",
        "Regular feedback and tracking",
        "Access to exclusive premium content and resources",
      ],
    },
  ];


  const cardVariants = {
    hidden: { opacity: 0, y: 50 },  
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1, 
        duration: 0.8,
        type: "spring",
        stiffness: 50,
      },
    }),
  };

  return (
    <div className="bg-[#E9FFFF] py-12 h-fit">
      {/* Header Section */}
      <div className="bg-[#1BC2C2] py-16 px-4 sm:px-8 lg:min-h-96 xlg:min-h-96 md:min-h-fit sm:min-h-fit lg:px-16">
        <h1 className="text-5xl sm:text-4xl font-bold text-center text-white mb-4">
          Choose Your Plan
        </h1>
        <p className="text-center font-semibold text-white mb-12">
          {/* Choose a payment plan that suits you. */}
        </p>
      </div>

      {/* Cards Section */}
      <div className="lg:-mt-48 h-fit py-12 px-5">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              drag="y"
              dragConstraints={{ top: -10, bottom: 10 }}
              key={index}
              custom={index} // Pass the index to the variant
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, amount: 0.3 }} // Repeat animation on scroll
              className="bg-white group rounded-3xl shadow-lg min-w-[250px] p-6 border-2 hover:border-white-2 hover:bg-[#1BC2C2] hover:text-white transition"
            >
              <h2 className="text-xl font-bold mb-4">{plan.title}</h2>
              <p className="text-3xl font-bold text-[#1BC2C2] group-hover:text-white mb-2">
                {plan.price}
              </p>
              <p className="text-sm mb-4 font-bold">{plan.duration}</p>
              <ul className="text-sm list-disk space-y-2 mb-6 font-semibold">
                {plan.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
              <button
                className="bg-[#1BC2C2] text-white py-2 px-4 rounded-lg group-hover:bg-white group-hover:text-[#1BC2C2] w-full"
                onClick={() => onPlanSelect(plan)}
              >
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PlanList;