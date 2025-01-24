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

export default function CreateTicketForm() {
  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="flex items-center gap-8">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Submit your Complaints</h2>
            <p className="text-sm text-muted-foreground">
            If you are experiencing any issues impacting your service
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name"> Full Name</Label>
            <Input id="name" defaultValue="Temilade Hassan" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" defaultValue="hassantemilade@gmail.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <Input id="department" defaultValue="3 Lawson Street Okeodo, Kwara State" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country of Residence</Label>
            <Input id="country" defaultValue="Nigeria" />
          </div>
          <div className="space-y-2 w-full">
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
