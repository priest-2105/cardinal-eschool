"use client"

import { useState } from "react"
import type { Ticket } from "../types"
import { Input } from "@/components/dashboard/student/ui/input"
import { Button } from "@/components/dashboard/student/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/dashboard/student/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/student/ui/select"
import { FilterModal } from "../ticketfilter/index"
import { Search } from "lucide-react"

// Sample data
const SAMPLE_TICKETS: Ticket[] = [
  {
    id: "#htr-325-87756",
    description: "Login Details",
    department: "Admin Department",
    lastUpdated: "2025/11/23 19:16",
    status: "Open",
  },
  {
    id: "#htr-325-87756",
    description: "Login Details",
    department: "Admin Department",
    lastUpdated: "2025/11/23 19:16",
    status: "Open",
  },
  {
    id: "#htr-325-87756",
    description: "Login Details",
    department: "Admin Department",
    lastUpdated: "2025/11/23 19:16",
    status: "Open",
  },
  {
    id: "#htr-325-87756",
    description: "Login Details",
    department: "Admin Department",
    lastUpdated: "2025/11/23 19:16",
    status: "Open",
  },
]

export function TicketList() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("latest")

  const sortedTickets = [...SAMPLE_TICKETS].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    }
    return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
  })

  const filteredTickets = sortedTickets.filter(
    (ticket) =>
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">My tickets</h2>
        <p className="text-sm text-muted-foreground">View and update tickets</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select defaultValue={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          <FilterModal />
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by Ticket ID, Department, Body..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticket ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>View Tickets</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTickets.map((ticket) => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id}</TableCell>
                <TableCell>{ticket.description}</TableCell>
                <TableCell>{ticket.department}</TableCell>
                <TableCell>{ticket.lastUpdated}</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    {ticket.status}
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    View Tickets
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

