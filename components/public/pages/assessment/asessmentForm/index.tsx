import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"

export interface FormData {
  gender: string
  educationLevel: string
  dateOfBirth: string
  subjects: string[]
  testPrep: string[]
  expectations: string
  hasLearningDifficulties: string
  learningDifficultiesDetails: string
  selectedPlan: string
  specificGoals: string
}

interface AssessmentFormProps {
  onSubmit: (formData: FormData) => void
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    gender: "",
    educationLevel: "",
    dateOfBirth: "",
    subjects: [],
    testPrep: [],
    expectations: "",
    hasLearningDifficulties: "",
    learningDifficultiesDetails: "",
    selectedPlan: "",
    specificGoals: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked
        ? [...prev[name as keyof FormData], value]
        : (prev[name as keyof FormData] as string[]).filter((item) => item !== value),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="gender">Gender</Label>
        <RadioGroup
          name="gender"
          value={formData.gender}
          onValueChange={(value) => handleSelectChange("gender", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" />
            <Label htmlFor="female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <Label htmlFor="educationLevel">Education Level</Label>
        <Select
          name="educationLevel"
          value={formData.educationLevel}
          onValueChange={(value) => handleSelectChange("educationLevel", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select education level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="highSchool">High School</SelectItem>
            <SelectItem value="undergraduate">Undergraduate</SelectItem>
            <SelectItem value="graduate">Graduate</SelectItem>
            <SelectItem value="postgraduate">Postgraduate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
      </div>

      <div>
        <Label>Subjects Interested In</Label>
        <div className="space-y-2">
          {["Mathematics", "Science", "English", "History", "Art"].map((subject) => (
            <div key={subject} className="flex items-center space-x-2">
              <Checkbox
                id={subject}
                checked={formData.subjects.includes(subject)}
                onCheckedChange={(checked) => handleCheckboxChange("subjects", subject, checked as boolean)}
              />
              <Label htmlFor={subject}>{subject}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Test Preparation</Label>
        <div className="space-y-2">
          {["SAT", "ACT", "GRE", "GMAT", "TOEFL"].map((test) => (
            <div key={test} className="flex items-center space-x-2">
              <Checkbox
                id={test}
                checked={formData.testPrep.includes(test)}
                onCheckedChange={(checked) => handleCheckboxChange("testPrep", test, checked as boolean)}
              />
              <Label htmlFor={test}>{test}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="expectations">What are your expectations from this course?</Label>
        <Textarea
          id="expectations"
          name="expectations"
          value={formData.expectations}
          onChange={handleChange}
          placeholder="Enter your expectations here"
        />
      </div>

      <div>
        <Label htmlFor="hasLearningDifficulties">Do you have any learning difficulties?</Label>
        <RadioGroup
          name="hasLearningDifficulties"
          value={formData.hasLearningDifficulties}
          onValueChange={(value) => handleSelectChange("hasLearningDifficulties", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id="yes" />
            <Label htmlFor="yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id="no" />
            <Label htmlFor="no">No</Label>
          </div>
        </RadioGroup>
      </div>

      {formData.hasLearningDifficulties === "yes" && (
        <div>
          <Label htmlFor="learningDifficultiesDetails">Please provide details about your learning difficulties</Label>
          <Textarea
            id="learningDifficultiesDetails"
            name="learningDifficultiesDetails"
            value={formData.learningDifficultiesDetails}
            onChange={handleChange}
            placeholder="Enter details here"
          />
        </div>
      )}

      <div>
        <Label htmlFor="selectedPlan">Selected Plan</Label>
        <Select
          name="selectedPlan"
          value={formData.selectedPlan}
          onValueChange={(value) => handleSelectChange("selectedPlan", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="basic">Basic Plan</SelectItem>
            <SelectItem value="standard">Standard Plan</SelectItem>
            <SelectItem value="premium">Premium Plan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="specificGoals">Specific Goals</Label>
        <Textarea
          id="specificGoals"
          name="specificGoals"
          value={formData.specificGoals}
          onChange={handleChange}
          placeholder="Enter your specific goals here"
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Assessment
      </Button>
    </form>
  )
}

export default AssessmentForm

