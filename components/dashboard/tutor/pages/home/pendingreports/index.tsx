"use client"

import { Button } from "@/components/ui/button"
import { Calendar, FileText } from "lucide-react"
import { format } from "date-fns"
import { CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface Report {
  id: number
  report_text: string
  report_month: string
  report_status: string
  created_at: string
  class: {
    id: number
    name: string
    code: string
  }
}

interface PendingReportsProps {
  reports: Report[]
}

export default function PendingReportsList({ reports }: PendingReportsProps) {
  const router = useRouter()
  const displayReports = reports.slice(0, 2)
  const remainingCount = Math.max(0, reports.length - 2)

  return (
    <div className="h-full flex bg-white rounded-xl border shadow-sm transition-shadow p-4 mt-5 flex-col">
      <div className="flex justify-between items-center mb-4">
        <CardTitle>Pending Reports</CardTitle>
        {remainingCount > 0 && (
          <span className="text-sm text-gray-500">+{remainingCount} more</span>
        )}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
        {displayReports.map((report) => (
          <div
            key={report.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">{report.class.name}</h3>
              <p className="text-sm text-gray-500">
                {report.class.code} • {report.report_month}
              </p>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Calendar size={12} className="mr-1" />
                {format(new Date(report.created_at), "MMM d, yyyy")}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Status: {report.report_status}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.push(`/tutor/course/${report.class.id}`)}
              >
                <FileText size={16} className="mr-2" />
                View
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

