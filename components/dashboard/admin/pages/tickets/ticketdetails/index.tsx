"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/dashboard/admin/ui/textarea"
import { Button } from "@/components/dashboard/admin/ui/button"
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
  customerName: "John Doe",
  customerEmail: "john.doe@example.com",
}

export default function TicketDetailsComponent() {
  const [ticket, setTicket] = useState(SAMPLE_TICKET)
  const [reply, setReply] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Here you would typically fetch the ticket details from an API
    // For now, we're using the sample ticket
    // fetchTicketDetails(ticketId).then(data => setTicket(data));
  }, [])

  const handleReply = async (event: React.FormEvent) => {
    event.preventDefault()
    // Here you would typically send the reply to an API
    // await sendReply(ticket.id, reply);
    setReply("")
    setPopupMessage("Your reply has been sent successfully.")
    setShowPopup(true)
    setTimeout(() => {
      setShowPopup(false)
    }, 2000)
  }

  const handleCloseTicket = async () => {
    setTicket({ ...ticket, status: "Closed" })
    setPopupMessage("The ticket has been closed successfully.")
    setShowPopup(true)
    setTimeout(() => {
      setShowPopup(false)
      router.push("/admin/tickets")  
    }, 2000)
  }

  return (
    <div className="max-w-4xl p-6 bg-white rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Ticket Details</h2>
        <Button onClick={handleCloseTicket} variant="danger">
          Close Ticket
        </Button>
      </div>
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
          <p>
            <strong>Status:</strong> {ticket.status}
          </p>
        </div>
      </div>
      <div className="space-y-4 mb-6">
        <div>
          <Label className="font-semibold">Title</Label>
          <p>{ticket.title}</p>
        </div>
        <div>
          <Label className="font-semibold">Description</Label>
          <p>{ticket.description}</p>
        </div>
        <div>
          <Label className="font-semibold">Priority</Label>
          <p>{ticket.priority}</p>
        </div>
        <div>
          <Label className="font-semibold">Category</Label>
          <p>{ticket.category}</p>
        </div>
        <div>
          <Label className="font-semibold">Department</Label>
          <p>{ticket.department}</p>
        </div>
      </div>

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

      {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
    </div>
  )
}

