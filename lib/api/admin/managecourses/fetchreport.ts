import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface Report {
  id: number;
  student_id: string;
  report: string;
  status: "pending" | "completed";
  month: string;
  created_at: string;
  updated_at: string;
  student_name: "TheMan Himself",
  view_report: {
  download_url: "http://localhost:8000/api/v1/admin/classes/reports/1/1/pdf"
  }
}

interface ReportsResponse {
  status: string;
  message: string;
  data: {
    reports: Report[];
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
