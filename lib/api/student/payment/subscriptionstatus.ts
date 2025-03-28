import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface SubscriptionStatus {
  status: string;
  message: string;
  data: {
    plan: string;
    expires_at: string;
  };
}

export async function checkSubscriptionStatus(token: string): Promise<SubscriptionStatus> {
  const response = await fetchWithAuth(`${apiUrl}/student/subscription/check`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to check subscription status");
  }

  return response.json();
}
