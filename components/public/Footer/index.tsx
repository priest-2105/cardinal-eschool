"use client";

import React from 'react'
import Image from 'next/image';
import logo from '@/public/assets/img/logo.png';
import { Phone, Mail, Youtube } from 'lucide-react'; 
import XIcon from '@/public/assets/icons/x.png';
import TiktokIcon from '@/public/assets/icons/tiktok.png';
import WhatsappIcon from '@/public/assets/icons/whatsapp.png';
import cardinalConfig from '@/config';


function PublicFooter() {

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1BC2C2] text-white">
          <div className="max-w-screen-2xl px-4 pt-32 pb-8 mx-auto sm:px-6 lg:px-8">
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
              <div className="grid xl:ms-auto lg:ms-autp grid-cols-1 gap-8 lg:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <p className="font-bold text-xl">
                    Company
                  </p>
                  <nav className="flex flex-col mt-4 space-y-2 text-sm text-white">
                    <a className="flex items-center space-x-2 hover:opacity-75 font-medium py-2" href={`${cardinalConfig.routes.home}`}> <span>Home</span> </a>
                    <a className="flex items-center space-x-2 hover:opacity-75 font-medium py-2" href={`${cardinalConfig.routes.aboutUs}`}> <span>About Us</span> </a>
                    <a className="flex items-center space-x-2 hover:opacity-75 font-medium py-2" href={`${cardinalConfig.routes.courses}`}> <span>Courses</span> </a>
                    <a className="flex items-center space-x-2 hover:opacity-75 font-medium py-2" href={`${cardinalConfig.routes.mentors}`}> <span>Our Mentors</span> </a>
                  </nav>
                </div> 
                <div>
                  <p className="font-bold text-xl">
                    Useful Links
                  </p>
                  <nav className="flex flex-col mt-4 space-y-2 text-sm text-white">
                    <a className="flex items-center space-x-2 hover:opacity-75 font-medium py-2" href={`${cardinalConfig.routes.careers}`}> <span>Careers</span> </a>
                    <a className="flex items-center space-x-2 hover:opacity-75 font-medium py-2" href={`${cardinalConfig.routes.contactUs}`}> <span>Contact Us</span> </a>
                    <a className="flex items-center space-x-2 hover:opacity-75 font-medium py-2" href={`${cardinalConfig.routes.faq}`}> <span>FAQs</span> </a>
                
                  </nav>
                </div>
                <div>
                  <p className="font-bold text-xl">
                    Support
                  </p>
                  <nav className="flex flex-col mt-4 space-y-2 text-sm text-white">
                    <a className="flex items-center space-x-2 hover:opacity-75 font-medium py-2" href={`${cardinalConfig.routes.privacyPolicy}`}>  <span>Privacy Policy</span> </a>
                    <a className="flex items-center space-x-2 hover:opacity-75 font-medium py-2" href={`tel: ${cardinalConfig.contactInfo.phone}`}><Phone /> <span>+234 01 2345 6789</span> </a>
                    <a className="flex items-center space-x-2 hover:opacity-75 font-medium py-2" href={`mailto: ${cardinalConfig.contactInfo.email}`}><Mail /> <span>Online@Cardinalschools.com</span> </a> 
                    <div className='flex items-center space-x-2 py-2'>
                    <a className='flex items-center space-x-2 hover:opacity-75 mx-2' target='_blank' href={`${cardinalConfig.socialInfo.whatsapp}`}>  <Image onDragStart={(event) => event.preventDefault()} src={WhatsappIcon} alt="whatsapp cion" /> </a> 
                    <a className='flex items-center space-x-2 hover:opacity-75 mx-2' target='_blank' href={`${cardinalConfig.socialInfo.tikTok}`}>  <Image onDragStart={(event) => event.preventDefault()} src={TiktokIcon} alt="tiktok Icon" />  </a> 
                    <a className='flex items-center space-x-2 hover:opacity-75 mx-2' target='_blank' href={`${cardinalConfig.socialInfo.youtube}`}>  <Youtube/>  </a> 
                    <a className='flex items-center space-x-2 hover:opacity-75 mx-2' target='_blank' href={`${cardinalConfig.socialInfo.X}`}>  <Image onDragStart={(event) => event.preventDefault()} src={XIcon} alt="X-cion" /> </a> 
                     </div>
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