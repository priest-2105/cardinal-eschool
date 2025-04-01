import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface Announcement {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface AnnouncementResponse {
  status: string;
  message: string;
  data: {
    announcements: Announcement[];
  };
}

export async function getAnnouncements(token: string): Promise<AnnouncementResponse> {
  const response = await fetchWithAuth(`${apiUrl}/admin/announcement`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to fetch announcements");
  }

  return response.json();
}
