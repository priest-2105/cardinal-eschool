"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search, Calendar } from "lucide-react"
import { format } from "date-fns"

interface Resource {
  id: string
  title: string
  type: string
  size: string
  dateUploaded: Date
}

const SAMPLE_RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Introduction to Scientific Method",
    type: "PDF",
    size: "2.3 MB",
    dateUploaded: new Date(2023, 5, 15),
  },
  { id: "2", title: "Matter and Energy Basics", type: "PDF", size: "1.8 MB", dateUploaded: new Date(2023, 6, 1) },
  { id: "3", title: "Living Systems Overview", type: "PDF", size: "3.1 MB", dateUploaded: new Date(2023, 6, 10) },
  {
    id: "4",
    title: "Earth and Space Science Fundamentals",
    type: "PDF",
    size: "2.7 MB",
    dateUploaded: new Date(2023, 6, 22),
  },
  { id: "5", title: "Laboratory Safety Guidelines", type: "PDF", size: "1.2 MB", dateUploaded: new Date(2023, 7, 5) },
]

export default function ResourcesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [resources, setResources] = useState(SAMPLE_RESOURCES)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    const filteredResources = SAMPLE_RESOURCES.filter((resource) =>
      resource.title.toLowerCase().includes(term.toLowerCase()),
    )
    setResources(filteredResources)
  }

  const handleDownload = (resourceId: string) => {
    console.log(`Downloading resource with ID: ${resourceId}`)
    // Implement actual download logic here
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
      <div className="space-y-4">
        {resources.map((resource) => (
          <div key={resource.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">{resource.title}</h3>
              <p className="text-sm text-gray-500">
                {resource.type} • {resource.size}
              </p>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Calendar size={12} className="mr-1" />
                {format(resource.dateUploaded, "MMM d, yyyy")}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleDownload(resource.id)}>
              <Download size={16} className="mr-2" />
              Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

