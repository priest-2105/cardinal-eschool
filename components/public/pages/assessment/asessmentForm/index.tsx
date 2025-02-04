"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MultiSelect } from "@/components/ui/multi-select"
import type React from "react"

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

interface FormData { 
  educationLevel: string 
  subjects: string[]
  testPrep: string[]
  expectations: string
  hasLearningDifficulties: string
  learningDifficultiesDetails: string
  selectedPlan: string
  specificGoals: string
}

export default function AssessmentForm({ onSubmit }: { onSubmit: (formData: FormData) => void }) {
  const [formData, setFormData] = useState<FormData>({ 
    educationLevel: "", 
    subjects: [],
    testPrep: [],
    expectations: "",
    hasLearningDifficulties: "",
    learningDifficultiesDetails: "",
    selectedPlan: "",
    specificGoals: "",
  })

  useEffect(() => {
    const savedData = sessionStorage.getItem("signupData")
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setFormData((prevData) => ({
        ...prevData,
      }))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const savedData = sessionStorage.getItem("signupData")
    const updatedData = savedData ? { ...JSON.parse(savedData), ...formData } : formData
    sessionStorage.setItem("signupData", JSON.stringify(updatedData))
    onSubmit(formData)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Education Level */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Learner&apos;s Level of Education</label>
            <Select
              value={formData.educationLevel}
              onValueChange={(value) => setFormData({ ...formData, educationLevel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, i) => (
                  <SelectItem key={i} value={`YEAR ${i + 1}`}>
                    YEAR {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <label className="block text-sm font-medium text-gray-700">Test Preparation Courses</label>
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
            className="w-full px-4 py-2 border border-gray-200 outline-none rounded-md focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent"
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
              onValueChange={(value) => setFormData({ ...formData, hasLearningDifficulties: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YES">Yes</SelectItem>
                <SelectItem value="NO">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.hasLearningDifficulties === "YES" && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">If yes, briefly explain</label>
              <textarea
                value={formData.learningDifficultiesDetails}
                onChange={(e) => setFormData({ ...formData, learningDifficultiesDetails: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border outline-none border-gray-200 rounded-md focus:ring-2 focus:ring-[#1BC2C2] focus:border-transparent"
              />
            </div>
          )}
        </div> 

        <Button type="submit" className="w-full">
          Submit Assessment
        </Button>
      </form>
    </div>
  )
}

