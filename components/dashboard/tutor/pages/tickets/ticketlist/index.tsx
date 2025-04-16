"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { fetchTicketList } from "@/lib/api/tutor/api"
import { Input } from "@/components/dashboard/tutor/ui/input"
import { Button } from "@/components/dashboard/tutor/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/dashboard/tutor/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/tutor/ui/select"
import { Search } from "lucide-react"
// import { Pagination } from "@/src/components/ui/pagination"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/dashboard/tutor/ui/dialog"



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
  const [isSearching, setIsSearching] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    per_page: 15,
    total_pages: 1,
    total_items: 0
  })
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const loadTickets = async () => {
      if (!token) return
      
      setLoading(true)
      try {
        const filters: {status?: string, search?: string} = {};
        
        if (statusFilter !== "all") {
          filters.status = statusFilter;
        }
        
        if (searchQuery) {
          filters.search = searchQuery;
        }
        
        const response = await fetchTicketList(
          token, 
          pagination.current_page, 
          pagination.per_page,
          filters
        )
        
        setTickets(response.data.tickets)
        setPagination({
          current_page: response.data.current_page,
          per_page: response.data.per_page,
          total_pages: response.data.total_pages,
          total_items: response.data.total_items
        })
      } catch (error) {
        console.error("Failed to fetch tickets:", error)
      } finally {
        setLoading(false)
        setIsSearching(false)
      }
    }

    loadTickets()
  }, [token, pagination.current_page, pagination.per_page, searchQuery, statusFilter])

  const handlePageChange = (page: string) => {
    setPagination(prev => ({ ...prev, current_page: parseInt(page) }))
  }
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsSearching(true);
  }

  // Sort tickets after they're retrieved from API
  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  })

  const handleRowClick = (ticket: Ticket) => {
    if (window.innerWidth >= 1024) {
      router.push(`/tutor/ticket/${ticket.codec}`)
    } else {
      setSelectedTicket(ticket)
      setIsTicketModalOpen(true)
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">My Tickets</h2>
          <p className="text-sm text-muted-foreground">View and update tickets</p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Desktop Filters */}
          <div className="hidden lg:flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <Select defaultValue={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Filter Button for Mobile/Tablet */}
          {window.innerWidth < 1024 && (
            <Button
              className="w-full sm:w-auto"
              onClick={() => setIsFilterModalOpen(true)}
            >
              Filters
            </Button>
          )}

          <div className="relative flex-1 w-full sm:max-w-sm z-[1]">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by Ticket ID, Department, Subject..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-8 w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden z-[1]">
        {loading || isSearching ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1BC2C2] mr-3"></div>
            {searchQuery ? "Searching tickets..." : "Loading tickets..."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <Table>
                <TableHeader>
                  <TableRow>
                    {window.innerWidth >= 1024 && (
                      <>
                        <TableHead className="w-[20%]">Ticket ID</TableHead>
                        <TableHead className="w-[20%]">Subject</TableHead>
                        <TableHead className="w-[20%]">Department</TableHead>
                        <TableHead className="w-[20%]">Created At</TableHead>
                        <TableHead className="w-[20%]">Status</TableHead>
                      </>
                    )}
                    {window.innerWidth >= 768 && window.innerWidth < 1024 && (
                      <>
                        <TableHead className="w-[25%]">Ticket ID</TableHead>
                        <TableHead className="w-[25%]">Subject</TableHead>
                        <TableHead className="w-[25%]">Created At</TableHead>
                        <TableHead className="w-[25%]">Status</TableHead>
                      </>
                    )}
                    {window.innerWidth < 768 && (
                      <>
                        <TableHead className="w-[50%]">Subject</TableHead>
                        <TableHead className="w-[50%]">Status</TableHead>
                      </>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedTickets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center h-24">
                        {searchQuery ? `No results found for "${searchQuery}"` : "No ticket has been created"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedTickets.map((ticket) => (
                      <TableRow
                        key={ticket.codec}
                        onClick={() => handleRowClick(ticket)}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        {window.innerWidth >= 1024 && (
                          <>
                            <TableCell className="font-medium">{ticket.ticket_id}</TableCell>
                            <TableCell>{ticket.subject}</TableCell>
                            <TableCell>{ticket.department}</TableCell>
                            <TableCell>{new Date(ticket.created_at).toLocaleString()}</TableCell>
                            <TableCell>
                              <Button variant={ticket.status === "open" ? "default" : "warning"} size="sm">
                                {ticket.status}
                              </Button>
                            </TableCell>
                          </>
                        )}
                        {window.innerWidth >= 768 && window.innerWidth < 1024 && (
                          <>
                            <TableCell className="font-medium">{ticket.ticket_id}</TableCell>
                            <TableCell>{ticket.subject}</TableCell>
                            <TableCell>{new Date(ticket.created_at).toLocaleString()}</TableCell>
                            <TableCell>
                              <Button variant={ticket.status === "open" ? "default" : "warning"} size="sm">
                                {ticket.status}
                              </Button>
                            </TableCell>
                          </>
                        )}
                        {window.innerWidth < 768 && (
                          <>
                            <TableCell>{ticket.subject}</TableCell>
                            <TableCell>
                              <Button variant={ticket.status === "open" ? "default" : "warning"} size="sm">
                                {ticket.status}
                              </Button>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent className="bg-white max-w-[400px] w-[99%] rounded-md"> 
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Select defaultValue={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Latest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() => setIsFilterModalOpen(false)}
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket Details Modal */}
      <Dialog open={isTicketModalOpen} onOpenChange={setIsTicketModalOpen}>
        <DialogContent className="bg-white max-w-[400px] w-[99%] rounded-md">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <p className="font-medium">Ticket ID:</p>
            <p>{selectedTicket?.ticket_id}</p>
            <p className="font-medium">Subject:</p>
            <p>{selectedTicket?.subject}</p>
            <p className="font-medium">Department:</p>
            <p>{selectedTicket?.department}</p>
            <p className="font-medium">Created At:</p>
            <p>{selectedTicket?.created_at}</p>
            <p className="font-medium">Status:</p>
            <p>{selectedTicket?.status}</p>
            <p className="font-medium">Last Response:</p>
            <p>{selectedTicket?.last_response || "N/A"}</p>
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() =>
                router.push(`/tutor/ticket/${selectedTicket?.codec}`)
              }
            >
              View Full Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {!loading && !isSearching && pagination.total_pages > 1 && (
        <div className="flex justify-end p-4">
          <Select value={pagination.current_page.toString()} onValueChange={handlePageChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`Page ${pagination.current_page} of ${pagination.total_pages}`} />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                <SelectItem key={page} value={page.toString()}>
                  Page {page} of {pagination.total_pages}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}


