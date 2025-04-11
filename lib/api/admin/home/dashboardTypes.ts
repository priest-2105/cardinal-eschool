export interface AdminDashboardData {
  overview: {
    students: {
      total: number;
      percentage_change: number;
      new_this_month: number;
    };
    tutors: {
      total: number;
      percentage_change: number;
      new_this_month: number;
    };
    classes: {
      total: number;
      percentage_change: number;
      new_this_month: number;
    };
    completion_rate: number;
    completion_rate_change: number;
  };
  extras: {
    recent_courses: {
      id: number;
      name: string;
      student_count: number;
    }[];
    recent_students: {
      id: string;
      name: string;
      email: string;
      courses?: number;
    }[];
    recent_tutors: {
      id: string;
      name: string;
      email: string;
      courses?: number;
      rating?: number;
    }[];
  };
}
