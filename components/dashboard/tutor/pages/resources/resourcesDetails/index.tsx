"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
    comment?: string
}

interface ViewResourceModalProps {
  isOpen: boolean
  onClose: () => void
  resource: Resource | null
}

export function ViewResourceModal({ isOpen, onClose, resource }: ViewResourceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Resource Details</DialogTitle>
        </DialogHeader>
        
        {resource && (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <p className="mt-1 text-sm">{resource.title}</p>
            </div>
            {resource.comment && (
              <div>
                <Label>Comment</Label>
                <p className="mt-1 text-sm">{resource.comment}</p>
              </div>
            )}
            <div>
              <Label>File</Label>
              <a 
                href={resource.fileUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 inline-block text-[#1BC2C2] hover:underline"
              >
                View File
              </a>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

