"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, Mail, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Student {
  id: string
  name: string
  email: string
  phone: string
  enrollmentDate: Date
  status: "active" | "inactive"
  avatar?: string
}


const SAMPLE_STUDENTS: Student[] = [
  {
    id: "1",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    phone: "+1 234-567-8901",
    enrollmentDate: new Date(2023, 0, 15),
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: "2",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    phone: "+1 234-567-8902",
    enrollmentDate: new Date(2023, 1, 1),
    status: "active",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: "3",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    phone: "+1 234-567-8903",
    enrollmentDate: new Date(2023, 2, 10),
    status: "inactive",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  // Add more sample students as needed
]

export default function StudentList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [students, setStudents] = useState(SAMPLE_STUDENTS) 

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    filterStudents(term)
  }
 

  const filterStudents = (term: string) => {
    let filteredStudents = SAMPLE_STUDENTS.filter(
      (student) =>
        student.name.toLowerCase().includes(term.toLowerCase()) ||
        student.email.toLowerCase().includes(term.toLowerCase()),
    )

    if (status !== "all") {
      filteredStudents = filteredStudents.filter((student) => student.status === status)
    }

    setStudents(filteredStudents)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <div className="relative flex-grow px-5">
          <Input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
       
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
        {students.map((student) => (
          <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={student.avatar} alt={student.name} />
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-gray-500 flex items-center">
                  <Mail size={12} className="mr-1" />
                  {student.email}
                </p>
                <p className="text-sm text-gray-500 flex items-center">
                  <Phone size={12} className="mr-1" />
                  {student.phone}
                </p>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  )
}

