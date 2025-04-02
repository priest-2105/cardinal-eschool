"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, CheckCheck, Eye, Filter, MoreHorizontal, Search, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, 
         AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, 
         deleteNotification } from "@/lib/api/student/api"
import { cn } from "@/lib/utils"
import cardinalConfig from "@/config"

interface Notification {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  created_at: string
  data?: {
    class_id?: number
    assignment_id?: number
    announcement_id?: number
  }
}

export default function NotificationsPage() {
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth?.token)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set())
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [notificationsToDelete, setNotificationsToDelete] = useState<string[]>([])
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false)
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [processingNotificationId, setProcessingNotificationId] = useState<string | null>(null)

  useEffect(() => {
    const loadNotifications = async () => {
      if (!token) return
      try {
        setIsLoading(true)
        const response = await fetchNotifications(token, currentPage)
        const notificationsWithDates = response.data.notifications.map((notification: any) => ({
          ...notification,
          id: notification.id.toString(),
          title: notification.title || "Notification",
          message: notification.message || notification.content || "",
          type: notification.type || "system",
          isRead: !!notification.read_at,
          created_at: notification.created_at,
        }))
        setNotifications(notificationsWithDates)
        setPagination(response.data.pagination)
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
        setAlert({ type: "error", message: "Failed to load notifications." })
      } finally {
        setIsLoading(false)
      }
    }

    loadNotifications()
  }, [currentPage, token])

  // Handle mark as read
  const handleMarkAsRead = async (id: string) => {
    if (!token) return
    setProcessingNotificationId(id)
    try {
      await markNotificationAsRead(token, Number(id))
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      )
      setAlert({ type: "success", message: "Notification marked as read." })
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
      setAlert({ type: "error", message: "Failed to mark notification as read." })
    } finally {
      setProcessingNotificationId(null)
    }
  }

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    if (!token) return
    setIsMarkingAllAsRead(true)
    try {
      await markAllNotificationsAsRead(token)
      setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })))
      setAlert({ type: "success", message: "All notifications marked as read." })
    } catch (error) {
      console.error("Failed to mark all as read:", error)
      setAlert({ type: "error", message: "Failed to mark all notifications as read." })
    } finally {
      setIsMarkingAllAsRead(false)
    }
  }

  // Handle delete notification
  const handleDeleteNotification = async (id: string) => {
    if (!token) return
    setProcessingNotificationId(id)
    try {
      await deleteNotification(token, Number(id))
      setNotifications(prev => prev.filter(notification => notification.id !== id))
      setAlert({ type: "success", message: "Notification deleted successfully." })
    } catch (error) {
      console.error("Failed to delete notification:", error)
      setAlert({ type: "error", message: "Failed to delete notification." })
    } finally {
      setProcessingNotificationId(null)
    }
  }

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!notification.title.toLowerCase().includes(query) && 
          !notification.message.toLowerCase().includes(query)) {
        return false
      }
    }

    if (typeFilter !== "all" && notification.type !== typeFilter) {
      return false
    }

    if (statusFilter === "read" && !notification.isRead) {
      return false
    }

    if (statusFilter === "unread" && notification.isRead) {
      return false
    }

    return true
  }).sort((a, b) => {
    const dateA = new Date(a.created_at)
    const dateB = new Date(b.created_at)
    return sortOrder === "newest" ? dateB.getTime() - dateA.getTime() : dateA.getTime() - dateB.getTime()
  })

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardTitle>Notifications</CardTitle>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Type</p>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="assignment">Assignment</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="grade">Grade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Status</p>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Sort</p>
                <Select value={sortOrder} onValueChange={(value: "newest" | "oldest") => setSortOrder(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        {/* Notifications List */}
        <div className="space-y-4">
          {isLoading ? (
            <div>Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-8">No notifications found</div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 border rounded-lg",
                  notification.isRead ? "bg-white" : "bg-gray-50"
                )}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-gray-600 mt-1">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge>{notification.type}</Badge>
                      <span className="text-sm text-gray-500">{notification.created_at}</span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {!notification.isRead && (
                        <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                          Mark as read
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleDeleteNotification(notification.id)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {!isLoading && notifications.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {(pagination.current_page - 1) * pagination.per_page + 1} 
              - {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total} notifications
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <select
                className="border rounded-md px-2 py-1 text-sm"
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
              >
                {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map((page) => (
                  <option key={page} value={page}>
                    Page {page} of {pagination.last_page}
                  </option>
                ))}
              </select>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                disabled={currentPage === pagination.last_page}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Alert Dialog for Success/Error messages */}
        {alert && (
          <Alert
            variant={alert.type === "success" ? "default" : "destructive"}
            className="fixed bottom-4 right-4 w-auto"
          >
            <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}

