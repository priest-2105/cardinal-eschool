import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface Assignment {
  id: number;
  title: string;
  description: string;
  file_path: string;
  deadline: string;
  tutor_id: string;
  submission_status: {
    status: "turned_in" | "not_turned_in";
    submitted_at: string | null;
    file_path: string | null;
    submission_text: string | null;
  };
}

export interface AssignmentsResponse {
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
