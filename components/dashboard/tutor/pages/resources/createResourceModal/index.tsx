"use client"

import type React from "react"
import { useState } from "react"
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
  
  

interface CreateResourceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (resource: Omit<Resource, "id">) => void
}

export function CreateResourceModal({ isOpen, onClose, onSubmit }: CreateResourceModalProps) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (file) {
      const newResource: Omit<Resource, "id"> = {
        title,
        type,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        dateUploaded: new Date(),
        fileUrl: URL.createObjectURL(file),
      }
      onSubmit(newResource)
      resetForm()
    }
  }

  const resetForm = () => {
    setTitle("")
    setType("")
    setFile(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Upload New Resource</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="type">Type</Label>
            <Input id="type" value={type} onChange={(e) => setType(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
              required
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Upload Resource</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

