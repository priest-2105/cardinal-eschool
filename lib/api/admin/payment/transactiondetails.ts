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
  const url = `${apiUrl}/admin/payments/view?transaction_ref=${transactionRef}`
  // console.log('Making API request to:', url) // Log the URL

  try {
    const response = await fetchWithAuth(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // console.log('Response status:', response.status) // Log response status

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        errorText
      }) // Log error details
      throw new Error(`Failed to fetch transaction details: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json()
    // console.log('API Response data:', data) // Log parsed response data
    return data;
  } catch (error) {
    console.error('API Call Error:', error) // Log any fetch errors
    throw error;
  }
} 