import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface Assignment {
  id: number;
  title: string;
  description: string;
  file_url: string;
  deadline: string;
  tutor: {
    name: string;
  };
}

interface AssignmentsResponse {
  status: string;
  message: string;
  data: {
    assignments: Assignment[];
  };
}

export async function getClassAssignments(token: string, classId: string): Promise<AssignmentsResponse> {
  const response = await fetchWithAuth(`${apiUrl}/tutor/class/assignments/${classId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch assignments");
  }

  return response.json();
}
