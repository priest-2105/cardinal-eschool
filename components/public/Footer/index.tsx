import React from 'react'
import Image from 'next/image';
import logo from '@/public/assets/img/logo.png';

function PublicFooter() {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1BC2C2] text-white">
          <div className="max-w-screen-xl px-4 pt-32 pb-8 mx-auto sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div>
              <h3 className='text-4xl font-bold'>Ready To Get Started ? </h3>
                <p className="max-w-xs mt-4 text-sm">
                Cardinal E-School, where education knows no borders. Our innovative platform connects learners worldwide, providing personalized education for a brighter future. 
                </p>
                <div className="flex mt-8 space-x-6">
                  <a className="bg-white px-16 py-3 text-[#1BC2C2] rounded-3xl font-bold hover:shadow-xl" href="" target="_blank" rel="noreferrer">
                    Get Started
                    </a> 
                </div>
              </div>
              <div className="grid ms-auto grid-cols-1 gap-8 lg:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="font-bold text-lg">
                    Company
                  </p>
                  <nav className="flex flex-col mt-4 space-y-2 text-sm text-white">
                    <a className="hover:opacity-75 font-medium py-2" href=""> Home </a>
                    <a className="hover:opacity-75 font-medium py-2" href=""> About Us</a>
                    <a className="hover:opacity-75 font-medium py-2" href=""> Courses</a>
                    <a className="hover:opacity-75 font-medium py-2" href=""> Our Mentors</a>
                  </nav>
                </div> 
                <div>
                  <p className="font-bold text-lg">
                    Useful Links
                  </p>
                  <nav className="flex flex-col mt-4 space-y-2 text-sm text-white">
                    <a className="hover:opacity-75 font-medium py-2" href=""> Contact Careers</a>
                    <a className="hover:opacity-75 font-medium py-2" href=""> Contact Us</a>
                    <a className="hover:opacity-75 font-medium py-2" href=""> FAQs </a> 
                  </nav>
                </div>
                <div>
                  <p className="font-bold text-lg">
                    Support
                  </p>
                  <nav className="flex flex-col mt-4 space-y-2 text-sm text-white">
                    <a className="hover:opacity-75 font-medium py-2" href=""> Privacy Policy </a>
                    <a className="hover:opacity-75 font-medium py-2" href=""> +234 01 2345 6789 </a>
                    <a className="hover:opacity-75 font-medium py-2" href=""> Online@Cardinalschools.com </a>
                    <a className="hover:opacity-75 font-medium py-2" href=""> Accessibility </a>
                  </nav>
                </div>
              </div>
            </div>
            <p className="mt-8 text-xs font-semibold text-center text-whiite">
            @{currentYear}  Cardinal Inc.
            </p>
          </div>
        </footer>
  )
}

export default PublicFooter;