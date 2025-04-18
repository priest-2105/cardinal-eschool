import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function fetchStudentsAssessment(token: string) {
  const response = await fetchWithAuth(`${apiUrl}/student/assessments`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();
  // console.log("Fetch Student Assessment Response:", responseData);

  if (!response.ok) {
    throw new Error(`Failed to fetch assessment: ${response.status} ${response.statusText} - ${responseData.message}`);
  }

  return responseData;
}
