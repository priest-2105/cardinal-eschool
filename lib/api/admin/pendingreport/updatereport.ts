import { fetchWithAuth, apiUrl } from "../fetchWithAuth"

export interface UpdateReportStatusResponse {
  status: string
  message: string
  data: null
}

export async function updateReportStatus(
  token: string,
  reportId: number,
  status: string,
): Promise<UpdateReportStatusResponse> {
  const response = await fetchWithAuth(`${apiUrl}/admin/report/${reportId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      status: status,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to update report status")
  }

  return response.json()
}

