"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useSelector } from "react-redux"
import { getTutors } from "@/lib/api/admin/managetutor/fetchtutors"
import type { RootState } from "@/lib/store"

interface Tutor {
  tutor_codec: string
  name: string
  email: string
  qualification: string | null
  dp_url: string | null
}

interface AssignTutorModalProps {
  isOpen: boolean
  onClose: () => void
  onAssign: (tutor: Tutor) => void
  currentTutor: Tutor | null
}

export function AssignTutorModal({ isOpen, onClose, onAssign, currentTutor }: AssignTutorModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(currentTutor)
  const [tutors, setTutors] = useState<Tutor[]>([])
  const [loading, setLoading] = useState(false)
  const token = useSelector((state: RootState) => state.auth?.token)

  useEffect(() => {
    const loadTutors = async () => {
      if (!token) return
      setLoading(true)
      try {
        const response = await getTutors(token)
        setTutors(response.data)
      } catch (error) {
        console.error("Failed to load tutors:", error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      loadTutors()
    }
  }, [isOpen, token])

  useEffect(() => {
    setSelectedTutor(currentTutor)
  }, [currentTutor])

  const filteredTutors = tutors.filter((tutor) =>
    tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tutor.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
              placeholder="Search by name or email..."
            />
          </div>
          <RadioGroup
            value={selectedTutor?.tutor_codec}
            onValueChange={(value) => setSelectedTutor(tutors.find((t) => t.tutor_codec === value) || null)}
          >
            {filteredTutors.map((tutor) => (
              <div key={tutor.tutor_codec} className="flex items-center space-x-2">
                <RadioGroupItem value={tutor.tutor_codec} id={`tutor-${tutor.tutor_codec}`} />
                <Label htmlFor={`tutor-${tutor.tutor_codec}`}>
                  {tutor.name} ({tutor.email})
                </Label>
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

