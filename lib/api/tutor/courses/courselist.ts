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

export async function getTutorClasses(token: string, page: number = 1, perPage: number = 10): Promise<TutorClassResponse> {
  const response = await fetchWithAuth(`${apiUrl}/tutor/classes?page=${page}&per_page=${perPage}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch classes: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
