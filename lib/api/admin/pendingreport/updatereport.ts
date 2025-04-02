import { fetchWithAuth, apiUrl } from "../fetchWithAuth"

export interface UpdateReportStatusResponse {
  status: string
  message: string
  data: null
}

export async function updateReport(token: string, reportId: number, status: 'approved' | 'rejected') {
  const response = await fetchWithAuth(`${apiUrl}/admin/reports/${reportId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Failed to update report: ${response.status} ${response.statusText} - ${errorMessage}`)
  }

  return response.json()
}

