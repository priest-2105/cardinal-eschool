"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MultiSelect } from "@/components/ui/multi-select"

const subjects = [
  { value: "MATHEMATICS", label: "Mathematics" },
  { value: "ENGLISH", label: "English" },
  { value: "LITERATURE", label: "Literature" },
  { value: "SCIENCE", label: "Science" },
  { value: "BIOLOGY", label: "Biology" },
  { value: "GEOGRAPHY", label: "Geography" },
  { value: "MUSIC", label: "Music" },
  { value: "CODING", label: "Coding" },
  { value: "HISTORY", label: "History" },
  { value: "PHYSICS", label: "Physics" },
  { value: "CHEMISTRY", label: "Chemistry" },
  { value: "IGBO", label: "Igbo" },
  { value: "HAUSA", label: "Hausa" },
  { value: "YORUBA", label: "Yoruba" },
  { value: "SOCIAL_STUDIES", label: "Social Studies" },
  { value: "ECONOMICS", label: "Economics" },
  { value: "DATA_ANALYSIS", label: "Data Analysis" },
]

const testPrep = [
  { value: "SAT", label: "SAT" },
  { value: "IELTS", label: "IELTS" },
  { value: "TOEFL", label: "TOEFL" },
  { value: "CELPIP", label: "CELPIP" },
  { value: "GMAT", label: "GMAT" },
  { value: "GRE", label: "GRE" },
  { value: "PTE", label: "PTE" },
]

export default function AssessmentForm({ onSubmit }: { onSubmit: (formData: any) => void }) {
  const [formData, setFormData] = useState({
    gender: "",
    educationLevel: "",
    dateOfBirth: "",
    subjects: [] as string[],
    testPrep: [] as string[],
    expectations: "",
    hasLearningDifficulties: "",
    learningDifficultiesDetails: "",
    selectedPlan: "",
    specificGoals: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gender */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Learner's Gender
            </label>
            <Select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </Select>
          </div>

          {/* Education Level */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Learner's Level of Education
            </label>
            <Select
              value={formData.educationLevel}
              onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value })}
            >
              <option value="">Select Level</option>
              {[...Array(12)].map((_, i) => (
                <option key={i} value={`YEAR ${i + 1}`}>YEAR {i + 1}</option>
              ))}
            </Select>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Learner's Date of Birth
            </label>
            <Input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
          </div>
        </div>

        {/* Subjects */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            What Subjects are You Interested in Learning?
          </label>
          <MultiSelect
            options={subjects}
            value={formData.subjects}
            onChange={(selected) => setFormData({ ...formData, subjects: selected })}
          />
        </div>

        {/* Test Prep */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Test Preparation Courses
          </label>
          <MultiSelect
            options={testPrep}
            value={formData.testPrep}
            onChange={(selected) => setFormData({ ...formData, testPrep: selected })}
          />
        </div>

        {/* Expectations */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            What are your expectations for this program?
          </label>
          <textarea
            value={formData.expectations}
            onChange={(e) => setFormData({ ...formData, expectations: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent"
          />
        </div>

        {/* Learning Difficulties */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Do you have any learning difficulties or special needs?
            </label>
            <Select
              value={formData.hasLearningDifficulties}
              onChange={(e) => setFormData({ ...formData, hasLearningDifficulties: e.target.value })}
            >
              <option value="">Select</option>
              <option value="YES">Yes</option>
              <option value="NO">No</option>
            </Select>
          </div>

          {formData.hasLearningDifficulties === "YES" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                If yes, briefly explain
              </label>
              <textarea
                value={formData.learningDifficultiesDetails}
                onChange={(e) => setFormData({ ...formData, learningDifficultiesDetails: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent"
              />
            </div>
          )}
        </div>

        {/* Specific Goals */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Is there anything specific you would like to achieve?
          </label>
          <textarea
            value={formData.specificGoals}
            onChange={(e) => setFormData({ ...formData, specificGoals: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent"
          />
        </div>

        <Button type="submit" fullWidth size="lg">
          Submit Assessment
        </Button>
      </form>
    </div>
  )
}


