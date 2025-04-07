"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, Eye, FileText, FileImage, FileVideo, FileAudio, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ViewResourceModal } from "../resourcesDetails/index"
import { Badge } from "@/components/ui/badge"

interface Resource {
  id: string;
  name: string;
  file_path: string;
}

interface ResourcesListProps {
  resources: Resource[] | { total: number; details: Resource[] };
  classId?: string;
}

export default function ResourcesList({ resources = [] }: ResourcesListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredResources, setFilteredResources] = useState<Resource[]>([])
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)

  useEffect(() => {
    // Handle both resource formats (direct array or object with details property)
    const resourceArray = Array.isArray(resources) 
      ? resources 
      : resources?.details || [];
    
    setFilteredResources(resourceArray);
  }, [resources])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)
    
    // Handle both resource formats for filtering
    const resourceArray = Array.isArray(resources) 
      ? resources 
      : resources?.details || [];
    
    const filtered = resourceArray.filter((resource) =>
      resource.name.toLowerCase().includes(term)
    )
    setFilteredResources(filtered)
  }

  const handleViewResource = (resource: Resource) => {
    setSelectedResource(resource)
    setIsViewModalOpen(true)
  }

  // Function to determine file type based on URL
  const getFileType = (filePath: string): {
    type: 'pdf' | 'image' | 'video' | 'audio' | 'doc' | 'other', 
    extension: string,
    icon: JSX.Element,
    color: string
  } => {
    const extension = filePath.split('.').pop()?.toLowerCase() || '';
    
    if (extension === 'pdf') {
      return {
        type: 'pdf',
        extension,
        icon: <FileText size={16} />,
        color: 'bg-red-100 text-red-700'
      };
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      return {
        type: 'image',
        extension,
        icon: <FileImage size={16} />,
        color: 'bg-green-100 text-green-700'
      };
    } else if (['mp4', 'webm', 'avi', 'mov'].includes(extension)) {
      return {
        type: 'video',
        extension,
        icon: <FileVideo size={16} />,
        color: 'bg-blue-100 text-blue-700'
      };
    } else if (['mp3', 'wav', 'ogg'].includes(extension)) {
      return {
        type: 'audio',
        extension,
        icon: <FileAudio size={16} />,
        color: 'bg-purple-100 text-purple-700'
      };
    } else if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension)) {
      return {
        type: 'doc',
        extension,
        icon: <FileText size={16} />,
        color: 'bg-blue-100 text-blue-700'
      };
    } else {
      return {
        type: 'other',
        extension: extension || 'unknown',
        icon: <File size={16} />,
        color: 'bg-gray-100 text-gray-700'
      };
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Only show search if there are resources */}
      {filteredResources.length > 0 && (
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
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-4">
        {filteredResources.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <FileText className="h-16 w-16 mb-4 text-gray-300" />
            <p className="text-lg font-medium">No resources available</p>
            <p className="text-sm">No resources have been assigned to this course yet.</p>
          </div>
        ) : (
          filteredResources.map((resource) => {
            const fileInfo = getFileType(resource.file_path);
            
            return (
              <div
                key={resource.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
              >
                <div className="mb-2 sm:mb-0 flex items-center">
                  <div className={`p-2 rounded ${fileInfo.color} mr-3`}>
                    {fileInfo.icon}
                  </div>
                  <div>
                    <h3 className="font-medium">{resource.name}</h3>
                    <Badge 
                      variant="outline" 
                      className={`mt-1 ${fileInfo.color} border-none text-xs`}
                    >
                      {fileInfo.extension.toUpperCase()}
                    </Badge>
                  </div>
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
            );
          })
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

