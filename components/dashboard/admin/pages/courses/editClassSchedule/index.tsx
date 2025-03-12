import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

interface Schedule {
  day: string
  fromTime: string
  toTime: string
}

interface EditClassScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  schedules: Schedule[]
  onSave: (newSchedules: Schedule[]) => void
}

export function EditClassScheduleModal({ isOpen, onClose, schedules, onSave }: EditClassScheduleModalProps) {
  const [editedSchedules, setEditedSchedules] = useState<Schedule[]>(schedules)
  const [newSchedule, setNewSchedule] = useState<Schedule>({ day: "", fromTime: "", toTime: "" })

  const handleAddSchedule = () => {
    if (newSchedule.day && newSchedule.fromTime && newSchedule.toTime) {
      setEditedSchedules([...editedSchedules, newSchedule])
      setNewSchedule({ day: "", fromTime: "", toTime: "" })
    }
  }

  const handleRemoveSchedule = (index: number) => {
    const updatedSchedules = editedSchedules.filter((_, i) => i !== index)
    setEditedSchedules(updatedSchedules)
  }

  const handleSave = () => {
    onSave(editedSchedules)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-fit">
        <DialogHeader>
          <DialogTitle>Edit Class Schedule</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {editedSchedules.map((schedule, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Select
                value={schedule.day}
                onValueChange={(value) => {
                  const updatedSchedules = [...editedSchedules]
                  updatedSchedules[index].day = value
                  setEditedSchedules(updatedSchedules)
                }}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="time"
                value={schedule.fromTime}
                onChange={(e) => {
                  const updatedSchedules = [...editedSchedules]
                  updatedSchedules[index].fromTime = e.target.value
                  setEditedSchedules(updatedSchedules)
                }}
                className="w-[100px]"
              />
              <Input
                type="time"
                value={schedule.toTime}
                onChange={(e) => {
                  const updatedSchedules = [...editedSchedules]
                  updatedSchedules[index].toTime = e.target.value
                  setEditedSchedules(updatedSchedules)
                }}
                className="w-[100px]"
              />
              <Button variant="ghost" size="sm" onClick={() => handleRemoveSchedule(index)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
          <div className="flex items-center space-x-2">
            <Select value={newSchedule.day} onValueChange={(value) => setNewSchedule({ ...newSchedule, day: value })}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Monday">Monday</SelectItem>
                <SelectItem value="Tuesday">Tuesday</SelectItem>
                <SelectItem value="Wednesday">Wednesday</SelectItem>
                <SelectItem value="Thursday">Thursday</SelectItem>
                <SelectItem value="Friday">Friday</SelectItem>
                <SelectItem value="Saturday">Saturday</SelectItem>
                <SelectItem value="Sunday">Sunday</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="time"
              value={newSchedule.fromTime}
              onChange={(e) => setNewSchedule({ ...newSchedule, fromTime: e.target.value })}
              className="w-[100px]"
            />
            <Input
              type="time"
              value={newSchedule.toTime}
              onChange={(e) => setNewSchedule({ ...newSchedule, toTime: e.target.value })}
              className="w-[100px]"
            />
            <Button variant="outline" size="sm" onClick={handleAddSchedule}>
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

