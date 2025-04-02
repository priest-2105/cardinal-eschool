import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface AssessmentResponse {
  status: string;
  message: string;
  data: {
    assignment: {
      id: number;
      title: string;
      description: string;
      deadline: string;
      file_url: string;
      student: {
        name: string;
      };
    };
  };
}

export async function createAssessment(token: string, classId: string, formData: FormData): Promise<AssessmentResponse> {
  const response = await fetchWithAuth(`${apiUrl}/student/class/assignment/${classId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include', 
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "Failed to create assessment");
  }

  return response.json();
}
