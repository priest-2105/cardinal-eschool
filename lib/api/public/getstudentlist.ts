import { fetchWithAuth, apiUrl } from "./fetchWithAuth";

interface Student {
  student_codec: string;
  name: string;
  email: string;
  dp_url: string | null;
  edu_level: string;
  subjects_interested_in: string[];
}

export async function getStudentList(token: string): Promise<Student[]> {
  const response = await fetchWithAuth(`${apiUrl}/admin/getAllStudents`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch students: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const result = await response.json();
  return result.data.students;
}
