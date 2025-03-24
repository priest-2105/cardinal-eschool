import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function getAnnouncementDetails(token: string, announcementId: number) {
  const response = await fetchWithAuth(`${apiUrl}/admin/announcement/${announcementId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch announcement details: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const result = await response.json();
  return result.data.announcement;
}
