"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import pusher from "@/utils/pusher"
import { fetchNotifications } from "@/lib/api/admin/api"

interface NotificationBadgeProps {
  onViewAll?: () => void
}

export function NotificationBadge({ onViewAll }: NotificationBadgeProps) {
  const token = useSelector((state: RootState) => state.auth?.token)
  const userId = useSelector((state: RootState) => state.auth?.user?.id)
  const [unreadCount, setUnreadCount] = useState(0)
  const [recentNotifications, setRecentNotifications] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Load initial notifications
  useEffect(() => {
    const loadNotifications = async () => {
      if (!token) return
      try {
        const response = await fetchNotifications(token, 1, 5)
        const notifications = response.data.notifications || []

        // Set recent notifications
        setRecentNotifications(notifications.slice(0, 5))

        // Count unread notifications
        const unreadNotifications = notifications.filter((n: any) => !n.read_at)
        setUnreadCount(unreadNotifications.length)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    loadNotifications()
  }, [token])

  // Subscribe to Pusher channel for real-time notifications
  useEffect(() => {
    if (!userId) return

    // Format the channel name correctly
    const channelName = `private-user.${userId}`

    // Subscribe to the user's private channel
    const channel = pusher.subscribe(channelName)

    // Listen for the 'notification.created' event
    channel.bind("notification.created", (data: any) => {
      // Add the new notification to the recent list
      setRecentNotifications((prev) => {
        const newNotifications = [data, ...prev.slice(0, 4)]
        return newNotifications
      })

      // Increment unread count
      setUnreadCount((prev) => prev + 1)
    })

    // Cleanup on unmount
    return () => {
      channel.unbind("notification.created")
      pusher.unsubscribe(channelName)
    }
  }, [userId])

  // Mark notifications as read when opening popover
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)

    // If opening the popover, we could mark notifications as read here
    // This is optional and depends on your UX requirements
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 px-1.5 h-5 min-w-[20px] flex items-center justify-center bg-red-500 text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && <Badge variant="secondary">{unreadCount} new</Badge>}
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {recentNotifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No notifications yet</div>
          ) : (
            <div className="divide-y">
              {recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-muted/20 ${!notification.read_at ? "bg-muted/10" : ""}`}
                >
                  <h4 className={`text-sm ${!notification.read_at ? "font-semibold" : "font-medium"}`}>
                    {notification.title || "Notification"}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notification.message || notification.content || ""}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(notification.created_at).toLocaleString()}
                    </span>
                    {notification.link && (
                      <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                        View
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {recentNotifications.length > 0 && (
          <div className="p-3 border-t">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsOpen(false)
                onViewAll?.()
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

