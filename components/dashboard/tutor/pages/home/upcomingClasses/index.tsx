"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/tutor/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"; 

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

export default function UpcomingClasses({ upcomingClasses = [], remainingCount }: UpcomingClassprop & { remainingCount: number }) {
  const router = useRouter();
  const displayClasses = upcomingClasses.slice(0, 2);

  if (upcomingClasses.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upcoming Classes</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-full">
          <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-500">No upcoming classes available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          Upcoming Classes
          {remainingCount > 0 && (
            <span className="text-sm text-gray-500 ml-2">+{remainingCount} more</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayClasses.map((class_) => (
          <div
            key={class_.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div>
              <h3 className="font-medium">{class_.name}</h3>
              <div className="flex items-center space-x-2">
                <span className="text-xs px-2 py-1 bg-[#E8F9F9] text-[#1BC2C2] rounded">
                  {class_.code}
                </span>
                <span className="text-sm text-gray-500">
                  {class_.student_count} student{class_.student_count > 1 && "s"}
                </span>
              </div>
            </div>
            <Button
              onClick={() => router.push(`/tutor/course/${class_.id}`)}
              size="sm"
              className="bg-[#1BC2C2] hover:bg-teal-600 text-white min-w-[80px]"
            >
              View
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

