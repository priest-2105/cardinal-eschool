"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Student {
  id: string;
  name: string;
  dp_url: string | null;
}

interface StudentListProps {
  coursedetails: {
    students_assigned: Student[];
  };
}

export default function StudentList({ coursedetails }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(coursedetails.students_assigned)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    const filtered = coursedetails.students_assigned.filter(
      (student) => student.name.toLowerCase().includes(term)
    )
    setFilteredStudents(filtered)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
        {filteredStudents.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No students found</div>
        ) : (
          filteredStudents.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={student.dp_url || "/assets/default-avatar.png"} 
                    alt={student.name} 
                  />
                  <AvatarFallback>{student.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium">{student.name}</h3>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

