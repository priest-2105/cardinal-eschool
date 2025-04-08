"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge" 
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  GraduationCap,
  LineChart,
  Plus,
  RefreshCw,
  Users,
  UserCircle2,
  Bell,
  Ticket,
  FileText,
  Tag,
} from "lucide-react"
import { getDashboardData } from "@/lib/api/admin/home/dashboard"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { Alert } from "@/components/ui/alert"
import { DashboardSkeleton } from "@/components/dashboard/admin/pages/skeletons/dashboardSkeleton"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { AnnouncementMarquee } from "@/components/dashboard/admin/announcementMarquee"
import type { AdminDashboardData } from "@/lib/api/admin/home/dashboardTypes"



interface StatChangeProps {
  value: number;
}

function StatChange({ value }: StatChangeProps) {
  if (value === 0) return <p className="text-xs text-muted-foreground">No change</p>
  
  return (
    <p className={cn(
      "text-xs flex items-center",
      value > 0 ? "text-green-600" : "text-red-600"
    )}>
      {value > 0 ? '+' : ''}{value}% from last month
    </p>
  )
}

export default function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null)
  const token = useSelector((state: RootState) => state.auth?.token)
  const route = useRouter()


  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) return
      
      setLoading(true)
      try {
        const response = await getDashboardData(token)
        const data = response.data;
        const adjustedData: AdminDashboardData = {
          ...data,
          overview: {
            ...data.overview,
            completion_rate: data.overview.completion_rate ?? 0,
            completion_rate_change: data.overview.completion_rate_change ?? 0,
          },
          extras: {
            ...data.extras,
            recent_students: data.extras.recent_students.map(student => ({
              id: student.user_codec,
              name: student.name,
              email: student.email,
              courses: student.courses_enrolled,
            }))
          }
        };
        setDashboardData(adjustedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [token])

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

  const handleNewCourse = () => {
    route.push("/admin/createcourse")
  }

  const handleRefresh = async () => {
      if (!token) return
   
      setLoading(true)
      try {
        const response = await getDashboardData(token)
        setDashboardData(response.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
  }
  
  

  if (loading) {
    return (
      <div className={`transition-all ease-in-out p-2 duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-6 bg-white my-4 border border-gray-200 rounded-lg">
          <DashboardSkeleton />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`transition-all ease-in-out p-2 duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
      <div className="text-center py-12 border rounded-lg">
        <div className="p-4">
          <Alert variant="danger">{error}</Alert>
        </div>
       </div>
       </div>
    )
  }

  const recentStudents = dashboardData?.extras.recent_students.slice(0, 3) || [];
  const recentTutors = dashboardData?.extras.recent_tutors.slice(0, 3) || [];
  
  return (
    <div className={`transition-all ease-in-out p-2 duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>     
      <AnnouncementMarquee />
      
      <div className="p-6 bg-white my-4 border border-gray-200 rounded-lg space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin!</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={handleNewCourse}>
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                <div className="text-2xl font-bold">{dashboardData?.overview.students.total}</div>
                <StatChange value={dashboardData?.overview.students.percentage_change} />
                  </div>
                <p className="text-xs text-muted-foreground">
                {dashboardData?.overview.students.new_this_month} new students this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tutors</CardTitle>
                <UserCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-bold">{dashboardData?.overview.tutors.total}</div>
                <StatChange value={dashboardData?.overview.tutors.percentage_change} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                  {dashboardData?.overview.students.new_this_month} new tutors this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="flex justify-between items-center">
               <div>
                <div className="text-2xl font-bold">{dashboardData?.overview.classes.total}</div>
                <StatChange value={dashboardData?.overview.classes.percentage_change} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {dashboardData?.overview.classes.new_this_month} new tutors this month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData?.overview.completion_rate}%</div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardData?.overview.completion_rate_change}% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Courses</CardTitle>
                <CardDescription>
                  {dashboardData?.extras.recent_courses.length} courses added this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData?.extras.recent_courses.map((course) => (
                    <div key={course.id} className="flex items-center">
                      <div className="w-full space-y-1">
                        <p className="text-sm font-medium leading-none">{course.name}</p>
                        <div className="text-sm text-muted-foreground">
                          {course.student_count} students enrolled
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/admin/courses" passHref></Link>
                  <Button variant="outline" className="w-full">
                    View All Courses
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-2">
                <Link href="/admin/createcourse" passHref>
                  <Button variant="outline" className="justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Create New Course
                  </Button>
                </Link>
                <Link href="/admin/createannouncement" passHref>
                  <Button variant="outline" className="justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    Post Announcement
                  </Button>
                </Link>
                <Link href="/admin/students" passHref>
                  <Button variant="outline" className="justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Students
                  </Button>
                </Link>
                <Link href="/admin/ticketlist" passHref>
                  <Button variant="outline" className="justify-start">
                    <Ticket className="mr-2 h-4 w-4" />
                    Support Tickets
                  </Button>
                </Link>
                <Link href="/admin/reports" passHref>
                  <Button variant="outline" className="justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Reports
                  </Button>
                </Link>
                <Link href="/admin/coupons" passHref>
                  <Button variant="outline" className="justify-start">
                    <Tag className="mr-2 h-4 w-4" />
                    Manage Coupons
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Students</CardTitle>
                <CardDescription>
                  {recentStudents.length} new students this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentStudents.map((student) => (
                    <div key={student.id} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${student.name.charAt(0)}`} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.email}</p>
                        <div className="flex items-center pt-1">
                          <BookOpen className="mr-1 h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{student.courses} courses</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/admin/students" passHref>
                  <Button variant="outline" className="w-full">
                    View All Students
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Tutors</CardTitle>
                <CardDescription>
                  {recentTutors.length} new tutors this month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTutors.map((tutor) => (
                    <div key={tutor.id} className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${tutor.name.charAt(0)}`} />
                        <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{tutor.name}</p>
                        <p className="text-sm text-muted-foreground">{tutor.email}</p>
                        <div className="flex items-center gap-3 pt-1">
                          <div className="flex items-center">
                            <BookOpen className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{tutor.courses} courses</span>
                          </div>
                          <div className="flex items-center">
                            <BarChart3 className="mr-1 h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{tutor.rating} rating</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/admin/tutors" passHref>
                  <Button variant="outline" className="w-full">
                    View All Tutors
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
  )
}

