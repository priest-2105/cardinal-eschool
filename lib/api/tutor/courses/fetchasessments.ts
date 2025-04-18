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
