"use client"

import { useState } from "react"
import type { FilterValues } from "../types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/dashboard/student/ui/dialog"
import { Button } from "@/components/dashboard/student/ui/button"
import { Label } from "@/components/dashboard/student/ui/label"
import { Calendar } from "@/components/dashboard/student/ui/calender"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/dashboard/student/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/dashboard/student/ui/popover"
import { Badge } from "@/components/dashboard/student/ui/badge"
import { cn } from "@/lib/utils"
import { Check, ChevronsUpDown, Filter } from "lucide-react"

interface FilterModalProps {
  courses: { id: number; name: string }[]
  tutors: { id: number; name: string }[]
  onFilterChange: (filters: FilterValues) => void
}

export function FilterModal({ courses, tutors, onFilterChange }: FilterModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [selectedTutors, setSelectedTutors] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const handleApplyFilters = () => {
    onFilterChange({
      courses: selectedCourses,
      tutors: selectedTutors,
      dateRange,
      status: selectedStatuses,
    })
    setOpen(false)
  }

  const handleReset = () => {
    setSelectedCourses([])
    setSelectedTutors([])
    setDateRange({ from: undefined, to: undefined })
    setSelectedStatuses([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader>
          <DialogTitle>Filter Courses</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Courses</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {selectedCourses.length === 0 ? "Select courses..." : `${selectedCourses.length} selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white">
                <Command>
                  <CommandInput placeholder="Search courses..." />
                  <CommandEmpty>No course found.</CommandEmpty>
                  <CommandGroup>
                    {courses.map((course) => (
                      <CommandItem
                        key={course.id}
                        onSelect={() => {
                          setSelectedCourses((prev) =>
                            prev.includes(course.name)
                              ? prev.filter((name) => name !== course.name)
                              : [...prev, course.name],
                          )
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedCourses.includes(course.name) ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {course.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Tutors</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" className="w-full justify-between">
                  {selectedTutors.length === 0 ? "Select tutors..." : `${selectedTutors.length} selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white">
                <Command>
                  <CommandInput placeholder="Search tutors..." />
                  <CommandEmpty>No tutor found.</CommandEmpty>
                  <CommandGroup>
                    {tutors.map((tutor) => (
                      <CommandItem
                        key={tutor.id}
                        onSelect={() => {
                          setSelectedTutors((prev) =>
                            prev.includes(tutor.name)
                              ? prev.filter((name) => name !== tutor.name)
                              : [...prev, tutor.name],
                          )
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedTutors.includes(tutor.name) ? "opacity-100" : "opacity-0",
                          )}
                        />
                        {tutor.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Date Range</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.from && "text-muted-foreground",
                    )}
                  >
                    {dateRange.from ? dateRange.from.toLocaleDateString() : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date: Date | undefined) => setDateRange((prev) => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateRange.to && "text-muted-foreground",
                    )}
                  >
                    {dateRange.to ? dateRange.to.toLocaleDateString() : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date: Date | undefined) => setDateRange((prev) => ({ ...prev, to: date }))}
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
                  {selectedStatuses.length === 0 ? "Select status..." : `${selectedStatuses.length} selected`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 bg-white">
                <Command>
                  <CommandInput placeholder="Search status..." />
                  <CommandEmpty>No status found.</CommandEmpty>
                  <CommandGroup>
                    {["Upcoming", "Active", "Completed"].map((status) => (
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
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button onClick={handleApplyFilters} className="bg-[#1BC2C2] hover:bg-teal-600">
            Apply Filters
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

