import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function updateUserStatus(token: string, userId: string) {
  const response = await fetchWithAuth(`${apiUrl}/admin/updateAccount/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch user details: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const result = await response.json();
  return result.data.profile;
}
