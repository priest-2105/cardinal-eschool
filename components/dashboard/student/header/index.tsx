"use client"

import { Bell } from 'lucide-react'
import { Avatar } from "@/components/dashboard/student/ui/avatar"
import { Button } from "@/components/dashboard/student/ui/button"
import { useState } from "react"
import { FaAngleDown } from 'react-icons/fa6'
import Link from "next/link"

const notifications = [
  { message: "New assignment available", time: "2 hours ago" },
  { message: "Class rescheduled", time: "1 day ago" },
  { message: "New message from instructor", time: "3 days ago" },
]

const profileOptions = [
  { name: "Profile", href: "/student/profile" },
  { name: "Settings", href: "/student/settings" },
  { name: "Support", href: "/student/support" },
]

interface Notification {
  message: string;
  time: string;
}

interface ProfileOption {
  name: string;
  href: string;
}

const Dropdown: React.FC<{ items: Notification[] | ProfileOption[], icon: React.ReactNode }> = ({ items, icon }) => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="flex items-center">
        {icon}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
          <ul className="py-1">
            {items.map((item, index) => (
              <li key={index} className="px-4 py-2 hover:bg-gray-100">
                {'href' in item ? (
                  <Link href={item.href}>
                    {item.name}
                  </Link>
                ) : (
                  <div>
                    <p className="font-medium">{item.message}</p>
                    <p className="text-sm text-gray-500">{item.time}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

const StudentDashboardHeader: React.FC = () => {
  const [showNotification, setShowNotification] = useState(true)

  return (
    <div className="fixed top-0 left-64 right-0 z-10 bg-white">
    <div className="relative">
      {showNotification && (
        <div className="bg-[#E9FFFF] px-6 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Great effort so far Temilade!</span>{" "}
              Keep up the tenacity, and with a bit more focus on your attendance, you&apos;re sure to reach your full potential!
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowNotification(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </Button>
          </div>
        </div>
      )}
    </div>
    <div className="border-b">
      <div className="flex h-16 items-center justify-end gap-x-4 px-6">
        <Dropdown items={notifications} icon={  
          <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>} />

        <Dropdown items={profileOptions} icon={
          <Button variant="ghost"  className="relative w-fit">
          <Avatar className='' src="/assets/img/dashboard/student/Ellipse2034.png" alt="User" fallback="TD" /> 
          <h3 className=' font-bold text-sm'>Temilade Hassan</h3>
          <FaAngleDown/>
          </Button>
          } />
   
      </div>
    </div>
  </div>
  
  );
};

export default StudentDashboardHeader;

