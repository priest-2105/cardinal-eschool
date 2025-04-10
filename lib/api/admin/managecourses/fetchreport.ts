import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface Report {
  id: number;
  report: string;
  status: "pending" | "completed";
  month: string;
  student_id: string;
  student_name: string;
  created_at: string;
  updated_at: string;
  view_report: {
    download_url: string;
  };
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface ReportsResponse {
  status: string;
  message: string;
  data: {
    reports: Report[];
    pagination: Pagination;
  };
}

export async function getClassReports(token: string, classId: string): Promise<ReportsResponse> {
  const response = await fetchWithAuth(`${apiUrl}/admin/classes/reports/${classId}`, {
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
