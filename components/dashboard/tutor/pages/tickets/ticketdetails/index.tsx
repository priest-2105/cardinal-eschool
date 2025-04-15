"use client"

import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { fetchTicketDetails } from "@/lib/api/tutor/api"
import { Textarea } from "@/components/dashboard/tutor/ui/textarea"
import { Button } from "@/components/dashboard/tutor/ui/button"
import { Label } from "@/components/dashboard/tutor/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/dashboard/tutor/ui/card"
import Popup from "@/components/dashboard/tutor/ui/Popup"
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

export default function TicketDetailsComponent({ ticketCodec }: { ticketCodec: string }) {
  const token = useSelector((state: RootState) => state.auth?.token)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [reply, setReply] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const [popupMessage, setPopupMessage] = useState("")
  const [, setShowConfirmModal] = useState(false)

  useEffect(() => {
    const loadTicketDetails = async () => {
      if (!token) {
        setPopupMessage("You must be logged in to view ticket details.")
        setShowPopup(true)
        return
      }

      try {
        const response = await fetchTicketDetails(token, ticketCodec)
        setTicket({
          id: response.data.ticket_id,
          title: response.data.subject,
          description: response.data.body,
          priority: "N/A",
          status: response.data.status,
          category: "N/A",
          department: response.data.department,
          createdAt: response.data.created_at,
          updatedAt: response.data.updated_at,
          userName: response.data.user_fullname,
          userEmail: response.data.user_email,
          replies: [],
        })
      } catch (error) {
        console.error("Failed to load ticket details:", error)
        setPopupMessage((error as Error).message || "Failed to load ticket details.")
        setShowPopup(true)
      }
    }

    loadTicketDetails()
  }, [token, ticketCodec])

  if (!ticket) {
    return <div>Loading ticket details...</div>
  }

  const handleReply = async (event: React.FormEvent) => {
    event.preventDefault()
    const newReply: Reply = {
      sender: "admin",
      content: reply,
      timestamp: new Date().toISOString(),
    }
    setTicket((prevTicket) => {
      if (!prevTicket) return null // Ensure prevTicket is not null
      return {
        ...prevTicket,
        replies: [...prevTicket.replies, newReply],
      }
    })
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

  return (
    <div className="max-w-4xl p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Ticket #{ticket.id}</h2>
        {ticket.status.toLowerCase() !== "open" && (
          <Button onClick={handleCloseTicket} variant="default">
            Reopen Ticket
          </Button>
        )}
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ticket Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 max-sm:grid-cols-1">
            <div className="max-sm:block">
              <Label className="font-semibold">User Name</Label>
              <p className="break-words">{ticket.userName}</p>
            </div>
            <div className="max-sm:block">
              <Label className="font-semibold">User Email</Label>
              <p className="break-words">{ticket.userEmail}</p>
            </div>
            <div className="max-sm:block">
              <Label className="font-semibold">Created At</Label>
              <p className="break-words">{new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
            <div className="max-sm:block">
              <Label className="font-semibold">Last Updated</Label>
              <p className="break-words">{new Date(ticket.updatedAt).toLocaleString()}</p>
            </div>
            <div className="max-sm:block">
              <Label className="font-semibold">Status</Label>
              <p className="break-words">{ticket.status}</p>
            </div>
            <div className="max-sm:block">
              <Label className="font-semibold">Department</Label>
              <p className="break-words">{ticket.department}</p>
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
    <div className="border-b border-gray-200 py-4 max-sm:block">
      <div className="flex justify-between items-center mb-2 max-sm:flex-col max-sm:items-start">
        <span className="font-semibold">{sender === "admin" ? "Support Staff" : "User"}</span>
        <span className="text-sm text-gray-500 max-sm:mt-1">{format(new Date(timestamp), "MMM d, yyyy HH:mm")}</span>
      </div>
      <p className="text-gray-700 whitespace-pre-wrap break-words">{content}</p>
    </div>
  )
}

