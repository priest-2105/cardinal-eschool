"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar, FileText } from "lucide-react"
import { format } from "date-fns"
import { CardTitle, CardContent, CardHeader } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { updateReport } from "@/lib/api/admin/pendingreport/updatereport"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"

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
  const token = useSelector((state: RootState) => state.auth?.token)
  const [processingReport, setProcessingReport] = useState<string | null>(null)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleUpdateStatus = async (reportId: string, status: 'approved' | 'rejected') => {
    if (!token) return
    setProcessingReport(reportId)
    try {
      await updateReport(token, Number(reportId), status)
      setAlert({
        type: "success",
        message: `Report ${status === 'approved' ? 'approved' : 'rejected'} successfully.`
      })
    } catch (error) {
      console.error(`Failed to ${status} report:`, error)
      setAlert({
        type: "error",
        message: `Failed to ${status} report.`
      })
    } finally {
      setProcessingReport(null)
    }
  }

  return (
    <div className="h-fit flex bg-white rounded-xl border shadow-sm transition-shadow p-4 mt-5 flex-col">
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus(report.id.toString(), 'approved')}
                disabled={processingReport === report.id.toString()}
              >
                {processingReport === report.id.toString() ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Approving...
                  </span>
                ) : (
                  "Approve"
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleUpdateStatus(report.id.toString(), 'rejected')}
                disabled={processingReport === report.id.toString()}
              >
                {processingReport === report.id.toString() ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Rejecting...
                  </span>
                ) : (
                  "Reject"
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {alert && (
        <Alert
          variant={alert.type === "success" ? "default" : "destructive"}
          className="fixed bottom-4 right-4 w-auto"
        >
          <AlertTitle>{alert.type === "success" ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
    </div>
  )
}

