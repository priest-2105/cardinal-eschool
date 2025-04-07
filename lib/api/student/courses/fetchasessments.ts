import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface Assignment {
  id: number;
  title: string;
  description: string;
  file_path: string;
  deadline: string;
  tutor_id: string;
}

interface AssignmentsResponse {
  status: string;
  message: string;
  data: {
    assignments: Assignment[];
  };
}

export async function getClassAssignments(token: string, classId: string): Promise<AssignmentsResponse> {
  const response = await fetchWithAuth(`${apiUrl}/student/classes/assignments/${classId}`, {
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
