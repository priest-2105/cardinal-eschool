"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { Bell, Check, CheckCheck, Eye, EyeOff, Filter, MoreHorizontal, Search, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/drodown"
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
import { Badge } from "@/components/ui/badge"
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } from "@/lib/api/tutor/api";
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/tutor/ui/alert";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

// Notification type definition
interface Notification {
  id: string
  title: string
  message: string
  type: "system" | "course" | "announcement" | "message"
  isRead: boolean
  isDone: boolean
  createdAt: Date
  link?: string
}

// Sample notification data
const SAMPLE_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    title: "System Maintenance",
    message: "The system will be down for maintenance on Saturday from 2 AM to 4 AM.",
    type: "system",
    isRead: false,
    isDone: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30), 
  },
  {
    id: "2",
    title: "New Course Available",
    message: "Introduction to React has been added to your available courses.",
    type: "course",
    isRead: true,
    isDone: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), 
    link: "/courses/react-intro",
  },
  {
    id: "3",
    title: "Assignment Due",
    message: "Your JavaScript Fundamentals assignment is due tomorrow.",
    type: "course",
    isRead: false,
    isDone: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), 
    link: "/courses/javascript/assignments",
  },
  {
    id: "4",
    title: "End of Semester Announcement",
    message: "The semester will end on December 15th. Please complete all assignments by then.",
    type: "announcement",
    isRead: true,
    isDone: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
]

export function NotificationList() {
  const token = useSelector((state: RootState) => state.auth?.token);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [notificationsToDelete, setNotificationsToDelete] = useState<string[]>([])

  useEffect(() => {
    const loadNotifications = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        const response = await fetchNotifications(token);
        const notificationsWithDates = response.data.notifications.map((notification: any) => ({
          ...notification,
          createdAt: new Date(notification.created_at), 
        }));
        setNotifications(notificationsWithDates);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
        setAlert({ type: 'error', message: "Failed to load notifications." });
      } finally {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [token]);

  const handleMarkAsRead = async (id: number) => {
    if (!token) return;
    try {
      await markNotificationAsRead(token, id);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id.toString() ? { ...notification, read_at: new Date().toISOString() } : notification
        )
      );
      setAlert({ type: 'success', message: "Notification marked as read." });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      setAlert({ type: 'error', message: "Failed to mark notification as read." });
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;
    try {
      await markAllNotificationsAsRead(token);
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read_at: new Date().toISOString() }))
      );
      setAlert({ type: 'success', message: "All notifications marked as read." });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      setAlert({ type: 'error', message: "Failed to mark all notifications as read." });
    }
  };

  const handleDeleteNotification = async (id: number) => {
    if (!token) return;
    try {
      await deleteNotification(token, id);
      setNotifications((prev) => prev.filter((notification) => notification.id !== id.toString()));
      setAlert({ type: 'success', message: "Notification deleted successfully." });
    } catch (error) {
      console.error("Failed to delete notification:", error);
      setAlert({ type: 'error', message: "Failed to delete notification." });
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...notifications]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (notification) =>
          notification.title.toLowerCase().includes(query) || notification.message.toLowerCase().includes(query)
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

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortOrder === "newest") {
        return b.createdAt.getTime() - a.createdAt.getTime()
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime()
      }
    })
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

  // Action handlers
  const markAsRead = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (ids.includes(notification.id)) {
          return { ...notification, isRead: true }
        }
        return notification
      })
    )
  }

  const markAsUnread = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (ids.includes(notification.id)) {
          return { ...notification, isRead: false }
        }
        return notification
      })
    )
  }

  const markAsDone = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (ids.includes(notification.id)) {
          return { ...notification, isDone: true }
        }
        return notification
      })
    )
  }

  const markAsNotDone = (ids: string[]) => {
    setNotifications((prev) =>
      prev.map((notification) => {
        if (ids.includes(notification.id)) {
          return { ...notification, isDone: false }
        }
        return notification
      })
    )
  }

  const confirmDelete = () => {
    setNotifications((prev) => prev.filter((notification) => !notificationsToDelete.includes(notification.id)))
    setSelectedNotifications((prev) => {
      const newSelected = new Set(prev)
      notificationsToDelete.forEach((id) => {
        newSelected.delete(id)
      })
      return newSelected
    })
    setIsDeleteDialogOpen(false)
    setNotificationsToDelete([])
  }

  const openDeleteDialog = (ids: string[]) => {
    setNotificationsToDelete(ids)
    setIsDeleteDialogOpen(true)
  }

  // Bulk action handlers
  const handleBulkAction = (action: string) => {
    const selectedIds = Array.from(selectedNotifications)
    if (selectedIds.length === 0) return
    switch (action) {
      case "mark-read":
        markAsRead(selectedIds)
        break
      case "mark-unread":
        markAsUnread(selectedIds)
        break
      case "mark-done":
        markAsDone(selectedIds)
        break
      case "mark-not-done":
        markAsNotDone(selectedIds)
        break
      case "delete":
        openDeleteDialog(selectedIds)
        break
      default:
        break
    }
  }

  // Individual action handlers
  const handleSingleAction = (action: string, id: string) => {
    switch (action) {
      case "mark-read":
        markAsRead([id])
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
            <DropdownMenuContent align="end" className="w-56">
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
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="not-done">Not Done</SelectItem>
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
      <CardContent className="p-0">
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
              >
                <Eye className="mr-1 h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mark Read</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("mark-unread")}
                className="flex items-center"
              >
                <EyeOff className="mr-1 h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mark Unread</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkAction("mark-done")}
                className="flex items-center"
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mark Done</span>
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
        <div className="divide-y">
          {isLoading
            ? renderSkeleton()
            : filteredNotifications.length === 0
              ? renderEmptyState()
              : filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 ${
                      !notification.isRead ? "bg-muted/10" : ""
                    } hover:bg-muted/20 transition-colors`}
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
                          <DropdownMenuContent align="end">
                            {notification.isRead ? (
                              <DropdownMenuItem onClick={() => handleSingleAction("mark-unread", notification.id)}>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Mark as unread
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleSingleAction("mark-read", notification.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Mark as read
                              </DropdownMenuItem>
                            )}
                            {notification.isDone ? (
                              <DropdownMenuItem onClick={() => handleSingleAction("mark-not-done", notification.id)}>
                                <X className="mr-2 h-4 w-4" />
                                Mark as not done
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem onClick={() => handleSingleAction("mark-done", notification.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                Mark as done
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleSingleAction("delete", notification.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        {renderTypeBadge(notification.type)}
                        <span className="text-xs text-muted-foreground">
                          {/* {formatDistanceToNow(notification.createdAt, { addSuffix: true })} */}
                        </span>
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
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button onClick={confirmDelete} variant="danger" className="bg-destructive text-destructive-foreground">
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>

      {alert && (
        <Alert variant={alert.type === 'success' ? 'default' : 'danger'} className="absolute top-4 right-4">
          <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
    </Card>
  )
}

