"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/dashboard/admin/ui/input"
import { Textarea } from "@/components/dashboard/admin/ui/textarea"
import { Button } from "@/components/dashboard/admin/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/admin/ui/select"
import { Label } from "@/components/dashboard/admin/ui/label"
import Popup from "@/components/dashboard/admin/ui/Popup"

interface FormData {
  name: string
  email: string
  department: string
  issue: string
  subject: string
  message: string
}

export default function CreateTicketForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    department: "",
    issue: "",
    subject: "",
    message: ""
  })
  const [showPopup, setShowPopup] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault() 
    setTimeout(() => {
      setShowPopup(true)
      setTimeout(() => {
        setShowPopup(false)
        router.push("/admin/ticketdetails")
      }, 3000)
    }, 1000)
  }

  return (
    <div className="max-w-4xl  p-6 bg-white rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select
            // id="department"
            value={formData.department}
            onValueChange={(value) => setFormData({ ...formData, department: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin Department">Admin Department</SelectItem>
              <SelectItem value="Academic Department">Academic Department</SelectItem>
              <SelectItem value="Support Department">Support Department</SelectItem>
              <SelectItem value="Technical Department">Technical Department</SelectItem>
              <SelectItem value="Sales Department">Sales Department</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Issue */}
        <div className="space-y-2">
          <Label htmlFor="issue">Issue</Label>
          <Input
            id="issue"
            value={formData.issue}
            onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
            required
          />
        </div>


        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
            rows={6}
            required
          />
        </div>

        <Button type="submit" size="lg">
          Submit Ticket
        </Button>
      </form>
      {showPopup && <Popup message="Your ticket has been successfully submitted." onClose={() => setShowPopup(false)} />}
    </div>
  )
}
