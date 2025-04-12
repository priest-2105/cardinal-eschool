import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function fetchStudentDashboard(token: string) {
  const response = await fetchWithAuth(`${apiUrl}/student/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch dashboard data: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const data = await response.json();
  return data.data;
}
