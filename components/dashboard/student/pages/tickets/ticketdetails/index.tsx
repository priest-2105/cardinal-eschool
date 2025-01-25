"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/dashboard/student/ui/input"
import { Textarea } from "@/components/dashboard/student/ui/textarea"
import { Button } from "@/components/dashboard/student/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/student/ui/select"
import { Label } from "@/components/dashboard/student/ui/label"
import Popup from "@/components/dashboard/student/ui/Popup"

interface Ticket {
  id: string
  name: string
  email: string
  department: string
  issue: string
  subject: string
  message: string
  status: string
  lastUpdated: string
}

const SAMPLE_TICKET: Ticket = {
  id: "#htr-325-87756",
  name: "John Doe",
  email: "john.doe@example.com",
  department: "Admin Department",
  issue: "Login Issue",
  subject: "Login Details",
  message: "Unable to login with provided credentials.",
  status: "Open",
  lastUpdated: "2025/11/23 19:16",
}

export default function TicketDetailsComponent() {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [showPopup, setShowPopup] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Simulate fetching ticket details
    setTimeout(() => {
      setTicket(SAMPLE_TICKET)
    }, 1000)
  }, [])

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate ticket update
    setTimeout(() => {
      setShowPopup(true)
      setTimeout(() => {
        setShowPopup(false)
        router.push("/dashboard/student/ticketdetails")
      }, 3000)
    }, 1000)
  }

  if (!ticket) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-4xl p-6 bg-white rounded-lg">
      <form onSubmit={handleUpdate} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={ticket.name}
              readOnly
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={ticket.email}
              readOnly
            />
          </div>
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select
            id="department"
            value={ticket.department}
            readOnly
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin Department">Admin Department</SelectItem>
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
            value={ticket.issue}
            readOnly
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={ticket.subject}
            readOnly
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={ticket.message}
            readOnly
            rows={6}
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            id="status"
            value={ticket.status}
            onValueChange={(value) => setTicket({ ...ticket, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" fullWidth size="lg">
          Update Ticket
        </Button>
      </form>
      {showPopup && <Popup message="Your ticket has been successfully updated." onClose={() => setShowPopup(false)} />}
    </div>
  )
}
