import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface Schedule {
  days: string[];
  time: string[];
}

interface UpdateCourseRequest {
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

interface UpdateCourseResponse {
  status: string;
  message: string;
  data: {
    class: {
      id: number;
      name: string;
      code: string;
      meeting_link: string;
      description: string;
      learning_outcome: string;
      prerequisite: string;
      department: string;
      semester: string;
      schedule: {
        days: string[];
        time: string[];
        start_date: string | null;
        end_date: string | null;
      };
      tutor_id?: string;
      student_ids?: string[];
      resource_ids?: string;
      created_at?: string;
      updated_at?: string;
    };
  };
}

export async function updateCourse(
  token: string, 
  courseId: string,
  courseData: UpdateCourseRequest
): Promise<UpdateCourseResponse> {
  console.log("Updating course:", courseId);
  console.log("With data:", JSON.stringify(courseData, null, 2));
  
  try {
    const response = await fetchWithAuth(`${apiUrl}/admin/classes/${courseId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(courseData),
    });

    const responseText = await response.text();
    console.log("Raw API Response:", responseText);

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.message || 'Failed to update course');
      } catch {  // removed parameter
        throw new Error(`Server Error: ${response.status} - ${responseText.slice(0, 200)}`);
      }
    }

    try {
      const jsonResponse = JSON.parse(responseText);
      console.log("Parsed API Response:", jsonResponse);
      return jsonResponse;
    } catch {  // removed parameter
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
