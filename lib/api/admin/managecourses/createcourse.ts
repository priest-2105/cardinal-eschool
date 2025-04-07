import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface Schedule {
  days: string[];
  time: string[];
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
      class: {
        id: string;
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
      };
    };
  };
}

export async function createClass(token: string, classData: CreateClassRequest): Promise<CreateClassResponse> {
  console.log("API URL:", `${apiUrl}/admin/classes`);
  console.log("Request Body:", JSON.stringify(classData, null, 2));
  
  try {
    const response = await fetchWithAuth(`${apiUrl}/admin/classes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(classData),
    });

    const responseText = await response.text();
    console.log("Raw API Response:", responseText);

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.message || 'Failed to create class');
      } catch {  // removed parameter
        throw new Error(`Server Error: ${response.status} - ${responseText.slice(0, 200)}`);
      }
    }

    try {
      const jsonResponse = JSON.parse(responseText);
      console.log("Parsed API Response:", jsonResponse);
      return jsonResponse;
    } catch { 
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
