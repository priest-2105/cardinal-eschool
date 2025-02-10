"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CourseDescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
}

export function CourseDescriptionModal({ isOpen, onClose, title, description }: CourseDescriptionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] w-full rounded-md border p-4">
          <p className="text-sm text-gray-700">{description}</p>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

