"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/tutor/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage } from "@/components/dashboard/tutor/ui/avatar"

interface Class {
  id: string
  title: string
  subject: string
  teacher: {
    name: string
    image: string
  }
}

const UPCOMING_CLASSES: Class[] = [
  {
    id: "1",
    title: "Computer Operating System - Class 2",
    subject: "Computer Science",
    teacher: {
      name: "Adekunle Onakoya",
      image: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "2",
    title: "Polymer - Class 1",
    subject: "Chemistry",
    teacher: {
      name: "Olumide Hannah",
      image: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "3",
    title: "Further Mathematics1",
    subject: "F.Maths",
    teacher: {
      name: "Aina David",
      image: "/placeholder.svg?height=40&width=40",
    },
  },
]

export default function UpcomingClasses() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Upcoming classes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {UPCOMING_CLASSES.map((class_) => (
          <div
            key={class_.id}
            className="flex items-center justify-between max-sm:block space-x-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex max-sm:block items-center space-x-4">
              <Avatar className="h-12 w-12 ">
                <AvatarImage src={class_.teacher.image} alt={class_.teacher.name} />
              </Avatar>
              <div>
                <h3 className="font-medium max-sm:my-2">{class_.title}</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-xs px-2 max-sm:my-2 py-1 bg-[#E8F9F9] text-[#1BC2C2] rounded">{class_.subject}</span>
                  <span className="text-sm text-gray-500">by {class_.teacher.name}</span>
                </div>
              </div>
            </div>
            <Button size="sm" className="bg-[#1BC2C2] max-sm:my-2 hover:bg-teal-600 text-white min-w-[80px]">
              Join
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

