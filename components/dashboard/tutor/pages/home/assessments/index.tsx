"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/tutor/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

interface Assessment {
  id: number;
  title: string;
  description: string;
  deadline: string;
  class: {
    id: number;
    name: string;
    code: string;
  };
  file_url: string;
}

interface AssessmentsProps {
  assignments: Assessment[]
}

export default function Assessments({ assignments = [] }: AssessmentsProps) {
  const getRemainingDays = (deadline: string) => {
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getDeadlineColor = (deadline: string) => {
    const remainingDays = getRemainingDays(deadline)
    return remainingDays > 4 ? "text-green-500" : "text-red-500"
  }

  const displayAssignments = assignments.slice(0, 3)
  const remainingCount = Math.max(0, assignments.length - 3)

  return (
    <Card className="min-h-[355px] w-full max-md:mt-5 xl:max-w-[1300px] xl:mx-auto">
      <CardHeader>
        <CardTitle>
          Active Assessment
          {remainingCount > 0 && (
            <span className="text-sm text-gray-500 ml-2">+{remainingCount} more</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {displayAssignments.map((assessment) => (
          <div
            key={assessment.id}
            className="flex flex-col space-y-4 p-4 rounded-lg border bg-white max-md:space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-4 sm:space-y-0">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold">{assessment.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-500 rounded">
                      {assessment.class.code}
                    </span>
                    <span className="text-sm text-gray-500">{assessment.class.name}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-500 hover:text-blue-600 max-md:w-full"
              >
                View
              </Button>
            </div>
            <div className="space-y-4">
              <p className={`text-sm font-medium ${getDeadlineColor(assessment.deadline)}`}>
                Assignment Due By {new Date(assessment.deadline).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

