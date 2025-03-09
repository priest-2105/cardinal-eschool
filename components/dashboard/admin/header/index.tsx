"use client"

import type React from "react"

import { Bell } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/dashboard/admin/ui/avatar"
import { Button } from "@/components/dashboard/admin/ui/button"
import { useState, useEffect, useRef } from "react"
import { FaAngleDown } from "react-icons/fa6"
import Link from "next/link"

const notifications = [
  { message: "New assessment available", time: "2 hours ago" },
  { message: "Class rescheduled", time: "1 day ago" },
  { message: "New message from instructor", time: "3 days ago" },
]

const profileOptions = [
  { name: "Profile", href: "/admin/profile" },
  { name: "Settings", href: "/admin/settings" },
  { name: "Support", href: "/admin/support" },
  { name: "Logout", href: "/admin/logout" },
]

interface Notification {
  message: string
  time: string
}

interface ProfileOption {
  name: string
  href: string
}

const Dropdown: React.FC<{ items: Notification[] | ProfileOption[]; icon: React.ReactNode }> = ({ items, icon }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, []) // Removed handleClickOutside from dependencies

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="flex items-center">
        {icon}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
          <ul className="py-1">
            {items.map((item, index) => (
              <li key={index} className="px-4 py-2 hover:bg-gray-100">
                {"href" in item ? (
                  <Link href={item.href}>{item.name}</Link>
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

const AdminDashboardHeader: React.FC<{ toggleSidebar: () => void; isSidebarOpen: boolean }> = ({
  toggleSidebar,
  isSidebarOpen,
}) => {
  return (
    <div className="fixed top-0 left-64 max-lg:-left-2 right-0 bg-white z-40 shadow-md">
      <div className="border-b">
        <div className="flex h-16 items-center max-lg:justify-between justify-end gap-x-4 px-6">
          <button onClick={toggleSidebar} className="ml-26 mr-2 mb-0 lg:hidden">
            {isSidebarOpen ? (
              <></>
            ) : (
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
          <div className="flex items-center gap-x-4 z-40">
            <Dropdown
              items={notifications}
              icon={
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                </Button>
              }
            />
            <Dropdown
              items={profileOptions}
              icon={
                <Button variant="ghost" className="relative w-fit flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/assets/img/dashboard/admin/Ellipse 2034.png" alt="User" />
                    <AvatarFallback>TD</AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-sm">Hanah Olumide</h3>
                  <FaAngleDown />
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardHeader

