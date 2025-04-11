import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface CourseDetails {
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
      status: string;
      progress_percentage: number;
      days_remaining: number | null;
      start_date: string | null;
      end_date: string | null;
      department: string;
      semester: string;
      tutor: {
        id: string;
        name: string;
        dp_url: string | null;
      };
      students: {
        id: string;
        name: string;
        dp_url: string | null;
        is_self: boolean;
      }[];
      resources: {
        id: string;
        name: string;
        file_path: string;
      }[];
    };
  };
}

export async function getCourseDetails(token: string, courseId: string): Promise<CourseDetails> {
  const response = await fetchWithAuth(`${apiUrl}/student/class/${courseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch course details");
  }

  return response.json();
}
