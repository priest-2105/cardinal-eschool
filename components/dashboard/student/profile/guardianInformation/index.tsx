'use client'

import { Button } from "@/components/dashboard/student/ui/button"
import { Card } from "@/components/dashboard/student/ui/card"
import { Input } from "@/components/dashboard/student/ui/input"
import { Label } from "@/components/dashboard/student/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/dashboard/student/ui/select"

export default function GuardianInformation() {
  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-8">
          <div className="relative">
            <img
              src="/assets/img/dashboard/student/Ellipse2036.png"
              alt="Profile"
              className="w-24 h-24 rounded-full "
            />
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-0 right-0 rounded-full bg-white"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Personal Information</h2>
            <p className="text-sm text-muted-foreground">
              Update your personal details and information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Temilade Hassan" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select defaultValue="female">
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="hassantemilade@gmail.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue="08123456789" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Home Address</Label>
            <Input id="address" defaultValue="3 Lawson Street Okeodo, Kwara State" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="education">Education Level</Label>
            <Input id="education" defaultValue="Grade 4" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country of Residence</Label>
            <Input id="country" defaultValue="Nigeria" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State of Residence</Label>
            <Input id="state" defaultValue="Kwara" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employment">Employment Status</Label>
            <Select defaultValue="unemployed">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="employed">Employed</SelectItem>
                <SelectItem value="unemployed">Unemployed</SelectItem>
                <SelectItem value="student">Student</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" type="date" defaultValue="2012-02-15" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button className="bg-[#1BC2C2] hover:bg-teal-600">
            Update Your Profile
          </Button>
        </div>
      </div>
    </Card>
  )
}

function PencilIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  )
}
