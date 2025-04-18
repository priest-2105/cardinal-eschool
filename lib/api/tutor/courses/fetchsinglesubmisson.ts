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
  const endpoint = `${apiUrl}/tutor/class/assignments/${classId}`;
  // console.log("Fetching assignments from:", endpoint);

  const response = await fetchWithAuth(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    // console.error("Failed to fetch assignments:", errorText); // Log the error response
    throw new Error(`Failed to fetch assignments: ${response.statusText}`);
  }

  const data = await response.json();
  // console.log("Assignments fetched successfully:", data); // Debugging log
  return data;
}

interface SubmissionDetailsResponse {
  status: string;
  message: string;
  data: {
    submission: {
      id: number;
      assignment_id: number;
      student_id: string;
      student_name: string;
      submission: string;
      file_url: string;
      status: string;
      submitted_at: string;
    };
  };
}

export async function getSubmissionDetails(token: string, submissionId: number): Promise<SubmissionDetailsResponse> {
  const endpoint = `${apiUrl}/tutor/submissions/${submissionId}`;
  const response = await fetchWithAuth(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch submission details");
  }

  return response.json();
}
