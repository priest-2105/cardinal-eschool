import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";
import { Badge } from "@/components/ui/badge";
import type { Report } from "@/lib/types/report"; // Import the updated Report type

interface ViewReportModalProps {
  report: Report | null; // Use the updated Report type
  isOpen: boolean;
  onClose: () => void;
  students: {
    id: string;
    name: string;
    dp_url: string | null;
  }[]; // Add the students prop
}

export function ViewReportModal({ report, isOpen, onClose, students }: ViewReportModalProps) {
  if (!report) return null;

  const student = students.find((s) => s.id === report.student_id); // Use the students prop

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Report Details
            <Badge variant={report.status === "pending" ? "warning" : "success"}>
              {report.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium">Student</p>
                <p className="text-gray-600">{student?.name || "Unknown Student"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Month</p>
                <p className="text-gray-600">{report.month}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium">Created</p>
              <p className="text-gray-600">
                {format(parseISO(report.created_at), "MMM d, yyyy HH:mm")}
              </p>
            </div>
            {report.updated_at !== report.created_at && (
              <div>
                <p className="text-sm font-medium">Last Updated</p>
                <p className="text-gray-600">
                  {format(parseISO(report.updated_at), "MMM d, yyyy HH:mm")}
                </p>
              </div>
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Report Content:</h4>
            <p className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {report.report}
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

