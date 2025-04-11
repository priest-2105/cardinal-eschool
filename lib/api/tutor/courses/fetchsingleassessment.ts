import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface AssignmentDetails {
  id: number;
  title: string;
  description: string;
  file_url: string;
  deadline: string;
  tutor: {
    name: string;
  };
  submission_stats: {
    total_students: number;
    submitted_students: number;
    pending_students: number;
  };
  submissions: unknown[]; // changed from any[] to unknown[]
}

interface AssignmentResponse {
  status: string;
  message: string;
  data: {
    assignment: AssignmentDetails;
  };
}

export async function getAssignmentDetails(token: string, assignmentId: number): Promise<AssignmentResponse> {
  const response = await fetchWithAuth(`${apiUrl}/tutor/assignments/${assignmentId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch assignment details");
  }

  return response.json();
}
