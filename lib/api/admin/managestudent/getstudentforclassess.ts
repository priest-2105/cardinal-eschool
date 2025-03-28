import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface Student {
  student_codec: string;
  name: string;
  email: string;
  dp_url: string | null;
  edu_level: string;
  subjects_interested_in: string[];
}

interface StudentListResponse {
  status: string;
  message: string;
  data: Student[];
}

export async function getStudentList(token: string, hasSubscription?: boolean) {
  const url = new URL(`${apiUrl}/admin/getStudents`);
  if (hasSubscription !== undefined) {
    url.searchParams.append("has_subscription", String(hasSubscription));
  }

  const response = await fetchWithAuth(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
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


export async function getStudentForClasses(token: string): Promise<StudentListResponse> {
  const response = await fetchWithAuth(`${apiUrl}/admin/getStudents`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch students for classes");
  }

  return response.json();
}
