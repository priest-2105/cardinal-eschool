"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/dashboard/admin/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/admin/ui/select"
import { Button } from "@/components/dashboard/admin/ui/button"
import { useRouter } from "next/navigation"
import { X } from "lucide-react"

interface Transaction {
  id: number
  amount: string
  status: string
  quantity: number
  transaction_ref: string
  tx_date: string
  subscription_plan: string
  flutterwave_txn_id: string | null
  coupon: string | null
  coupon_discount: string | null
}

interface Props {
  transactions?: Transaction[]
}

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

export default function TransactionList({ transactions = [] }: Props) {
  const [selectedMonths, setSelectedMonths] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const router = useRouter()

  const clearMonths = () => {
    setSelectedMonths("all")
  }

  const clearYear = () => {
    setSelectedYear("all")
  }

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.tx_date)
      const monthMatch =
        selectedMonths.includes("all") ||
        transactionDate.getMonth().toString() === selectedMonths

      const yearMatch =
        selectedYear === "all" ||
        transactionDate.getFullYear().toString() === selectedYear

      const statusMatch =
        selectedStatus === "all" ||
        transaction.status.toLowerCase() === selectedStatus.toLowerCase()

      return monthMatch && yearMatch && statusMatch
    })
  }, [transactions, selectedMonths, selectedYear, selectedStatus])

  const handleTransactionClick = () => {
    router.push("/admin/transactiondetails")
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-semibold">Transaction History</h2>
        <p className="text-sm text-muted-foreground">View and filter your transaction history</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="relative w-full sm:w-auto">
          <Select value={selectedMonths} onValueChange={setSelectedMonths}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue
                placeholder={selectedMonths.includes("all") ? "All Months" : `${selectedMonths.length} months`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {MONTHS.map((month, index) => (
                <SelectItem key={month} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!selectedMonths.includes("all") && (
            <button
              onClick={clearMonths}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-auto">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder={selectedYear === "all" ? "All Years" : selectedYear} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {Array.from(new Set(transactions.map((t) => new Date(t.tx_date).getFullYear()))).sort((a, b) => b - a).map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedYear !== "all" && (
            <button
              onClick={clearYear}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder={selectedStatus === "all" ? "All Status" : selectedStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Successful">Successful</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-muted/50 font-semibold">Date</TableHead>
                    <TableHead className="bg-muted/50 font-semibold">Transaction Status</TableHead>
                    <TableHead className="bg-muted/50 font-semibold">Package</TableHead>
                    <TableHead className="bg-muted/50 font-semibold">Amount</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>
            <div className="overflow-y-auto max-h-[calc(85vh-300px)] custom-scrollbar">
              <Table>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="hover:bg-slate-100 cursor-pointer"
                      onClick={handleTransactionClick}
                    >
                      <TableCell className="font-medium">{transaction.tx_date}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className={`${
                            transaction.status.toLowerCase() === "pending"
                              ? "bg-yellow-200 hover:bg-yellow-300"
                              : transaction.status.toLowerCase() === "successful"
                                ? "bg-[#0FFF0378] hover:bg-[#0FFF0399]"
                                : "bg-red-300 hover:bg-red-400"
                          } text-gray-700`}
                        >
                          {transaction.status}
                        </Button>
                      </TableCell>
                      <TableCell>{transaction.subscription_plan}</TableCell>
                      <TableCell>${transaction.amount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

