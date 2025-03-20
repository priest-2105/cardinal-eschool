import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function fetchGuardianProfile(token: string) {
  const response = await fetchWithAuth(`${apiUrl}/student/guardian/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch guardian profile: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
