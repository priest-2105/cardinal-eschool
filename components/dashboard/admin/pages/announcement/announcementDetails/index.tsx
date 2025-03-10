"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calender"
import { format } from "date-fns"
import { ArrowLeft, CalendarIcon, Edit, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
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

const SAMPLE_ANNOUNCEMENT: Announcement = {
  id: "1",
  title: "End of Semester Examination Schedule",
  content: "The end of semester examinations will begin on December 15th...",
  recipients: "both",
  status: "active",
  expirationDate: new Date(2024, 11, 20),
  createdAt: new Date(2024, 2, 1),
  updatedAt: new Date(2024, 2, 1),
}

export function AnnouncementDetails() {
  const [announcement, setAnnouncement] = useState<Announcement>(SAMPLE_ANNOUNCEMENT)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(announcement.title)
  const [editedContent, setEditedContent] = useState(announcement.content)
  const [editedRecipients, setEditedRecipients] = useState(announcement.recipients)
  const [editedStatus, setEditedStatus] = useState(announcement.status)
  const [editedExpirationDate, setEditedExpirationDate] = useState<Date | undefined>(announcement.expirationDate)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()

  const handleBack = () => {
    router.push("/admin/announcements")
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedTitle(announcement.title)
    setEditedContent(announcement.content)
    setEditedRecipients(announcement.recipients)
    setEditedStatus(announcement.status)
    setEditedExpirationDate(announcement.expirationDate)
  }

  const handleSave = async () => {
    const updatedAnnouncement: Announcement = {
      ...announcement,
      title: editedTitle,
      content: editedContent,
      recipients: editedRecipients,
      status: editedStatus,
      expirationDate: editedExpirationDate,
      updatedAt: new Date(),
    }

    // Here you would typically send the update to your backend
    setAnnouncement(updatedAnnouncement)
    setIsEditing(false)
  }

  const handleDelete = () => {
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    // Here you would typically send a delete request to your backend
    router.push("/admin/announcements")
  }

  const handleStatusChange = (status: "active" | "inactive" | "draft") => {
    if (!isEditing) {
      const updatedAnnouncement: Announcement = {
        ...announcement,
        status,
        updatedAt: new Date(),
      }
      // Here you would typically send the update to your backend
      setAnnouncement(updatedAnnouncement)
    } else {
      setEditedStatus(status)
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
    <div className="max-w-4xl p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Announcements
        </Button>
        <div className="flex gap-2">
          {!isEditing && (
            <>
              <Button onClick={handleEdit} variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
              <Button onClick={handleDelete} variant="danger">
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{isEditing ? "Edit Announcement" : "Announcement Details"}</CardTitle>
            {!isEditing && getStatusBadge(announcement.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              {isEditing ? (
                <Input id="title" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} required />
              ) : (
                <p className="text-lg font-medium">{announcement.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              {isEditing ? (
                <Select
                  value={editedStatus}
                  onValueChange={(value: "active" | "inactive" | "draft") => setEditedStatus(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex gap-2 mt-1">
                  <Button
                    variant={announcement.status === "active" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange("active")}
                    className={announcement.status === "active" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    Active
                  </Button>
                  <Button
                    variant={announcement.status === "inactive" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange("inactive")}
                    className={announcement.status === "inactive" ? "bg-gray-600 hover:bg-gray-700" : ""}
                  >
                    Inactive
                  </Button>
                  <Button
                    variant={announcement.status === "draft" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange("draft")}
                    className={announcement.status === "draft" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    Draft
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              {isEditing ? (
                <Select
                  value={editedRecipients}
                  onValueChange={(value: "students" | "tutors" | "both") => setEditedRecipients(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select recipients" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="students">Students</SelectItem>
                    <SelectItem value="tutors">Tutors</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p>{announcement.recipients.charAt(0).toUpperCase() + announcement.recipients.slice(1)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Expiration Date (Optional)</Label>
              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !editedExpirationDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editedExpirationDate ? format(editedExpirationDate, "PPP") : "Select expiration date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={editedExpirationDate}
                      onSelect={setEditedExpirationDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <p>
                  {announcement.expirationDate
                    ? format(announcement.expirationDate, "MMMM d, yyyy")
                    : "No expiration date"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              {isEditing ? (
                <Textarea
                  id="content"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[200px]"
                  required
                />
              ) : (
                <p className="whitespace-pre-wrap">{announcement.content}</p>
              )}
            </div>

            <div className="text-sm text-gray-500">
              <p>Created: {format(announcement.createdAt, "MMMM d, yyyy")}</p>
              <p>Last updated: {format(announcement.updatedAt, "MMMM d, yyyy")}</p>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Save Changes</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
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

