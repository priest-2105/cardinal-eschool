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
import { requeryPayment } from "@/lib/api/student/payment/requerypayment"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"


interface Transaction {
  id: number
  transaction_ref: string
  created_at: string
  subscription_plan_name: string
  amount: number
  status: string
  quantity: number
}

interface ApiTransaction {
  id: number;
  transaction_ref: string;
  created_at: string;
  subscription_plan_name: string;
  amount: string; 
  status: string;
  quantity: number;
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
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [selectedMonths, setSelectedMonths] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [isRequeryModalOpen, setIsRequeryModalOpen] = useState(false)
  const [selectedTransactionRef, setSelectedTransactionRef] = useState<string>("")
  const authState = useAppSelector((state) => state.auth)
  const [isRequeryingPayment, setIsRequeryingPayment] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!authState?.token) return

      try {
        const response = await fetchTransactionHistory(authState.token)
        setTransactions(
          response.data.data.map((transaction: ApiTransaction) => ({
            ...transaction,
            amount: parseFloat(transaction.amount),
          }))
        )
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

  const handleTransactionClick = (transaction: Transaction) => {
    if (window.innerWidth >= 1024) {
      router.push(`/student/transaction/${transaction.transaction_ref}`);
    } else {
      setSelectedTransaction(transaction);
      setIsTransactionModalOpen(true);
    }
  };

  const handleRequeryPayment = async (transactionId: string) => {
    setIsRequeryingPayment(true)
    try {
      if (!authState?.token) {
        throw new Error("Authentication token is missing");
      }
      const response = await requeryPayment(authState.token, transactionId)
      setTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction.id === Number(transactionId)
            ? { ...transaction, status: response.data.status }
            : transaction
        )
      )
      
      setAlert({
        type: "success",
        message: "Payment status updated successfully"
      })
      
      setIsRequeryModalOpen(false)
    } catch (error) {
      setAlert({
        type: "error",
        message: error instanceof Error ? error.message : "Failed to requery payment"
      })
    } finally {
      setIsRequeryingPayment(false)
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
      {alert && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
            alert.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {alert.message}
        </div>
      )}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
        <h2 className="text-xl sm:text-2xl font-semibold">Transaction History</h2>
        <p className="text-sm text-muted-foreground">View and filter your transaction history</p>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4">
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
            <SelectItem value="successful">Success</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
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

      {/* Filter Button for Mobile/Tablet */}
      {window.innerWidth < 1024 && (
        <Button
          className="w-full sm:w-auto"
          onClick={() => setIsFilterModalOpen(true)}
        >
          Filters
        </Button>
      )}

      {/* Filter Modal */}
      <Dialog open={isFilterModalOpen} onOpenChange={setIsFilterModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative w-full">
              <Select value={selectedMonths} onValueChange={setSelectedMonths}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      selectedMonths.includes("all")
                        ? "All Months"
                        : `${selectedMonths.length} months`
                    }
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
            </div>

            <div className="relative w-full">
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      selectedYear === "all" ? "All Years" : selectedYear
                    }
                  />
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
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    selectedStatus === "all" ? "All Status" : selectedStatus
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="successful">Success</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by student name, ID or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              className="w-full"
              onClick={() => setIsFilterModalOpen(false)}
            >
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {window.innerWidth >= 1024 && (
                <>
                  <TableHead>Transaction Ref</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Options</TableHead>
                </>
              )}
              {window.innerWidth >= 768 && window.innerWidth < 1024 && (
                <>
                  <TableHead>Transaction Ref</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Options</TableHead>
                </>
              )}
              {window.innerWidth < 768 && (
                <>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow
                key={transaction.id}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleTransactionClick(transaction)}
              >
                {window.innerWidth >= 1024 && (
                  <>
                    <TableCell>{transaction.transaction_ref}</TableCell>
                    <TableCell>{transaction.created_at}</TableCell>
                    <TableCell>{transaction.subscription_plan_name}</TableCell>
                    <TableCell>${transaction.amount}</TableCell>
                    <TableCell>
                      <Badge
                        className={`
                        ${transaction.status.toLowerCase() === "successful" && "bg-[#1BC2C2] text-[#1BC2C2]-300 hover:bg-[#1BC2C2]-800"}
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
                              handleTransactionClick(transaction)
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </>
                )}
                {window.innerWidth >= 768 && window.innerWidth < 1024 && (
                  <>
                    <TableCell>{transaction.transaction_ref}</TableCell>
                    <TableCell>{transaction.created_at}</TableCell>
                    <TableCell>{transaction.subscription_plan_name}</TableCell>
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
                              handleTransactionClick(transaction)
                            }}
                          >
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </>
                )}
                {window.innerWidth < 768 && (
                  <>
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
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog 
        open={isRequeryModalOpen} 
        onOpenChange={(open) => {
          if (!isRequeryingPayment) {
            setIsRequeryModalOpen(open)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Requery Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to requery this payment? This will check the current status of your payment.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => !isRequeryingPayment && setIsRequeryModalOpen(false)}
              disabled={isRequeryingPayment}
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedTransactionRef && handleRequeryPayment(selectedTransactionRef)}
              disabled={isRequeryingPayment}
            >
              {isRequeryingPayment ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Checking Payment...
                </span>
              ) : (
                "Confirm Requery"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Transaction Details Modal */}
      <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
        <DialogContent className="rounded-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <p className="font-medium">Transaction Ref:</p>
            <p>{selectedTransaction?.transaction_ref}</p>
            <p className="font-medium">Date:</p>
            <p>{selectedTransaction?.created_at}</p>
            <p className="font-medium">Plan:</p>
            <p>{selectedTransaction?.subscription_plan_name}</p>
            <p className="font-medium">Amount:</p>
            <p>${selectedTransaction?.amount}</p>
            <p className="font-medium">Status:</p>
            <p>{selectedTransaction?.status}</p>
            <p className="font-medium">Quantity:</p>
            <p>{selectedTransaction?.quantity}</p>
          </div>
          <DialogFooter>
            <div  className="flex justify-between">
            <Button className="w-40" onClick={() => handleRequeryPayment(selectedTransaction?.id.toString() || "")}>
              Requery Payment
            </Button>
            <Button className="w-40"  onClick={() => router.push(`/student/transaction/${selectedTransaction?.transaction_ref}`)}>
              View Details
            </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

