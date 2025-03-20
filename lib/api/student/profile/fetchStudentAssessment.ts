import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function fetchStudentsAssessment(token: string) {
  const response = await fetchWithAuth(`${apiUrl}/student/assements`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch assessment: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
