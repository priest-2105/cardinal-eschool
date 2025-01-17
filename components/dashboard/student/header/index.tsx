"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Bell, User } from 'lucide-react'

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

const Dropdown: React.FC<{ items: any[], icon: React.ReactNode }> = ({ items, icon }) => {
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
                {item.href ? (
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
  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-10 flex justify-between items-center px-8 py-4">
      <div className="flex items-center">
        <Image
          src="/assets/img/logo.png"
          alt="Cardinal E-School"
          width={150}
          height={40}
          className="h-12 w-auto"
        />
      </div>
      <div className="flex items-center space-x-4">
        <Dropdown items={notifications} icon={<Bell className="h-6 w-6 text-gray-700" />} />
        <Dropdown items={profileOptions} icon={<User className="h-6 w-6 text-gray-700" />} />
      </div>
    </header>
  )
}

export default StudentDashboardHeader
