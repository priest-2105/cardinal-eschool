import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface Ticket {
  codec: string;
  ticket_id: string;
  name: string;
  email: string;
  department: string;
  subject: string;
  status: "open" | "in_progress" | "resolved";
  owner_category: "student" | "tutor" | "admin";
  last_response: string | null;
  responded_by: string | null;
  created_at: string;
  resolved_at: string | null;
}

export interface Pagination {
  current_page: number;
  per_page: number;
  total_pages: number;
  total_items: number;
}

export interface FetchTicketsResponse {
  status: string;
  message: string;
  data: {
    tickets: Ticket[];
    pagination: Pagination;
  };
}

// interface TicketFilters {
//     status?: string;
//     ticket_id?: string;
//     department?: string;
// }

export async function fetchTicketList(
  token: string,
  page: number = 1,
  perPage: number = 15,
  filters: Partial<Pick<Ticket, "status" | "ticket_id" | "department">> = {}
): Promise<FetchTicketsResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
    ...(filters.status && { status: filters.status }),
    ...(filters.ticket_id && { ticket_id: filters.ticket_id }),
    ...(filters.department && { department: filters.department }),
  });

  const response = await fetchWithAuth(`${apiUrl}/admin/tickets?${queryParams.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error(`Failed to fetch ticket list: ${response.status} ${response.statusText} - ${errorMessage}`);
    throw new Error(`Failed to fetch ticket list: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}