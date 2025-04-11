import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function Signup(payload: {
  firstname: string;
  lastname: string;
  email: string | null;
  password: string;
  password_confirmation: string;
  gender: string;
  dob: string;
  channel: string;
  guardian_name: string | null;
  guardian_email: string | null;
  guardian_phone: string | null;
}) {
  const response = await fetchWithAuth(`${apiUrl}/register/student`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Signup failed: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  return response.json();
}
