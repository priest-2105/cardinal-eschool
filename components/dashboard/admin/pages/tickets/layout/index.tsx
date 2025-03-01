'use client'


import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import cardinalConfig from '@/config'

const tabs = [
  {
    title: 'Ticket List',
    href: cardinalConfig.routes.dashboard.admin.adminticketlist,
    exact: true
  },
  {
    title: 'Reply Ticket',
    href: cardinalConfig.routes.dashboard.admin.adminreplyticket,
  },

]

export default function TicketLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-full mx-auto px-4">
      <div className=" ">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => {
            const isActive = tab.exact 
              ? pathname === tab.href
              : pathname?.startsWith(tab.href)

            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "py-4 px-1  text-sm font-medium transition-colors hover:border-gray-300 hover:text-gray-700",
                  isActive
                    ? "border-teal-500 text-teal-600"
                    : "border-transparent text-gray-500"
                )}
              >
                {tab.title}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-6">
        {children}
      </div>
    </div>
  )
}

