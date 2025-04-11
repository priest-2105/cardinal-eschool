import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function updateGuardianProfile(token: string, profileData: {
  guardian_name: string;
  guardian_email: string;
  guardian_phone: string;
  guardian_gender: string;
  guardian_country: string;
  guardian_state: string;
  guardian_address: string;
}) {
  const response = await fetchWithAuth(`${apiUrl}/student/guardian/profile/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const responseData = await response.json();
  console.log("Update Guardian Profile Response:", responseData);

  if (!response.ok) {
    throw new Error(`Failed to update guardian profile: ${response.status} ${response.statusText} - ${responseData.message}`);
  }

  return responseData;
}

