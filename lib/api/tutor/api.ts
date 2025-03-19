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



export async function fetchTutorProfile(token: string) {
    const response = await fetch(`${apiUrl}/tutor/profile`, {
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



export async function updateTutorProfile(token: string, profileData: {
    firstname: string;
    lastname: string;
    phone_number: string;
    address: string;
    country: string;
    state: string;
    qualification: string;
}) {
    const response = await fetch(`${apiUrl}/tutor/profile/update`, {
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




export async function updateTutorProfilePicture(token: string, file: File) {
    const formData = new FormData();
    formData.append("profile_picture", file);

    const response = await fetch(`${apiUrl}/tutor/profile/update-picture`, {
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




export async function fetchTicketList(token: string, page: number = 1, perPage: number = 15) {
    const response = await fetch(`${apiUrl}/tutor/tickets?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch ticket list: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}




export async function createTicket(token: string, ticketData: { subject: string; department: string; body: string }) {
    const response = await fetch(`${apiUrl}/tutor/tickets/store`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Ticket creation failed: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}


export async function fetchTicketDetails(token: string, ticketCodec: string) {
    const response = await fetch(`${apiUrl}/tutor/tickets/${ticketCodec}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch ticket details: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}




export async function fetchNotifications(token: string, page: number = 1, perPage: number = 20) {
    const response = await fetch(`${apiUrl}/notifications?page=${page}&per_page=${perPage}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to fetch notifications: ${response.status} ${response.statusText} - ${errorMessage}`);
    }

    return response.json();
}



export async function markNotificationAsRead(token: string, notificationId: number) {
    try {
        const response = await fetch(`${apiUrl}/notifications/${notificationId}/read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to mark notification as read: ${response.status} ${response.statusText} - ${errorMessage}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error in markNotificationAsRead:", error);
        throw error;
    }
}

export async function markAllNotificationsAsRead(token: string) {
    try {
        const response = await fetch(`${apiUrl}/notifications/read-all`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to mark all notifications as read: ${response.status} ${response.statusText} - ${errorMessage}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error in markAllNotificationsAsRead:", error);
        throw error;
    }
}

export async function deleteNotification(token: string, notificationId: number) {
    try {
        const response = await fetch(`${apiUrl}/notifications/${notificationId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Failed to delete notification: ${response.status} ${response.statusText} - ${errorMessage}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error in deleteNotification:", error);
        throw error;
    }
}
