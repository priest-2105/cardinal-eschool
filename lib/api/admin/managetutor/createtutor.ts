import { fetchWithAuth, apiUrl } from "../fetchWithAuth";


export async function createTutor(token: string, tutorData: {
    firstname: string;
    lastname: string;
    email: string;
    phone_number: string;
    gender: string;
}) {
    const response = await fetchWithAuth(`${apiUrl}/admin/create-tutor`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(tutorData),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Tutor creation failed: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}