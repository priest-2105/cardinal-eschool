import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface Schedule {
  days: string[];
  time: string;
}

interface CreateClassRequest {
  name: string;
  code: string;
  description: string;
  schedule: Schedule;
  meeting_link: string;
  tutor_id: string;
  student_ids: string[];
  learning_outcome: string;
  prerequisite: string;
  department: string;
  semester: string;
}

interface CreateClassResponse {
  status: string;
  message: string;
  data: {
    class: {
      id: number;
      name: string;
      code: string;
      description: string;
      schedule: string;
      tutor_id: string;
      student_ids: string;
      resource_ids: string;
      meeting_link: string;
      learning_outcome: string;
      prerequisite: string;
      department: string;
      semester: string;
      updated_at: string;
      created_at: string;
    };
  };
}

export async function createClass(token: string, classData: CreateClassRequest): Promise<CreateClassResponse> {
  const response = await fetchWithAuth(`${apiUrl}/admin/classes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(classData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create class");
  }

  return response.json();
}
