import { store } from "../../store"; 
import { clearAuthState } from "../../authSlice";

const apiUrl = process.env.NEXT_PUBLIC_CARDINAL_APP_API_URL;

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
    const defaultInit: RequestInit = {
        credentials: 'include',
        mode: 'cors',
        headers: {
            'Accept': 'application/json',
        }
    };

    // Merge the default init with the provided init
    const mergedInit = {
        ...defaultInit,
        ...init,
        headers: {
            ...defaultInit.headers,
            ...(init?.headers || {})
        }
    };

    const response = await fetch(input, mergedInit);

    if (response.status === 401) {
        store.dispatch(clearAuthState());
        // Check if this is a login request
        if (input.toString().includes('/login')) {
            throw new Error("Email or password is incorrect");
        }
        throw new Error("Your session has expired. Please log in again.");
    }

    return response;
}

export { apiUrl };
