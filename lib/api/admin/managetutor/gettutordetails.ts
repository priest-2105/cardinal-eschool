import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface Schedule {
  days: string[];
  time: string[];
}

export interface Class {
  id: number;
  name: string;
  code: string;
  department: string;
  semester: string;
  schedule: Schedule;
  student_count: number;
}

export interface User {
  name: string;
  email: string;
  gender: string;
  account_status: string;
  last_login: string;
  joined_at: string;
  has_subscription: boolean;
  subscription_expires_at: string | null;
  subscription_plan: string | null;
}

export interface TutorOverview {
  total_students: number;
  total_classes: number;
  total_reports: number;
  classes_this_week: number;
}

export interface TutorProfile {
  id: number;
  owner_id: string;
  phone_number: string;
  qualification: string;
  dp_url: string | null;
  address: string;
  country: string;
  state: string;
  created_at: string;
  updated_at: string;
  user: User;
  tutor_overview: TutorOverview;
  classes: Class[];
}

export interface GetTutorDetailsResponse {
  status: string;
  message: string;
  data: {
    profile: TutorProfile;
  };
}

export async function getTutorDetails(token: string, tutorId: string): Promise<TutorProfile> {
  const response = await fetchWithAuth(`${apiUrl}/profiles/tutor/${tutorId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch tutor details: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const result: GetTutorDetailsResponse = await response.json();
  return result.data.profile;
}
