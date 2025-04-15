"use client";

import UpcomingClasses from "@/components/dashboard/tutor/pages/home/upcomingClasses";
import { useEffect, useState } from "react";
import { getTutorDashboard } from "@/lib/api/tutor/home/dashboard";
import { useSelector } from "react-redux";
import type { RootState } from "@/lib/store";
import { Alert } from "@/components/ui/alert";
import { DashboardSkeleton } from "@/components/dashboard/tutor/pages/skeletons/dashboardSkeleton";
import { AnnouncementMarquee } from "@/components/dashboard/tutor/announcementMarquee";
import { DashboardStats } from "@/components/dashboard/tutor/pages/home/dashboardStats";
import Assessments from "@/components/dashboard/tutor/pages/home/assessments";
import PendingReportsList from "@/components/dashboard/tutor/pages/home/pendingreports/index";

interface TutorDashboardData {
  overview: {
    total_classes: {
      total_count: number;
      percentage_change: number;
    };
    total_students: {
      total_count: number;
      percentage_change: number;
    };
    total_assignments: {
      total_count: number;
      percentage_change: number;
    };
    total_reports: {
      total_count: number;
      percentage_change: number;
    };
    classes_this_week: {
      total_count: number;
      percentage_change: number;
    };
  };
  upcoming_classes: {
    id: number;
    name: string;
    code: string;
    schedule: {
      days: string[];
      time: string[];
    };
    meeting_link: string;
    student_count: number;
    department: string;
    semester: string;
    status: string;
    progress_percentage: number; 
    days_remaining: number | null;
    start_date: string | null; 
    end_date: string | null; 
  }[];
  active_assignments: {
    id: number;
    title: string;
    description: string;
    deadline: string;
    class: {
      id: number;
      name: string;
      code: string;
    };
    file_url: string;
  }[];
  pending_reports: {
    id: number;
    report_text: string;
    report_month: string;
    report_status: string;
    created_at: string;
    class: {
      id: number;
      name: string;
      code: string;
    };
  }[];
  announcements: {
    id: number;
    title: string;
    content: string;
    target_role: string;
    created_at: string;
  }[];
}

export default function TutorDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<TutorDashboardData | null>(null);
  const token = useSelector((state: RootState) => state.auth?.token);

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!token) return;

      setLoading(true);
      try {
        const response = await getTutorDashboard(token);
        const data = response.data;

        const transformedData = {
          ...data,
          upcoming_classes: Object.values(data.upcoming_classes).map(cls => ({
            ...cls,
            status: cls.status || 'active',
            progress_percentage: cls.progress_percentage || 0,
            days_remaining: cls.days_remaining || null,
            start_date: cls.start_date || null,
            end_date: cls.end_date || null
          }))
        };

        setDashboardData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <div className={`transition-all ease-in-out p-2 duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <DashboardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`transition-all ease-in-out p-2 duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div className={`transition-all ease-in-out p-2 duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
      {(dashboardData?.announcements ?? []).length > 0 && (
        <AnnouncementMarquee announcements={dashboardData?.announcements ?? []} />
      )}

      <div className="space-y-6 p-6 bg-white rounded-lg border">
        {dashboardData?.overview && <DashboardStats overview={dashboardData.overview} />}

        <div className="gap-6 max-md:block lg:grid md:grid-cols-2 lg:grid-cols-2">
          <div className="md:col-span-1">
            {(dashboardData?.upcoming_classes ?? []).length > 0 && (
              <UpcomingClasses upcomingClasses={dashboardData?.upcoming_classes ?? []} />
            )}
            {(dashboardData?.pending_reports ?? []).length > 0 && (
              <PendingReportsList reports={dashboardData?.pending_reports ?? []} />
            )}
          </div>
          <div className="space-y-6">
            {(dashboardData?.active_assignments ?? []).length > 0 && (
              <Assessments assignments={dashboardData?.active_assignments ?? []} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

