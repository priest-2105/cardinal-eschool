"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { fetchTicketList } from "@/lib/api/student/ticket/fetchtickets"
import { Input } from "@/components/dashboard/student/ui/input"
import { Button } from "@/components/dashboard/student/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/dashboard/student/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/student/ui/select"
import { Search } from "lucide-react"

interface Ticket {
  codec: string
  ticket_id: string
  subject: string
  status: string
  department: string
  last_response: string | null
  responded_by: string | null
  created_at: string
}

interface Pagination {
  current_page: number
  per_page: number
  total_pages: number
  total_items: number
}

export function TicketList() {
  const token = useSelector((state: RootState) => state.auth?.token)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("latest")
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    per_page: 15,
    total_pages: 1,
    total_items: 0
  })
  const router = useRouter()

  useEffect(() => {
    const loadTickets = async () => {
      if (!token) return
      try {
        setLoading(true)
        const response = await fetchTicketList(token, pagination.current_page, pagination.per_page)
        setTickets(response.data.tickets)
        setPagination(response.data.pagination)
      } catch (error) {
        console.error("Failed to fetch tickets:", error)
      } finally {
        setLoading(false)
      }
    }

    loadTickets()
  }, [token, pagination.current_page, pagination.per_page])

  const handlePageChange = (page: string) => {
    setPagination(prev => ({ ...prev, current_page: parseInt(page) }))
  }

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })

  const filteredTickets = sortedTickets.filter(
    (ticket) =>
      ticket.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRowClick = (codec: string) => {
    router.push(`/student/ticket/${codec}`)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">My Tickets</h2>
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
          </div>
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by Ticket ID, Department, Subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-full">Loading tickets...</div>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%]">Ticket ID</TableHead>
                    <TableHead className="w-[20%]">Subject</TableHead>
                    <TableHead className="w-[20%]">Department</TableHead>
                    <TableHead className="w-[20%]">Created At</TableHead>
                    <TableHead className="w-[20%]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No ticket has been created
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTickets.map((ticket) => (
                      <TableRow
                        key={ticket.codec}
                        onClick={() => handleRowClick(ticket.codec)}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        <TableCell className="font-medium">{ticket.ticket_id}</TableCell>
                        <TableCell>{ticket.subject}</TableCell>
                        <TableCell>{ticket.department}</TableCell>
                        <TableCell>{new Date(ticket.created_at).toLocaleString()}</TableCell>
                        <TableCell>
                          <Button variant={ticket.status === "open" ? "default" : "warning"} size="sm">
                            {ticket.status}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {!loading && pagination.total_pages > 1 && (
        <div className="flex justify-end p-4">
          <Select value={pagination.current_page.toString()} onValueChange={handlePageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                <SelectItem key={page} value={page.toString()}>
                  Page {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}

