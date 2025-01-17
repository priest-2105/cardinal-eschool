"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { ArrowLeft, ArrowRight } from 'lucide-react'
import HomeIcon from '@/public/assets/icons/home-01.png'
import HomeLightIcon from '@/public/assets/icons/home-01-light.png'
import ProfileIcon from '@/public/assets/icons/user.png'
import ProfileLightIcon from '@/public/assets/icons/user-light.png'
import CoursesIcon from '@/public/assets/icons/course.png'
import CoursesLightIcon from '@/public/assets/icons/course-light.png'
import PaymentIcon from '@/public/assets/icons/credit-card-validation.png'
import PaymentLightIcon from '@/public/assets/icons/credit-card-validation-light.png'
import AdminSupportIcon from '@/public/assets/icons/message-01.png'
import AdminSupportLightIcon from '@/public/assets/icons/message-01-light.png'

const navigation = [ 
  { name: "Home", href: "/", icon: HomeIcon, iconLight: HomeLightIcon },
  { name: "Profile", href: "/student/profile", icon: ProfileIcon, iconLight: ProfileLightIcon },
  { name: "My Courses", href: "/student/courses", icon: CoursesIcon, iconLight: CoursesLightIcon },
  { name: "Payments", href: "/student/payments", icon: PaymentIcon, iconLight: PaymentLightIcon },
  { name: "Admin Support", href: "/student/support", icon: AdminSupportIcon, iconLight: AdminSupportLightIcon },
]

const StudentDashboardSideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`flex h-full ${isOpen ? 'w-64' : 'w-20'} flex-col fixed left-0 top-0 border-r bg-[#E9FFFF] transition-all ease-in-out duration-300`}>
      <div className="flex h-26 py-12 shrink-0 items-center px-6 relative">
        <button onClick={toggleSidebar} className=" lg:hidden">
          {isOpen ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
        </button>
        {isOpen ? 
        <Image
          src="/assets/img/logo.png"
          alt="Cardinal E-School"
          width={150}
          height={40}
          className="h-12 w-auto"/> :
        <Image
          src="/assets/img/favicon-logo.png"
          alt="Cardinal E-School"
          width={30}
          height={10}
          className="h-8 w-auto"
        />}
      </div>
      <div className="flex flex-1 flex-col px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-x-3 rounded-lg mb-2 px-3 py-3 text-sm font-medium group",
                isActive
                  ? "bg-[#1BC2C2] text-white"
                  : "text-gray-700 font-bold hover:bg-[#1BC2C2] hover:text-white"
              )}
            >
              <Image
                src={isActive ? item.iconLight : item.icon}
                alt={`${item.name} icon`}
                className="h-5 w-5 group-hover:hidden"
              />
              <Image
                src={item.iconLight}
                alt={`${item.name} icon light`}
                className="h-5 w-5 hidden group-hover:block"
              />
              {isOpen && <span>{item.name}</span>}
              {!isOpen && (
                <span className="absolute left-20 bg-gray-700 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {item.name}
                </span>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default StudentDashboardSideBar