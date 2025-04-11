export interface TutorDashboardData {
  overview: {
    // Define properties as known from the API response. Adjust as needed.
    total_classes: number;
    active_assignments: number;
    pending_reports: number;
    upcoming_classes: number;
    // Additional overview stats can be added here.
    [key: string]: number;
  };
  announcements: {
    id: number;
    title: string;
    message: string;
    // Other announcement properties.
  }[];
  upcoming_classes: Array<{
    // Define upcoming class properties
    id: number;
    name: string;
    date: string;
    // Add additional fields as needed.
  }>;
  pending_reports: Array<{
    // Define pending report properties
    id: number;
    title: string;
    // Add additional fields as needed.
  }>;
  active_assignments: Array<{
    // Define active assignment properties
    id: number;
    title: string;
    due_date: string;
    // Add additional fields as needed.
  }>;
}
