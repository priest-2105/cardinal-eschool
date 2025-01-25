"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/dashboard/student/ui/input"
import { Textarea } from "@/components/dashboard/student/ui/textarea"
import { Button } from "@/components/dashboard/student/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/student/ui/select"
import { Label } from "@/components/dashboard/student/ui/label"
import Popup from "@/components/dashboard/student/ui/Popup"

interface Message {
  id: string
  sender: string
  content: string
  timestamp: string
  replyTo?: string
}

interface Ticket {
  id: string
  name: string
  email: string
  department: string
  issue: string
  subject: string
  messages: Message[]
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
  messages: [
    { id: "1", sender: "John Doe", content: "Unable to login with provided credentials.", timestamp: "2025/11/23 19:16" },
    { id: "2", sender: "Support", content: "Please try resetting your password.", timestamp: "2025/11/23 20:00", replyTo: "1" },
    { id: "3", sender: "John Doe", content: "I have tried that, but it still doesn't work.", timestamp: "2025/11/23 21:00", replyTo: "2" },
  ],
  status: "Open",
  lastUpdated: "2025/11/23 21:00",
}

export default function TicketDetailsComponent() {
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [newMessage, setNewMessage] = useState("")
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

  const handleAddMessage = () => {
    if (ticket && newMessage.trim()) {
      const newMsg: Message = {
        id: (ticket.messages.length + 1).toString(),
        sender: "John Doe",
        content: newMessage,
        timestamp: new Date().toISOString(),
      }
      setTicket({ ...ticket, messages: [...ticket.messages, newMsg] })
      setNewMessage("")
    }
  }

  if (!ticket) {
    return <div>Loading...</div>'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import cardinalConfig from '@/config'

const tabs = [
  {
    title: 'Ticket List',
    href: cardinalConfig.routes.dashboard.student.studentticketlist,
    exact: true
  },
  {
    title: 'Create a New Ticket',
    href: cardinalConfig.routes.dashboard.student.studentcreateticket,
  },

]

export default function TicketLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-full mx-auto px-4">
      <div className="border-b">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = tab.exact 
              ? pathname === tab.href
              : pathname?.startsWith(tab.href)

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "py-4 px-1 border-b-2 text-sm font-medium transition-colors hover:border-gray-300 hover:text-gray-700",
                  isActive
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500"
                )}
              >
                {tab.title}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-6">
        {children}
      </div>
    </div>
  )
}


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

        {/* Messages */}
        <div className="space-y-2">
          <Label>Messages</Label>
          <div className="space-y-4">
            {ticket.messages.map((message) => (
              <div key={message.id} className="relative pl-8">
                {message.replyTo && <div className="absolute left-0 top-0 h-full w-1 bg-gray-300"></div>}
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="font-semibold">{message.sender}</p>
                  <p className="text-sm text-gray-600">{message.content}</p>
                  <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Message */}
        <div className="space-y-2">
          <Label htmlFor="newMessage">Add a Message</Label>
          <Textarea
            id="newMessage"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={4}
          />
          <Button onClick={handleAddMessage}>Send Message</Button>
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
