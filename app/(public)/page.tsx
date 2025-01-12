import CourseCategories from "@/components/pages/Home/courseCategories";
import FeaturesSection from "@/components/pages/Home/FeaturesSection";
import HeroOneSection from "@/components/pages/Home/HeroOneSection";
import PopularCourses from "@/components/pages/Home/popularCourses";
import PricingPlans from "@/components/pages/Home/pricingPlans";
import SkilledExpert from "@/components/pages/Home/skilledExpert";
import Testimonials from "@/components/pages/Home/testimonials";


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
