export interface Ticket {
  id: string
  name: string
  email: string
  department: string
  issue: string
  subject: string
  message: string
  status: string
  lastUpdated: string
}

export interface Department {
  id: string
  name: string
}

export interface ComplaintFormData {
  name: string
  email: string
  department: string
  issue: string
  subject: string
  message: string
}

export interface FilterValues {
  departments: string[]
  dateRange: { from: Date | undefined; to: undefined }
  status: string[]
}
