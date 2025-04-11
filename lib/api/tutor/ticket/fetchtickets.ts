import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface TicketListResponse {
    status: string;
    message: string;
    data: {
        tickets: {
            codec: string;
            ticket_id: string;
            subject: string;
            status: string;
            department: string;
            last_response: string | null;
            responded_by: string | null;
            created_at: string;
        }[];
        pagination: {
            current_page: number;
            per_page: number;
            total_pages: number;
            total_items: number;
        }
    };
}

export async function fetchTicketList(token: string, page: number = 1, perPage: number = 15): Promise<TicketListResponse> {
    const response = await fetchWithAuth(`${apiUrl}/tutor/tickets?page=${page}&per_page=${perPage}`, {
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
