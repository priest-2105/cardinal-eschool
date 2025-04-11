import { fetchWithAuth, apiUrl } from "../fetchWithAuth"

export interface PendingReportsResponse {
  status: string
  message: string
  data: {
    reports: {
      id: number
      student_id: string
      report: string
      status: string
      month: string
      tutor_id: string
      created_at: string
      updated_at: string
    }[]
  }
}

export async function getPendingReports(token: string): Promise<PendingReportsResponse> {
  const response = await fetchWithAuth(`${apiUrl}/admin/reports`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch pending reports")
  }

  return response.json()
}

