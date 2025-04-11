"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/tutor/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface UpcomingClassprop {
  upcomingClasses: {
    id: number;
    name: string;
    code: string;
    schedule: {
      days: string[];
      time: string[];
    };
    meeting_link: string;
    student_count: number;
    department: string;
    semester: string;
    status: string;
    progress_percentage: number;
    days_remaining: number | null;
    start_date: string | null;
    end_date: string | null;
  }[];
}

export default function UpcomingClasses({ upcomingClasses }: UpcomingClassprop) {
  const router = useRouter()
  const displayClasses = upcomingClasses.slice(0, 2)
  const remainingCount = Math.max(0, upcomingClasses.length - 2)

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>
          Upcoming classes
          {remainingCount > 0 && (
            <span className="text-sm text-gray-500 ml-2">+{remainingCount} more</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayClasses.map((class_) => (
          <div
            key={class_.id}
            className="flex items-center justify-between max-sm:block space-x-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex max-sm:block items-center space-x-4">
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

