"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/student/ui/card"
import { Button } from "@/components/dashboard/student/ui/button"
import { X } from "lucide-react"

interface Event {
  id: string
  title: string
  start: string
  end: string
  description: string
  type: "class" | "assignment" | "quiz" | "project"
  color: string
}

const SAMPLE_EVENTS: Event[] = [
  {
    id: "1",
    title: "Mathematics Class",
    start: "09:00",
    end: "10:00",
    description: "Regular mathematics class",
    type: "class",
    color: "bg-yellow-100 border-yellow-300",
  },
  {
    id: "2",
    title: "Biology Practical Class",
    start: "10:00",
    end: "11:35",
    description: "Reproductive System",
    type: "class",
    color: "bg-purple-100 border-purple-300",
  },
  {
    id: "3",
    title: "Assignment Deadline",
    start: "12:30",
    end: "13:00",
    description: "Submit Mathematics homework",
    type: "assignment",
    color: "bg-orange-100 border-orange-300",
  },
  {
    id: "4",
    title: "Take Physics Quiz",
    start: "13:00",
    end: "14:00",
    description: "Chapter 5 - Forces and Motion",
    type: "quiz",
    color: "bg-red-100 border-red-300",
  },
  {
    id: "5",
    title: "Computer Group Project",
    start: "14:00",
    end: "14:45",
    description: "Team meeting for final project",
    type: "project",
    color: "bg-blue-100 border-blue-300",
  },
  {
    id: "6",
    title: "Social Studies Class",
    start: "15:00",
    end: "16:00",
    description: "World History - Industrial Revolution",
    type: "class",
    color: "bg-green-100 border-green-300",
  },
]

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function StudentEventCalendar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [eventPosition, setEventPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const timezoneElement = document.getElementById("timezone")
    if (timezoneElement) {
      timezoneElement.textContent = timezone
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setEventPosition({
      top: rect.top + window.scrollY,
      left: rect.right + 20, // 20px offset from the event
    })
    setSelectedEvent(event)
  }

  const currentMonth = selectedDate.toLocaleString("default", { month: "long", year: "numeric" })

  return (
    <div className={`transition-all ease-in-out duration-300`}>
      <div className="relative">
        <Card className="border rounded-lg shadow-sm">
          <CardHeader className="border-b bg-gray-50/80">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-medium">Schedule</CardTitle>
                <p className="text-sm text-gray-500">{currentMonth}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                  Today
                </Button>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const newDate = new Date(selectedDate)
                      newDate.setDate(newDate.getDate() - 7)
                      setSelectedDate(newDate)
                    }}
                  >
                    {"<"}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => {
                      const newDate = new Date(selectedDate)
                      newDate.setDate(newDate.getDate() + 7)
                      setSelectedDate(newDate)
                    }}
                  >
                    {">"}
                  </Button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-8 mt-4">
              <div className="col-span-1 text-start py-1 font-medium">
                <div className="text-xs">Time</div>
                <div className="text-sm" id="timezone"></div>
              </div>
              {DAYS.map((day, i) => {
                const date = new Date(selectedDate)
                date.setDate(date.getDate() - 3 + i)
                const isToday = date.toDateString() === new Date().toDateString()
                return (
                  <div
                    key={day}
                    className={`text-center py-1 font-medium ${isToday ? "bg-blue-500 text-white rounded-md" : ""}`}
                  >
                    <div className="text-xs">{day}</div>
                    <div className="text-sm">{date.getDate()}</div>
                  </div>
                )
              })}
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-auto custom-scrollbar" style={{ height: "480px" }}>
            <div className="relative grid grid-cols-8">
              {/* Time labels */}
              <div className="col-span-1 border-r sticky left-0 bg-white z-10">
                {HOURS.map((hour) => (
                  <div key={hour} className="h-12 border-b px-2 py-1">
                    <span className="text-xs text-gray-500">{`${hour.toString().padStart(2, "0")}:00`}</span>
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              {DAYS.map((_, dayIndex) => (
                <div key={dayIndex} className="col-span-1 border-r">
                  {HOURS.map((hour) => (
                    <div key={hour} className="h-12 border-b relative">
                      {SAMPLE_EVENTS.map((event) => {
                        const [eventHour] = event.start.split(":").map(Number)
                        if (eventHour === hour && dayIndex === 3) {
                          // Showing events only on Wednesday (middle day) for demo
                          return (
                            <button
                              key={event.id}
                              onClick={(e) => handleEventClick(event, e)}
                              className={`absolute w-11/12 left-1/2 -translate-x-1/2 p-1 rounded-md border ${event.color} 
                                hover:shadow-md transition-shadow cursor-pointer`}
                              style={{
                                top: "2px",
                                minHeight: "32px",
                              }}
                            >
                              <div className="text-xs font-medium truncate">{event.title}</div>
                              <div className="text-xs truncate">
                                {event.start} - {event.end}
                              </div>
                            </button>
                          )
                        }
                        return null
                      })}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Details Popover */}
        {selectedEvent && (
          <Card
            className="absolute w-80 shadow-lg z-20"
            style={{
              top: eventPosition.top,
              left: eventPosition.left,
              transform: "translateY(-50%)",
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Event Details</CardTitle>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedEvent(null)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">{selectedEvent.title}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedEvent.start} - {selectedEvent.end}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Description</h4>
                  <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Type</h4>
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full ${selectedEvent.color.replace(
                      "border",
                      "text",
                    )}`}
                  >
                    {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

