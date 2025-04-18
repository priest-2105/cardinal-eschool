"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Logo from "@/public/assets/img/logo.png"
import favIconLogo from "@/public/assets/img/favicon-logo.png"
import HomeIcon from "@/public/assets/icons/home-01.png"
import HomeLightIcon from "@/public/assets/icons/home-01-light.png"
import ProfileIcon from "@/public/assets/icons/user.png"
import ProfileLightIcon from "@/public/assets/icons/user-light.png"
import CoursesIcon from "@/public/assets/icons/course.png"
import CoursesLightIcon from "@/public/assets/icons/course-light.png"
import AdminSupportIcon from "@/public/assets/icons/message-01.png"
import AdminSupportLightIcon from "@/public/assets/icons/message-01-light.png"
import NotificationIcon from "@/public/assets/icons/notification-03.png"
import NotificationLightIcon from "@/public/assets/icons/notification-0-light.png"
import cardinalConfig from "@/config"
import { fetchNotifications, fetchTicketList } from "@/lib/api/tutor/api"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import type React from "react"

const navigation = [
  {
    name: "Home",
    href: cardinalConfig.routes.dashboard.tutor.home,
    icon: HomeIcon,
    iconLight: HomeLightIcon,
    activePaths: [cardinalConfig.routes.dashboard.tutor.home],
  },
  {
    name: "Profile",
    href: cardinalConfig.routes.dashboard.tutor.tutorinformation,
    icon: ProfileIcon,
    iconLight: ProfileLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.tutor.guardianinformation,
      cardinalConfig.routes.dashboard.tutor.tutorinformation,
      cardinalConfig.routes.dashboard.tutor.tutorprofilesettings,
    ],
  },
  {
    name: "Courses",
    href: cardinalConfig.routes.dashboard.tutor.courses,
    icon: CoursesIcon,
    iconLight: CoursesLightIcon,
    activePaths: [cardinalConfig.routes.dashboard.tutor.courses],
    dynamicPath: "/tutor/course/",
  },
  {
    name: "Admin Support",
    href: cardinalConfig.routes.dashboard.tutor.tutorticketlist,
    icon: AdminSupportIcon,
    iconLight: AdminSupportLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.tutor.tutorticketlist,
      cardinalConfig.routes.dashboard.tutor.tutorcreateticket,
      cardinalConfig.routes.dashboard.tutor.tutorticketdetails,
    ],
    dynamicPath: "/tutor/ticket/",
  },
  {
    name: "Notification",
    href: cardinalConfig.routes.dashboard.tutor.tutorNotifications,
    icon: NotificationIcon,
    iconLight: NotificationLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.tutor.tutorNotifications,
    ],
    dynamicPath: "/tutor/notifications/",
  },
]

const TutorDashboardSideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const token = useSelector((state: RootState) => state?.auth?.token)
  const [unreadCount, setUnreadCount] = useState(0)
  const [openInProgressTicketCount, setOpenInProgressTicketCount] = useState(0)

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

  useEffect(() => {
    const fetchNotificationsData = async () => {
      if (token) {
        try {
          const response = await fetchNotifications(token)
          const notifications = response.data.notifications
          const unread = notifications.filter(
            (notification: { read_at: string | null }) => !notification.read_at
          )
          setUnreadCount(unread.length)
        } catch (error) {
          console.error("Error fetching notifications:", error)
        }
      }
    }

    fetchNotificationsData()

    const handleNotificationsUpdated = () => {
      fetchNotificationsData()
    }

    window.addEventListener("notificationsUpdated", handleNotificationsUpdated)

    return () => {
      window.removeEventListener("notificationsUpdated", handleNotificationsUpdated)
    }
  }, [token])

  useEffect(() => {
    const fetchOpenInProgressTicketCount = async () => {
      if (token) {
        try {
          const response = await fetchTicketList(token)
          const tickets = response.data.tickets
          const openInProgressCount = tickets.filter(
            (ticket: { status: string }) => ticket.status === "open" || ticket.status === "in_progress",
          ).length
          setOpenInProgressTicketCount(openInProgressCount)
        } catch (error) {
          console.error("Error fetching tickets:", error)
        }
      }
    }

    fetchOpenInProgressTicketCount()
  }, [token])

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div
      className={`flex h-full ${isOpen ? "w-64" : "w-20"} flex-col fixed left-0 top-0 border-r bg-[#E9FFFF] z-50 transition-all ease-in-out duration-300`}
    >
      <div className="block h-26 py-12 shrink-0 items-center text-end px-6 relative">
        <button onClick={toggleSidebar} className="ml-auto mr-2 mb-0 lg:hidden">
          {isOpen ? (
            <svg
              className="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <></>
          )}
        </button>
        {isOpen ? (
          <Image src={Logo} alt="Cardinal E-School" width={150} height={40} className="h-12 w-auto" />
        ) : (
          <Image
            src={favIconLogo}
            alt="Cardinal E-School"
            width={30}
            height={10}
            className="h-8 w-auto"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive =
            item.activePaths.includes(pathname) || (item.dynamicPath && pathname.startsWith(item.dynamicPath))

          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              // onMouseEnter={() => handleLinkClick(item.href)}
              className={cn(
                "flex items-center gap-x-3 rounded-lg mb-2 px-3 py-3 text-sm font-medium group relative",
                isActive ? "bg-[#1BC2C2] text-white" : "text-gray-700 font-bold hover:bg-[#1BC2C2] hover:text-white",
              )}
            >
              <Image
                src={isActive ? item.iconLight : item.icon}
                alt={`${item.name} icon`}
                className="h-5 w-5 group-hover:hidden"
              />
              <Image
                src={item.iconLight || "/placeholder.svg"}
                alt={`${item.name} icon light`}
                className="h-5 w-5 hidden group-hover:block"
              />
              {isOpen && (
                <>
                  <span>{item.name}</span>
                  {item.name === "Notification" && unreadCount > 0 && (
                    <div className="ml-auto w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                      {unreadCount}
                    </div>
                  )}
                  {item.name === "Admin Support" && openInProgressTicketCount > 0 && (
                    <div className="ml-auto w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                      {openInProgressTicketCount}
                    </div>
                  )}
                </>
              )}
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

export default TutorDashboardSideBar

