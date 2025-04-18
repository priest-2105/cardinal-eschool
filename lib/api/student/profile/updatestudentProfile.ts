import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function updateStudentProfile(token: string, profileData: {
  firstname: string;
  lastname: string;
  phone_number: string;
  address: string;
  edu_level: string;
  country: string;
  state: string;
  employment_status: string;
}) {
  const response = await fetchWithAuth(`${apiUrl}/student/profile/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const responseData = await response.json();
  // console.log("Update Student Profile Response:", responseData);

  if (!response.ok) {
    throw new Error(`Profile update failed: ${response.status} ${response.statusText} - ${responseData.message}`);
  }

  return responseData;
}

