import { RootState } from "@/lib/store";
import { useSelector } from "react-redux";

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

export async function logout(token: string) {
    const response = await fetch(`${apiUrl}/logout`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Logout failed: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}

export async function fetchAdminProfile(token: string) {
    const response = await fetch(`${apiUrl}/admin/profile`, {
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
        throw new Error(`Failed to fetch profile: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}
