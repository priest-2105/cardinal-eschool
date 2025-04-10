import { fetchWithAuth, apiUrl } from "../fetchWithAuth";

export interface ClassSchedule {
  days: string[];
  time: string[];
}

export interface Resource {
  id: number;
  name: string;
  file_url: string;
  file_size_in_kb: string;
}

export interface Class {
  id: number;
  name: string;
  code: string;
  department: string;
  semester: string;
  schedule: ClassSchedule;
  tutor_id: string;
  students: string[];
  resources: Resource[];
  created_at: string;
  updated_at: string;
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

export interface Payment {
  id: number;
  amount: string;
  status: string;
  quantity: number;
  transaction_ref: string;
  flutterwave_txn_id: string | null;
  subscription_plan: string;
  coupon: string | null;
  coupon_discount: string | null;
  tx_date: string;
}

export interface Guardian {
  name: string;
  email: string;
  phone: string;
  gender: string;
  country: string;
  state: string;
  address: string;
}

export interface Assessment {
  edu_level: string;
  subjects_interested_in: string[];
  tests_interested_in: string[];
  learning_expectations: string;
  learning_difficulties: boolean;
  learning_difficulty_description: string | null;
  specific_goals: string | null;
}

export interface AcademicInfo {
  total_classes: number;
  assigned_assignments: number;
  submission_rate: string;
}

export interface StudentProfile {
  id: number;
  owner_id: string;
  address: string;
  phone_number: string;
  edu_level: string;
  country: string;
  state: string;
  employment_status: string;
  dob: string;
  dp_url: string | null;
  channel: string | null;
  created_at: string;
  updated_at: string;
  classes: Class[];
  user: User;
  payments: Payment[];
  guardian: Guardian | null;
  assessment: Assessment | null;
  academic_info: AcademicInfo | null;
}

export interface GetStudentDetailsResponse {
  status: string;
  message: string;
  data: {
    profile: StudentProfile;
  };
}

export async function getStudentDetails(token: string, studentId: string): Promise<StudentProfile> {
  const response = await fetchWithAuth(`${apiUrl}/profiles/student/${studentId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Failed to fetch student details: ${response.status} ${response.statusText} - ${errorMessage}`);
  }

  const result: GetStudentDetailsResponse = await response.json();
  return result.data.profile;
}
