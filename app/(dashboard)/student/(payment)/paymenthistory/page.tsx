"use client"

import PaymentLayout from "@/components/dashboard/student/pages/payment/layout"
import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/dashboard/student/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/student/ui/select"
import { Button } from "@/components/dashboard/student/ui/button"
import { useRouter } from "next/navigation"

interface Transaction {
  date: string
  status: string
  package: string
  amount: string
  grade: string
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { date: "2025/11/23", status: "Success", package: "Premium Plan", amount: "$120", grade: "A" },
  { date: "2025/10/15", status: "Pending", package: "Basic Plan", amount: "$60", grade: "B" },
  { date: "2025/09/10", status: "Failed", package: "Standard Plan", amount: "$90", grade: "C" },
  { date: "2025/08/05", status: "Success", package: "Group Sessions", amount: "$40", grade: "A" },
]

export default function StudentPaymentHistory() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const router = useRouter()

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

  const filteredTransactions = selectedMonth
    ? SAMPLE_TRANSACTIONS.filter(transaction => new Date(transaction.date).getMonth() === parseInt(selectedMonth))
    : SAMPLE_TRANSACTIONS

  const handleStatusClick = (status: string) => {
    router.push(`/dashboard/student/transactiondetails?status=${status}`)
  }

  return (
    <div className={`transition-all ease-in-out duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
      <PaymentLayout>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Transaction History</h2>
            <p className="text-sm text-muted-foreground">View and filter your transaction history</p>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">January</SelectItem>
                  <SelectItem value="1">February</SelectItem>
                  <SelectItem value="2">March</SelectItem>
                  <SelectItem value="3">April</SelectItem>
                  <SelectItem value="4">May</SelectItem>
                  <SelectItem value="5">June</SelectItem>
                  <SelectItem value="6">July</SelectItem>
                  <SelectItem value="7">August</SelectItem>
                  <SelectItem value="8">September</SelectItem>
                  <SelectItem value="9">October</SelectItem>
                  <SelectItem value="10">November</SelectItem>
                  <SelectItem value="11">December</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction Status</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Grade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>{transaction.date}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${
                          transaction.status === "Pending"
                            ? "bg-yellow-500"
                            : transaction.status === "Success"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } text-white`}
                        onClick={() => handleStatusClick(transaction.status)}
                      >
                        {transaction.status}
                      </Button>
                    </TableCell>
                    <TableCell>{transaction.package}</TableCell>
                    <TableCell>{transaction.amount}</TableCell>
                    <TableCell>{transaction.grade}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </PaymentLayout>
    </div>
  )
}


