import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface VerifyPaymentResponse {
    status: string;
    message: string;
    data: null;
}

export async function verifyPayment(token: string, txRef: string, transactionId: string): Promise<VerifyPaymentResponse> {
    const response = await fetchWithAuth(
        `${apiUrl}/student/payments/callback?status=successful&tx_ref=${txRef}&transaction_id=${transactionId}`, 
        {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to validate payment: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
