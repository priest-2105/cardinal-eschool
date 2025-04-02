import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface AdminClassResponse {
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

export async function getAdminClasses(token: string): Promise<AdminClassResponse> {
  const response = await fetchWithAuth(`${apiUrl}/admin/classes`, {
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
