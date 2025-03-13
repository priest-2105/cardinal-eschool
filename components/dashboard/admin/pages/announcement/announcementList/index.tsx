"use client"

import type React from "react"

import { useState } from "react"
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

interface Announcement {
  id: string
  title: string
  content: string
  recipients: "students" | "tutors" | "both"
  status: "active" | "inactive" | "draft"
  expirationDate?: Date
  createdAt: Date
  updatedAt: Date
}

const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "End of Semester Examination Schedule",
    content: "The end of semester examinations will begin on December 15th...",
    recipients: "both",
    status: "active",
    expirationDate: new Date(2024, 11, 20),
    createdAt: new Date(2024, 2, 1),
    updatedAt: new Date(2024, 2, 1),
  },
  {
    id: "2",
    title: "Holiday Break Notice",
    content: "The school will be closed for the holiday break from December 23rd...",
    recipients: "both",
    status: "active",
    createdAt: new Date(2024, 2, 2),
    updatedAt: new Date(2024, 2, 2),
  },
  {
    id: "3",
    title: "New Course Registration",
    content: "Registration for new courses will open on January 5th...",
    recipients: "students",
    status: "draft",
    createdAt: new Date(2024, 2, 3),
    updatedAt: new Date(2024, 2, 3),
  },
  {
    id: "4",
    title: "Faculty Meeting",
    content: "There will be a faculty meeting on March 15th...",
    recipients: "tutors",
    status: "inactive",
    createdAt: new Date(2024, 2, 4),
    updatedAt: new Date(2024, 2, 4),
  },
]

export function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState(SAMPLE_ANNOUNCEMENTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [recipientFilter, setRecipientFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null)
  const router = useRouter()

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRecipient = recipientFilter === "all" || announcement.recipients === recipientFilter
    const matchesStatus = statusFilter === "all" || announcement.status === statusFilter
    return matchesSearch && matchesRecipient && matchesStatus
  })

  const handleCreateAnnouncement = () => {
    router.push("/admin/announcements/create")
  }

  const handleAnnouncementClick = (id: string) => {
    router.push(`/admin/announcements/${id}`)
  }

  const handleEditClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    router.push(`/admin/announcements/${id}/edit`)
  }

  const handleDeleteClick = (e: React.MouseEvent, announcement: Announcement) => {
    e.stopPropagation()
    setAnnouncementToDelete(announcement)
  }

  const confirmDelete = () => {
    if (announcementToDelete) {
      setAnnouncements(announcements.filter((a) => a.id !== announcementToDelete.id))
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
              <SelectItem value="students">Students Only</SelectItem>
              <SelectItem value="tutors">Tutors Only</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
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
                  Recipients: {announcement.recipients.charAt(0).toUpperCase() + announcement.recipients.slice(1)}
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
                Created: {format(announcement.createdAt, "MMM d, yyyy")}
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

      <AlertDialog open={!!announcementToDelete} onOpenChange={(open) => !open && setAnnouncementToDelete(null)}>
        <AlertDialogContent>
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

