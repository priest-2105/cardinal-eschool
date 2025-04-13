"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, FileText } from "lucide-react"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Report } from "@/lib/api/student/courses/fetchreport";

interface ReportsListProps {
  reports: Report[];
}

export default function ReportsList({ reports }: ReportsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")
  const [filteredReports, setFilteredReports] = useState(reports)

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
    let filtered = reports.filter(
      (report) =>
        report.class_name.toLowerCase().includes(term.toLowerCase()) ||
        report.class_code.toLowerCase().includes(term.toLowerCase()),
    )

    const now = new Date()
    switch (date) {
      case "week":
        filtered = filtered.filter(
          (report) => new Date(report.created_at) >= new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7),
        )
        break
      case "month":
        filtered = filtered.filter(
          (report) => new Date(report.created_at) >= new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()),
        )
        break
      case "year":
        filtered = filtered.filter(
          (report) => new Date(report.created_at) >= new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()),
        )
        break
    }

    setFilteredReports(filtered)
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
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">{report.class_name}</h3>
              <p className="text-sm text-gray-500">
                {report.class_code} • {report.month}
              </p>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Calendar size={12} className="mr-1" />
                {format(new Date(report.created_at), "MMM d, yyyy")}
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

