import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface ResourcesListResponse {
  status: string;
  message: string;
  data: {
    resources: {
      id: number;
      admin_id: string;
      name: string;
      comment: string;
      file_size: string;
      file_path: string;
      created_at: string;
      updated_at: string;
      file_path_url: string;
    }[];
  };
}

export async function getResources(token: string): Promise<ResourcesListResponse> {
  const response = await fetchWithAuth(`${apiUrl}/admin/get/resources`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch resources");
  }

  return response.json();
}
