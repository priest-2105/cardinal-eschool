"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, FileText } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Report {
  
  id: string
  title: string
  subject: string
  grade: string
  dateSubmitted: Date
}

const SAMPLE_REPORTS: Report[] = [
  {
    id: "1",
    title: "Midterm Exam Results",
    subject: "Basic Science",
    grade: "A",
    dateSubmitted: new Date(2024, 5, 15),
  },
  {
    id: "2",
    title: "Lab Report: Energy Conservation",
    subject: "Physics",
    grade: "B+",
    dateSubmitted: new Date(2025, 6, 1),
  },
  {
    id: "3",
    title: "Essay: Ecosystem Dynamics",
    subject: "Biology",
    grade: "A-",
    dateSubmitted: new Date(2024, 6, 10),
  },
  {
    id: "4",
    title: "Project: Solar System Model",
    subject: "Astronomy",
    grade: "A",
    dateSubmitted: new Date(2024, 6, 22),
  },
  { id: "5", title: "Quiz: Chemical Reactions", subject: "Chemistry", grade: "B", dateSubmitted: new Date(2023, 7, 5) },
]

interface ReportsListProps {
  classId: number;
  courseDetails: {
    id: number;
    name: string;
    code: string;
    description: string;
    schedule: {
      days: string[];
      time: string[];
    };
    meeting_link: string;
    status: string;
    progress_percentage: number;
    days_remaining: number | null;
    start_date: string | null;
    end_date: string | null;
    department: string;
    semester: string;
    tutor: {
      id: string;
      name: string;
      dp_url: string | null;
    };
    students: {
      id: string;
      name: string;
      dp_url: string | null;
      is_self: boolean;
    }[];
    resources: {
      id: string;
      name: string;
      file_path: string;
    }[];
  };
}

export default function ReportsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [reports, setReports] = useState(SAMPLE_REPORTS)
  const [dateFilter, setDateFilter] = useState("all")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    filterReports(term, dateFilter)
  }

  const handleDateFilter = (value: string) => {
    setDateFilter(value)
    filterReports(searchTerm, value)
  }

  const filterReports = (term: string, date: string) => {
    let filteredReports = SAMPLE_REPORTS.filter(
      (report) =>
        report.title.toLowerCase().includes(term.toLowerCase()) ||
        report.subject.toLowerCase().includes(term.toLowerCase()),
    )

    const now = new Date()
    switch (date) {
      case "week":
        filteredReports = filteredReports.filter(
          (report) => report.dateSubmitted >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        )
        break
      case "month":
        filteredReports = filteredReports.filter(
          (report) => report.dateSubmitted >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        )
        break
      case "year":
        filteredReports = filteredReports.filter(
          (report) => report.dateSubmitted >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        )
        break
    }

    setReports(filteredReports)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
        <Select onValueChange={handleDateFilter} defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All time</SelectItem>
            <SelectItem value="week">Past week</SelectItem>
            <SelectItem value="month">Past month</SelectItem>
            <SelectItem value="year">Past year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">{report.title}</h3>
              <p className="text-sm text-gray-500">
                {report.subject} • Grade: {report.grade}
              </p>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Calendar size={12} className="mr-1" />
                {format(report.dateSubmitted, "MMM d, yyyy")}
              </p>
            </div>
            <Button variant="outline" size="sm" className="mt-2 sm:mt-0">
              <FileText size={16} className="mr-2" />
              View Report
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

