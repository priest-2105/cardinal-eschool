import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface StudentClassResponse {
  status: string;
  message: string;
  data: {
    classes: {
      class_id: number;
      name: string;
      code: string;
      no_of_students: number;
      schedule: {
        days: string[];
        time: string[];
      };
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
