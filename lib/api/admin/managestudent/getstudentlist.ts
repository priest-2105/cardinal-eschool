import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function getStudentList(token: string, hasSubscription?: boolean) {
  const url = new URL(`${apiUrl}/admin/getAllStudents`);
  if (hasSubscription !== undefined) {
    url.searchParams.append("has_subscription", String(hasSubscription));
  }

  const response = await fetchWithAuth(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch students: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const result = await response.json();
  return result.data.students;
}
