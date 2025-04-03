import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export async function login(email: string, password: string) {
  const response = await fetchWithAuth(`${apiUrl}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const responseData = await response.json();

  if (!response.ok) {
    // Check for specific error messages and provide user-friendly alternatives
    if (responseData.message?.includes("Invalid credentials") || responseData.message?.includes("credentials")) {
      throw new Error("Email or password is incorrect");
    }
    throw new Error(responseData.message || "Login failed. Please try again.");
  }

  return responseData;
}
