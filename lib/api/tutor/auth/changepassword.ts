import { fetchWithAuth, apiUrl } from "../fetchWithAuth";
 

export async function changePassword(token: string, currentPassword: string, newPassword: string, newPasswordConfirmation: string) {
    const response = await fetchWithAuth(`${apiUrl}/change-password`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
            current_password: currentPassword,
            new_password: newPassword,
            new_password_confirmation: newPasswordConfirmation,
        }),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Password change failed: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}