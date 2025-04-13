import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface StudentClassResponse {
  status: string;
  message: string;
  data: {
    classes: {
      id: number;
      name: string;
      code: string;
      description: string;
      schedule: {
        days: string[];
        time: string[];
      };
      meeting_link: string;
      status: "active" | "completed" | "upcoming" | "scheduled"; // Updated to include "scheduled"
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
      resources: {
        id: string;
        name: string;
        file_path: string;
      }[];
    }[];
    current_page: number;
    total_pages: number;
    total_classes: number;
  };
}

export async function getStudentClasses(
  token: string, 
  page: number = 1, 
  perPage: number = 10
): Promise<StudentClassResponse> {
  try {
    const response = await fetchWithAuth(
      `${apiUrl}/student/classes?page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || 
        `Failed to fetch classes: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    console.error("Error in getStudentClasses:", error);
    throw error;
  }
}
