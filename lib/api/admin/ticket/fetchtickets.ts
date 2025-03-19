import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface TicketFilters {
    status?: string;
    ticket_id?: string;
    department?: string;
}

export async function fetchTicketList(
    token: string,
    page: number = 1,
    perPage: number = 15,
    filters: TicketFilters = {}
) {
    const response = await fetchWithAuth(`${apiUrl}/admin/tickets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
            ...filters,
            page,
            per_page: perPage,
        }),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        console.error(`Failed to fetch ticket list: ${response.status} ${response.statusText} - ${errorMessage}`);
        throw new Error(`Failed to fetch ticket list: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    const responseData = await response.json();
    console.log("Fetched ticket list successfully:", responseData);
    return responseData;
}
