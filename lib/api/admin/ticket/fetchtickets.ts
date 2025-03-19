import { fetchWithAuth, apiUrl } from "../fetchWithAuth";



export async function fetchTicketList(token: string, page: number = 1, perPage: number = 15) {
    const response = await fetchWithAuth(`${apiUrl}/admin/tickets?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch ticket list: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}
