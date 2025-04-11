export interface Report {
  id: number;
  student_id: string;
  student_name: string; // Ensure this property exists
  report: string;
  status: string; // Ensure this property exists
  month: string; // Ensure this property exists
  created_at: string; // Ensure this property exists
  updated_at: string; // Ensure this property exists
}
