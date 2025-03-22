import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function getStudentDetails(token: string, studentId: string) {
  const response = await fetchWithAuth(`${apiUrl}/profiles/student/${studentId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch student details: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const result = await response.json();
  return result.data.profile;
}
