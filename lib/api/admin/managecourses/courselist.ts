import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface AdminClassResponse {
  status: string;
  message: string;
  data: {
    classes: {
      id: number;
      name: string;
      code: string;
      schedule: {
        days: string[];
        time: string[];
      };
      tutor_id: string;
      tutor_name: string;
      status: string;
      progress_percentage: number;
      created_at: string;
      updated_at: string;
    }[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
}

export async function getAdminClasses(
  token: string,
  search: string = "",
  perPage: number = 10,
  page: number = 1
): Promise<AdminClassResponse> {
  const queryParams = new URLSearchParams({
    search: search || "",
    per_page: perPage.toString(),
    page: page.toString(),
  });

  const response = await fetchWithAuth(`${apiUrl}/admin/classes?${queryParams.toString()}`, {
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

