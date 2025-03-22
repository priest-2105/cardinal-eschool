import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function updateUserStatus(token: string, userId: string, payload: { status: string }) {
  const response = await fetchWithAuth(`${apiUrl}/admin/updateAccount/${userId}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to update user status: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
