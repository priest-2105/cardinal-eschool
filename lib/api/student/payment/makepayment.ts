import { fetchWithAuth, apiUrl } from "../fetchWithAuth";


export async function makePayment(
  token: string,
  body: { subscription_plan_id: string; quantity: number; coupon_code: string }
) {
  const response = await fetchWithAuth(`${apiUrl}/student/payments/initiate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to initiate payment: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
