'use client'

import { useRouter } from 'next/navigation' 
import { ArrowLeft } from 'lucide-react'


export default function TicketDetailsLayout({
  children
}: {
  children: React.ReactNode
}) {
    
  const router = useRouter();

  const handleback = () => {
    router.push("/tutor/ticketlist");
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

