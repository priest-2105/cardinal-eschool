"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ArrowLeft, CalendarIcon, Edit } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Announcement {
  id: string
  title: string
  content: string
  recipients: "students" | "tutors" | "both"
  expirationDate?: Date
  createdAt: Date
  updatedAt: Date
}

const SAMPLE_ANNOUNCEMENT: Announcement = {
  id: "1",
  title: "End of Semester Examination Schedule",
  content: "The end of semester examinations will begin on December 15th...",
  recipients: "both",
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
  const [editedExpirationDate, setEditedExpirationDate] = useState<Date | undefined>(announcement.expirationDate)
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
    setEditedExpirationDate(announcement.expirationDate)
  }

  const handleSave = async () => {
    const updatedAnnouncement: Announcement = {
      ...announcement,
      title: editedTitle,
      content: editedContent,
      recipients: editedRecipients,
      expirationDate: editedExpirationDate,
      updatedAt: new Date(),
    }

    // Here you would typically send the update to your backend
    setAnnouncement(updatedAnnouncement)
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Announcements
        </Button>
        {!isEditing && (
          <Button onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" /> Edit Announcement
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Announcement" : "Announcement Details"}</CardTitle>
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
    </div>
  )
}

