const apiUrl = process.env.NEXT_PUBLIC_CARDINAL_APP_API_URL;

export async function login(email: string, password: string) {
    const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Login failed: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}
