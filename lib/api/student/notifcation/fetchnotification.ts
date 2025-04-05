import { fetchWithAuth, apiUrl } from "../fetchWithAuth";


export async function fetchNotifications(token: string, page: number = 1, perPage: number = 10) {
    const response = await fetchWithAuth(`${apiUrl}/notifications?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    const data = await response.json();

    return {
        notifications: data.notifications,
        totalPages: data.total_pages,
    };
}
