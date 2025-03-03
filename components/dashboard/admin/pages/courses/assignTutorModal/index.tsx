"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface Tutor {
  id: string
  name: string
}

interface AssignTutorModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (tutor: Tutor) => void
  currentTutor: Tutor | null
}

const SAMPLE_TUTORS: Tutor[] = [
  { id: "1", name: "John Doe" },
  { id: "2", name: "Jane Smith" },
  { id: "3", name: "Alice Johnson" },
]

export function AssignTutorModal({ isOpen, onClose, onAssign, currentTutor }: AssignTutorModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(currentTutor)

  useEffect(() => {
    setSelectedTutor(currentTutor)
  }, [currentTutor])

  const filteredTutors = SAMPLE_TUTORS.filter((tutor) => tutor.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleAssign = () => {
    if (selectedTutor) {
      onAssign(selectedTutor)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Tutor</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Tutors</Label>
            <Input
              id="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
            />
          </div>
          <RadioGroup
            value={selectedTutor?.id}
            onValueChange={(value) => setSelectedTutor(SAMPLE_TUTORS.find((t) => t.id === value) || null)}
          >
            {filteredTutors.map((tutor) => (
              <div key={tutor.id} className="flex items-center space-x-2">
                <RadioGroupItem value={tutor.id} id={`tutor-${tutor.id}`} />
                <Label htmlFor={`tutor-${tutor.id}`}>{tutor.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleAssign} disabled={!selectedTutor}>
            Assign Tutor
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

