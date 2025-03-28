"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/store"
import { getResources } from "@/lib/api/tutor/courses/fetchresources"
import { assignResources } from "@/lib/api/tutor/courses/assignresources"
import { Alert } from "@/components/ui/alert"
import { CreateResourceModal } from "../createResourceModal"

interface Resource {
  id: number;
  name: string;
  comment: string;
  file_size: string;
  file_path_url: string;
}

interface AssignResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  onSuccess: () => void;
}

export function AssignResourceModal({ isOpen, onClose, classId, onSuccess }: AssignResourceModalProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [selectedResources, setSelectedResources] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const token = useSelector((state: RootState) => state.auth?.token)

  useEffect(() => {
    if (isOpen && token) {
      fetchResources()
    }
  }, [isOpen, token])

  const fetchResources = async () => {
    try {
      const response = await getResources(token!)
      setResources(response.data.resources)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch resources")
    }
  }

  const handleAssign = async () => {
    if (!selectedResources.length) {
      setError("Please select at least one resource")
      return
    }

    setLoading(true)
    setError(null)

    try {
      await assignResources(token!, classId, selectedResources)
      onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to assign resources")
    } finally {
      setLoading(false)
    }
  }

  const handleResourceSelect = (resourceId: number) => {
    setSelectedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    )
  }

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
    fetchResources()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Resources</DialogTitle>
          </DialogHeader>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <div className="space-y-4">
            <div className="max-h-[300px] overflow-y-auto space-y-2">
              {resources.map((resource) => (
                <div key={resource.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`resource-${resource.id}`}
                    checked={selectedResources.includes(resource.id)}
                    onCheckedChange={() => handleResourceSelect(resource.id)}
                  />
                  <Label htmlFor={`resource-${resource.id}`}>
                    {resource.name} ({resource.file_size})
                  </Label>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create New Resource
            </Button>

            <DialogFooter>
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
              <Button onClick={handleAssign} disabled={loading}>
                {loading ? "Assigning..." : "Assign Resources"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <CreateResourceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </>
  )
}

