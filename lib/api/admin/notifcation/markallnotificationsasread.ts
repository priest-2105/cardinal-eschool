import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface MarkAllNotificationsAsReadResponse {
  status: string;
  message: string;
  data: null;
}

export async function markAllNotificationsAsRead(token: string): Promise<MarkAllNotificationsAsReadResponse> {
  const response = await fetchWithAuth(`${apiUrl}/notifications/read-all`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to mark all notifications as read: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
