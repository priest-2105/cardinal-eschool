import { fetchWithAuth, apiUrl } from "../fetchWithAuth";


export async function resetPasswordEmail(email: string) {
    const response = await fetchWithAuth(`${apiUrl}/forgot-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Reset password email failed: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}