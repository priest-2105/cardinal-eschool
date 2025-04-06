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
    const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.ticket_id && { ticket_id: filters.ticket_id }),
        ...(filters.department && { department: filters.department }),
    });

    const response = await fetchWithAuth(`${apiUrl}/admin/tickets?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
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