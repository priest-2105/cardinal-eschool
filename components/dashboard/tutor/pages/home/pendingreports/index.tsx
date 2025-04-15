"use client"

import { Button } from "@/components/ui/button"
import { Calendar, FileText, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"

interface Report {
  id: number;
    report_text: string;
    report_month: string;
    report_status: string;
    created_at: string;
    class: {
      id: number;
      name: string;
      code: string;
    };
}

interface PendingReportsProps {
  reports: Report[]
}

export default function PendingReportsList({ reports = [], remainingCount }: PendingReportsProps & { remainingCount: number }) {
  const router = useRouter();
  const displayReports = reports.slice(0, 2);

  if (reports.length === 0) {
    return (
      <div className="h-fit flex flex-col bg-white rounded-xl border shadow-sm transition-shadow p-4 mt-5 xl:max-w-[1300px] xl:mx-auto">
        <div className="flex justify-between items-center mb-4">
          <CardTitle>Pending Reports</CardTitle>
        </div>
        <div className="flex flex-col items-center justify-center h-full">
          <AlertCircle className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-gray-500">No pending reports available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-fit flex flex-col bg-white rounded-xl border shadow-sm transition-shadow p-4 mt-5 xl:max-w-[1300px] xl:mx-auto">
      <div className="flex justify-between items-center mb-4">
        <CardTitle>
          Pending Reports
          {remainingCount > 0 && (
            <span className="text-sm text-gray-500 ml-2">+{remainingCount} more</span>
          )}
        </CardTitle>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
        {displayReports.map((report) => (
          <div
            key={report.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0"
          >
            <div>
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
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/tutor/course/${report.class.id}`)}
            >
              <FileText size={16} className="mr-2" />
              View
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}