"use client"

import { Bell, X } from 'lucide-react'
import { Avatar } from "@/components/dashboard/student/ui/avatar"
import { Button } from "@/components/dashboard/student/ui/button"
import { useState } from "react"



const StudentDashboardHeader: React.FC = () => {
  
  const [showNotification, setShowNotification] = useState(true)

  return (
    <div className="fixed top-0 left-64 right-0 z-10 bg-white">
    <div className="relative">
      {showNotification && (
        <div className="bg-[#E9FFFF] px-6 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Great effort so far Temilade!</span>{" "}
              Keep up the tenacity, and with a bit more focus on your attendance, you're sure to reach your full potential!
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-gray-700"
              onClick={() => setShowNotification(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </Button>
          </div>
        </div>
      )}
    </div>
    <div className="border-b">
      <div className="flex h-16 items-center justify-end gap-x-4 px-6">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <Avatar src="/placeholder.svg" alt="User" fallback="TD" />
      </div>
    </div>
  </div>
  
  );
};

export default StudentDashboardHeader;
