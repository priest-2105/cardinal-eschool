import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface TicketFilters {
    status?: string;
    ticket_id?: string;
    department?: string;
}

export async function DeleteTicket(token: string, ticketId: string) {
  const response = await fetchWithAuth(`${apiUrl}/admin/tickets/${ticketId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to delete ticket: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
