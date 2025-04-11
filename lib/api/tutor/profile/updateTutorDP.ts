import { fetchWithAuth, apiUrl } from "../fetchWithAuth";
 

export async function updateTutorProfilePicture(token: string, file: File) {
    const formData = new FormData();
    formData.append("profile_picture", file);

    const response = await fetchWithAuth(`${apiUrl}/tutor/profile/update-picture`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Profile picture update failed: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}
