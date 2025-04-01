import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface DashboardResponse {
  status: string;
  message: string;
  data: {
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
    upcoming_classes: Array<{
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
    }>;
    active_assignments: Array<{
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
    }>;
    pending_reports: Array<{
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
    }>;
    announcements: Array<{
      id: number;
      title: string;
      content: string;
      target_role: string;
      created_at: string;
    }>;
  };
}

export async function getTutorDashboard(token: string): Promise<DashboardResponse> {
  const response = await fetchWithAuth(`${apiUrl}/tutor/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch dashboard data");
  }

  return response.json();
}
