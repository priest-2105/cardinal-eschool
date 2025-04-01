import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface DashboardResponse {
  status: string;
  message: string;
  data: {
    overview: {
      students: {
        total: number;
        new_this_month: number;
        percentage_change: number;
      };
      tutors: {
        total: number;
        new_this_month: number;
        percentage_change: number;
      };
      classes: {
        total: number;
        new_this_month: number;
        percentage_change: number;
      };
      revenue: {
        total: string;
        this_month: string;
      };
    };
    extras: {
      recent_courses: {
        id: number;
        name: string;
        student_count: number;
        created_at: string;
      }[];
      recent_students: {
        user_codec: string;
        name: string;
        email: string;
        is_subscribed: boolean;
        courses_enrolled: number;
      }[];
      recent_tutors: {
        tutor_codec: string;
        name: string;
        email: string;
        courses_assigned: number;
      }[];
    };
  };
}

export async function getDashboardData(token: string): Promise<DashboardResponse> {
  const response = await fetchWithAuth(`${apiUrl}/admin/dashboard`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch dashboard data");
  }

  return response.json();
}
