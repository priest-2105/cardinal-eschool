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

export async function resetPasswordEmail(email: string) {
    const response = await fetch(`${apiUrl}/forgot-password`, {
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

export async function updateAdminProfile(token: string, profileData: {
    firstname: string;
    lastname: string;
    phone_number: string;
    address: string;
    country: string;
    state: string;
    position: string;
}) {
    const response = await fetch(`${apiUrl}/admin/profile/update`, {
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

export async function changePassword(token: string, currentPassword: string, newPassword: string, newPasswordConfirmation: string) {
    const response = await fetch(`${apiUrl}/change-password`, {
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
