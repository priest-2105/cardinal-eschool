"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function TransactionDetailsPage() {

    const router = useRouter()

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
    useEffect(() => {
      const handleResize = () => {
        if (window.innerWidth < 1024) {
          setIsSidebarOpen(false)
        } else {
          setIsSidebarOpen(true)
        }
      }
  
      window.addEventListener("resize", handleResize)
      handleResize()
  
      return () => window.removeEventListener("resize", handleResize)
    }, [])

    const handleBack = () => {
    router.back()
    }

  return (
    <div className={`transition-all ease-in-out bg-white border border-gray-200 rounded-lg p-2 duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold">Transaction Details</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Transaction ID</p>
              <p className="font-medium">#TRX-123456</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">May 15, 2023</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium">$120.00</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-medium text-green-600">Successful</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-medium">Credit Card</p>
          <p className="text-sm text-gray-500">Visa ending in 4242</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transaction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Subtotal</p>
              <p className="font-medium">$100.00</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-gray-500">Tax</p>
              <p className="font-medium">$20.00</p>
            </div>
            <div className="flex justify-between border-t pt-2">
              <p className="text-sm font-bold">Total</p>
              <p className="font-bold">$120.00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center">
        <Button variant="outline" className="flex items-center">
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
      </div>
    </div>
    </div>
  )
}

