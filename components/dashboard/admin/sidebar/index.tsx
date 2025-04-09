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
import ManageTutorsIcon from "@/public/assets/icons/user-multiple3x.png"
import ManageTutorsLightIcon from "@/public/assets/icons/user-multiplelight.png"
import ManageStudentsIcon from "@/public/assets/icons/user-star-013x.png"
import ManageStudentsLightIcon from "@/public/assets/icons/user-star-01light.png"
import AnnouncementIcon from "@/public/assets/icons/volume-high3x.png"
import AnnouncementLightIcon from "@/public/assets/icons/volume-highlight.png"
import CouponIcon from "@/public/assets/icons/coupon-icon.png"
import CouponLightIcon from "@/public/assets/icons/coupon-icon-light.png"
import NotificationIcon from "@/public/assets/icons/notification-03.png"
import NotificationLightIcon from "@/public/assets/icons/notification-0-light.png"
import cardinalConfig from "@/config"
import { fetchNotifications } from "@/lib/api/admin/notifcation/fetchnotification"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import type React from "react"
import { getPendingReports } from "@/lib/api/admin/pendingreport/fetchpendingreport"
import { fetchTicketList } from "@/lib/api/admin/ticket/fetchtickets"

const navigation = [
  {
    name: "Home",
    href: cardinalConfig.routes.dashboard.admin.home,
    icon: HomeIcon,
    iconLight: HomeLightIcon,
    activePaths: [cardinalConfig.routes.dashboard.admin.home],
    dynamicPath: null,
  },
  {
    name: "Profile",
    href: cardinalConfig.routes.dashboard.admin.admininformation,
    icon: ProfileIcon,
    iconLight: ProfileLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.admin.guardianinformation,
      cardinalConfig.routes.dashboard.admin.admininformation,
      cardinalConfig.routes.dashboard.admin.adminprofilesettings,
    ],
    dynamicPath: null,
  },
  {
    name: "Payments",
    href: cardinalConfig.routes.dashboard.admin.adminMakePayment,
    icon: PaymentIcon,
    iconLight: PaymentLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.admin.adminMakePayment,
      cardinalConfig.routes.dashboard.admin.adminPaymentHistory,
      cardinalConfig.routes.dashboard.admin.adminTransactionDetails,
    ],
    dynamicPath: null,
  },
  {
    name: "Support Tickets",
    href: cardinalConfig.routes.dashboard.admin.adminticketlist,
    icon: AdminSupportIcon,
    iconLight: AdminSupportLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.admin.adminticketlist,
      cardinalConfig.routes.dashboard.admin.adminreplyticket,
      cardinalConfig.routes.dashboard.admin.adminticketdetails,
    ],
    dynamicPath: "/admin/ticket/",
  },
  {
    name: "Manage Courses",
    href: cardinalConfig.routes.dashboard.admin.adminmanagecourses,
    icon: CoursesIcon,
    iconLight: CoursesLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.admin.adminmanagecourses,
      cardinalConfig.routes.dashboard.admin.admincreatecourse,
      cardinalConfig.routes.dashboard.admin.courseDetails,
    ],
    dynamicPath: "/admin/course/",
  },
  {
    name: "Manage Students",
    href: cardinalConfig.routes.dashboard.admin.adminManageStudents,
    icon: ManageStudentsIcon,
    iconLight: ManageStudentsLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.admin.adminManageStudents,
      cardinalConfig.routes.dashboard.admin.adminStudentDetails,
    ],
    dynamicPath: "/admin/student/",
  },
  {
    name: "Manage Tutors",
    href: cardinalConfig.routes.dashboard.admin.adminManageTutors,
    icon: ManageTutorsIcon,
    iconLight: ManageTutorsLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.admin.adminManageTutors,
      cardinalConfig.routes.dashboard.admin.adminManageTutors,
      cardinalConfig.routes.dashboard.admin.adminTutorDetails,
    ],
    dynamicPath: "/admin/tutor/",
  },
  {
    name: "Pending Reports",
    href: cardinalConfig.routes.dashboard.admin.adminPendingReports,
    icon: ManageTutorsIcon,
    iconLight: ManageTutorsLightIcon,
    activePaths: [cardinalConfig.routes.dashboard.admin.adminPendingReports],
    dynamicPath: "/admin/pendingreports/",
  },
  {
    name: "Announcements",
    href: cardinalConfig.routes.dashboard.admin.adminAnnouncements,
    icon: AnnouncementIcon,
    iconLight: AnnouncementLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.admin.adminAnnouncements,
      cardinalConfig.routes.dashboard.admin.adminAnnouncementDetails,
      cardinalConfig.routes.dashboard.admin.adminCreateAnnouncement,
    ],
    dynamicPath: null,
  },
  {
    name: "Manage Coupons",
    href: cardinalConfig.routes.dashboard.admin.adminCouponList,
    icon: CouponIcon,
    iconLight: CouponLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.admin.adminCouponList,
      cardinalConfig.routes.dashboard.admin.adminCouponDetails,
      cardinalConfig.routes.dashboard.admin.adminEditCoupon,
      cardinalConfig.routes.dashboard.admin.adminCreateCoupon,
    ],
    dynamicPath: "/admin/coupon",
  },
  {
    name: "Notification",
    href: cardinalConfig.routes.dashboard.admin.adminNotifications,
    icon: NotificationIcon,
    iconLight: NotificationLightIcon,
    activePaths: [
      cardinalConfig.routes.dashboard.admin.adminNotifications,
    ],
    dynamicPath: "/admin/notifications/",
  },
]

const AdminDashboardSideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [unreadCount, setUnreadCount] = useState(0)
  const [openTicketsCount, setOpenTicketsCount] = useState(0)
  const [pendingReportsCount, setPendingReportsCount] = useState(0)
  const token = useSelector((state: RootState) => state.auth?.token)

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
    const fetchUnreadNotificationsCount = async () => {
      if (token) {
        try {
          const response = await fetchNotifications(token)
          const notifications = response.data.notifications
          const unread = notifications.filter((notification: { read_at: string | null }) => !notification.read_at)
          setUnreadCount(unread.length)
        } catch (error) {
          console.error("Error fetching notifications:", error)
        }
      }
    }

    fetchUnreadNotificationsCount()
  }, [token])

  useEffect(() => {
    const fetchPendingReportsCount = async () => {
      if (token) {
        try {
          const response = await getPendingReports(token)
          const pendingOnly = response.data.reports.filter((report) => report.status === "pending")
          setPendingReportsCount(pendingOnly.length)
        } catch (error) {
          console.error("Error fetching pending reports:", error)
        }
      }
    }

    fetchPendingReportsCount()
  }, [token])

  useEffect(() => {
    const fetchOpenTicketsCount = async () => {
      if (token) {
        try {
          const response = await fetchTicketList(token, 1, 100, { status: "open" })
          const openTickets = response.data.tickets
          setOpenTicketsCount(openTickets.length)
        } catch (error) {
          console.error("Error fetching open tickets:", error)
        }
      }
    }

    fetchOpenTicketsCount()
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
                  {item.name === "Pending Reports" && pendingReportsCount > 0 && (
                    <div className="ml-auto w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                      {pendingReportsCount}
                    </div>
                  )}
                  {item.name === "Support Tickets" && openTicketsCount > 0 && (
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
                  {item.name === "Support Tickets" && openTicketsCount > 0 && (
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

export default AdminDashboardSideBar

