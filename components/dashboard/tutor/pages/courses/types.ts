export interface Course {
    id: number;
    name: string;
    tutor: {
      name: string;
      email: string;
      avatar?: string;
    };
    schedule: string;
    status: 'Upcoming' | 'Active' | 'Completed';
    dateAdded: string;
  }
  
  export interface FilterValues {
    courses: string[];
    tutors: string[];
    dateRange: {
      from: Date | undefined;
      to: Date | undefined;
    };
    status: string[];
  }
  
  