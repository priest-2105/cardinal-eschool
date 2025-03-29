import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface UpdateReportResponse {
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
      created_at: string;
      updated_at: string;
    };
  };
}

export async function updateReport(
  token: string, 
  classId: string, 
  reportId: number, 
  data: { report: string }
): Promise<UpdateReportResponse> {
  const response = await fetchWithAuth(`${apiUrl}/tutor/class/${classId}/report/${reportId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to update report");
  }

  return response.json();
}
