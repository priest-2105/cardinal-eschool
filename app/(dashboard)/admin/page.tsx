
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AnnouncementMarquee } from "@/components/dashboard/admin/announcementMarquee"
import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  GraduationCap,
  LayoutDashboard,
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

// Sample data
const announcements = [
  { id: "1", title: "End of Semester Examination Schedule", content: "..." },
  { id: "2", title: "Holiday Break Notice", content: "..." },
  { id: "3", title: "New Course Registration Opens Next Week", content: "..." },
  { id: "4", title: "Faculty Meeting on Friday", content: "..." },
]

const recentCourses = [
  { id: "1", name: "Introduction to Computer Science", students: 32, progress: 45, status: "Active" },
  { id: "2", name: "Advanced Mathematics", students: 24, progress: 68, status: "Active" },
  { id: "3", name: "Business Ethics", students: 18, progress: 92, status: "Active" },
  { id: "4", name: "Data Structures and Algorithms", students: 28, progress: 23, status: "Upcoming" },
]

const recentStudents = [
  { id: "1", name: "Alex Johnson", email: "alex.j@example.com", courses: 3, joinDate: "2023-09-15" },
  { id: "2", name: "Maria Garcia", email: "maria.g@example.com", courses: 2, joinDate: "2023-09-18" },
  { id: "3", name: "James Wilson", email: "james.w@example.com", courses: 4, joinDate: "2023-09-20" },
]

const recentTutors = [
  { id: "1", name: "Dr. Sarah Miller", email: "sarah.m@example.com", courses: 2, rating: 4.8 },
  { id: "2", name: "Prof. David Chen", email: "david.c@example.com", courses: 3, rating: 4.9 },
]

const upcomingEvents = [
  { id: "1", title: "New Student Orientation", date: "2023-10-05", time: "10:00 AM" },
  { id: "2", title: "Faculty Meeting", date: "2023-10-08", time: "2:00 PM" },
  { id: "3", title: "Midterm Exams Begin", date: "2023-10-15", time: "All Day" },
]



interface Announcement {
  id: string
  title: string
  content: string
  recipients: "students" | "tutors" | "both"
  status: "active" | "inactive" | "draft"
  expirationDate?: Date
  createdAt: Date
  updatedAt: Date
}



const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "End of Semester Examination Schedule",
    content: "The end of semester examinations will begin on December 15th...",
    recipients: "both",
    status: "active",
    expirationDate: new Date(2024, 11, 20),
    createdAt: new Date(2024, 2, 1),
    updatedAt: new Date(2024, 2, 1),
  },
  {
    id: "2",
    title: "Holiday Break Notice",
    content: "The school will be closed for the holiday break from December 23rd...",
    recipients: "both",
    status: "active",
    createdAt: new Date(2024, 2, 2),
    updatedAt: new Date(2024, 2, 2),
  },
  {
    id: "3",
    title: "New Course Registration",
    content: "Registration for new courses will open on January 5th...",
    recipients: "students",
    status: "draft",
    createdAt: new Date(2024, 2, 3),
    updatedAt: new Date(2024, 2, 3),
  },
  {
    id: "4",
    title: "Faculty Meeting",
    content: "There will be a faculty meeting on March 15th...",
    recipients: "tutors",
    status: "inactive",
    createdAt: new Date(2024, 2, 4),
    updatedAt: new Date(2024, 2, 4),
  },
]


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
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

  return (
    <div className={`transition-all ease-in-out p-2 duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
  
    <AnnouncementMarquee announcements={SAMPLE_ANNOUNCEMENTS} speed={4} />
 
  <div className="p-6  bg-white my-4 border border-gray-200 rounded-lg space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Admin!</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Button>
        </div>
      </div>


      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4" />
            Courses
          </TabsTrigger>
          <TabsTrigger value="students" className="flex items-center">
            <GraduationCap className="mr-2 h-4 w-4" />
            Students
          </TabsTrigger>
          <TabsTrigger value="tutors" className="flex items-center">
            <UserCircle2 className="mr-2 h-4 w-4" />
            Tutors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,248</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tutors</CardTitle>
                <UserCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">64</div>
                <p className="text-xs text-muted-foreground">+2 new this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">42</div>
                <p className="text-xs text-muted-foreground">+4 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">88%</div>
                <p className="text-xs text-muted-foreground">+2% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Recent Courses</CardTitle>
                <CardDescription>{recentCourses.length} courses added this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCourses.map((course) => (
                    <div key={course.id} className="flex items-center">
                      <div className="w-full space-y-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">{course.name}</p>
                          <Badge variant={course.status === "Active" ? "default" : "outline"}>{course.status}</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div>{course.students} students</div>
                          <div>{course.progress}% complete</div>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/admin/courses" passHref>
                  <Button variant="outline" className="w-full">
                    View All Courses
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Schedule for the next 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start gap-4">
                      <div className="rounded-md bg-primary/10 p-2 text-primary">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{event.title}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-3 w-3" />
                          {event.date} at {event.time}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/admin/calendar" passHref>
                  <Button variant="outline" className="w-full">
                    View Calendar
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
                <Link href="/admin/courses/create" passHref>
                  <Button variant="outline" className="justify-start">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Create New Course
                  </Button>
                </Link>
                <Link href="/admin/announcements/create" passHref>
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
                <Link href="/admin/tickets" passHref>
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
                <CardDescription>{recentStudents.length} new students this month</CardDescription>
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
                <CardDescription>{recentTutors.length} new tutors this month</CardDescription>
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
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Management</CardTitle>
              <CardDescription>Manage all your courses from here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Course management content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
              <CardDescription>Manage all your students from here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Student management content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tutors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tutor Management</CardTitle>
              <CardDescription>Manage all your tutors from here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tutor management content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    </div>
  )
}

