"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import CourseDetailsComponent from "@/components/dashboard/admin/pages/courses/coursedetails"
import { getAdminCourseDetails } from "@/lib/api/admin/managecourses/fetchsinglecourse"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Alert } from "@/components/ui/alert"
// import type { CourseDetailsResponse } from "@/lib/api/admin/managecourses/fetchsinglecourse"

interface CourseDetailsResponse {
  data: {
    class: {
      id: number;
      name: string;
      code: string;
      description: string;
      schedule: {
        days: string[];
        time: string[];
        start_date: string | null;
        end_date: string | null;
      };
      meeting_link: string;
      learning_outcome: string;
      prerequisite: string;
      department: string;
      semester: string;
      progress_percentage: number;
      start_date: string | null;
      end_date: string | null;
      status: string;
      days_remaining: number | null;
    };
    tutor: {
      id: string;
      name: string;
      email: string;
    } | null;
    students: {
      id: string;
      name: string;
      email: string;
    }[];
    assignments: {
      total: number;
      turned_in: number;
      pending: number;
      overdue: number;
      percentage_turned_in: number;
    };
    reports: {
      total: number;
    };
    resources: {
      total: number;
      details: {
        id: number;
        name: string;
        file_path: string;
      }[];
    };
  };
}

export default function CourseDetails() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [courseDetails, setCourseDetails] = useState<CourseDetailsResponse["data"] | null>(null)
  const params = useParams()
  const token = useSelector((state: RootState) => state.auth?.token)

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!token) return
      
      setLoading(true)
      try {
        const response = await getAdminCourseDetails(token, params.coursedetails as string)
        setCourseDetails({
          class: {
            ...response.data.class,
            start_date: response.data.class.start_date || null,
            end_date: response.data.class.end_date || null,
            status: response.data.class.status || "unknown",
            progress_percentage: response.data.class.progress_percentage || 0,
            days_remaining: response.data.class.days_remaining || null,
          },
          tutor: response.data.tutor || { id: "unknown", name: "Unknown Tutor", email: "unknown@example.com" }, 
          students: response.data.students,
          assignments: response.data.assignments,
          reports: response.data.reports,
          resources: response.data.resources,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch course details")
      } finally {
        setLoading(false)
      }
    }

    fetchCourseDetails()
  }, [params.coursedetails, token])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading course details...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="danger">{error}</Alert>
      </div>
    )
  }

  if (!courseDetails) {
    return (
      <div className="flex items-center justify-center h-screen">
        No course details found
      </div>
    )
  }

  return (
    <div className={`transition-all w-[85%] ease-in-out max-sm:h-[calc(80vh-50px)] overflow-hidden py-4 bg-white border border-gray-200 rounded-lg p-4 duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <CourseDetailsComponent courseDetails={{ ...courseDetails, tutor: courseDetails.tutor || { id: "unknown", name: "Unknown Tutor", email: "unknown@example.com" } }} />
    </div>
  )
}