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
import PaymentIcon from "@/public/assets/icons/credit-card-validation.png"
import PaymentLightIcon from "@/public/assets/icons/credit-card-validation-light.png"
import AdminSupportIcon from "@/public/assets/icons/message-01.png"
import AdminSupportLightIcon from "@/public/assets/icons/message-01-light.png"
import cardinalConfig from "@/config"
import type React from "react" 
import NotificationIcon from "@/public/assets/icons/notification-03.png"
import NotificationLightIcon from "@/public/assets/icons/notification-0-light.png"
import { fetchNotifications } from "@/lib/api/student/notifcation/fetchnotification"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { fetchTicketList } from "@/lib/api/student/ticket/fetchtickets"

const navigation = [
  {
    name: "Home",
    href: cardinalConfig.routes.dashboard.student.home,
    icon: HomeIcon,
    iconLight: HomeLightIcon,
    activePaths: [cardinalConfig.routes.dashboard.student.home],
  },
  {
    name: "Profile",
    href: cardinalConfig.routes.dashboard.student.studentinformation,
    icon: ProfileIcon,
    iconLight: ProfileLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.student.guardianinformation,
      cardinalConfig.routes.dashboard.student.studentinformation,
      cardinalConfig.routes.dashboard.student.studentprofilesettings,
    ],
  },
  {
    name: "My Course",
    href: cardinalConfig.routes.dashboard.student.courses,
    icon: CoursesIcon,
    iconLight: CoursesLightIcon,
    activePaths: [cardinalConfig.routes.dashboard.student.courses],
    dynamicPath: "/student/course/",
  },
  {
    name: "Payments",
    href: cardinalConfig.routes.dashboard.student.studentMakePayment,
    icon: PaymentIcon,
    iconLight: PaymentLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.student.studentMakePayment,
      cardinalConfig.routes.dashboard.student.studentPaymentHistory,
      cardinalConfig.routes.dashboard.student.studentTransactionDetails,
    ],
    dynamicPath: "/student/transaction",
  },
  {
    name: "Admin Support",
    href: cardinalConfig.routes.dashboard.student.studentticketlist,
    icon: AdminSupportIcon,
    iconLight: AdminSupportLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.student.studentticketlist,
      cardinalConfig.routes.dashboard.student.studentcreateticket,
      cardinalConfig.routes.dashboard.student.studentticketdetails,
    ],
    dynamicPath: "/student/ticket/",
  },
  {
    name: "Notification",
    href: cardinalConfig.routes.dashboard.student.studentNotifications,
    icon: NotificationIcon,
    iconLight: NotificationLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.student.studentNotifications,
    ],
    dynamicPath: "/student/notifications/",
  },
]

const StudentDashboardSideBar: React.FC<{  }> = ({}) => {
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  const [openTicketsCount, setOpenTicketsCount] = useState(0)
  const token = useSelector((state: RootState) => state.auth?.token)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
 
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined" && window.innerWidth < 1024) {
        setIsOpen(false)
      } else {
        setIsOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [setIsOpen])

  useEffect(() => {
    const fetchUnreadNotificationsCount = async () => {
      if (token) {
        try {
          const response = await fetchNotifications(token)
          const notifications = response.notifications
          const unread = notifications.filter((notification: any) => !notification.isRead)
          setUnreadCount(unread.length)
        } catch (error) {
          console.error("Error fetching notifications:", error)
        }
      }
    }

    fetchUnreadNotificationsCount()
  }, [token])

  useEffect(() => {
    const fetchOpenTicketsCount = async () => {
      if (token) {
        try {
          const response = await fetchTicketList(token, 1, 100, { status: "open" });
          setOpenTicketsCount(response.data.tickets.length);
        } catch (error) {
          console.error("Error fetching open tickets:", error);
        }
      }
    };

    fetchOpenTicketsCount();
  }, [token]);

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
              className={cn(
                "flex items-center gap-x-3 rounded-lg mb-2 px-3 py-3 text-sm font-medium group",
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
                  {item.name === "Admin Support" && openTicketsCount > 0 && (
                    <div className="ml-auto w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                      {openTicketsCount}
                    </div>
                  )}
                </>
              )}
              {!isOpen && (
                <>
                  <span className="absolute left-20 bg-gray-700 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.name}
                  </span>
                  {item.name === "Admin Support" && openTicketsCount > 0 && (
                    <div className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                      {openTicketsCount}
                    </div>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default StudentDashboardSideBar

