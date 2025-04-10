import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface Schedule {
  days: string[];
  time: string[];
  start_date: string | null;
  end_date: string | null;
}

export interface CourseDetailsResponse {
  status: string;
  message: string;
  data: {
    class: {
      id: number;
      name: string;
      code: string;
      description: string;
      schedule: Schedule;
      meeting_link: string;
      learning_outcome: string;
      prerequisite: string;
      department: string;
      semester: string;
      start_date: string | null;
      end_date: string | null;
      status: string;
      progress_percentage: number;
      days_remaining: number | null;
    };
    tutor: {
      id: string;
      name: string;
      email: string;
    };
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
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch course details: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
