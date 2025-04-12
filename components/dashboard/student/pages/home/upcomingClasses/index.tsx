"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/dashboard/student/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/dashboard/student/ui/avatar";
import Link from "next/link";

interface Class {
  id: string;
  name: string;
  link: string;
  tutor: { name: string };
}

interface UpcomingClassesProps {
  classes: Class[];
}

export default function UpcomingClasses({ classes }: UpcomingClassesProps) {
  return (
    <Card className="mt-5 min-h-64">
      <CardHeader>
        <CardTitle>Upcoming classes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {classes.map((class_) => (
          <div
            key={class_.id}
            className="flex items-center justify-between max-sm:block space-x-4 p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex max-sm:block items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder.svg" alt={class_.tutor.name} />
              </Avatar>
              <div>
                <h3 className="font-medium max-sm:my-2">{class_.name}</h3>
                <span className="text-sm text-gray-500">by {class_.tutor.name}</span>
              </div>
            </div>
            <Link href={class_.link} target="_blank" className="bg-[#1BC2C2] px-5 py-1 max-sm:my-2 hover:bg-teal-600 text-white rounded-md">
              Join
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

