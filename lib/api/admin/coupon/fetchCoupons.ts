import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function fetchCoupons(token: string) {
  const response = await fetchWithAuth(`${apiUrl}/admin/coupons`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch coupons: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
