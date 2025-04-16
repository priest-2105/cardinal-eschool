import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, UserCircle2, BookOpen, LineChart } from "lucide-react"

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
      <div className="flex flex-col gap-4 lg:grid lg:grid-cols-2 xl:grid-cols-4 xl:mx-auto">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses Assigned</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.total_classes.total_count}</div>
            <p className="text-xs text-muted-foreground">
              {overview.total_classes.percentage_change === 0
                ? "No Change"
                : `${overview.total_classes.percentage_change}%`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students Assigned</CardTitle>
            <UserCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.total_students.total_count}</div>
            <p className="text-xs text-muted-foreground">
              {overview.total_students.percentage_change === 0
                ? "No Change"
                : `${overview.total_students.percentage_change}%`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.total_reports.total_count}</div>
            <p className="text-xs text-muted-foreground">
              {overview.total_reports.percentage_change === 0
                ? "No Change"
                : `${overview.total_reports.percentage_change}%`}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assignments</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.total_assignments.total_count}</div>
            <p className="text-xs text-muted-foreground">
              {overview.total_assignments.percentage_change === 0
                ? "No Change"
                : `${overview.total_assignments.percentage_change}%`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}




