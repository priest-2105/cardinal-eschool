
export interface Assessment {
    id: string
    title: string
    subject: string
    dueDate: Date
    status: "pending" | "submitted" | "graded"
    description?: string
    submittedFile?: string
    studentIds: string[]
    grade?: number
  }
  