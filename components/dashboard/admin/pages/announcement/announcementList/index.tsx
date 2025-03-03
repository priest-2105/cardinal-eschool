"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Calendar, Edit } from "lucide-react"
import { format } from "date-fns"
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

const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "End of Semester Examination Schedule",
    content: "The end of semester examinations will begin on December 15th...",
    recipients: "both",
    expirationDate: new Date(2024, 11, 20),
    createdAt: new Date(2024, 2, 1),
    updatedAt: new Date(2024, 2, 1),
  },
  {
    id: "2",
    title: "Holiday Break Notice",
    content: "The school will be closed for the holiday break from December 23rd...",
    recipients: "both",
    createdAt: new Date(2024, 2, 2),
    updatedAt: new Date(2024, 2, 2),
  },
]

export function AnnouncementsList() {
  const [announcements, setAnnouncements] = useState(SAMPLE_ANNOUNCEMENTS)
  const [searchQuery, setSearchQuery] = useState("")
  const [recipientFilter, setRecipientFilter] = useState("all")
  const router = useRouter()

  const filteredAnnouncements = announcements.filter((announcement) => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRecipient = recipientFilter === "all" || announcement.recipients === recipientFilter
    return matchesSearch && matchesRecipient
  })

  const handleCreateAnnouncement = () => {
    router.push("/admin/announcements/create")
  }

  const handleAnnouncementClick = (id: string) => {
    router.push(`/admin/announcements/${id}`)
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcements</h1>
        <Button onClick={handleCreateAnnouncement}>
          <Plus className="mr-2 h-4 w-4" /> Create Announcement
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={recipientFilter} onValueChange={setRecipientFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by recipient" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Recipients</SelectItem>
            <SelectItem value="students">Students Only</SelectItem>
            <SelectItem value="tutors">Tutors Only</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>
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
                <h3 className="font-medium text-lg">{announcement.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Recipients: {announcement.recipients.charAt(0).toUpperCase() + announcement.recipients.slice(1)}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
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
      </div>
    </div>
  )
}

