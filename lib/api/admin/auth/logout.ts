import { fetchWithAuth, apiUrl } from "../fetchWithAuth";
 
export async function logout(token: string) {
    const response = await fetchWithAuth(`${apiUrl}/logout`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
    });

    return response.json();
}
