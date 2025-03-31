import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

interface ResourceResponse {
  status: string;
  message: string;
  data: {
    resource: {
      id: number;
      admin_id: string;
      name: string;
      file_size: string;
      file_path: string;
      comment: string;
      updated_at: string;
      created_at: string;
      file_path_url: string;
    };
  };
}

export async function createResource(token: string, formData: FormData): Promise<ResourceResponse> {
  const response = await fetchWithAuth(`${apiUrl}/admin/resources`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create resource");
  }

  return response.json();
}
