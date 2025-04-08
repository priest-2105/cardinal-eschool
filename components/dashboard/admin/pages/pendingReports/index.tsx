"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format, parseISO } from "date-fns"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { getPendingReports } from "@/lib/api/admin/pendingreport/fetchpendingreport"
import { updateReport } from "@/lib/api/admin/pendingreport/updatereport"
import { getStudentDetails } from "@/lib/api/admin/managestudent/getstudentdetails"
import { getTutorDetails } from "@/lib/api/admin/managetutor/gettutordetails"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Eye, Calendar, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface StudentProfile {
  owner_id: string
  dp_url: string | null
  user: {
    name: string
    email: string
    gender: string
  }
}

interface TutorProfile {
  owner_id: string
  dp_url: string | null
  user: {
    name: string
    email: string
    gender: string
  }
}

interface PendingReport {
  id: number
  student_id: string
  report: string
  status: string
  month: string
  tutor_id: string
  created_at: string
  updated_at: string
  studentProfile?: StudentProfile
  tutorProfile?: TutorProfile
}

interface PendingReportsListProps {
  updatePendingReportsCount?: () => Promise<void>;
}

const spinnerProps = {
  width: "1rem",
  height: "1rem",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: "2",
  className: "animate-spin",
  viewBox: "0 0 24 24",
  xmlns: "http://www.w3.org/2000/svg",
};

