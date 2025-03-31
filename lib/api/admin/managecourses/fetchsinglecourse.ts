import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface CourseDetailsResponse {
  status: string;
  message: string;
  data: {
    class: {
      id: number;
      name: string;
      code: string;
      description: string;
      schedule: {
        days: string[];
        time: string[];
      };
      meeting_link: string;
      learning_outcome: string;
      prerequisite: string;
      department: string;
      semester: string;
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
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch course details");
  }

  return response.json();
}
