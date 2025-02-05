"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/dashboard/student/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/student/ui/select"
import { Button } from "@/components/dashboard/student/ui/button"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

interface Transaction {
  date: string
  status: "Success" | "Pending" | "Failed"
  package: string
  amount: string
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { date: "11/23/2025", status: "Success", package: "Premium Plan", amount: "$120" },
  { date: "10/15/2025", status: "Pending", package: "Basic Plan", amount: "$60" },
  { date: "09/10/2025", status: "Failed", package: "Standard Plan", amount: "$90" },
  { date: "08/05/2025", status: "Success", package: "Group Sessions", amount: "$40" },
]

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function TransactionList() {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>("")
  const router = useRouter()

  const clearMonths = () => {
    setSelectedMonths([])
  }

  const filteredTransactions = SAMPLE_TRANSACTIONS.filter((transaction) => {
    const monthMatch =
      selectedMonths.length === 0 || selectedMonths.includes(new Date(transaction.date).getMonth().toString())
    const statusMatch = !selectedStatus || transaction.status === selectedStatus
    return monthMatch && statusMatch
  })

  const handleTransactionClick = () => {
    router.push("student/transactiondetails")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Transaction History</h2>
        <p className="text-sm text-muted-foreground">View and filter your transaction history</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Select multiple value={selectedMonths} onValueChange={setSelectedMonths}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={selectedMonths.length ? `${selectedMonths.length} months` : "Filter by Month"}
              />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedMonths.length > 0 && (
            <button
              onClick={clearMonths}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Success">Success</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Transaction Status</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction, index) => (
              <TableRow key={index} className="hover:bg-slate-100 cursor-pointer" onClick={handleTransactionClick}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    className={`${
                      transaction.status === "Pending"
                        ? "bg-yellow-200 hover:bg-yellow-300"
                        : transaction.status === "Success"
                          ? "bg-[#0FFF0378] hover:bg-[#0FFF0399]"
                          : "bg-red-300 hover:bg-red-400"
                    } text-gray-700`}
                  >
                    {transaction.status}
                  </Button>
                </TableCell>
                <TableCell>{transaction.package}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

