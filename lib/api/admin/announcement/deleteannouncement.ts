import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function deleteAnnouncement(token: string, announcementId: number) {
  const response = await fetchWithAuth(`${apiUrl}/admin/announcement/${announcementId}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to delete announcement: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
