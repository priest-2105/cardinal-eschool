import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface CourseDetailsResponse {
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


export async function getAdminCourseDetails(token: string, courseId: string): Promise<CourseDetailsResponse> {
  const response = await fetchWithAuth(`${apiUrl}/admin/classes/${courseId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch course details");
  }

  return response.json();
}
