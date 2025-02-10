"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CourseDescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
}

export function CourseDescriptionModal({ isOpen, onClose, title, description }: CourseDescriptionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[300px] w-full rounded-md border p-4 overflow-y-auto">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{description}</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

