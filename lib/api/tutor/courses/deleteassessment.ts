import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface DeleteAssessmentResponse {
  status: string;
  message: string;
  data: null;
}

export async function deleteAssessment(token: string, assessmentId: number): Promise<DeleteAssessmentResponse> {
  const response = await fetchWithAuth(`${apiUrl}/tutor/assignment/${assessmentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to delete assessment");
  }

  return response.json();
}
