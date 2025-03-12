"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calender"
import { format } from "date-fns"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

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

export function CreateAnnouncement() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [recipients, setRecipients] = useState<"students" | "tutors" | "both">("both")
  const [status, setStatus] = useState<"active" | "inactive" | "draft">("draft")
  const [expirationDate, setExpirationDate] = useState<Date>()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const announcement: Omit<Announcement, "id" | "createdAt" | "updatedAt"> = {
      title,
      content,
      recipients,
      status,
      expirationDate,
    }

    // Here you would typically send the announcement to your backend
    console.log("Creating announcement:", announcement)

    // Navigate back to the announcements list
    router.push("/admin/announcements")
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Create Announcement</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Announcement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value: "active" | "inactive" | "draft") => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                Draft announcements are not visible to users. Active announcements are visible to the selected
                recipients.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipients">Recipients</Label>
              <Select
                value={recipients}
                onValueChange={(value: "students" | "tutors" | "both") => setRecipients(value)}
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
            </div>

            <div className="space-y-2">
              <Label>Expiration Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !expirationDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {expirationDate ? format(expirationDate, "PPP") : "Select expiration date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={expirationDate} onSelect={setExpirationDate} initialFocus />
                </PopoverContent>
              </Popover>
              <p className="text-sm text-muted-foreground">
                If set, the announcement will automatically become inactive after this date.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type your announcement here..."
                className="min-h-[200px]"
                required
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit">Create Announcement</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

