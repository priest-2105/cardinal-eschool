import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface TransactionDetailResponse {
  status: string;
  message: string;
  data: {
    status: string;
    message: string;
    data: any;
  };
}

export async function getTransactionDetails(token: string, transactionRef: string): Promise<TransactionDetailResponse> {
  const response = await fetchWithAuth(`${apiUrl}/student/payments/requery?transaction_ref=${transactionRef}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch transaction details: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
