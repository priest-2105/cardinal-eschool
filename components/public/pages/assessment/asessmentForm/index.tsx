"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select as UiSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select"
import { Loader2 } from "lucide-react"
import { getSubjects } from "@/lib/api/public/fetchsubjects"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import Select, { MultiValue, StylesConfig } from "react-select"; // Update import
// import Image from "next/image"

const testOptions = ["SAT", "IELTS", "TOEFL", "GRE", "CELPIP", "PTE", "GMAT", "LSAT", "PSAT", "ACT"]

export interface FormData {
  plan_id: number
  education_level: string
  subjects_interested_in: number[]
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
  const [subjects, setSubjects] = useState<{ id: number; name: string }[]>([])
  const token = useSelector((state: RootState) => state.auth?.token)
  const formDataRef = useRef<FormData | null>(null)
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
          learning_expectations: parsed.learning_expectations || "", // Ensure string initialization
          learning_difficulty_description: parsed.learning_difficulty_description || "", // Ensure string initialization
          specific_goals: parsed.specific_goals || "", // Ensure string initialization
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
        learning_expectations: "", // Ensure string initialization
        learning_difficulties: false,
        learning_difficulty_description: "", // Ensure string initialization
        specific_goals: "", // Ensure string initialization
        other_subjects: ["", ""],
      }
    )
  })

  const [currentStep, setCurrentStep] = useState(0)
  const totalSteps = 7

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!token) return
      try {
        const fetchedSubjects = await getSubjects(token)
        setSubjects(fetchedSubjects)
      } catch (error) {
        console.error("Failed to fetch subjects:", error)
      }
    }

    fetchSubjects()
  }, [token])

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
    // console.log("Moving to next step, current form data:", formData)

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
    // console.log("Moving to previous step, current form data:", formData)
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

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.plan_id !== 0; 
      case 1:
        return formData.education_level !== ""; 
      case 2:
        return formData.subjects_interested_in.length === 2;
      case 3:
        return formData.tests_interested_in.length > 0;
      case 4:
        return (formData.learning_expectations || "").trim() !== ""; // Add fallback for null/undefined
      case 5:
        if (formData.learning_difficulties) {
          return (formData.learning_difficulty_description || "").trim() !== ""; // Add fallback for null/undefined
        }
        return true;
      case 6:
        return (formData.specific_goals || "").trim() !== ""; // Add fallback for null/undefined
      default:
        return true;
    }
  };

  // Render each step's part of the form
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        // console.log("Rendering step 0 with plan_id:", formData.plan_id)
        return (
          <>
            <div>
              <Label htmlFor="plan_id">Subscription Plan</Label>
              <UiSelect
                name="plan_id"
                value={formData.plan_id ? formData.plan_id.toString() : ""}
                onValueChange={(value) => {
                  // console.log("Selected plan ID:", value)
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
              </UiSelect>
              {!formData.plan_id && <p className="text-red-500 text-sm mt-1">Please select a plan</p>}
            </div>
          </>
        )
      case 1:
        // console.log("Rendering step 1 with education_level:", formData.education_level)
        return (
          <>
            <div>
              <Label htmlFor="education_level">Education Level</Label>
              <UiSelect
                name="education_level"
                value={formData.education_level || ""}
                onValueChange={(value) => {
                  // console.log("Selected education level:", value)
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
              </UiSelect>
              {!formData.education_level && (
                <p className="text-red-500 text-sm mt-1">Please select an education level</p>
              )}
            </div>
          </>
        )
      case 2:
        // Define custom styles for react-select
        const customStyles: StylesConfig<{ value: number; label: string } | null, true> = {
          multiValue: (base) => ({
            ...base,
            backgroundColor: "#1BC2C2",
            color: "white",
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: "white",
          }),
          multiValueRemove: (base) => ({
            ...base,
            color: "white",
            ":hover": {
              backgroundColor: "#19b0b0",
              color: "white",
            },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 9999,
          }),
        };

        return (
          <>
            <div>
              <Label>Subjects Interested In (Exactly 2)</Label>
              <Select
                isMulti
                options={subjects.map((subject) => ({
                  value: subject.id,
                  label: subject.name,
                }))}
                value={formData.subjects_interested_in.map((id) => {
                  const subject = subjects.find((s) => s.id === id);
                  return subject ? { value: subject.id, label: subject.name } : null;
                }).filter(Boolean)}
                onChange={(selectedOptions: MultiValue<{ value: number; label: string } | null>) => {
                  if (selectedOptions.length <= 2) {
                    setFormData((prev) => ({
                      ...prev,
                      subjects_interested_in: selectedOptions.map((option) => option?.value).filter((value) => value !== undefined),
                    }));
                  }
                }}
                placeholder="Select exactly 2 subjects"
                className="mt-1"
                styles={customStyles}
              />
              {formData.subjects_interested_in.length === 0 && (
                <p className="text-red-500 text-sm mt-1">Please select at least one subject</p>
              )}
              {formData.subjects_interested_in.length > 2 && (
                <p className="text-red-500 text-sm mt-1">You can only select a maximum of 2 subjects</p>
              )}
              {formData.subjects_interested_in.length < 2 && formData.subjects_interested_in.length > 0 && (
                <p className="text-red-500 text-sm mt-1">You must select exactly 2 subjects</p>
              )}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div>
                <Label>Test Preparation</Label>
                <MultiSelect
                options={testOptions.map((test) => ({ value: test, label: test }))}
                value={formData.tests_interested_in || []}
                onChange={(selected) => 
                  setFormData((prev) => ({
                  ...prev,
                  tests_interested_in: selected
                  }))}
                className="mt-1"
                />
              {formData.tests_interested_in.length === 0 && (
                <p className="text-gray-500 text-sm mt-1">Select tests you&lsquo;re interested in</p>
              )}
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

  const handleSelectChange = (name: string, value: string | boolean) => {
    // console.log(`Selecting ${name}:`, value)
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: name === "plan_id" ? Number(value) : value }
      return updatedData
    })
  }

  const transitionClass = "transition-transform duration-500 ease-in-out"

  const isFinalStep = currentStep === totalSteps - 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isStepValid()) return; // Prevent submission if the current step is invalid

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

        // console.log("Final form data being submitted:", finalFormData)
        await onSubmit(finalFormData)

        // Clear assessment data from local storage
        localStorage.removeItem(STORAGE_KEY)
      } catch (error) {
        console.error("Submit failed:", error)
      }
    } else {
      nextStep()
    }
  }

  return (
    <form onSubmit={handleSubmit} className=" relative w-full">
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
          className={`bg-[#1BC2C2] text-white px-4 py-2 rounded hover:bg-[#19b0b0] ${
            !isStepValid() ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isStepValid() || isSubmitting}
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

