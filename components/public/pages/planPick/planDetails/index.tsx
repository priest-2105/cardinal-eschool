"use client";

import { motion } from "framer-motion";

const chosenPlanDetails: React.FC = () => {
 

 
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
    <>n</>
  );
};

export default chosenPlanDetails;
