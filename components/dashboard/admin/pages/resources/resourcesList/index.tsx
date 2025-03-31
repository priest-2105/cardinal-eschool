"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Eye } from "lucide-react"

interface Resource {
  id: number
  name: string
  file_path: string
}

interface ResourcesListProps {
  resources: {
    total: number
    details: Resource[]
  }
}

export default function ResourcesList({ resources }: ResourcesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredResources, setFilteredResources] = useState(resources.details)

  useEffect(() => {
    setFilteredResources(resources.details)
  }, [resources])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    const filtered = resources.details.filter((resource) =>
      resource.name.toLowerCase().includes(term),
    )
    setFilteredResources(filtered)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="relative mb-4">
        <Input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
        {filteredResources.length === 0 ? (
          <p className="text-center text-gray-500">No resources found</p>
        ) : (
          filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="mb-2 sm:mb-0">
                <h3 className="font-medium">{resource.name}</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
                <Button variant="outline" size="sm" asChild>
                  <a href={resource.file_path} target="_blank" rel="noopener noreferrer">
                    <Eye size={16} className="mr-2" />
                    View
                  </a>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

