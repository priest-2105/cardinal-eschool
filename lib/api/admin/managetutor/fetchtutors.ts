import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function getTutors(token: string) {
    const response = await fetchWithAuth(`${apiUrl}/admin/getTutors`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch tutors: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}
