import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function getAnnouncements(token: string) {
  const response = await fetchWithAuth(`${apiUrl}/admin/announcement`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch announcements: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const result = await response.json();
  return result.data.announcements;
}
