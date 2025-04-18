import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function updateAssessment(token: string, payload: unknown) {
  console.log("Sending assessment update with payload:", payload);
  
  const response = await fetchWithAuth(`${apiUrl}/student/assessments`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json();
  // console.log("Update Assessment Response:", responseData);

  if (!response.ok) {
    throw new Error(
      JSON.stringify({
        status: responseData.status,
        message: responseData.message,
        data: responseData.data,
      })
    );
  }

  return responseData;
}

