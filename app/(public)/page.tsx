import CourseCategories from "@/components/public/pages/Home/courseCategories";
import FeaturesSection from "@/components/public/pages/Home/FeaturesSection";
import HeroOneSection from "@/components/public/pages/Home/HeroOneSection";
import PopularCourses from "@/components/public/pages/Home/popularCourses";
import PricingPlans from "@/components/public/pages/Home/pricingPlans";
import SkilledExpert from "@/components/public/pages/Home/skilledExpert";
import Testimonials from "@/components/public/pages/Home/testimonials";


export default function Home() {
  return (
    <>
    <HeroOneSection/>
    <FeaturesSection/>
    <CourseCategories/>
    <PopularCourses/>
    <SkilledExpert/>
    <PricingPlans/>
    <Testimonials/>
    </>
  );
}
