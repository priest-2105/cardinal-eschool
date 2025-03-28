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

export async function getTutors(token: string): Promise<TutorListResponse> {
  const response = await fetchWithAuth(`${apiUrl}/admin/getTutors`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch tutors");
  }

  return response.json();
}
