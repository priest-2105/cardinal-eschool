import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface CourseDetails {
  status: string;
  message: string;
  data: {
    class: {
      name: string;
      code: string;
      description: string;
      schedule: {
        days: string[];
        time: string[];
      };
      meeting_link: string;
      students_assigned: {
        id: string;
        name: string;
        dp_url: string | null;
      }[];
      resources_assigned: any[];
    };
  };
}

export async function getCourseDetails(token: string, courseId: string): Promise<CourseDetails> {
  const response = await fetchWithAuth(`${apiUrl}/tutor/classes/${courseId}`, {
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
