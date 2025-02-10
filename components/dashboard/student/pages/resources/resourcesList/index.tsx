"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"

interface Resource {
  id: string
  title: string
  type: string
  size: string
}

const SAMPLE_RESOURCES: Resource[] = [
  { id: "1", title: "Introduction to Scientific Method", type: "PDF", size: "2.3 MB" },
  { id: "2", title: "Matter and Energy Basics", type: "PDF", size: "1.8 MB" },
  { id: "3", title: "Living Systems Overview", type: "PDF", size: "3.1 MB" },
  { id: "4", title: "Earth and Space Science Fundamentals", type: "PDF", size: "2.7 MB" },
  { id: "5", title: "Laboratory Safety Guidelines", type: "PDF", size: "1.2 MB" },
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

