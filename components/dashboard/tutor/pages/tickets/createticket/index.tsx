"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/dashboard/tutor/ui/input"
import { Textarea } from "@/components/dashboard/tutor/ui/textarea"
import { Button } from "@/components/dashboard/tutor/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/tutor/ui/select"
import { Label } from "@/components/dashboard/tutor/ui/label"
import { Alert, AlertTitle, AlertDescription } from "@/components/dashboard/tutor/ui/alert"
import { createTicket, fetchTutorProfile } from "@/lib/api/tutor/api";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store";
import { useEffect } from "react";

interface FormData {
  name: string
  email: string
  department: string
  issue: string
  subject: string
  message: string
}

export default function CreateTicketForm() {
  const token = useSelector((state: RootState) => state.auth?.token);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    department: "",
    issue: "",
    subject: "",
    message: ""
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (token) {
        try {
          const response = await fetchTutorProfile(token);
          setFormData((prev) => ({
            ...prev,
            name: response.data.firstname + " " + response.data.lastname,
            email: response.data.email,
          }));
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      }
    };

    loadUserProfile();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setAlert({ type: 'error', message: "You must be logged in to create a ticket." });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createTicket(token, {
        subject: formData.subject,
        department: formData.department,
        body: formData.message,
      });
      setAlert({ type: 'success', message: response.message || "Ticket created successfully." });
      setTimeout(() => {
        router.push(`/tutor/ticket/${response.data.codec}`);
      }, 2000);
    } catch (error) {
      console.error("Ticket creation failed:", error);
      setAlert({ type: 'error', message: (error as Error).message || "Failed to create ticket." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl p-6 bg-white rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              readOnly
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              readOnly
              required
            />
          </div>
        </div>

        {/* Department */}
        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select
            value={formData.department}
            onValueChange={(value) => setFormData({ ...formData, department: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Admin Department">Admin Department</SelectItem>
              <SelectItem value="Academic Department">Academic Department</SelectItem>
              <SelectItem value="Support Department">Support Department</SelectItem>
              <SelectItem value="Technical Department">Technical Department</SelectItem>
              <SelectItem value="Sales Department">Sales Department</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Issue */}
        <div className="space-y-2">
          <Label htmlFor="issue">Issue</Label>
          <Input
            id="issue"
            value={formData.issue}
            onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
            required
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            required
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
            rows={6}
            required
          />
        </div>

        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Ticket"}
        </Button>
      </form>

      {alert && (
        <Alert variant={alert.type === 'success' ? 'default' : 'danger'} className="mt-4">
          <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
