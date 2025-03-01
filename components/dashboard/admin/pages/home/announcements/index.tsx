"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/admin/ui/card"

interface Announcement {
  id: string
  title: string
  date: string
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun"
}

const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "Father's day",
    date: "12-03-2025",
    day: "Mon",
  },
  {
    id: "2",
    title: "Mother's day",
    date: "12-03-2025",
    day: "Wed",
  },
  {
    id: "3",
    title: "Christmas day",
    date: "12-03-2025",
    day: "Sat",
  },
  {
    id: "4",
    title: "Graduation day",
    date: "12-03-2025",
    day: "Tue",
  },
]

const getDayColor = (day: Announcement["day"]) => {
  const colors = {
    Mon: "bg-[#0088B4] text-white",
    Tue: "bg-[#38B45D] text-white",
    Wed: "bg-[#F1416C] text-white",
    Thu: "bg-purple-500 text-white",
    Fri: "bg-orange-500 text-white",
    Sat: "bg-[#02C3BD] text-white",
    Sun: "bg-red-500 text-white",
  }
  return colors[day]
}

export default function Announcements() {
  return (
    <Card className="w-full h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Announcements</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ANNOUNCEMENTS.map((announcement) => (
            <div
              key={announcement.id}
              className="flex items-center gap-4 group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div
                className={`flex items-center justify-center w-14 h-12 rounded-2xl ${getDayColor(
                  announcement.day,
                )} font-semibold text-xs shadow-sm group-hover:shadow-md transition-shadow`}
              >
                {announcement.day}
              </div>
              <div className="space-y-1">
                <h3 className="text-md font-semibold group-hover:text-gray-900">{announcement.title}</h3>
                <p className="text-sm text-gray-500">{announcement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

