import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function CreateCoupon(
  token: string,
  couponData: { discount_percentage: number }
) {
  const response = await fetchWithAuth(`${apiUrl}/admin/coupons/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(couponData),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to create coupon: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
