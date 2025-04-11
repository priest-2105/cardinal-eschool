import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface Report {
  id: number;
  student_id: string;
  student_name: string; // Add student_name to match the response
  report: string;
  status: string; // Change to string to match the response
  month: string;
  created_at: string;
  updated_at: string;
}

interface ReportsResponse {
  status: string;
  message: string;
  data: {
    reports: Report[];
  };
}

export async function getClassReports(token: string, classId: string): Promise<ReportsResponse> {
  const response = await fetchWithAuth(`${apiUrl}/tutor/class/${classId}/reports`, {
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
