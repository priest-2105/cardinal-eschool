import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface AssignResourceResponse {
  status: string;
  message: string;
  data: null;
}

export async function assignResources(token: string, classId: string, resourceIds: number[]): Promise<AssignResourceResponse> {
  const response = await fetchWithAuth(`${apiUrl}/student/class/resource/${classId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ resource_ids: resourceIds }),
  });

  if (!response.ok) {
    throw new Error("Failed to assign resources");
  }

  return response.json();
}
