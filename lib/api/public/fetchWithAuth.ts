import { store } from "../../store"; 
import { clearAuthState } from "../../authSlice";

const apiUrl = process.env.NEXT_PUBLIC_CARDINAL_APP_API_URL;


export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
    const response = await fetch(input, init);

    if (response.status === 401) {
        store.dispatch(clearAuthState());
        throw new Error("Unauthorized: Token expired or invalid.");
    }

    return response;
}

export { apiUrl };
