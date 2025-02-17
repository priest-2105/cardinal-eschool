'use client'


import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import cardinalConfig from '@/config'

const tabs = [
  {
    title: 'Personal Information',
    href: cardinalConfig.routes.dashboard.student.studentinformation,
    exact: true
  },
  {
    title: 'Guardian Information',
    href: cardinalConfig.routes.dashboard.student.guardianinformation,
  },
  {
    title: 'Settings',
    href: cardinalConfig.routes.dashboard.student.studentprofilesettings,
  },
]

export default function ProfileLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-full mx-auto px-4 max-sm:w-[100%]">
      <div className="border-b mb-4 md:mb-6 overflow-x-auto">
        <div className="flex space-x-4 md:space-x-8">
       {/* <div className="border-b"> */}
        {/* <nav className="-mb-px flex space-x-8 max-sm:w-[100%] max-sm:items-end max-sm:overflow-x-scroll" aria-label="Tabs"> */}
          {tabs.map((tab) => {
            const isActive = tab.exact 
              ? pathname === tab.href
              : pathname?.startsWith(tab.href)

            return ( 
              <Link
                key={tab.href}
                href={tab.href} 
                className={cn(
                      "pb-2 text-sm font-medium transition-colors relative whitespace-nowrap",
                      isActive                        
                      ? "text-[#1BC2C2] border-b-2 border-[#1BC2C2]"
                        : "text-gray-500 hover:text-gray-700",
                    )}
              >
                {tab.title}
              </Link>
            )
          })}
          </div>
          </div>
        {/* </nav> */}
      {/* </div> */}
      <div className="mt-6">
        {children}
      </div>
    </div>
  )
}

