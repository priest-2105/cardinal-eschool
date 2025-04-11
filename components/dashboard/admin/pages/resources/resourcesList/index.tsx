"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ViewResourceModal } from "../resourcesDetails"

interface Resource {
  id: number;
  name: string;
  file_path: string;
}

interface ResourcesListProps {
  resources: {
    total: number;
    details: Resource[];
  };
}

export default function ResourcesList({ resources }: ResourcesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredResources, setFilteredResources] = useState(resources.details)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  useEffect(() => {
    setFilteredResources(resources.details)
  }, [resources])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    const filtered = resources.details.filter((resource) =>
      resource.name.toLowerCase().includes(term)
    )
    setFilteredResources(filtered)
  }

  const handleViewResource = (resource: Resource) => {
    setSelectedResource(resource)
    setIsViewModalOpen(true)
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewResource(resource)}
                >
                  <Eye size={16} className="mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <ViewResourceModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        resource={selectedResource}
      />
    </div>
  )
}

