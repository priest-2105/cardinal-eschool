"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/tutor/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface UpcomingClassprop {
  id: number,
  name: string,
  code: string,
  schedule: {
      days: [
          string,
          string
      ],
      time: [
          string,
          string
      ]
  },
  meeting_link: string,
  student_count: number,
  department: string,
  semester: string
}

export default function UpcomingClasses({ upcomingClasses } : UpcomingClassprop ) {

  const router = useRouter()

 

  return (
    <Card className="">
    <CardHeader>
      <CardTitle>Upcoming classes</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {upcomingClasses.map((class_) => (
        <div
          key={class_.id}
          className="flex items-center justify-between max-sm:block space-x-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="flex max-sm:block items-center space-x-4">
            {/* <Avatar className="h-12 w-12 ">
              <AvatarImage src={class_.teacher.image} alt={class_.teacher.name} />
            </Avatar> */}
            <div>
              <h3 className="font-medium max-sm:my-2">{class_.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 max-sm:my-2 py-1 bg-[#E8F9F9] text-[#1BC2C2] rounded">{class_.code}</span>
                <span className="text-sm text-gray-500"> {class_.student_count} student{class_.student_count > 1 && "s"}</span>
              </div>
            </div>
          </div>
          <Button onClick={() => router.push(`/tutor/course/${class_.id}`)} size="sm" className="bg-[#1BC2C2] max-sm:my-2 hover:bg-teal-600 text-white min-w-[80px]">
            View 
          </Button>
        </div>
      ))}
    </CardContent>
  </Card>
  )
}

