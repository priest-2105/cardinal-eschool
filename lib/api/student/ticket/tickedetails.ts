import { fetchWithAuth, apiUrl } from "../fetchWithAuth";


export async function fetchTicketDetails(token: string, ticketCodec: string) {
    const response = await fetchWithAuth(`${apiUrl}/student/tickets/${ticketCodec}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch ticket details: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}
