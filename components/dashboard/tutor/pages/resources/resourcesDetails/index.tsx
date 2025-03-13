"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


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
  

interface ViewResourceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (resource: Resource) => void
  resource: Resource | null
}

export function ViewResourceModal({ isOpen, onClose, onSubmit, resource }: ViewResourceModalProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState("")
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    if (resource) {
      setTitle(resource.title)
      setType(resource.type)
    }
  }, [resource])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (resource) {
      const updatedResource: Resource = {
        ...resource,
        title,
        type,
        size: file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : resource.size,
        fileUrl: file ? URL.createObjectURL(file) : resource.fileUrl,
      }
      onSubmit(updatedResource)
    }
  }

  if (!resource) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>View Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input readOnly id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Input readOnly id="type" value={type} onChange={(e) => setType(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="file">File </Label>
            <Input readOnly id="file" type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
            {/* <Button type="submit">Update Resource</Button> */}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

