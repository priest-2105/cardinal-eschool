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

export default function GuardianInformationForm() {
  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Guardian Information</h2>
            <p className="text-sm text-muted-foreground">
              Update your guardian details and information
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
          <Label htmlFor="name">Relationship Status</Label>
            <Input id="name" defaultValue="Mother" />
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
            <Label htmlFor="country">Country of Residence</Label>
            <Input id="country" defaultValue="Nigeria" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">State of Residence</Label>
            <Input id="state" defaultValue="Kwara" />
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
