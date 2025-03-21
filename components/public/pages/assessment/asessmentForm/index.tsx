import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export interface FormData {
  plan_id: string;
  education_level: string;
  subjects_interested_in: number[];
  tests_interested_in: string[];
  learning_expectations: string;
  learning_difficulties: boolean;
  learning_difficulty_description: string;
  specific_goals: string;
}

interface AssessmentFormProps {
  onSubmit: (formData: FormData) => void;
  initialData?: FormData | null;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ onSubmit, initialData }) => {
  const [formData, setFormData] = useState<FormData>(
    initialData || {
      plan_id: "",
      education_level: "",
      subjects_interested_in: [],
      tests_interested_in: [],
      learning_expectations: "",
      learning_difficulties: false,
      learning_difficulty_description: "",
      specific_goals: "",
    }
  );

  const subjectsOptions = [
    { label: "Mathematics", value: 1 },
    { label: "English", value: 2 },
    { label: "Physics", value: 3 },
    { label: "Chemistry", value: 4 },
    { label: "Biology", value: 5 },
    { label: "Computer Science", value: 6 },
    { label: "Economics", value: 7 },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      console.log("Updated formData:", updatedData); // Log updated formData
      return updatedData;
    });
  };

  const handleSelectChange = (name: string, value: string | boolean) => {
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };
      console.log("Updated formData:", updatedData); // Log updated formData
      return updatedData;
    });
  };

  const handleCheckboxChange = (name: string, value: number | string, checked: boolean) => {
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: checked
          ? [...(prev[name as keyof FormData] as any[]), value]
          : (prev[name as keyof FormData] as any[]).filter((item) => item !== value),
      };
      console.log("Updated formData:", updatedData); // Log updated formData
      return updatedData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Final formData being submitted:", formData); // Log final formData
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="plan_id">Subscription Plan</Label>
        <Select
          name="plan_id"
          value={formData.plan_id}
          onValueChange={(value) => handleSelectChange("plan_id", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Basic Plan</SelectItem>
            <SelectItem value="2">Standard Plan</SelectItem>
            <SelectItem value="3">Premium Plan</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="education_level">Education Level</Label>
        <Select
          name="education_level"
          value={formData.education_level}
          onValueChange={(value) => handleSelectChange("education_level", value)}
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
        <Label>Subjects Interested In</Label>
        <div className="space-y-2">
          {subjectsOptions.map((subject) => (
            <div key={subject.value} className="flex items-center space-x-2">
              <Checkbox
                id={`subject-${subject.value}`}
                checked={formData.subjects_interested_in.includes(subject.value)}
                onCheckedChange={(checked) => handleCheckboxChange("subjects_interested_in", subject.value, checked as boolean)}
              />
              <Label htmlFor={`subject-${subject.value}`}>{subject.label}</Label>
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
                checked={formData.tests_interested_in.includes(test)}
                onCheckedChange={(checked) => handleCheckboxChange("tests_interested_in", test, checked as boolean)}
              />
              <Label htmlFor={test}>{test}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="learning_expectations">What are your expectations from this course?</Label>
        <Textarea
          id="learning_expectations"
          name="learning_expectations"
          value={formData.learning_expectations}
          onChange={handleChange}
          placeholder="Enter your expectations here"
        />
      </div>

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
        <div>
          <Label htmlFor="learning_difficulty_description">Please provide details about your learning difficulties</Label>
          <Textarea
            id="learning_difficulty_description"
            name="learning_difficulty_description"
            value={formData.learning_difficulty_description}
            onChange={handleChange}
            placeholder="Enter details here"
          />
        </div>
      )}

      <div>
        <Label htmlFor="specific_goals">Specific Goals</Label>
        <Textarea
          id="specific_goals"
          name="specific_goals"
          value={formData.specific_goals}
          onChange={handleChange}
          placeholder="Enter your specific goals here"
        />
      </div>

      <Button type="submit" className="w-full">
        Submit Assessment
      </Button>
    </form>
  );
};

export default AssessmentForm;

