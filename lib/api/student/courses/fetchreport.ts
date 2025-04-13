import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface Report {
  id: number;
  class_id: number;
  class_name: string;
  class_code: string;
  month: string;
  status: "pending" | "completed";
  created_at: string;
  updated_at: string;
  download_url: string | null;
}

export interface ReportsResponse {
  status: string;
  message: string;
  data: {
    reports: Report[];
    pagination: {
      current_page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
  };
}

export async function getStudentReports(token: string): Promise<ReportsResponse> {
  const response = await fetchWithAuth(`${apiUrl}/student/reports`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch reports");
  }

  return response.json();
}