export default function PendingReportsList({ updatePendingReportsCount }: PendingReportsListProps) {
  const [pendingReports, setPendingReports] = useState<PendingReport[]>([])
  const [filteredReports, setFilteredReports] = useState<PendingReport[]>([])
  const [loading, setLoading] = useState(true)
  // const [approving, setapproving] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedReport, setSelectedReport] = useState<PendingReport | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [loadingProfiles, setLoadingProfiles] = useState<Record<string, boolean>>({})
  const token = useSelector((state: RootState) => state.auth?.token)
  const [processingAction, setProcessingAction] = useState<{
    reportId: number | null;
    action: 'approve' | 'reject' | null;
  }>({ reportId: null, action: null });

  const fetchPendingReports = async () => {
    if (!token) return

    setLoading(true)
    try {
      const response = await getPendingReports(token)
      const pendingOnly = response.data.reports.filter((report) => report.status === "pending")
      setPendingReports(pendingOnly)
      setFilteredReports(pendingOnly)

      pendingOnly.forEach((report) => {
        fetchProfilesForReport(report)
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "No Pending Results Found")
    } finally {
      setLoading(false)
    }
  }

  const fetchProfilesForReport = async (report: PendingReport) => {
    if (!token) return

    const reportId = report.id.toString()
    setLoadingProfiles((prev) => ({ ...prev, [reportId]: true }))

    try {
      const studentProfile = await getStudentDetails(token, report.student_id)

      const tutorProfile = await getTutorDetails(token, report.tutor_id)

      setPendingReports((prev) => prev.map((r) => (r.id === report.id ? { ...r, studentProfile, tutorProfile } : r)))

      setFilteredReports((prev) => prev.map((r) => (r.id === report.id ? { ...r, studentProfile, tutorProfile } : r)))

      if (selectedReport?.id === report.id) {
        setSelectedReport({ ...report, studentProfile, tutorProfile })
      }
    } catch (err) {
      console.error(`Failed to fetch profiles for report ${report.id}:`, err)
    } finally {
      setLoadingProfiles((prev) => ({ ...prev, [reportId]: false }))
    }
  }

  useEffect(() => {
    fetchPendingReports();
  }, [fetchPendingReports]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredReports(pendingReports)
    } else {
      const filtered = pendingReports.filter(
        (report) =>
          report.report.toLowerCase().includes(term.toLowerCase()) ||
          report.month.toLowerCase().includes(term.toLowerCase()) ||
          report.studentProfile?.user.name.toLowerCase().includes(term.toLowerCase()) ||
          report.tutorProfile?.user.name.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredReports(filtered)
    }
  }

  const handleViewReport = (report: PendingReport) => {
    setSelectedReport(report)
    setIsViewModalOpen(true)
  }

  const handleApproveReport = async (reportId: number) => {
    if (!token) return
    setProcessingAction({ reportId, action: 'approve' });

    try {
      await updateReport(token, reportId, "approved")
      setPendingReports(pendingReports.filter((report) => report.id !== reportId))
      setFilteredReports(filteredReports.filter((report) => report.id !== reportId))
      setSuccessMessage("Report approved successfully")
      setIsViewModalOpen(false)
      if (updatePendingReportsCount) {
        await updatePendingReportsCount();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve report")
    } finally {
      setProcessingAction({ reportId: null, action: null });
    }
  };

  const handleRejectReport = async (reportId: number) => {
    if (!token) return
    setProcessingAction({ reportId, action: 'reject' });

    try {
      await updateReport(token, reportId, "rejected")
      setPendingReports(pendingReports.filter((report) => report.id !== reportId))
      setFilteredReports(filteredReports.filter((report) => report.id !== reportId))
      setSuccessMessage("Report rejected successfully")
      setIsViewModalOpen(false)
      if (updatePendingReportsCount) {
        await updatePendingReportsCount();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject report")
    } finally {
      setProcessingAction({ reportId: null, action: null });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Success message */}
      {successMessage && (
        <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Pending Reports</h2>
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        {/* Table header - fixed */}
        <div className="bg-gray-50 border-b">
          <div className="grid grid-cols-5 gap-4 px-4 py-3 font-medium text-sm text-gray-500">
            <div>Assigned To</div>
            <div>Created By</div>
            <div>Report</div>
            <div>Month</div>
            <div className="text-right">Actions</div>
          </div>
        </div>

        {/* Table body - scrollable */}
        <div className="overflow-y-auto" style={{ height: "65vh" }}>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <p>Loading pending reports...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-32 text-red-500">
              <p>{error}</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <p>No pending reports found</p>
            </div>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className="grid grid-cols-5 gap-4 px-4 py-3 border-b hover:bg-gray-50">
                <div className="flex items-center gap-2">
                  {loadingProfiles[report.id.toString()] ? (
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ) : report.studentProfile ? (
                    <>
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={report.studentProfile.dp_url || undefined}
                          alt={report.studentProfile.user.name}
                        />
                        <AvatarFallback>{getInitials(report.studentProfile.user.name)}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{report.studentProfile.user.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Loading student...</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {loadingProfiles[report.id.toString()] ? (
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ) : report.tutorProfile ? (
                    <>
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={report.tutorProfile.dp_url || undefined}
                          alt={report.tutorProfile.user.name}
                        />
                        <AvatarFallback>{getInitials(report.tutorProfile.user.name)}</AvatarFallback>
                      </Avatar>
                      <span className="truncate">{report.tutorProfile.user.name}</span>
                    </>
                  ) : (
                    <span className="text-gray-500">Loading tutor...</span>
                  )}
                </div>

                <div className="truncate flex items-center">{report.report}</div>
                <div className="flex items-center">{report.month}</div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                    <Eye size={16} className="mr-2" />
                View
              </Button>
              <Button
                size="sm"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproveReport(report.id)}
                    disabled={processingAction.reportId === report.id}
              >
                    {processingAction.reportId === report.id && processingAction.action === 'approve' ? (
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
                      <>
                        <CheckCircle size={16} className="mr-2" />
                        Approve
                      </>
                )}
              </Button>
              <Button
                size="sm"
                    variant="danger"
                    onClick={() => handleRejectReport(report.id)}
                    disabled={processingAction.reportId === report.id}
              >
                    {processingAction.reportId === report.id && processingAction.action === 'reject' ? (
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
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Reject
                      </>
                )}
              </Button>
            </div>
          </div>
            ))
          )}
        </div>
      </div>

      {/* View Report Modal */}
      <Dialog
        open={isViewModalOpen}
        onOpenChange={(open) => {
          if (!open) setIsViewModalOpen(false)
        }}
      >
        <DialogContent className="sm:max-w-[625px] bg-white">
          {selectedReport && (
            <>
              <DialogHeader>
                <DialogTitle>Student Report</DialogTitle>
              </DialogHeader>

              <Tabs defaultValue="report" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="report">Report</TabsTrigger>
                  <TabsTrigger value="student">Assigned To</TabsTrigger>
                  <TabsTrigger value="tutor">Created By</TabsTrigger>
                </TabsList>

                <TabsContent value="report" className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      {selectedReport.status}
                    </Badge>
                    <div className="text-sm text-gray-500">Month: {selectedReport.month}</div>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="mr-2 h-4 w-4" />
                    Created: {format(parseISO(selectedReport.created_at), "MMM d, yyyy")}
                  </div>

                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-1">Report Content</h4>
                    <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-md">{selectedReport.report}</p>
                  </div>
                </TabsContent>

                <TabsContent value="student" className="space-y-4 pt-4">
                  {loadingProfiles[selectedReport.id.toString()] ? (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ) : selectedReport.studentProfile ? (
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={selectedReport.studentProfile.dp_url || undefined}
                          alt={selectedReport.studentProfile.user.name}
                        />
                        <AvatarFallback>{getInitials(selectedReport.studentProfile.user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="font-medium text-lg">{selectedReport.studentProfile.user.name}</h3>
                        <p className="text-sm text-gray-500">{selectedReport.studentProfile.user.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Gender:{" "}
                          {selectedReport.studentProfile.user.gender.charAt(0).toUpperCase() +
                            selectedReport.studentProfile.user.gender.slice(1)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      <p>Failed to load student details</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="tutor" className="space-y-4 pt-4">
                  {loadingProfiles[selectedReport.id.toString()] ? (
                    <div className="flex flex-col items-center gap-4 py-8">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  ) : selectedReport.tutorProfile ? (
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={selectedReport.tutorProfile.dp_url || undefined}
                          alt={selectedReport.tutorProfile.user.name}
                        />
                        <AvatarFallback>{getInitials(selectedReport.tutorProfile.user.name)}</AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <h3 className="font-medium text-lg">{selectedReport.tutorProfile.user.name}</h3>
                        <p className="text-sm text-gray-500">{selectedReport.tutorProfile.user.email}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Gender:{" "}
                          {selectedReport.tutorProfile.user.gender.charAt(0).toUpperCase() +
                            selectedReport.tutorProfile.user.gender.slice(1)}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-32 text-gray-500">
                      <p>Failed to load tutor details</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <div className="flex gap-2 sm:mr-auto">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleApproveReport(selectedReport.id)}
                    disabled={processingAction.reportId === selectedReport.id}
                  >
                    {processingAction.reportId === selectedReport.id && processingAction.action === 'approve' ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" {...spinnerProps} />
                        Approving...
                      </span>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve Report
                      </>
                    )}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleRejectReport(selectedReport.id)}
                    disabled={processingAction.reportId === selectedReport.id}
                  >
                    {processingAction.reportId === selectedReport.id && processingAction.action === 'reject' ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" {...spinnerProps} />
                        Rejecting...
                      </span>
                    ) : (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        Reject Report
                      </>
                    )}
                  </Button>
                </div>
                <Button variant="outline" onClick={() => setIsViewModalOpen(false)} className="sm:ml-auto">
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

