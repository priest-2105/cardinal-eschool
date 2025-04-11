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
        current_page: number;
        per_page: number;
        total_pages: number;
        total_items: number;
    };
}

interface TicketFilters {
    status?: string;
    search?: string;
    department?: string;
}

export async function fetchTicketList(
    token: string, 
    page: number = 1, 
    perPage: number = 15,
    filters: TicketFilters = {}
): Promise<TicketListResponse> {
    const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        ...(filters.status && { status: filters.status }),
        ...(filters.search && { search: filters.search }),
        ...(filters.department && { department: filters.department }),
    });

    const response = await fetchWithAuth(`${apiUrl}/student/tickets?${queryParams.toString()}`, {
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
