import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function getStudentList(token: string, hasSubscription?: boolean) {
  const response = await fetchWithAuth(`${apiUrl}/admin/getAllStudents`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(hasSubscription !== undefined ? { has_subscription: hasSubscription } : {}),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch students: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const result = await response.json();
  return result.data.students;
}
