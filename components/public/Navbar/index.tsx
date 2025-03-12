"use client"

import Image from 'next/image';
import logo from '@/public/assets/img/logo.png';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react'; 
import cardinalConfig from '@/config';
import { usePathname } from 'next/navigation';

function PublicNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const navMenuLinks = [
    { menuItem: 'Home', Link: `${cardinalConfig.routes.home}`},
    { menuItem: 'About Us', Link: `${cardinalConfig.routes.aboutUs}`},
    { menuItem: 'Courses', Link: `${cardinalConfig.routes.courses}`},
    // { menuItem: 'Test Prep', Link: `${cardinalConfig.routes.testPrep}`},
    { menuItem: 'Contact Us', Link: `${cardinalConfig.routes.contactUs}`},
    { menuItem: 'Career', Link: `${cardinalConfig.routes.careers}`},
  ]

  return (
    <nav className="bg-white">
      <div className="max-w-screen-2xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            {/* <Image onDragStart={(event) => event.preventDefault()}  src={logo} alt="Cardinal Logo" width={180} height={90} /> */}
            <img onDragStart={(event) => event.preventDefault()}  src={logo.src} alt="Cardinal Logo" width={180} height={90} />
          </div>
          
          {/* Desktop menu */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            {navMenuLinks.map((menuLink, index) => {
              const isActive = pathname === menuLink.Link;
              return (
                <Link 
                  key={index} 
                  href={menuLink.Link} 
                  className={`mx-3 py-2 text-sm font-semibold ${
                    isActive 
                      ? 'text-[#1BC2C2] border-b-2 border-[#1BC2C2]' 
                      : 'text-gray-700 border-b-2 border-transparent hover:text-[#1BC2C2] hover:border-b-2 hover:border-[#1BC2C2]'
                  }`}
                >
                  {menuLink.menuItem}
                </Link>
              )
            })}
          </div>
          
          <div className="hidden lg:flex items-center">
            <Link href="/login" className="mx-2 px-8 py-2 rounded-3xl text-sm font-bold text-[#1BC2C2] border-2 border-[#1BC2C2] hover:bg-[#1BC2C2] hover:text-[#fff]">Log In</Link>
            <Link href="/signup" className="mx-2 px-8 py-2 rounded-3xl text-sm font-bold text-[#fff] border-2 bg-[#1BC2C2] border-[#1BC2C2]  hover:bg-[#fff]  hover:text-[#1BC2C2]">Sign Up</Link>
          </div>
          
          {/* Mobile and Tablet menu button */}
          <div className="lg:hidden flex items-center">
            <button onClick={toggleMenu} className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile and Tablet menu overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={toggleMenu}></div>
      )}

      {/* Mobile and Tablet side menu */}
      <div 
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <Image  onDragStart={(event) => event.preventDefault()} src={logo} alt="Cardinal Logo" width={120} height={60} />
            <button onClick={toggleMenu} className="text-gray-500 hover:text-gray-600">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="space-y-4">
            {navMenuLinks.map((menuLink, index) => {
              const isActive = pathname === menuLink.Link;
              return (
                <Link 
                  key={index} 
                  href={menuLink.Link} 
                  className={`block py-2 text-sm w-fit font-semibold ${
                    isActive 
                      ? 'text-[#1BC2C2] border-b-2 border-[#1BC2C2]' 
                      : 'text-gray-700 border-b-2 border-transparent hover:text-[#1BC2C2] hover:border-b-2 hover:border-[#1BC2C2]'
                  }`}
                  onClick={toggleMenu}
                >
                  {menuLink.menuItem}
                </Link>
              )
            })}
          </div>
          <div className="mt-6 space-y-4">
            <Link href={cardinalConfig.routes.login} className="block w-full px-4 py-2 text-center rounded-3xl text-sm font-bold text-[#1BC2C2] border-2 border-[#1BC2C2] hover:bg-[#1BC2C2] hover:text-[#fff]" onClick={toggleMenu}>Log In</Link>
            <Link href={cardinalConfig.routes.signup} className="block w-full px-4 py-2 text-center rounded-3xl text-sm font-bold text-[#fff] border-2 bg-[#1BC2C2] border-[#1BC2C2] hover:bg-[#fff] hover:text-[#1BC2C2]" onClick={toggleMenu}>Sign Up</Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default PublicNavbar;

