'use client'


export default function TicketLayout({
  children
}: {
  children: React.ReactNode
}) {

  return (
    <div className="flex flex-col w-full mx-auto px-4">
      <div className=" ">
      </div>
      <div className="mt-6">
        {children}
      </div>
    </div>
  )
}

