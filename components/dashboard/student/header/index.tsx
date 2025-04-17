"use client"

import type React from "react"
import { Bell } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/dashboard/student/ui/avatar"
import { Button } from "@/components/dashboard/student/ui/button"
import { useState, useEffect, useRef } from "react"
import { FaAngleDown } from "react-icons/fa6"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { fetchStudentProfile, logout } from "@/lib/api/student/api"
import { checkSubscriptionStatus } from "@/lib/api/student/payment/subscriptionstatus"
import { RootState } from "@/lib/store"
import { clearAuthState, setSubscriptionStatus, clearSubscriptionStatus } from "@/lib/authSlice"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { fetchStudentsAssessment } from "@/lib/api/student/profile/fetchStudentAssessment"
import { fetchNotifications } from "@/lib/api/student/notifcation/fetchnotification"
import pusher from "@/utils/pusher"
import type { Notification } from "@/lib/api/student/notifcation/fetchnotification"

const profileOptions = [
  { name: "Profile", href: "/student/studentinformation" },
  { name: "Settings", href: "/student/settings" },
  { name: "Support", href: "/student/ticketlist" },
  { name: "Logout", href: "#" },
]

const StudentDashboardHeader: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const token = useSelector((state: RootState) => state.auth?.token)
  const dispatch = useDispatch()
  const [profile, setProfile] = useState({ firstname: "", lastname: "", email: "" })
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const router = useRouter()
  
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([])
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false)
  const notificationDropdownRef = useRef<HTMLDivElement>(null)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false) 
  const profileDropdownRef = useRef<HTMLDivElement>(null) 
  const [profilePicture, setProfilePicture] = useState("/assets/img/dashboard/student/Ellipse 2034.png");

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
          const response = await fetchStudentProfile(token)
          setProfile(response.data)
          setProfilePicture(response.data.profile_picture || "/assets/img/dashboard/student/Ellipse 2034.png");
          console.log("user data", response.data)
        }
      } catch (error: unknown) {
        console.error("Failed to fetch profile:", error instanceof Error ? error.message : "Unknown error")
      }
    }

    getProfile()
  }, [token])

  useEffect(() => {
    const fetchRecentNotifications = async () => {
      if (token) {
        try {
          const response = await fetchNotifications(token, 1, 20); 
          const notifications = response.data.notifications;
  
          // Filter unread notifications
          const unread = notifications.filter((notification) => !notification.read_at);
  
          // Update state for unread notifications and red dot
          setHasUnreadNotifications(unread.length > 0);
  
          // Take the three most recent unread notifications
          const recent = unread.slice(0, 3).map((notification) => ({
            id: notification.id,
            type: notification.type,
            title: notification.title || "Notification",
            message: notification.message,
            data: notification.data || {}, 
            action_url: `/student/notifications`,
            read_at: notification.read_at,
            created_at: notification.created_at,
          }));
  
          setRecentNotifications(recent);
        } catch (error: unknown) {
          console.error("Error fetching notifications:", error instanceof Error ? error.message : "Unknown error");
        }
      }
    };
  
    fetchRecentNotifications();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const channel = pusher.subscribe("notifications");

    channel.bind("new-notification", (data: Notification) => {
      setRecentNotifications((prev) => [
        {
          id: data.id,
          type: data.type,
          title: data.title,
          message: data.message,
          data: data.data,
          action_url: data.action_url,
          read_at: data.read_at,
          created_at: data.created_at,
        },
        ...prev.slice(0, 2),
      ]);

      if (!data.read_at) {
        setHasUnreadNotifications(true);
      }
    });

    return () => {
      pusher.unsubscribe("notifications");
    };
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationDropdownOpen && notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target as Node)) {
        setNotificationDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [notificationDropdownOpen])

  useEffect(() => {
    const handleClickOutsideProfile = (event: MouseEvent) => {
      if (profileDropdownOpen && profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutsideProfile)
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideProfile)
    }
  }, [profileDropdownOpen])

  useEffect(() => {
    const handleProfilePictureUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<{ dp_url: string }>;
      setProfilePicture(customEvent.detail.dp_url);
    };

    window.addEventListener("profilePictureUpdated", handleProfilePictureUpdate as EventListener);

    return () => {
      window.removeEventListener("profilePictureUpdated", handleProfilePictureUpdate as EventListener);
    };
  }, []);

  type Assessment = {
    education_level: string | null;
    subjects_interested_in: string | null;
    tests_interested_in: string | null;
    learning_expectations: string | null;
    specific_goals: string | null;
    [key: string]: unknown; 
  };

  const isAssessmentComplete = (assessment: Assessment) => {
    // Required fields that must not be null
    const requiredFields = [
      'education_level',
      'subjects_interested_in',
      'tests_interested_in',
      'learning_expectations',
      'specific_goals'
    ];

    // Check if all required fields are filled
    return requiredFields.every(field => assessment[field] !== null);
  };

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (token) {
          const response = await checkSubscriptionStatus(token);
          if (response.status === "success") {
            const assessmentResponse = await fetchStudentsAssessment(token);
            const assessment = assessmentResponse.data.Assessment;

            if (!isAssessmentComplete(assessment)) {
              router.push("/assessment");
              return;
            }

            if (response.data.plan) {
              dispatch(
                setSubscriptionStatus({
                  plan: response.data.plan,
                  expiresAt: response.data.expires_at,
                })
              );
            } else {
            }
          } else {
            dispatch(clearSubscriptionStatus());
          }
        }
      } catch (error: unknown) {
        console.error("Failed to check subscription:", error instanceof Error ? error.message : "Unknown error");
        dispatch(clearSubscriptionStatus()); 
      }
    };

    checkSubscription();
  }, [token, dispatch, router]);

  const handleLogout = async () => {
    try {
      if (token) {
        await logout(token);
        dispatch(clearAuthState());
        dispatch(clearSubscriptionStatus());
      }
    } catch (error: unknown) {
      console.error("Logout failed", error instanceof Error ? error.message : "Unknown error");
    }
    router.push("/login")
  }

  return (
    <div className="fixed top-0 left-64 max-lg:-left-2 right-0 bg-white z-[9999] shadow-md">
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
          <div className="flex items-center gap-x-4 z-[9999]">
            <div className="relative" ref={notificationDropdownRef}>
              <Button variant="ghost" size="icon" className="relative" onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}>
                <Bell className="h-5 w-5" />
                {hasUnreadNotifications && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" /> 
                )}
              </Button>
              {notificationDropdownOpen && (
                <div className="absolute right-0 max-md:left-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]">
                  <ul>
                    {recentNotifications.length > 0 ? (
                      recentNotifications.map((item, index) => (
                        <li key={index} className="px-4 py-2 hover:bg-gray-100">
                          <Link href='/student/notification'>
                            <p className="font-small text-[12px]">{item.message}</p>
                            <p className="text-[12px] text-gray-500">{item.created_at}</p>
                          </Link>
                        </li>
                      ))
                    ) : (
                      <li className="px-4 py-2 text-gray-500 text-sm">No notifications</li>
                    )}
                    <li className="px-4 text-[12px] py-2 border border-[#1BC2C2] hover:bg-gray-100">
                      <Link className="w-full" href="/student/notifications">See All</Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <div className="relative" ref={profileDropdownRef}>
              <Button variant="ghost" className="relative w-fit flex items-center gap-2" onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profilePicture} alt="User" />
                  <AvatarFallback>
                    {profile.firstname[0]} {profile.lastname[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-sm">
                    {profile.firstname} {profile.lastname}
                  </h3>
                </div>
                <FaAngleDown />
              </Button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]">
                  <ul className="py-1">
                    {profileOptions.map((option) => (
                      <li key={option.name} className="px-4 py-2 hover:bg-gray-100" onClick={option.name === "Logout" ? () => setShowLogoutDialog(true) : undefined}>
                        <Link href={option.href}>{option.name}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
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
            <AlertDialogCancel onClick={() => setShowLogoutDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default StudentDashboardHeader