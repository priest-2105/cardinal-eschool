"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Mail, Phone } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Student {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
}

interface TransactionDetails {
  id: string
  date: string
  amount: string
  status: "Success" | "Pending" | "Failed"
  paymentMethod: string
  cardDetails?: string
  subtotal: string
  tax: string
  total: string
  package: string
  student: Student
}

// Sample transaction data
const TRANSACTION: TransactionDetails = {
  id: "TRX-123456",
  date: "May 15, 2023",
  amount: "$120.00",
  status: "Success",
  paymentMethod: "Credit Card",
  cardDetails: "Visa ending in 4242",
  subtotal: "$100.00",
  tax: "$20.00",
  total: "$120.00",
  package: "Premium Plan",
  student: {
    id: "STU001",
    name: "Alice Johnson",
    email: "alice@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
}

export default function TransactionDetailsPage() {
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transaction, _setTransaction] = useState<TransactionDetails>(TRANSACTION);

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
    <div
      className={`transition-all ease-in-out bg-white border border-gray-200 rounded-lg p-2 duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}
    >
      <div className="container mx-auto p-4">
        <div className="mb-6 flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">Transaction Details</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Transaction ID</p>
                    <p className="font-medium">{transaction.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{transaction.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="font-medium">{transaction.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Badge
                      className={`${
                        transaction.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                          : transaction.status === "Success"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                      }`}
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Package</p>
                    <p className="font-medium">{transaction.package}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{transaction.paymentMethod}</p>
                {transaction.cardDetails && <p className="text-sm text-gray-500">{transaction.cardDetails}</p>}
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
                    <p className="font-medium">{transaction.subtotal}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-500">Tax</p>
                    <p className="font-medium">{transaction.tax}</p>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <p className="text-sm font-bold">Total</p>
                    <p className="font-bold">{transaction.total}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Student Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-4">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarImage src={transaction.student.avatar} alt={transaction.student.name} />
                    <AvatarFallback>{transaction.student.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{transaction.student.name}</h3>
                  <p className="text-sm text-gray-500">{transaction.student.id}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-sm">{transaction.student.email}</p>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="text-sm">{transaction.student.phone}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    View Student Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

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

