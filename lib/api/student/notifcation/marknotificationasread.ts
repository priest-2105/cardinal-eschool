import { fetchWithAuth, apiUrl } from "../fetchWithAuth";


export async function markNotificationAsRead(token: string, notificationId: number) {
    try {
        const response = await fetchWithAuth(`${apiUrl}/notifications/${notificationId}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to mark notification as read: ${response.status} ${response.statusText} - ${errorMessage}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error in markNotificationAsRead:", error);
        throw error;
    }
}
