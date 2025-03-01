"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search, Calendar, Plus, Edit, Eye } from "lucide-react"
import { format } from "date-fns"
import { CreateResourceModal } from "../createResourceModal"
import { EditResourceModal } from "../editresourcesModal"
import { ViewResourceModal } from "../resourcesDetails"


export interface Student {
  id: string
  name: string
  email: string
}


export interface Resource {
  id: string
  title: string
  type: string
  size: string
  dateUploaded: Date
  fileUrl: string
}

const SAMPLE_RESOURCES: Resource[] = [
  {
    id: "1",
    title: "Introduction to Scientific Method",
    type: "PDF",
    size: "2.3 MB",
    dateUploaded: new Date(2023, 5, 15),
    fileUrl: "/path/to/scientific-method.pdf",
  },
  {
    id: "2",
    title: "Matter and Energy Basics",
    type: "PDF",
    size: "1.8 MB",
    dateUploaded: new Date(2023, 6, 1),
    fileUrl: "/path/to/matter-energy.pdf",
  },
]

export default function ResourcesList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [resources, setResources] = useState(SAMPLE_RESOURCES)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value
    setSearchTerm(term)
    const filteredResources = SAMPLE_RESOURCES.filter((resource) =>
      resource.title.toLowerCase().includes(term.toLowerCase()),
    )
    setResources(filteredResources)
  }

  const handleView = (resource: Resource) => {
    setSelectedResource(resource)
    setIsViewModalOpen(true)
  }

  const handleCreateResource = (newResource: Omit<Resource, "id">) => {
    const id = (resources.length + 1).toString()
    setResources([...resources, { ...newResource, id }])
    setIsCreateModalOpen(false)
  }

  const handleEditResource = (resource: Resource) => {
    setSelectedResource(resource)
    setIsEditModalOpen(true)
  }

  const handleDeleteResource = (id: string) => {
    const updatedResources = resources.filter((resource) => resource.id !== id)
    setResources(updatedResources)
    setIsEditModalOpen(false)
  }

  const handleUpdateResource = (updatedResource: Resource) => {
    const updatedResources = resources.map((resource) =>
      resource.id === updatedResource.id ? updatedResource : resource,
    )
    setResources(updatedResources)
    setIsEditModalOpen(false)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Resources</h2>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Upload Resource
        </Button>
      </div>
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
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="mb-2 sm:mb-0">
              <h3 className="font-medium">{resource.title}</h3>
              <p className="text-sm text-gray-500">
                {resource.type} • {resource.size}
              </p>
              <p className="text-xs text-gray-400 flex items-center mt-1">
                <Calendar size={12} className="mr-1" />
                {format(resource.dateUploaded, "MMM d, yyyy")}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-2 sm:mt-0">
              <Button variant="outline" size="sm" onClick={() => handleView(resource)}>
                <Eye size={16} className="mr-2" />
                View
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleEditResource(resource)}>
                <Edit size={16} className="mr-2" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
      <CreateResourceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateResource}
      />
      <EditResourceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onDelete={handleDeleteResource}
        onSubmit={handleUpdateResource}
        resource={selectedResource}
      />
       <ViewResourceModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        onSubmit={handleUpdateResource}
        resource={selectedResource}
      />
    </div>
  )
}

