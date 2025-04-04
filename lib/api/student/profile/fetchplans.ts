import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function getPlans() {
    const response = await fetch(`${apiUrl}/getPlans`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        }
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch plans: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}
