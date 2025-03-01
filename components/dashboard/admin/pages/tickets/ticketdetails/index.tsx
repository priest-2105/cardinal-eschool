"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/dashboard/admin/ui/input"
import { Textarea } from "@/components/dashboard/admin/ui/textarea"
import { Button } from "@/components/dashboard/admin/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/admin/ui/select"
import { Label } from "@/components/dashboard/admin/ui/label"
import Popup from "@/components/dashboard/admin/ui/Popup"
import type React from "react"

const SAMPLE_TICKET = {
  id: "7e19c06b-1c1f-4a91-b94c-74dd9a13aa07",
  title: "Unable to connect to the internet",
  description:
    "I have been unable to connect to the internet for the past few hours. I have tried restarting my computer and modem, but nothing seems to work.",
  priority: "High",
  status: "Open",
  category: "Technical",
  department: "Technical Department",
  createdAt: "2023-09-15T14:30:00.000Z",
  updatedAt: "2023-09-15T14:30:00.000Z",
  assignedTo: "",
  customerName: "John Doe",
  customerEmail: "john.doe@example.com",
}

export default function TicketDetailsComponent() {
  const [ticket, setTicket] = useState(SAMPLE_TICKET)
  const [reply, setReply] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Here you would typically fetch the ticket details from an API
    // For now, we're using the sample ticket
    // fetchTicketDetails(ticketId).then(data => setTicket(data));
  }, [])

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the updated ticket details to an API
    // await updateTicket(ticket.id, ticket);
    setShowPopup(true)
    setTimeout(() => {
      setShowPopup(false)
      router.push("/dashboard/admin/tickets") // Redirect to the tickets page
    }, 2000)
  }

  const handleReply = async (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the reply to an API
    // await sendReply(ticket.id, reply);
    setReply("")
    setShowPopup(true)
    setTimeout(() => {
      setShowPopup(false)
    }, 2000)
  }

  return (
    <div className="max-w-4xl p-6 bg-white rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Ticket Details</h2>
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <p>
            <strong>Customer Name:</strong> {ticket.customerName}
          </p>
          <p>
            <strong>Customer Email:</strong> {ticket.customerEmail}
          </p>
          <p>
            <strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}
          </p>
        </div>
        <div>
          <p>
            <strong>Ticket ID:</strong> {ticket.id}
          </p>
          <p>
            <strong>Last Updated:</strong> {new Date(ticket.updatedAt).toLocaleString()}
          </p>
        </div>
      </div>
      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={ticket.title} onChange={(e) => setTicket({ ...ticket, title: e.target.value })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={ticket.description}
            onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={ticket.priority} onValueChange={(value) => setTicket({ ...ticket, priority: value })}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={ticket.status} onValueChange={(value) => setTicket({ ...ticket, status: value })}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={ticket.category} onValueChange={(value) => setTicket({ ...ticket, category: value })}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Technical">Technical</SelectItem>
                <SelectItem value="Billing">Billing</SelectItem>
                <SelectItem value="General">General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Select value={ticket.department} onValueChange={(value) => setTicket({ ...ticket, department: value })}>
              <SelectTrigger id="department">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Input
            id="assignedTo"
            value={ticket.assignedTo}
            onChange={(e) => setTicket({ ...ticket, assignedTo: e.target.value })}
            placeholder="Enter name or email of assignee"
          />
        </div>

        <Button type="submit">Update Ticket</Button>
      </form>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Reply to Customer</h3>
        <form onSubmit={handleReply} className="space-y-4">
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type your reply here..."
            rows={4}
          />
          <Button type="submit">Send Reply</Button>
        </form>
      </div>

      {showPopup && <Popup message="Your changes have been successfully saved." onClose={() => setShowPopup(false)} />}
    </div>
  )
}

