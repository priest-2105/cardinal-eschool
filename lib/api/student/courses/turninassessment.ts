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

  await fetchWithAuth(`${apiUrl}/student/assignments/submit/${assignmentId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  // Return a mock response or handle the actual response if needed
  return {
    status: "success",
    message: "Assignment submitted successfully",
    data: {
      submission: {
        submission: submissionText,
        file: file ? file.name : "",
      },
    },
  };
}
