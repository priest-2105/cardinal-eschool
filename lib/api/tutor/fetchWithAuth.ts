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
        throw new Error("Unauthorized: Token expired or invalid.");
    }

    return response;
}

export { apiUrl };
