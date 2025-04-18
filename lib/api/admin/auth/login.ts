import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function login(email: string, password: string) {
    const response = await fetchWithAuth(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    return response.json();
}
 