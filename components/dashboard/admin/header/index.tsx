"use client"

import type React from "react"

import { Bell } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/dashboard/admin/ui/avatar"
import { Button } from "@/components/dashboard/admin/ui/button"
import { useState, useEffect, useRef } from "react"
import { FaAngleDown } from "react-icons/fa6"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { fetchAdminProfile, fetchNotifications } from "@/lib/api/admin/api"
import { RootState } from "@/lib/store"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/api/admin/auth/logout"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const notifications = [
  { message: "New assessment available", time: "2 hours ago" },
  { message: "Class rescheduled", time: "1 day ago" },
  { message: "New message from instructor", time: "3 days ago" },
]

const profileOptions = [
  { name: "Profile", href: "/admin/profile" },
  { name: "Settings", href: "/admin/settings" },
  { name: "Support", href: "/admin/support" },
  { name: "Logout", href: "#" },
]

interface Notification {
  message: string
  time: string
  createdAt: string
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
        <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg">
          <ul className="py-1">
            {items.map((item, index) => (
              <li key={index} className="px-4 py-2 text-[15px] hover:bg-gray-100" onClick={item.onClick}>
                {"href" in item ? (
                  <Link href={item.href}>{item.name}</Link>
                ) : (
                  <div>
                    <p className="font-medium text-[12px]">{item.message}</p>
                    <p className="text-sm text-gray-500 text-[12px]">{item.time}</p>
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

const AdminDashboardHeader: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [profile, setProfile] = useState({ firstname: "", lastname: "", email: "" })
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const token = useSelector((state: RootState) => state.auth?.token)
  const dispatch = useDispatch()
  const router = useRouter()
  const notificationDropdownRef = useRef<HTMLDivElement>(null)
  const profileDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (token) {
          const response = await fetchAdminProfile(token);
          setProfile(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    getProfile();
  }, [token]);

  useEffect(() => {
    const fetchRecentNotifications = async () => {
      if (token) {
        try {
          const response = await fetchNotifications(token)
          const notifications = response.data.notifications
          const unread = notifications.filter((notification: any) => !notification.read_at)
          setHasUnreadNotifications(unread.length > 0)
          const recent = unread.slice(0, 3).map((notification: any) => ({
            message: notification.message,
            time: notification.created_at,
            createdAt: notification.created_at,
          }))
          setRecentNotifications(recent)
        } catch (error) {
          console.error("Error fetching notifications:", error)
        }
      }
    }

    fetchRecentNotifications()
  }, [token])

  const handleLogout = async () => {
    try {
      if (token) {
        await logout(token)
        dispatch({ type: "CLEAR_AUTH" })
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
    router.push("/admin/login")
  };

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
          <div className="flex items-center w-58 gap-x-4 z-40">
            <Dropdown
              items={recentNotifications.length > 0 ? recentNotifications : [{ message: "No notifications", time: "" , createdAt: ""}]}
              icon={
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {hasUnreadNotifications && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Button>
              }
            />
            <Dropdown
              items={profileOptions.map(option => ({
                ...option,
                onClick: option.name === "Logout" ? () => setShowLogoutDialog(true) : undefined
              }))}
              icon={
                <Button variant="ghost" className="relative w-fit flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/assets/img/dashboard/admin/Ellipse 2034.png" alt="User" />
                    <AvatarFallback>{profile.firstname[0]} {profile.lastname[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-sm">{profile.firstname} {profile.lastname}</h3>
                    {/* <p className="text-xs text-gray-500">{profile.email}</p> */}
                  </div>
                  <FaAngleDown />
                </Button>
              }
            />
          </div>
        </div>
      </div>

      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out of your account and redirected to the login page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminDashboardHeader

