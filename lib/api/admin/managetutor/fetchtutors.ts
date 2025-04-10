import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface Tutor {
  tutor_codec: string;
  name: string;
  email: string;
  qualification: string | null;
  dp_url: string | null; 
}

interface TutorListResponse {
  status: string;
  message: string;
  data: Tutor[];
}

export async function getTutors(token: string): Promise<Tutor[]> {
  const response = await fetchWithAuth(`${apiUrl}/admin/getTutors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch tutors: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const result: TutorListResponse = await response.json();

  
  const baseUrl = apiUrl?.replace("/api", ""); // Adjust base URL if needed
  result.data.forEach((tutor) => {
    if (tutor.dp_url && !tutor.dp_url.startsWith("http")) {
      tutor.dp_url = `${baseUrl}/${tutor.dp_url}`;
    }
  });

  return result.data;
}
