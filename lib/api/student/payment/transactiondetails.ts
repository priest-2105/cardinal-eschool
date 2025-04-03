import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface PaymentDetails {
  flutterwave_transaction_id: string;
  is_subscription_active: boolean;
  subscription_expires_at: string;
}

interface TransactionDetail {
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
  updated_at: string;
  payment_details: PaymentDetails;
}

interface TransactionDetailResponse {
  status: string;
  message: string;
  data: TransactionDetail;
}

export async function getTransactionDetails(token: string, transactionRef: string): Promise<TransactionDetailResponse> {
  const response = await fetchWithAuth(`${apiUrl}/student/payments/view?transaction_ref=${transactionRef}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch transaction details: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
