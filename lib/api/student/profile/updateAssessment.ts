import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function updateAssessment(token: string, payload: any) {
  const response = await fetchWithAuth(`${apiUrl}/student/assements`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();
  console.log("Update Assessment Response:", responseData);

  if (!response.ok) {
    throw new Error(`Failed to update assessment: ${response.status} ${response.statusText} - ${responseData.message}`);
  }

  return responseData;
}
