import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function EditAnnouncement(
  payload: { title: string; message: string; target_role: string },
  token: string,
  announcementId: number
) {
  const response = await fetchWithAuth(`${apiUrl}/admin/announcement/${announcementId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to update announcement: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
