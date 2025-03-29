import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface ReportResponse {
  status: string;
  message: string;
  data: {
    report: {
      id: number;
      class_id: number;
      student_id: string;
      report: string;
      status: string;
      month: string;
      updated_at: string;
      created_at: string;
    };
  };
}

export async function createReport(
  token: string, 
  classId: string, 
  data: { 
    student_id: string; 
    month: string; 
    report: string; 
  }
): Promise<ReportResponse> {
  const response = await fetchWithAuth(`${apiUrl}/tutor/class/${classId}/report`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to create report");
  }

  return response.json();
}
