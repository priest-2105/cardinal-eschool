import CourseCategories from "@/components/pages/Home/courseCategories";
import FeaturesSection from "@/components/pages/Home/FeaturesSection";
import HeroOneSection from "@/components/pages/Home/HeroOneSection";
import PopularCourses from "@/components/pages/Home/popularCourses";


export default function Home() {
  return (
    <>
    <HeroOneSection/>
    <FeaturesSection/>
    <CourseCategories/>
    <PopularCourses/>
    </>
  );
}
