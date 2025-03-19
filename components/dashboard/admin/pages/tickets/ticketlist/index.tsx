"use client"

import { useState, useEffect } from "react";
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

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                if (!token) {
                    console.error("Token is missing");
                    return;
                }

                const response = await fetchTicketList(token, 1, 15, {
                    status: filters.status?.[0],
                    department: filters.departments?.[0],
                    ticket_id: searchQuery || undefined,
                });

                console.log("Fetched tickets response:", response); // Log the full response
                setTickets(response.data.tickets || []); // Ensure tickets are set correctly
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        };

        fetchTickets();
    }, [filters, searchQuery, token]);

    const handleFilterChange = (newFilters: FilterValues) => {
        setFilters(newFilters);
    };

    const handleRowClick = (ticketId: string) => {
        router.push(`/admin/ticket/${ticketId}`);
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
                        <FilterModal tickets={tickets} onFilterChange={handleFilterChange} />
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
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[15%]">Ticket ID</TableHead>
                                    <TableHead className="w-[20%]">User</TableHead>
                                    <TableHead className="w-[20%]">Description</TableHead>
                                    <TableHead className="w-[15%]">Department</TableHead>
                                    <TableHead className="w-[15%]">Last Updated</TableHead>
                                    <TableHead className="w-[15%]">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTickets.map((ticket) => (
                                    <TableRow
                                        key={ticket.ticket_id}
                                        onClick={() => handleRowClick(ticket.ticket_id)}
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
                                            <Button variant={ticket.status === "open" ? "default" : "danger"} size="sm">
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
        </div>
    );
}

