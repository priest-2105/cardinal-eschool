"use client"

import type React from "react"

import { useState, useMemo, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { fetchTransactionHistory } from "@/lib/api/student/payment/fetchTransactionHistory"
import { useAppSelector } from "@/lib/hooks"
import { Search, X, MoreHorizontal } from "lucide-react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown"
import { getTransactionDetails } from "@/lib/api/student/payment/requerypayment"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

// Define the Transaction type
interface Transaction {
  id: number
  transaction_ref: string
  created_at: string
  subscription_plan_name: string
  amount: number
  status: string
  quantity: number
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

function parseTransactionDate(dateString: string) {
  const monthIndex = MONTHS.findIndex((month) => dateString.startsWith(month))
  const year = Number.parseInt(dateString.match(/\d{4}/)?.[0] || "0")
  return { month: monthIndex, year }
}

export default function TransactionList() {
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedMonths, setSelectedMonths] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isRequeryModalOpen, setIsRequeryModalOpen] = useState(false)
  const [selectedTransactionRef, setSelectedTransactionRef] = useState<string>("")
  const authState = useAppSelector((state) => state.auth)

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!authState?.token) return

      try {
        const response = await fetchTransactionHistory(authState.token)
        setTransactions(response.data.data)
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [authState?.token])

  const availableYears = useMemo(() => {
    const years = new Set(transactions.map((t) => parseTransactionDate(t.created_at).year))
    return Array.from(years).sort((a, b) => b - a)
  }, [transactions])

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const { month, year } = parseTransactionDate(transaction.created_at)

      const monthMatch = selectedMonths === "all" || month.toString() === selectedMonths

      const yearMatch = selectedYear === "all" || year.toString() === selectedYear

      const statusMatch = selectedStatus === "all" || transaction.status.toLowerCase() === selectedStatus.toLowerCase()

      const searchLower = searchQuery.toLowerCase()
      const searchMatch =
        searchQuery === "" ||
        transaction.subscription_plan_name.toLowerCase().includes(searchLower) ||
        transaction.transaction_ref.toLowerCase().includes(searchLower)

      return monthMatch && yearMatch && statusMatch && searchMatch
    })
  }, [transactions, selectedMonths, selectedYear, selectedStatus, searchQuery])

  const clearMonths = () => setSelectedMonths("all")
  const clearYear = () => setSelectedYear("all")

  const handleTransactionClick = (transactionRef: string) => {
    router.push(`/student/transaction/${transactionRef}`)
  }

  const handleRequeryPayment = async (transactionRef: string) => {
    if (!authState?.token) return
    try {
      const response = await getTransactionDetails(authState.token, transactionRef)
      const updatedResponse = await fetchTransactionHistory(authState.token)
      setTransactions(updatedResponse.data.data)
      setIsRequeryModalOpen(false)
    } catch (error) {
      console.error("Failed to requery payment:", error)
    }
  }

  const openRequeryModal = (transactionRef: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedTransactionRef(transactionRef)
    setIsRequeryModalOpen(true)
  }

  if (loading) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-gray-500">Loading</p>
      </div>
    )
  }

  if (!transactions) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <p className="text-gray-500">No Transactions</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-semibold">Transaction History</h2>
        <p className="text-sm text-muted-foreground">View and filter your transaction history</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
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
              {availableYears.map((year) => (
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
            <SelectItem value="Success">Success</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by student name, ID or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction Ref</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Options</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleTransactionClick(transaction.transaction_ref)}
              >
                <TableCell>{transaction.transaction_ref}</TableCell>
                <TableCell>{transaction.created_at}</TableCell>
                <TableCell>{transaction.subscription_plan_name}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>
                  <Badge
                    className={`
                    ${transaction.status.toLowerCase() === "success" && "bg-[#1BC2C2] text-[#1BC2C2]-300 hover:bg-[#1BC2C2]-800"}
                    ${transaction.status.toLowerCase() === "pending" && "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"} 
                    ${transaction.status.toLowerCase() === "failed" && "bg-red-100 text-red-800 hover:bg-red-100"}
                    `}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.quantity}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-white">
                      {/* Only show Requery Payment for pending status, not for failed */}
                      {transaction.status.toLowerCase() === "pending" && (
                        <DropdownMenuItem onClick={(e) => openRequeryModal(transaction.transaction_ref, e)}>
                          Requery Payment
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleTransactionClick(transaction.transaction_ref)
                        }}
                      >
                        View Details
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AlertDialog open={isRequeryModalOpen} onOpenChange={setIsRequeryModalOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Requery Payment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to requery this payment? This will check the current status of your transaction.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsRequeryModalOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleRequeryPayment(selectedTransactionRef)}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

