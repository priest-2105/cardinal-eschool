import FoundersQuote from '@/components/public/pages/About/FounderQuote';
import OurJourney from '@/components/public/pages/About/ourJourney'; 
import HeadedSection from '@/components/public/pages/About/headedSection';
import LearningToday from '@/components/public/pages/About/learningToday';
import React from 'react'
import FaqQuestions from '@/components/public/pages/Faq/faqQuestions';

function Team() {
  return (
    <>
    <OurJourney/>
    <HeadedSection/>
    <FoundersQuote/>
    <LearningToday/>
    <FaqQuestions/>
    </>
  )
}

export default Team;