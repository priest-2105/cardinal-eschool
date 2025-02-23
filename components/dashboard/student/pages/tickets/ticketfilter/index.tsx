"use client"

import { useState } from "react"
import { Button } from "@/components/dashboard/student/ui/button"
import { Calendar } from "@/components/dashboard/student/ui/calender"
import { Check } from "@/components/dashboard/student/ui/check"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/dashboard/student/ui/command"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dashboard/student/ui/dialog"
import { Label } from "@/components/dashboard/student/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/dashboard/student/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { CalendarIcon, ChevronsUpDown } from "lucide-react"
import type { Ticket } from "../types"

interface FilterValues {
  departments?: string[]
  dateRange?: { from: Date | undefined; to: Date | undefined }
  status?: string[]
}

interface FilterModalProps {
  tickets?: Ticket[]
  onFilterChange: (filters: FilterValues) => void
}

export function FilterModal({ tickets = [], onFilterChange }: FilterModalProps) {
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  })
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const handleApplyFilters = () => {
    onFilterChange({
      departments: selectedDepartments,
      dateRange: {
        from: dateRange.from,
        to: dateRange.to,
      },
      status: selectedStatuses,
    })
    setOpen(false)
  }

  const handleReset = () => {
    setSelectedDepartments([])
    setDateRange({ from: undefined, to: undefined })
    setSelectedStatuses([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Filter</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-fit bg-white">
        <DialogHeader>
          <DialogTitle>Filter Tickets</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Departments</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {selectedDepartments.length === 0
                    ? "Select departments..."
                    : `${selectedDepartments.length} selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white">
                <Command>
                  <CommandInput placeholder="Search departments..." />
                  <CommandList>
                    <CommandEmpty>No department found.</CommandEmpty>
                    <CommandGroup>
                      {Array.from(new Set(tickets.map((ticket) => ticket.department))).map((department) => (
                        <CommandItem
                          key={department}
                          onSelect={() => {
                            setSelectedDepartments((prev) =>
                              prev.includes(department)
                                ? prev.filter((name) => name !== department)
                                : [...prev, department],
                            )
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedDepartments.includes(department) ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {department}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid gap-2">
            <Label>Date Range</Label>
            <div className="flex items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP") : <span>From date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-white p-0" align="center">
                <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => {
                  if (date instanceof Date || date === undefined) {
                    setDateRange((prev) => ({ ...prev, from: date }));
                  }
                }}
                initialFocus
              />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : <span>To date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto bg-white p-0" align="center">
                <Calendar
                mode="single"
                selected={dateRange.from}
                onSelect={(date) => {
                  if (date instanceof Date || date === undefined) {
                    setDateRange((prev) => ({ ...prev, from: date }));
                  }
                }}
                initialFocus
              />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {selectedStatuses.length === 0 ? "Select statuses..." : `${selectedStatuses.length} selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white">
                <Command>
                  <CommandInput placeholder="Search statuses..." />
                  <CommandList>
                    <CommandEmpty>No status found.</CommandEmpty>
                    <CommandGroup>
                      {Array.from(new Set(tickets.map((ticket) => ticket.status))).map((status) => (
                        <CommandItem
                          key={status}
                          onSelect={() => {
                            setSelectedStatuses((prev) =>
                              prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
                            )
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedStatuses.includes(status) ? "opacity-100" : "opacity-0",
                            )}
                          />
                          {status}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={handleReset} variant="ghost">
            Reset
          </Button>
          <Button onClick={handleApplyFilters}>Apply</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

