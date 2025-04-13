"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Report } from "@/lib/api/student/courses/fetchreport";
import { FileText } from "lucide-react";
import { format } from "date-fns";

interface ViewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
}

export default function ViewReportModal({ isOpen, onClose, report }: ViewReportModalProps) {
  console.log("Modal Open State:", isOpen); // Debugging log
  if (!report) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Class Name</h4>
            <p className="text-sm text-gray-700">{report.class_name}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Class Code</h4>
            <p className="text-sm text-gray-700">{report.class_code}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Month</h4>
            <p className="text-sm text-gray-700">{report.month}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Status</h4>
            <p className={`text-sm font-medium ${report.status === "completed" ? "text-green-600" : "text-red-600"}`}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Created At</h4>
            <p className="text-sm text-gray-700">{format(new Date(report.created_at), "MMM d, yyyy HH:mm")}</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Updated At</h4>
            <p className="text-sm text-gray-700">{format(new Date(report.updated_at), "MMM d, yyyy HH:mm")}</p>
          </div>
          {report.download_url && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Download</h4>
              <a
                href={report.download_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
              >
                <FileText className="mr-2 h-4 w-4" />
                Download Report
              </a>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
