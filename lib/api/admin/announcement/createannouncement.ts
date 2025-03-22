import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function createAnnouncement(
  payload: { title: string; message: string; target_role: string },
  token: string
) {
  const response = await fetchWithAuth(`${apiUrl}/admin/announcement`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to create announcement: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
