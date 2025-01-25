'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from "@/lib/utils"
import cardinalConfig from '@/config'
import { ArrowLeft } from 'lucide-react'


export default function TicketDetailsLayout({
  children
}: {
  children: React.ReactNode
}) {
    
  const router = useRouter();

  const handleback = () => {
    router.push("/student/ticketlist");
    }

  return (
    <div className="flex flex-col w-full mx-auto px-4">
      <div className="border-b">
      <button onClick={handleback}>
        <ArrowLeft/>
      </button>
      
      </div>
      <div className="mt-6">
        {children}
      </div>
    </div>
  )
}

