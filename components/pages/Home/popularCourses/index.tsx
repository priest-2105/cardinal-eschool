import { img } from "framer-motion/client";
import Image from "next/image";


const PopularCourses = () => {
  const courses = [
    { name: "Science", label: "SCIENCE", img: "/assets/img/pages/homepage/Rectangle 1470.png" },
    { name: "Mathematics", label: "MATH", img: "/assets/img/pages/homepage/Rectangle 1471.png"  },
    { name: "English", label: "ENGLISH", img: "/assets/img/pages/homepage/Rectangle 1472.png"  },
  ];

  return (
    <section className="text-center py-16 bg-[#E9FFFF]"> 
      <h1 className="text-4xl font-extrabold text-gray-800">Our Most Popular Courses</h1>
        <p className="text-gray-600 font-medium mt-4">Expert-led online courses for students and professionals</p>
  
      <div className="flex flex-wrap justify-center space-x-8 mt-8">
        {courses.map((course, index) => (
          <div key={index}>
            <Image  className="rounded-lg  w-96 h-80" height={96} width={96} src={course.img} alt={course.name}/>
            <div className="py-2 text-center"> 
              <h1 className="text-2xl font-extrabold text-gray-800">{course.name}</h1>
              <p className="max-w-60 text-center font-semibold ms-auto me-auto py-2">Get on your studies and track your study progress now. <span className="text-blue-700 font-bold"> Get Started</span></p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};


export default PopularCourses;