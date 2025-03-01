"use client"

import { useState } from "react"
import type { Ticket } from "../types"
import { Input } from "@/components/dashboard/admin/ui/input"
import { Button } from "@/components/dashboard/admin/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/dashboard/admin/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/admin/ui/select"
import { FilterModal } from "../ticketfilter/index"
import { Search } from "lucide-react"

const SAMPLE_TICKETS: Ticket[] = [
  {
    id: "#htr-325-87756",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Admin Department",
    issue: "Login Issue",
    subject: "Login Details",
    message: "Unable to login with provided credentials.",
    lastUpdated: "2025/11/23 19:16",
    status: "Open",
  },
  {
    id: "#htr-329-37756",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Admin Department",
    issue: "Login Issue",
    subject: "Login Details",
    message: "Unable to login with provided credentials.",
    lastUpdated: "2025/11/23 19:16",
    status: "Open",
  },
  {
    id: "#htr-325-88756",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Admin Department",
    issue: "Login Issue",
    subject: "Login Details",
    message: "Unable to login with provided credentials.",
    lastUpdated: "2025/11/23 19:16",
    status: "Open",
  },
  {
    id: "#jtr-325-87756",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Admin Department",
    issue: "Login Issue",
    subject: "Login Details",
    message: "Unable to login with provided credentials.",
    lastUpdated: "2025/11/23 19:16",
    status: "Open",
  },
  {
    id: "#htr-399-87756",
    name: "John Doe",
    email: "john.doe@example.com",
    department: "Admin Department",
    issue: "Login Issue",
    subject: "Login Details",
    message: "Unable to login with provided credentials.",
    lastUpdated: "2025/11/23 19:16",
    status: "Open",
  },
  {
    id: "#htr-325-87757",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Support Department",
    issue: "Payment Issue",
    subject: "Payment Failed",
    message: "Payment failed during checkout.",
    lastUpdated: "2025/11/22 18:00",
    status: "Closed",
  },
  {
    id: "#htr-325-87758",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    department: "Technical Department",
    issue: "Bug Report",
    subject: "App Crash",
    message: "The app crashes when I try to open it.",
    lastUpdated: "2025/11/21 17:30",
    status: "In Progress",
  },
  {
    id: "#htr-325-87759",
    name: "Bob Brown",
    email: "bob.brown@example.com",
    department: "Sales Department",
    issue: "Inquiry",
    subject: "Product Inquiry",
    message: "I have a question about your product.",
    lastUpdated: "2025/11/20 16:45",
    status: "Open",
  },
]

interface FilterValues {
  departments?: string[]
  dateRange?: { from: Date | undefined; to: Date | undefined }
  status?: string[]
}

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
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.department.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleFilterChange = (filters: FilterValues) => {
    // Implement filter logic here
    console.log("Filters applied:", filters)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">My tickets</h2>
          <p className="text-sm text-muted-foreground">View and update tickets</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <Select defaultValue={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
            <FilterModal tickets={SAMPLE_TICKETS} onFilterChange={handleFilterChange} />
          </div>
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by Ticket ID, Department, Body..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">Ticket ID</TableHead>
                    <TableHead className="w-[200px]">Description</TableHead>
                    <TableHead className="w-[180px] hidden md:table-cell">Department</TableHead>
                    <TableHead className="w-[140px] hidden lg:table-cell">Last Updated</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="w-[120px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar">
              <Table>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id}</TableCell>
                      <TableCell>{ticket.subject}</TableCell>
                      <TableCell className="hidden md:table-cell">{ticket.department}</TableCell>
                      <TableCell className="hidden lg:table-cell">{ticket.lastUpdated}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          {ticket.status}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

