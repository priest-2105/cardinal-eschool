"use client"

import type React from "react"
import { Bell, Loader2 } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/dashboard/admin/ui/avatar"
import { Button } from "@/components/dashboard/admin/ui/button"
import { useState, useEffect, useRef } from "react"
import { FaAngleDown } from "react-icons/fa6"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"
import { fetchAdminProfile, logout } from "@/lib/api/admin/api"
import { RootState } from "@/lib/store"
import { clearAuthState } from "@/lib/authSlice"
import { useRouter } from "next/navigation"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import type { Notification as BaseNotification } from "@/lib/api/admin/notifcation/fetchnotification";
import { fetchNotifications } from "@/lib/api/admin/notifcation/fetchnotification"


// Extend the Notification interface to include the `time` property
interface Notification extends BaseNotification {
  time: string;
}

const profileOptions = [
  { name: "Profile", href: "/admin/admininformation" },
  { name: "Settings", href: "/admin/settings" },
  { name: "Logout", href: "#" },
]

interface ProfileOption {
  name: string
  href: string
}

const Dropdown: React.FC<{
  items: Notification[] | ProfileOption[];
  icon: React.ReactNode;
  isNotification?: boolean;
  handleItemClick?: (href: string) => void;
  setShowLogoutDialog?: (show: boolean) => void;
}> = ({ items, icon, isNotification, handleItemClick, setShowLogoutDialog }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  const router = useRouter();

  const handleNotification = () => {
    router.push("/admin/notifications");
    toggleDropdown();
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="flex items-center">
        {icon}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white border border-gray-200 rounded-lg shadow-lg">
          <ul className="py-1">
            {items.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 cursor-pointer text-[14px] hover:bg-gray-100"
                onClick={() => {
                  if ("href" in item) {
                    if (item.name === "Logout") {
                      setShowLogoutDialog?.(true);
                      toggleDropdown();
                    } else if (handleItemClick) {
                      handleItemClick(item.href);
                      toggleDropdown();
                    }
                  } else {
                    handleNotification();
                  }
                }}
              >
                {"href" in item ? (
                  <Link href={item.href}>{item.name}</Link>
                ) : (
                  <div>
                    <p className="font-medium text-[13px]">{(item as Notification).message}</p>
                    <p className="text-sm text-gray-500 text-[11px]">{(item as Notification).created_at}</p>
                  </div>
                )}
              </li>
            ))}
            {isNotification && items.length > 0 && (items[0] as Notification)?.message !== "No notifications" && (
              <li className="px-4 text-[12px] py-2 border border-[#1BC2C2] hover:bg-gray-100">
                <Link className="w-full" href="/admin/notifications">
                  See All
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const AdminDashboardHeader: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [profile, setProfile] = useState({ firstname: "", lastname: "", email: "" })
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([])
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)
  const token = useSelector((state: RootState) => state.auth?.token)
  const dispatch = useDispatch()
  const router = useRouter()

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

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (token) {
          const response = await fetchAdminProfile(token);
          setProfile(response.data);
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Failed to fetch profile:", errorMessage);
      }
    };

    getProfile();
  }, [token]);

  const fetchRecentNotifications = async () => {
    if (token) {
      try {
        const response = await fetchNotifications(token);
        const notifications = response.data.notifications;

        // Filter unread notifications
        const unreadNotifications = notifications.filter((notification) => !notification.read_at);

        // Map recent unread notifications (limit to 3)
        const recentUnread = unreadNotifications.slice(0, 3).map((notification) => ({
          ...notification,
          time: new Date(notification.created_at).toLocaleString(), // Format the `created_at` property
        }));

        setHasUnreadNotifications(unreadNotifications.length > 0);
        setRecentNotifications(recentUnread);
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
        console.error("Error fetching notifications:", errorMessage);

        // Set fallback notification
        setRecentNotifications([
          {
            id: 0,
            type: "system",
            title: "No notifications",
            message: "You have no unread notifications at the moment.",
            data: {},
            action_url: null,
            read_at: null,
            created_at: new Date().toISOString(),
            time: new Date().toLocaleString(),
          },
        ]);
      }
    }
  };

  useEffect(() => {
    fetchRecentNotifications();
  }, [token]);

  useEffect(() => {
    const handleNotificationsUpdated = () => {
      fetchRecentNotifications();
    };

    window.addEventListener("notificationsUpdated", handleNotificationsUpdated);
    return () => {
      window.removeEventListener("notificationsUpdated", handleNotificationsUpdated);
    };
  }, []); // Removed `token` dependency to ensure the listener is always active

  useEffect(() => {
    if (showLogoutDialog) {
      router.prefetch("/admin/login")
    }
  }, [showLogoutDialog, router])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      if (token) {
        await logout(token);
        dispatch(clearAuthState());
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
      console.error("Logout failed", errorMessage);
    } finally {
      setIsLoggingOut(false)
      setShowLogoutDialog(false)
      router.push("/admin/login")
    }
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
              items={recentNotifications}
              icon={
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {hasUnreadNotifications && (
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </Button>
              }
              isNotification={true}
              handleItemClick={() => router.push("/admin/notifications")}
            />
            <Dropdown
              items={profileOptions}
              icon={
                <Button variant="ghost" className="relative w-fit flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/assets/img/dashboard/admin/Ellipse 2034.png" alt="User" />
                    <AvatarFallback>{profile.firstname?.[0]} {profile.lastname?.[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold text-sm">{profile.firstname} {profile.lastname}</h3>
                    {/* <p className="text-xs text-gray-500">{profile.email}</p> */}
                  </div>
                  <FaAngleDown />
                </Button>
              }
              handleItemClick={(href) => router.push(href)}
              setShowLogoutDialog={setShowLogoutDialog}
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
            <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout} 
              disabled={isLoggingOut}
              className="relative"
            >
              {isLoggingOut && (
                <Loader2 className="h-4 w-4 animate-spin absolute left-3" />
              )}
              {isLoggingOut ? "Logging out..." : "Logout"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminDashboardHeader

