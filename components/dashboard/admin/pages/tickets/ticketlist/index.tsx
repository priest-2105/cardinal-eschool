"use client"

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { fetchTicketList } from "@/lib/api/admin/ticket/fetchtickets";
import type { Ticket } from "../types";
import { Input } from "@/components/dashboard/admin/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/dashboard/admin/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/admin/ui/select";
import { FilterModal } from "../ticketfilter/index";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";

interface FilterValues {
    departments?: string[];
    dateRange?: { from: Date | undefined; to: Date | undefined };
    status?: string[];
}

export function TicketList() {
    const token = useSelector((state: RootState) => state.auth?.token);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const [filters, setFilters] = useState<FilterValues>({});
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedTicketId, setSelectedTicketId] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");

    // Compute unique options for filters
    const uniqueTicketIds = useMemo(() => Array.from(new Set(tickets.map(t => t.ticket_id))), [tickets]);
    const uniqueStatuses = useMemo(() => Array.from(new Set(tickets.map(t => t.status))), [tickets]);
    const uniqueDepartments = useMemo(() => Array.from(new Set(tickets.map(t => t.department))), [tickets]);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                if (!token) {
                    console.error("Token is missing");
                    return;
                }

                const response = await fetchTicketList(token, currentPage, 15, {
                    status: selectedStatus !== "all" ? selectedStatus : undefined,
                    ticket_id: selectedTicketId !== "all" ? selectedTicketId : undefined,
                    department: selectedDepartment !== "all" ? selectedDepartment : undefined,
                });

                setTickets(response.data.tickets || []);
                setTotalPages(response.data.pagination.total_pages);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };

        fetchTickets();
    }, [token, currentPage, selectedStatus, selectedTicketId, selectedDepartment]);

    const handleFilterChange = (newFilters: FilterValues) => {
        setFilters(newFilters);
    };

    const handleRowClick = (codec: string) => {
        router.push(`/admin/ticket/${codec}`);
    };

    const filteredTickets = tickets.filter((ticket) =>
        ticket.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full">
            <div className="space-y-4 p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-xl sm:text-2xl font-semibold">Manage tickets</h2>
                    <p className="text-sm text-muted-foreground">View and update tickets</p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <Select value={selectedTicketId} onValueChange={setSelectedTicketId}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Ticket ID" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Ticket IDs</SelectItem>
                                {uniqueTicketIds.map(ticketId => (
                                    <SelectItem key={ticketId} value={ticketId}>{ticketId}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Statuses</SelectItem>
                                {uniqueStatuses.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                                <SelectValue placeholder="Department" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {uniqueDepartments.map(dept => (
                                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
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
                <div className="overflow-x-auto max-h-[65vh]">
                    <div className="inline-block min-w-full align-middle">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[15%]">Ticket ID</TableHead>
                                    <TableHead className="w-[20%]">User</TableHead>
                                    <TableHead className="w-[20%]">Subject</TableHead>
                                    <TableHead className="w-[15%]">Department</TableHead>
                                    <TableHead className="w-[15%]">Last Updated</TableHead>
                                    <TableHead className="w-[15%]">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTickets.map((ticket) => (
                                    <TableRow
                                        key={ticket.ticket_id}
                                        onClick={() => handleRowClick(ticket.codec)}
                                        className="cursor-pointer hover:bg-gray-100"
                                    >
                                        <TableCell className="font-medium">{ticket.ticket_id}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{ticket.name}</p>
                                                <p className="text-sm text-muted-foreground">{ticket.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{ticket.subject}</TableCell>
                                        <TableCell>{ticket.department}</TableCell>
                                        <TableCell>{new Date(ticket.created_at).toLocaleString()}</TableCell>
                                        <TableCell>
                                        <Button variant={ticket.status === "open" ? "default" : "warning"} size="sm">
                                            {ticket.status}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
            <div className="flex w-fit justify-end items-center gap-4 py-4">
                <Select value={currentPage.toString()} onValueChange={(val) => setCurrentPage(parseInt(val))}>
                    <SelectTrigger>
                        Page {currentPage} of {totalPages}
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                                Page {i + 1}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}