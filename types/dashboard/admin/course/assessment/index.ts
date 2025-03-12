
export interface Assessment {
    id: string
    topic: string
    subject: string
    dueDate: Date
    status: "pending" | "submitted" | "graded"
    description?: string
    submittedFile?: string
    studentIds: string[]
    grade?: number
  }
  