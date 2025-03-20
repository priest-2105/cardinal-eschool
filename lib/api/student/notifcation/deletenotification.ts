import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function deleteNotification(token: string, notificationId: number) {
    try {
        const response = await fetchWithAuth(`${apiUrl}/notifications/${notificationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to delete notification: ${response.status} ${response.statusText} - ${errorMessage}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error in deleteNotification:", error);
        throw error;
    }
}
