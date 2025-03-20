import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function deactivateCoupon(token: string, couponCodec: string) {
  const response = await fetchWithAuth(`${apiUrl}/admin/coupons/deactivate/${couponCodec}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to deactivate coupon: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
