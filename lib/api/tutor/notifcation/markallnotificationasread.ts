import { fetchWithAuth, apiUrl } from "../fetchWithAuth";


export async function markAllNotificationsAsRead(token: string) {
    try {
        const response = await fetchWithAuth(`${apiUrl}/notifications/read-all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to mark all notifications as read: ${response.status} ${response.statusText} - ${errorMessage}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error in markAllNotificationsAsRead:", error);
        throw error;
    }
}
