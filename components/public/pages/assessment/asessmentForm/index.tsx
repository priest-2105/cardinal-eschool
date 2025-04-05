"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

const subjectOptions = [
  "Maths",
  "English",
  "Science",
  "French",
  "Spanish",
  "Yoruba",
  "Igbo",
  "Hausa",
  "Music",
  "Coding",
  "Biology",
  "Chemistry",
  "Physics",
  "Literature",
  "Data Analytics",
  "Economics",
  "Other",
]

const testOptions = ["SAT", "IELTS", "TOEFL", "GRE", "CELPIP", "PTE", "GMAT", "LSAT", "PSAT", "ACT"]

export interface FormData {
  plan_id: number
  education_level: string
  subjects_interested_in: string[]
  tests_interested_in: string[]
  learning_expectations: string
  learning_difficulties: boolean
  learning_difficulty_description: string
  specific_goals: string
  other_subjects?: string[]
}

interface AssessmentFormProps {
  onSubmit: (formData: FormData) => void
  initialData?: FormData | null
  isSubmitting?: boolean
}

const STORAGE_KEY = "assessment_form_data"

export default function AssessmentForm({ onSubmit, initialData, isSubmitting = false }: AssessmentFormProps) {
  const [subjectError, setSubjectError] = useState("")
  const formDataRef = useRef<FormData | null>(null)
  const [otherSubjects, setOtherSubjects] = useState<string[]>(initialData?.other_subjects || ["", ""])
  const [formData, setFormData] = useState<FormData>(() => {
    // Try to load from localStorage first
    const savedData = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        return {
          ...parsed,
          subjects_interested_in: parsed.subjects_interested_in || [],
          tests_interested_in: parsed.tests_interested_in || [],
          other_subjects: parsed.other_subjects || ["", ""],
        }
      } catch (e) {
        console.error("Error parsing saved form data:", e)
      }
    }

    // Fall back to initialData or default values
    return (
      initialData || {
        plan_id: 0,
        education_level: "",
        subjects_interested_in: [],
        tests_interested_in: [],
        learning_expectations: "",
        learning_difficulties: false,
        learning_difficulty_description: "",
        specific_goals: "",
        other_subjects: ["", ""],
      }
    )
  })

  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 7

  // Keep a reference to the current form data
  useEffect(() => {
    formDataRef.current = formData
  }, [formData])

  // Load saved data on mount and determine starting step
  useEffect(() => {
    const savedData = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        setFormData((curr) => ({
          ...curr,
          ...parsedData,
          subjects_interested_in: parsedData.subjects_interested_in || [],
          tests_interested_in: parsedData.tests_interested_in || [],
        }))

        if (parsedData.other_subjects) {
          setOtherSubjects(parsedData.other_subjects)
        }

        // Set current step based on saved data
        if (parsedData.specific_goals) setCurrentStep(6)
        else if (parsedData.learning_difficulty_description) setCurrentStep(5)
        else if (parsedData.learning_expectations) setCurrentStep(4)
        else if (parsedData.tests_interested_in?.length > 0) setCurrentStep(3)
        else if (parsedData.subjects_interested_in?.length > 0) setCurrentStep(2)
        else if (parsedData.education_level) setCurrentStep(1)
        else if (parsedData.plan_id) setCurrentStep(0)
        else setCurrentStep(0) // Ensure it defaults to 0 if nothing is set
      } catch (e) {
        console.error("Error loading saved form data:", e)
      }
    } else if (initialData) {
      setFormData(initialData)
      setOtherSubjects(initialData.other_subjects || ["", ""])
      if (initialData.plan_id) setCurrentStep(0) // Set to first step if initialData has plan_id
    } else {
      setCurrentStep(0) // Ensure it defaults to 0 if no saved data or initialData
    }
  }, [initialData])

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== "undefined" && formDataRef.current) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formDataRef.current))
    }
  }, [formData])

  // Navigation handlers with validation
  const nextStep = () => {
    console.log("Moving to next step, current form data:", formData)

    // Validate current step
    if (currentStep === 0 && !formData.plan_id) {
      alert("Please select a plan before proceeding")
      return
    }

    if (currentStep === 1 && !formData.education_level) {
      alert("Please select an education level before proceeding")
      return
    }

    // Save current form state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData))
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1))
  }

  const prevStep = () => {
    console.log("Moving to previous step, current form data:", formData)
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  // Helper for horizontal progress lines
  const renderProgressLines = () => (
    <div className="flex justify-center items-center gap-2 my-4">
      {[...Array(totalSteps)].map((_, i) => (
        <div key={i} className={`h-1 w-8 transition-colors ${currentStep >= i ? "bg-[#1BC2C2]" : "bg-gray-200"}`} />
      ))}
    </div>
  )

  // Calculate how many "Other" input fields to show
  const calculateOtherInputsToShow = () => {
    // Safely handle potential null/undefined
    const selectedSubjects = formData.subjects_interested_in || []
    const hasOther = selectedSubjects.includes("Other")

    if (!hasOther) return 0

    // Count non-Other selections
    const nonOtherCount = selectedSubjects.filter((subj) => subj !== "Other").length

    // If we have Other and one other selection, show 1 input
    // If we have only Other, show 2 inputs
    return nonOtherCount === 1 ? 1 : 2
  }

  // Handle changes to "Other" subject inputs
  const handleOtherSubjectChange = (index: number, value: string) => {
    const newOtherSubjects = [...otherSubjects]
    newOtherSubjects[index] = value
    setOtherSubjects(newOtherSubjects)

    setFormData((prev) => ({
      ...prev,
      other_subjects: newOtherSubjects,
    }))
  }

  // Render each step's part of the form
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        console.log("Rendering step 0 with plan_id:", formData.plan_id)
        return (
          <>
            <div>
              <Label htmlFor="plan_id">Subscription Plan</Label>
              <Select
                name="plan_id"
                value={formData.plan_id || ""}
                onValueChange={(value) => {
                  console.log("Selected plan ID:", value)
                  handleSelectChange("plan_id", value)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a plan">
                    {formData.plan_id === 1 && "Basic Plan - $60"}
                    {formData.plan_id === 2 && "Standard Plan - $90"}
                    {formData.plan_id === 3 && "Premium Plan - $120"}
                    {formData.plan_id === 4 && "Group Sessions - $40"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Basic Plan - $60</SelectItem>
                  <SelectItem value="2">Standard Plan - $90</SelectItem>
                  <SelectItem value="3">Premium Plan - $120</SelectItem>
                  <SelectItem value="4">Group Sessions - $40</SelectItem>
                </SelectContent>
              </Select>
              {!formData.plan_id && <p className="text-red-500 text-sm mt-1">Please select a plan</p>}
            </div>
          </>
        )
      case 1:
        console.log("Rendering step 1 with education_level:", formData.education_level)
        return (
          <>
            <div>
              <Label htmlFor="education_level">Education Level</Label>
              <Select
                name="education_level"
                value={formData.education_level || ""}
                onValueChange={(value) => {
                  console.log("Selected education level:", value)
                  handleSelectChange("education_level", value)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select education level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one">Grade One</SelectItem>
                  <SelectItem value="two">Grade Two</SelectItem>
                  <SelectItem value="three">Grade Three</SelectItem>
                  <SelectItem value="four">Grade Four</SelectItem>
                  <SelectItem value="five">Grade Five</SelectItem>
                  <SelectItem value="six">Grade Six</SelectItem>
                  <SelectItem value="seven">Grade Seven</SelectItem>
                  <SelectItem value="eight">Grade Eight</SelectItem>
                  <SelectItem value="nine">Grade Nine</SelectItem>
                  <SelectItem value="ten">Grade Ten</SelectItem>
                  <SelectItem value="eleven">Grade Eleven</SelectItem>
                  <SelectItem value="twelve">Grade Twelve</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {!formData.education_level && (
                <p className="text-red-500 text-sm mt-1">Please select an education level</p>
              )}
            </div>
          </>
        )
      case 2:
        const otherInputsToShow = calculateOtherInputsToShow()

        return (
          <>
            <div>
              <Label>Subjects Interested In (Maximum 2)</Label>
              <MultiSelect
                options={subjectOptions.map((subj) => ({ value: subj, label: subj }))}
                value={formData.subjects_interested_in || []}
                onChange={handleSubjectMultiSelect}
                placeholder="Select up to 2 subjects"
                className="mt-1"
              />
              {subjectError && <p className="text-red-500 text-sm mt-1">{subjectError}</p>}
              {formData.subjects_interested_in?.length === 0 && (
                <p className="text-red-500 text-sm mt-1">Please select at least one subject</p>
              )}

              {otherInputsToShow > 0 && (
                <div className="mt-3 space-y-3">
                  <Label>Please specify your subject{otherInputsToShow > 1 ? "s" : ""}</Label>
                  {[...Array(otherInputsToShow)].map((_, index) => (
                    <Input
                      key={index}
                      placeholder={`Enter subject ${index + 1}`}
                      value={otherSubjects[index] || ""}
                      onChange={(e) => handleOtherSubjectChange(index, e.target.value)}
                      className="mt-1"
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )
      case 3:
        return (
          <>
            <div>
              <Label>Test Preparation</Label>
              <MultiSelect
                options={testOptions.map((test) => ({ value: test, label: test }))}
                value={formData.tests_interested_in || []}
                onChange={(selected) => handleSelectChange("tests_interested_in", selected)}
                placeholder="Select tests you're interested in"
              />
            </div>
          </>
        )
      case 4:
        return (
          <>
            <div>
              <Label htmlFor="learning_expectations">What are your expectations from this course?</Label>
              <Textarea
                id="learning_expectations"
                name="learning_expectations"
                value={formData.learning_expectations || ""}
                onChange={handleChange}
                placeholder="Enter your expectations here"
              />
            </div>
          </>
        )
      case 5:
        return (
          <>
            <div>
              <Label htmlFor="learning_difficulties">Do you have any learning difficulties?</Label>
              <RadioGroup
                name="learning_difficulties"
                value={formData.learning_difficulties ? "yes" : "no"}
                onValueChange={(value) => handleSelectChange("learning_difficulties", value === "yes")}
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
            {formData.learning_difficulties && (
              <div className="mt-4">
                <Label htmlFor="learning_difficulty_description">
                  Please provide details about your learning difficulties
                </Label>
                <Textarea
                  id="learning_difficulty_description"
                  name="learning_difficulty_description"
                  value={formData.learning_difficulty_description || ""}
                  onChange={handleChange}
                  placeholder="Enter details here"
                />
              </div>
            )}
          </>
        )
      case 6:
        return (
          <>
            <div>
              <Label htmlFor="specific_goals">Specific Goals</Label>
              <Textarea
                id="specific_goals"
                name="specific_goals"
                value={formData.specific_goals || ""}
                onChange={handleChange}
                placeholder="Enter your specific goals here"
              />
            </div>
          </>
        )
      default:
        return null
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value }
      return updatedData
    })
  }

  // Add console log to debug plan selection
  const handleSelectChange = (name: string, value: any) => {
    console.log(`Selecting ${name}:`, value)
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: name === "plan_id" ? Number(value) : value }
      return updatedData
    })
  }

  const handleSubjectMultiSelect = (selected: string[]) => {
    const previousSelections = formData.subjects_interested_in || [] // Add default empty array
    const hadOther = previousSelections.includes("Other")
    const hasOther = selected.includes("Other")

    // Check if we're trying to add a third option
    if (selected.length > 2) {
      // If trying to add "Other" but already have 2 selections
      if (hasOther && !hadOther) {
        setSubjectError("You can only select a maximum of two subjects. Please deselect one to select 'Other'.")
      } else {
        setSubjectError("You can only select a maximum of two subjects.")
      }
      return
    }

    setSubjectError("")
    setFormData((prev) => ({
      ...prev,
      subjects_interested_in: selected,
      // Initialize other_subjects if "Other" is selected
      other_subjects: selected.includes("Other") ? prev.other_subjects || ["", ""] : [],
    }))
  }

  const transitionClass = "transition-transform duration-500 ease-in-out"
  const stepPosition = currentStep * 100

  const isFinalStep = currentStep === totalSteps - 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Add validation for current step
    if (currentStep === 0 && !formData.plan_id) {
      alert("Please select a plan before proceeding")
      return
    }

    if (currentStep === 1 && !formData.education_level) {
      alert("Please select an education level before proceeding")
      return
    }

    if (currentStep === 2 && (!formData.subjects_interested_in || formData.subjects_interested_in.length === 0)) {
      alert("Please select at least one subject before proceeding")
      return
    }

    if (isFinalStep) {
      try {
        // Create a deep copy of the form data to avoid reference issues
        const finalFormData = JSON.parse(JSON.stringify(formData))

        // Ensure all fields are properly initialized
        finalFormData.plan_id = finalFormData.plan_id || 0
        finalFormData.education_level = finalFormData.education_level || ""
        finalFormData.subjects_interested_in = finalFormData.subjects_interested_in || []
        finalFormData.tests_interested_in = finalFormData.tests_interested_in || []
        finalFormData.learning_expectations = finalFormData.learning_expectations || ""
        finalFormData.learning_difficulties = !!finalFormData.learning_difficulties
        finalFormData.learning_difficulty_description = finalFormData.learning_difficulty_description || ""
        finalFormData.specific_goals = finalFormData.specific_goals || ""

        // Safe check for "Other" in subjects
        if (finalFormData.subjects_interested_in.includes("Other")) {
          const filledOtherSubjects = otherSubjects.filter((subj) => subj.trim() !== "")

          if (filledOtherSubjects.length > 0) {
            const nonOtherSubjects = finalFormData.subjects_interested_in.filter((subj) => subj !== "Other")
            finalFormData.subjects_interested_in = [...nonOtherSubjects, ...filledOtherSubjects]
          }
        }

        console.log("Final form data being submitted:", finalFormData)
        await onSubmit(finalFormData)
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error("Submit failed:", error)
      }
    } else {
      nextStep()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden relative w-full">
      {renderProgressLines()}

      <div className={`${transitionClass} flex`} style={{ transform: `translateX(-${currentStep * 100}%)` }}>
        {[...Array(totalSteps)].map((_, i) => (
          <div key={i} className="w-full flex-shrink-0 p-2 sm:p-4">
            {i === currentStep && renderStepContent()}
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        <Button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0 || isSubmitting}
          variant="outline"
          className="border border-gray-300 px-4 py-2 rounded"
        >
          Back
        </Button>
        <Button
          type="submit"
          className="bg-[#1BC2C2] text-white px-4 py-2 rounded hover:bg-[#19b0b0]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isFinalStep ? "Submitting..." : "Processing..."}
            </>
          ) : isFinalStep ? (
            "Submit"
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </form>
  )
}

