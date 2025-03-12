"use client"

import { useState } from "react"
// import { useRouter } from "next/navigation"
import { Textarea } from "@/components/dashboard/tutor/ui/textarea"
import { Button } from "@/components/dashboard/tutor/ui/button"
import { Label } from "@/components/dashboard/tutor/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/tutor/ui/card"
import Popup from "@/components/dashboard/tutor/ui/Popup" 
// import { TicketReply } from "./TicketReply"
import type React from "react"

interface Reply {
  sender: "admin" | "you"
  content: string
  timestamp: string
}

interface Ticket {
  id: string
  title: string
  description: string
  priority: string
  status: string
  category: string
  department: string
  createdAt: string
  updatedAt: string
  userName: string
  userEmail: string
  replies: Reply[]
}

const SAMPLE_TICKET: Ticket = {
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
  userName: "John Doe",
  userEmail: "john.doe@example.com",
  replies: [
    {
      sender: "you",
      content: "Hi, I'm having trouble connecting to the internet. Can you help?",
      timestamp: "2023-09-15T14:30:00.000Z",
    },
    {
      sender: "admin",
      content: "Hello John, I'm sorry to hear that. Have you tried restarting your router?",
      timestamp: "2023-09-15T14:35:00.000Z",
    },
    {
      sender: "you",
      content: "Yes, I've tried that but it didn't work.",
      timestamp: "2023-09-15T14:40:00.000Z",
    },
  ],
}

export default function TicketDetailsComponent() {
  const [ticket, setTicket] = useState<Ticket>(SAMPLE_TICKET)
  const [reply, setReply] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_showConfirmModal, setShowConfirmModal] = useState(false)
  // const router = useRouter()

 

  const handleReply = async (event: React.FormEvent) => {
    event.preventDefault()
    const newReply: Reply = {
      sender: "admin",
      content: reply,
      timestamp: new Date().toISOString(),
    }
    setTicket((prevTicket) => ({
      ...prevTicket,
      replies: [...prevTicket.replies, newReply],
    }))
    setReply("")
    setPopupMessage("Your reply has been sent successfully.")
    setShowPopup(true)
    setTimeout(() => {
      setShowPopup(false)
    }, 2000)
  }

  const handleCloseTicket = async () => {
    setShowConfirmModal(true)
  }

  // const confirmCloseTicket = async () => {
  //   // Here you would typically send a request to close the ticket
  //   // await closeTicket(ticket.id);
  //   setTicket({ ...ticket, status: "Closed" })
  //   setShowConfirmModal(false)
  //   setPopupMessage("The ticket has been closed successfully.")
  //   setShowPopup(true)
  //   setTimeout(() => {
  //     setShowPopup(false)
  //     router.push("/admin/tickets")
  //   }, 2000)
  // }

  return (
    <div className="max-w-4xl p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Ticket #{ticket.id}</h2>
        <Button onClick={handleCloseTicket} variant="default">
          Reopen Ticket
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {/* <div>
              <Label className="font-semibold">User Name</Label>
              <p>{ticket.userName}</p>
            </div>
            <div>
              <Label className="font-semibold">User Email</Label>
              <p>{ticket.userEmail}</p>
            </div> */}
            <div>
              <Label className="font-semibold">Created At</Label>
              <p>{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <Label className="font-semibold">Last Updated</Label>
              <p>{new Date(ticket.updatedAt).toLocaleString()}</p>
            </div>
            <div>
              <Label className="font-semibold">Status</Label>
              <p>{ticket.status}</p>
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
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ticket Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{ticket.description}</p>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ticket History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ticket.replies.map((reply, index) => (
              <TicketReply key={index} sender={reply.sender} content={reply.content} timestamp={reply.timestamp} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Reply</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReply} className="space-y-4">
            <Textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Type your reply here..."
              rows={4}
            />
            <div className="flex justify-end">
              <Button type="submit">Send Reply</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {showPopup && <Popup message={popupMessage} onClose={() => setShowPopup(false)} />}
 
    </div>
  )
}



import { format } from "date-fns"

interface TicketReplyProps {
  sender: "admin" | "you"
  content: string
  timestamp: string
}

export function TicketReply({ sender, content, timestamp }: TicketReplyProps) {
  return (
    <div className="border-b border-gray-200 py-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold">{sender === "admin" ? "Support Staff" : "User"}</span>
        <span className="text-sm text-gray-500">{format(new Date(timestamp), "MMM d, yyyy HH:mm")}</span>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{content}</p>
    </div>
  )
}

