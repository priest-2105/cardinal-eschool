import { fetchWithAuth, apiUrl } from "./fetchWithAuth";

export async function getSubjects(token: string) {
  const response = await fetchWithAuth(`${apiUrl}/getSubjects`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch subjects: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const result = await response.json();
  return result.data;
}
