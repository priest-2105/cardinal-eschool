import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface TutorClassResponse {
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

export async function getTutorClasses(token: string): Promise<TutorClassResponse> {
  const response = await fetchWithAuth(`${apiUrl}/tutor/classes`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch classes");
  }

  return response.json();
}
