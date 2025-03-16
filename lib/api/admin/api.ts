
const apiUrl = process.env.NEXT_PUBLIC_CARDINAL_APP_API_URL;

export async function login(email: string, password: string) {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    return response.json();
  }