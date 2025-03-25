import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function getPlans(token: string, planId: string) {
  const response = await fetchWithAuth(`${apiUrl}/getplans?id=${planId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch plan: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
