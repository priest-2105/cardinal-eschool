"use client"

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchStudentDashboard } from "@/lib/api/student/home/dashboard";
import Assessments from "@/components/dashboard/student/pages/home/assessments";
import UpcomingClasses from "@/components/dashboard/student/pages/home/upcomingClasses";
import { AnnouncementMarquee } from "@/components/dashboard/student/announcementMarquee";
import { DashboardStats } from "@/components/dashboard/student/pages/home/dashboardstat";
import { RootState } from "@/lib/store";
import { DashboardSkeleton } from "@/components/dashboard/student/pages/skeletons/dashboardSkeleton";

interface DashboardData {
  announcements: { id: number; title: string; content: string; created_at: string }[];
  overview: {
    total_classes: { total_class: number; percentage_change: number };
    active_classes: { total_active_class: number; percentage_change: number };
    total_assignments_due: number;
    total_resources: number;
  };
  upcoming_classes: { id: string; name: string; link: string; tutor: { name: string } }[];
  active_assignments: {
    id: string;
    title: string;
    description: string;
    deadline: string;
    class: { name: string; id: string; };
  }[];
}

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = useSelector((state: RootState) => state.auth?.token);

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

  useEffect(() => {
    async function loadDashboardData() {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const data = await fetchStudentDashboard(token);
        setDashboardData(data);
      } catch (error) {
        console.error(error);
      }
    }
    loadDashboardData();
  }, [token]);

  if (!dashboardData) {
    return  <div className={`transition-all ease-in-out max-xs:w-[74%] p-4 duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}><DashboardSkeleton/> </div>;
  }

  return (
    <div className={`transition-all ease-in-out max-xs:w-[74%] p-4 duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
      {dashboardData.announcements?.length > 0 ? (
        <AnnouncementMarquee announcements={dashboardData.announcements} />
      ) : (
        <div className="text-center py-4 text-gray-500">No announcements available</div>
      )}

      <DashboardStats overview={dashboardData.overview} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div>
          {dashboardData.upcoming_classes?.length > 0 ? (
            <UpcomingClasses classes={dashboardData.upcoming_classes} />
          ) : (
            <div className="text-center py-4 text-gray-500">No upcoming classes</div>
          )}
        </div>
        <div>
          {dashboardData.active_assignments?.length > 0 ? (
            <Assessments assignments={dashboardData.active_assignments} />
          ) : (
            <div className="text-center py-4 text-gray-500">No active assignments</div>
          )}
        </div>
      </div>
    </div>
  );
}

