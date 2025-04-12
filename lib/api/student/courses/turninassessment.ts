import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface SubmissionResponse {
  status: string;
  message: string;
  data: {
    submission: {
      assignment_id: string;
      student_id: string;
      submission: string;
      file_path: string;
      status: string;
      submitted_at: string;
      updated_at: string;
      created_at: string;
      id: number;
      file_path_url: string;
      student: {
        id: number;
        firstname: string;
        lastname: string;
        email: string;
      };
    };
  };
}

export async function submitAssignment(
  token: string,
  assignmentId: string,
  submissionText: string,
  file: File | null
): Promise<SubmissionResponse> {
  const formData = new FormData();
  formData.append("submission", submissionText);
  
  if (file) {
    formData.append("file", file);
  }

  const response = await fetchWithAuth(`${apiUrl}/student/classes/assignments/${assignmentId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error submitting assignment:", errorText);
    throw new Error("Failed to submit assignment");
  }

  return response.json();
}
