"use client";


export default function ContactHero() {


  return (
       <div className="relative h-[400px] overflow-hidden">
            <div className="absolute inset-0 bg-gray-900">
                <img 
                src="/assets/img/pages/contact/pexels-pixabay-207456.jpg" 
                alt="Contact Us" 
                className="w-full h-full object-cover opacity-50"
                />
            </div>
            <div className="relative z-10 h-full flex items-center justify-center">
                <h1 className="text-5xl md:text-6xl font-bold text-white transform transition-all duration-700 hover:scale-105">
                Contact Us
                </h1>
            </div>

      </div>
  )
}
