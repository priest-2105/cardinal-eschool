import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface SubmissionResponse {
  status: string;
  message: string;
  data: {
    submission: {
      submission: string;
      file: string;
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

  console.log("Submitting assignment with:", {
    url: `${apiUrl}/student/assignments/submit/${assignmentId}`,
    token,
    submissionText,
    file,
  });

  const response = await fetchWithAuth(`${apiUrl}/student/assignments/submit/${assignmentId}`, {
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
