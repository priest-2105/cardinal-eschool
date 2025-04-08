"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import cardinalConfig from "@/config"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/lib/store"
import { fetchStudentProfile } from "@/lib/api/student/api"

interface ProfileData {
  date_of_birth?: string
  firstname?: string
  lastname?: string
  email?: string
  phone_number?: string
  gender?: string
  education_level?: string
  employment_status?: string
  home_address?: string
  country_of_residence?: string
  state_of_residence?: string
  profile_picture?: string | null
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const token = useSelector((state: RootState) => state.auth?.token)
  const [profile, setProfile] = useState<ProfileData>({})

  
  const calculateAge = (dateOfBirth: string): number => {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()

    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }

    return age
  }

  // Check if user is under 16 years old
  const isUnder16 = profile.date_of_birth ? calculateAge(profile.date_of_birth) < 16 : true

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (token) {
          const response = await fetchStudentProfile(token)
          setProfile(response.data)
          console.log("user data", response.data)
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      }
    }

    getProfile()
  }, [token])

  
  const filteredTabs = [
    {
      title: "Personal Information",
      href: cardinalConfig.routes.dashboard.student.studentinformation,
      exact: true,
    },
    ...(isUnder16
      ? [
          {
            title: "Guardian Information",
            href: cardinalConfig.routes.dashboard.student.guardianinformation,
          },
        ]
      : []),
    {
      title: "Settings",
      href: cardinalConfig.routes.dashboard.student.studentprofilesettings,
    },
  ]

  return (
    <div className="flex flex-col w-full mx-auto px-4 max-sm:w-[100%]">
      <div className="border-b mb-4 md:mb6 overflow-x-auto">
        <div className="flex space-x-4 md:space-x-8">
          {filteredTabs.map((tab) => {
            const isActive = tab.exact ? pathname === tab.href : pathname?.startsWith(tab.href)

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "pb-2 text-sm font-medium transition-colors relative whitespace-nowrap",
                  isActive ? "text-[#1BC2C2] border-b-2 border-[#1BC2C2]" : "text-gray-500 hover:text-gray-700",
                )}
              >
                {tab.title}
              </Link>
            )
          })}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </div>
  )
}

