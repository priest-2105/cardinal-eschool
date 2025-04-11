import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data: {
    class_id?: number;
    ticket_id?: number;
  };
  action_url: string | null;
  read_at: string | null;
  created_at: string;
}

 interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface FetchNotificationsResponse {
  status: string;
  message: string;
  data: {
    notifications: Notification[];
    pagination: Pagination;
  };
}

export async function fetchNotifications(
  token: string,
  page: number = 1,
  perPage: number = 20
): Promise<FetchNotificationsResponse> {
  const response = await fetchWithAuth(`${apiUrl}/notifications?page=${page}&per_page=${perPage}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const data = await response.json();
  return data;
}
