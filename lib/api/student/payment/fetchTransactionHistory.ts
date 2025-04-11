import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface TransactionHistory {
  id: number;
  subscription_plan_id: number;
  subscription_plan_name: string;
  amount: string;
  quantity: number;
  discount: string;
  transaction_ref: string;
  status: string;
  coupon_code: string | null;
  created_at: string;
}

interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

interface TransactionHistoryResponse {
  status: string;
  message: string;
  data: {
    data: TransactionHistory[];
    pagination: PaginationInfo;
  };
}

export async function fetchTransactionHistory(token: string): Promise<TransactionHistoryResponse> {
  const response = await fetchWithAuth(`${apiUrl}/student/payments/history`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch transaction history: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
