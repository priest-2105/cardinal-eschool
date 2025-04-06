export interface Course {
  id: number;
  name: string;
  code: string;
  schedule: {
    days: string[];
    time: string[];
  };
  tutor_id: string;
  tutor_name: string;
  status: string;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface FilterValues {
  courses: string[]
  admins: string[]
  tutors: Array<string>
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  status: string[]
}

