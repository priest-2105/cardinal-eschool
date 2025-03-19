import { fetchWithAuth, apiUrl } from "../fetchWithAuth";


export async function updateAdminProfile(token: string, profileData: {
    firstname: string;
    lastname: string;
    phone_number: string;
    address: string;
    country: string;
    state: string;
    position: string;
}) {
    const response = await fetchWithAuth(`${apiUrl}/admin/profile/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Profile update failed: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}