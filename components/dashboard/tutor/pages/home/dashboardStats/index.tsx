import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Book, GraduationCap, FileText, Calendar, UserCircle2, BookOpen, LineChart } from "lucide-react"

interface StatsProps {
  overview: {
    total_classes: { total_count: number; percentage_change: number };
    total_students: { total_count: number; percentage_change: number };
    total_assignments: { total_count: number; percentage_change: number };
    total_reports: { total_count: number; percentage_change: number };
    classes_this_week: { total_count: number; percentage_change: number };
  };
}

export function DashboardStats({ overview }: StatsProps) {
  return (
    <div className="space-y-6">
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-sm font-medium">Total Courses Assigned</CardTitle>
                   <GraduationCap className="h-4 w-4 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold">1,248</div>
                   <p className="text-xs text-muted-foreground">+12% from last month</p>
                 </CardContent>
               </Card>
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-sm font-medium">Total Students Assigned</CardTitle>
                   <UserCircle2 className="h-4 w-4 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold">64</div>
                   <p className="text-xs text-muted-foreground">+2 new this month</p>
                 </CardContent>
               </Card>
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-sm font-medium">Reports</CardTitle>
                   <BookOpen className="h-4 w-4 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold">42</div>
                   <p className="text-xs text-muted-foreground">+4 from last month</p>
                 </CardContent>
               </Card>
               <Card>
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                   <CardTitle className="text-sm font-medium">Assignments</CardTitle>
                   <LineChart className="h-4 w-4 text-muted-foreground" />
                 </CardHeader>
                 <CardContent>
                   <div className="text-2xl font-bold">88%</div>
                   <p className="text-xs text-muted-foreground">+2% from last month</p>
                 </CardContent>
               </Card>
             </div>
             </div>
  )
}




