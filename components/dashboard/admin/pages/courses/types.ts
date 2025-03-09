export interface Course {
  id: number
  grade: number,
  name: string
  noOfStudent: number
  schedule: string
  status: "Upcoming" | "Active" | "Completed"
  dateAdded: string
}

export interface FilterValues {
  courses: string[]
  admins: string[]
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
  status: string[]
}

