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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/lib/api/admin/api"
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/admin/ui/alert"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { cn } from "@/lib/utils"
import cardinalConfig from "@/config"

// Notification type definition
interface Notification {
  id: string
  title: string
  message: string
  type: "system" | "course" | "announcement" | "message"
  isRead: boolean
  isDone: boolean
  created_at: Date
  link?: string
}

export function NotificationList() {
  const router = useRouter()
  const token = useSelector((state: RootState) => state.auth?.token)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [notificationsToDelete, setNotificationsToDelete] = useState<string[]>([])
  const [isMarkingAsRead, setIsMarkingAsRead] = useState(false)
  const [isMarkingAllAsRead, setIsMarkingAllAsRead] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [processingNotificationId, setProcessingNotificationId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    last_page: 1,
    next_page_url: null,
    prev_page_url: null
  })

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  // Load notifications
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
          isDone: false,
          created_at: notification.created_at,
          link: notification.link || undefined,
        }))
        setNotifications(notificationsWithDates)
        setPagination(response.data.pagination)
      } catch (error: unknown) {
        console.error("Failed to fetch notifications:", error instanceof Error ? error.message : "Unknown error")
        setAlert({ type: "error", message: "Failed to load notifications." })
      } finally {
        setIsLoading(false)
      }
    }

    loadNotifications()
  }, [currentPage, token])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...notifications]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(query) || notification.message.toLowerCase().includes(query),
      )
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((notification) => notification.type === typeFilter)
    }

    // Apply status filter
    if (statusFilter === "read") {
      filtered = filtered.filter((notification) => notification.isRead)
    } else if (statusFilter === "unread") {
      filtered = filtered.filter((notification) => !notification.isRead)
    } else if (statusFilter === "done") {
      filtered = filtered.filter((notification) => notification.isDone)
    } else if (statusFilter === "not-done") {
      filtered = filtered.filter((notification) => !notification.isDone)
    }
    
    const parseDate = (dateStr) => {
      // Remove the "th", "st", "nd", "rd" from the day
      const cleanDateStr = dateStr.replace(/(\d+)(st|nd|rd|th)/, "$1");
      
      // Convert to a valid Date string
      const dateObj = new Date(cleanDateStr);
      
      return dateObj;
    };
    
    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = parseDate(a.created_at);
      const dateB = parseDate(b.created_at);
    
      if (sortOrder === "newest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
    
    setFilteredNotifications(filtered)
  }, [notifications, searchQuery, typeFilter, statusFilter, sortOrder])

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      // Deselect all
      setSelectedNotifications(new Set())
    } else {
      // Select all
      const newSelected = new Set<string>()
      filteredNotifications.forEach((notification) => {
        newSelected.add(notification.id)
      })
      setSelectedNotifications(newSelected)
    }
  }

  const toggleSelectNotification = (id: string) => {
    const newSelected = new Set(selectedNotifications)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedNotifications(newSelected)
  }

  // API Action handlers
  const handleMarkAsRead = async (id: string) => {
    if (!token) return
    setProcessingNotificationId(id)
    try {
      const response = await markNotificationAsRead(token, Number.parseInt(id))
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true, read_at: response.data.notification.read_at }
            : notification,
        ),
      )
      setAlert({ type: "success", message: "Notification marked as read." })
    } catch (error: unknown) {
      console.error("Failed to mark notification as read:", error instanceof Error ? error.message : "Unknown error")
      setAlert({ type: "error", message: "Failed to mark notification as read." })
    } finally {
      setProcessingNotificationId(null)
      loadNotifications()
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!token) return
    setIsMarkingAllAsRead(true)
    try {
      await markAllNotificationsAsRead(token)
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, isRead: true, read_at: new Date().toISOString() })),
      )
      setAlert({ type: "success", message: "All notifications marked as read." })
    } catch (error: unknown) {
      console.error("Failed to mark all notifications as read:", error instanceof Error ? error.message : "Unknown error")
      setAlert({ type: "error", message: "Failed to mark all notifications as read." })
    } finally {
      setIsMarkingAllAsRead(false)
      loadNotifications()
    }
  }

  const handleDeleteNotification = async (id: string) => {
    if (!token) return
    setProcessingNotificationId(id)
    try {
      await deleteNotification(token, Number.parseInt(id))
      setNotifications((prev) => prev.filter((notification) => notification.id !== id))
      setAlert({ type: "success", message: "Notification deleted successfully." })
    } catch (error: unknown) {
      console.error("Failed to delete notification:", error instanceof Error ? error.message : "Unknown error")
      setAlert({ type: "error", message: "Failed to delete notification." })
    } finally {
      setProcessingNotificationId(null)
    }
  }

  // Local state action handlers
  const markAsUnread = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (ids.includes(notification.id)) {
          return { ...notification, isRead: false }
        }
        return notification
      }),
    )
  }

  const markAsDone = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (ids.includes(notification.id)) {
          return { ...notification, isDone: true }
        }
        return notification
      }),
    )
  }

  const markAsNotDone = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (ids.includes(notification.id)) {
          return { ...notification, isDone: false }
        }
        return notification
      }),
    )
  }

  const confirmDelete = async () => {
    if (!token) return
    setIsDeleting(true)

    try {
      // Process each ID sequentially
      for (const id of notificationsToDelete) {
        await handleDeleteNotification(id)
      }

      setSelectedNotifications(new Set())

      setAlert({ type: "success", message: "Notifications deleted successfully." })
    } catch (error: unknown) {
      console.error("Failed to delete notifications:", error instanceof Error ? error.message : "Unknown error")
      setAlert({ type: "error", message: "Failed to delete notifications." })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setNotificationsToDelete([])
    }
  }

  const openDeleteDialog = (ids: string[]) => {
    setNotificationsToDelete(ids)
    setIsDeleteDialogOpen(true)
  }

  // Bulk action handlers
  const handleBulkAction = async (action: string) => {
    const selectedIds = Array.from(selectedNotifications)
    if (selectedIds.length === 0) return

    switch (action) {
      case "mark-read":
        setIsMarkingAsRead(true)
        try {
          // Process each ID sequentially
          for (const id of selectedIds) {
            // Only mark unread notifications as read
            const notification = notifications.find((n) => n.id === id)
            if (notification && !notification.isRead) {
              await handleMarkAsRead(id)
            }
          }
          setAlert({ type: "success", message: "Selected notifications marked as read." })
          setSelectedNotifications(new Set())
        } catch (error: unknown) {
          console.error("Failed to mark notifications as read:", error instanceof Error ? error.message : "Unknown error")
          setAlert({ type: "error", message: "Failed to mark some notifications as read." })
        } finally {
          setIsMarkingAsRead(false)
        }
        break
      case "delete":
        openDeleteDialog(selectedIds)
        break
      default:
        break
    }
  }

  // Individual action handlers
  const handleSingleAction = async (action: string, id: string) => {
    switch (action) {
      case "mark-read":
        await handleMarkAsRead(id)
        break
      case "mark-unread":
        markAsUnread([id])
        break
      case "mark-done":
        markAsDone([id])
        break
      case "mark-not-done":
        markAsNotDone([id])
        break
      case "delete":
        openDeleteDialog([id])
        break
      default:
        break
    }
  }

  const handleNotificationClick = (notification: any) => {
    if (!notification.data) return

    switch (notification.type) {
      case "ticket_updated":
        router.push(cardinalConfig.routes.dashboard.admin.adminticketdetails(notification.data.ticket_id))
        break
      case "class_created":
      case "resources_assigned":
        router.push(cardinalConfig.routes.dashboard.admin.courseDetails(notification.data.class_id))
        break
      default:
        
        break
    }
  }

  // Render notification type badge
  const renderTypeBadge = (type: string) => {
    switch (type) {
      case "system":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
            System
          </Badge>
        )
      case "course":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
            Course
          </Badge>
        )
      case "announcement":
        return (
          <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
            Announcement
          </Badge>
        )
      case "message":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
            Message
          </Badge>
        )
      default:
        return null
    }
  }

  // Render loading skeleton
  const renderSkeleton = () => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <div key={index} className="flex items-start gap-4 p-4 border-b">
          <Skeleton className="h-5 w-5 rounded" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      ))
  }

  // Render empty state
  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted/30 p-4 rounded-full mb-4">
          <Bell className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">No notifications found</h3>
        <p className="text-muted-foreground max-w-sm">
          {searchQuery || typeFilter !== "all" || statusFilter !== "all"
            ? "Try adjusting your filters to see more results."
            : "You don't have any notifications yet. They will appear here when you receive them."}
        </p>
        {(searchQuery || typeFilter !== "all" || statusFilter !== "all") && (
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setSearchQuery("")
              setTypeFilter("all")
              setStatusFilter("all")
            }}
          >
            Clear Filters
          </Button>
        )}
      </div>
    )
  }

  // Check if there are any unread notifications
  const hasUnreadNotifications = notifications.some((n) => !n.isRead)


  if(!notifications) { 
    return <div className="text-center py-12">Loading courses...</div>
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Notifications
          {!isLoading && (
            <Badge variant="secondary" className="ml-2">
              {notifications.filter((n) => !n.isRead).length}
            </Badge>
          )}
        </CardTitle>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notifications..."
              className="pl-9 w-full sm:w-[200px]"
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
            <DropdownMenuContent align="end" className="w-56 bg-white">
              <div className="p-2">
                <p className="text-sm font-medium mb-2">Type</p>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="course">Course</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="message">Message</SelectItem>
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
        {/* Mark All as Read button - always visible when there are unread notifications */}
        {hasUnreadNotifications && selectedNotifications.size === 0 && (
          <div className="flex items-center justify-end bg-muted/20 p-4 border-b">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="flex items-center"
              disabled={isMarkingAllAsRead}
            >
              {isMarkingAllAsRead ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span className="hidden sm:inline">Processing...</span>
                </span>
              ) : (
                <>
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Mark All as Read</span>
                </>
              )}
            </Button>
          </div>
        )}

        {/* Bulk Actions */}
        {selectedNotifications.size > 0 && (
          <div className="flex items-center justify-between bg-muted/20 p-4 border-b">
            <div className="flex items-center">
              <Checkbox
                checked={
                  selectedNotifications.size === filteredNotifications.length && filteredNotifications.length > 0
                }
                onCheckedChange={toggleSelectAll}
                id="select-all"
                className="mr-2"
              />
              <label htmlFor="select-all" className="text-sm font-medium">
                {selectedNotifications.size} selected
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("mark-read")}
                className="flex items-center"
                disabled={
                  isMarkingAsRead ||
                  !Array.from(selectedNotifications).some((id) => {
                    const notification = notifications.find((n) => n.id === id)
                    return notification && !notification.isRead
                  })
                }
              >
                {isMarkingAsRead ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="hidden sm:inline">Processing...</span>
                  </span>
                ) : (
                  <>
                    <Eye className="mr-1 h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Mark Read</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("delete")}
                className="flex items-center text-destructive"
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="p-0 max-h-[60vh] overflow-y-scroll custom-scrollbar divide-y">
          {isLoading
            ? renderSkeleton()
            : filteredNotifications.length === 0
              ? renderEmptyState()
              : filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start gap-4 p-4 hover:bg-muted/20 transition-colors cursor-pointer",
                      notification.isRead ? "bg-white" : "bg-gray-50"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <Checkbox
                      checked={selectedNotifications.has(notification.id)}
                      onCheckedChange={() => toggleSelectNotification(notification.id)}
                      id={`select-${notification.id}`}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${!notification.isRead ? "font-semibold" : ""}`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notification.message}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-white" align="end">
                            {!notification.isRead && (
                              <DropdownMenuItem
                                onClick={() => handleSingleAction("mark-read", notification.id)}
                                disabled={processingNotificationId === notification.id}
                              >
                                {processingNotificationId === notification.id ? (
                                  <span className="flex items-center">
                                    <svg
                                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    Processing...
                                  </span>
                                ) : (
                                  <>
                                    <Eye className="mr-2 h-4 w-4" />
                                    Mark as read
                                  </>
                                )}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleSingleAction("delete", notification.id)}
                              className="text-destructive"
                              disabled={processingNotificationId === notification.id}
                            >
                              {processingNotificationId === notification.id ? (
                                <span className="flex items-center">
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-destructive"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                  >
                                    <circle
                                      className="opacity-25"
                                      cx="12"
                                      cy="12"
                                      r="10"
                                      stroke="currentColor"
                                      strokeWidth="4"
                                    ></circle>
                                    <path
                                      className="opacity-75"
                                      fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                  </svg>
                                  Deleting...
                                </span>
                              ) : (
                                <>
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {renderTypeBadge(notification.type)}
                        <span className="text-xs text-muted-foreground">{notification.created_at}</span>
                        {notification.isDone && (
                          <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                            <CheckCheck className="mr-1 h-3 w-3" />
                            Done
                          </Badge>
                        )}
                        {notification.link && (
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                            View Details
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-white mt-8">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Notification{notificationsToDelete.length > 1 ? "s" : ""}</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete{" "}
                {notificationsToDelete.length > 1
                  ? `these ${notificationsToDelete.length} notifications`
                  : "this notification"}
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <Button onClick={confirmDelete} variant="danger" disabled={isDeleting}>
                {isDeleting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Delete"
                )}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
      </CardContent>

      {alert && (
        <Alert variant={alert.type === "success" ? "default" : "danger"} className="fixed z-50 top-16 bg-white right-4">
          <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
    </Card>
  )
}

