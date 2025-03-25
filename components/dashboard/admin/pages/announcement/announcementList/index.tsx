"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Calendar, Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { getAnnouncements } from "@/lib/api/admin/announcement/announcementlist"
import { deleteAnnouncement } from "@/lib/api/admin/announcement/deleteannouncement"
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/admin/ui/alert"

interface Announcement {
  id: string
  title: string
  content: string
  target_role: "students" | "tutors" | "both"
  status: "active" | "inactive" | "draft"
  expirationDate?: Date
  created_at: Date
  created_by: stirng
  updated_at: Date
}

export function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [recipientFilter, setRecipientFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "danger"; message: string } | null>(null)
  const token = useSelector((state: RootState) => state.auth?.token)
  const router = useRouter()

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true)
      try {
        if (!token) throw new Error("Authentication token is missing")
        const data = await getAnnouncements(token)
        setAnnouncements(data)
      } catch (error: any) {
        console.error("Failed to fetch announcements:", error.message)
        setAlert({ type: "danger", message: error.message })
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [token])

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRecipient = recipientFilter === "all" || announcement.target_role === recipientFilter
    const matchesStatus = statusFilter === "all" || announcement.status === statusFilter
    return matchesSearch && matchesRecipient && matchesStatus
  })

  const handleCreateAnnouncement = () => {
    router.push("/admin/announcement/create")
  }

  const handleAnnouncementClick = (id: string) => {
    router.push(`/admin/announcement/${id}`)
  }

  const handleEditClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    router.push(`/admin/announcement/${id}`)
  }

  const handleDeleteClick = (e: React.MouseEvent, announcement: Announcement) => {
    e.stopPropagation()
    setAnnouncementToDelete(announcement)
  }

  const confirmDelete = async () => {
    if (!announcementToDelete || !token) return

    setLoading(true)
    setAlert(null)
    try {
      await deleteAnnouncement(token, Number(announcementToDelete.id))
      setAnnouncements(announcements.filter((a) => a.id !== announcementToDelete.id))
      setAlert({ type: "success", message: "Announcement deleted successfully!" })
    } catch (error: any) {
      console.error("Failed to delete announcement:", error.message)
      setAlert({ type: "danger", message: error.message })
    } finally {
      setLoading(false)
      setAnnouncementToDelete(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>
      case "draft":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Draft</Badge>
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      {alert && (
        <div className="fixed top-5 right-5 z-50 bg-white">
          <Alert variant={alert.type} onClose={() => setAlert(null)}>
            <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Button onClick={handleCreateAnnouncement}>
          <Plus className="mr-2 h-4 w-4" /> Create Announcement
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={recipientFilter} onValueChange={setRecipientFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by recipient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Recipients</SelectItem>
              <SelectItem value="student">Students Only</SelectItem>
              <SelectItem value="tutor">Tutors Only</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
          {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select> */}
        </div>
      </div>

      {loading ? (
       <div className="text-center py-12 border rounded-lg">
              <p className="text-gray-500">Loading</p>
            </div>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-x-hidden overflow-y-auto custom-scrollbar px-4">
          {filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleAnnouncementClick(announcement.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-lg">{announcement.title}</h3>
                    {getStatusBadge(announcement.status)}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Recipients: {announcement.target_role.charAt(0).toUpperCase() + announcement.target_role.slice(1)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={(e) => handleEditClick(e, announcement.id)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={(e) => handleDeleteClick(e, announcement)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{announcement.content}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {/* Created: {format(announcement.createdAt, "MMM d, yyyy")} */}
                  Created: {announcement.created_at}
                </div>
                {announcement.expirationDate && <div>Expires: {format(announcement.expirationDate, "MMM d, yyyy")}</div>}
              </div>
            </div>
          ))}

          {filteredAnnouncements.length === 0 && (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-gray-500">No announcements found</p>
            </div>
          )}
        </div>
      )}

      <AlertDialog open={!!announcementToDelete} onOpenChange={(open) => !open && setAnnouncementToDelete(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the announcement &quot;{announcementToDelete?.title}&quot;? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

