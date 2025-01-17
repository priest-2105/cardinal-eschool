"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { Home, User, GraduationCap, CreditCard, HeadphonesIcon, Menu, X } from 'lucide-react'

const navigation = [ 
  { name: "Home", href: "/", icon: Home },
  { name: "Profile", href: "/student/profile", icon: User },
  { name: "My Courses", href: "/student/courses", icon: GraduationCap },
  { name: "Payments", href: "/student/payments", icon: CreditCard },
  { name: "Admin Support", href: "/student/support", icon: HeadphonesIcon },
]

const StudentDashboardSideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`flex h-full ${isOpen ? 'w-64' : 'w-20'} flex-col fixed left-0 top-0 border-r bg-[#E9FFFF] transition-all ease-in-out duration-300`}>
      <div className="flex h-26 py-12 shrink-0 items-center px-6">
        <Image
          src="/assets/img/logo.png"
          alt="Cardinal E-School"
          width={150}
          height={40}
          className="h-12 w-auto"
        />
        <button onClick={toggleSidebar} className="ml-auto lg:hidden">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      <div className="flex flex-1 flex-col px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-x-3 rounded-lg mb-2 px-3 py-3 text-sm font-medium",
                isActive
                  ? "bg-[#1BC2C2] text-white"
                  : "text-gray-700 font-bold hover:bg-[#1BC2C2] hover:text-white"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-700 hover:text-white")} />
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