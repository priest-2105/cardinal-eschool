"use client"

import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import {Home, User, GraduationCap, CreditCard, HeadphonesIcon } from 'lucide-react'

const navigation = [ 
  { name: "Home", href: "/home", icon: Home },
  { name: "Profile", href: "/student/profile", icon: User },
  { name: "My Courses", href: "/student/courses", icon: GraduationCap },
  { name: "Payments", href: "/student/payments", icon: CreditCard },
  { name: "Admin Support", href: "/student/support", icon: HeadphonesIcon },
]


const StudentDashboardSideBar: React.FC = () => {

  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col fixed left-0 top-0 border-r bg-[#E9FFFF]">
    <div className="flex h-26 py-12 shrink-0 items-center px-6">
      <Image
        src="/assets/img/logo.png"
        alt="Cardinal E-School"
        width={150}
        height={40}
        className="h-12 w-auto"
      />
    </div>
    <div className="flex flex-1 flex-col px-4 py-4 space-y-1">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-x-3 rounded-lg px-3 py-3 my-9 text-sm font-medium",
              isActive
                ? "bg-[#1BC2C2] text-[#E9FFFF]"
                : "text-gray-700 font-bold hover:bg-[#1BC2C2]  hover:text-white"
            )}
          >
            <item.icon className={cn("h-5 w-5 hover:text-white", isActive ? "text-[#1BC2C2]" : "text-gray-700   hover:text-white font-bold")} />
            {item.name}
          </Link>
        )
      })}
    </div>
  </div>
  );
};

export default StudentDashboardSideBar;