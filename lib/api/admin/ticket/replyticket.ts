import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function ReplyTicket(
  token: string,
  ticketId: string,
  ticketData: { ticket_response: string; status: "in_progress" | "resolved" | "closed" }
) {
  const response = await fetchWithAuth(`${apiUrl}/admin/tickets/respond/${ticketId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(ticketData),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to respond to ticket: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
