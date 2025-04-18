import { fetchWithAuth, apiUrl } from "../fetchWithAuth";


export async function createTicket(token: string, ticketData: { subject: string; department: string; body: string }) {
    const response = await fetchWithAuth(`${apiUrl}/student/tickets/store`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Ticket creation failed: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}
