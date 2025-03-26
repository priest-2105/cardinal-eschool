"use client"

import { useState, useMemo, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { fetchTransactionHistory } from "@/lib/api/student/payment/fetchTransactionHistory"
import { useAppSelector } from "@/lib/hooks"
import { Search, X } from "lucide-react"
import { formatDate } from "@/utils/dateformat"

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
];

const YEARS = [2023, 2024, 2025]; 

interface Transaction {
  id: number;
  subscription_plan_id: number;
  subscription_plan_name: string;
  amount: string;
  quantity: number;
  discount: string;
  transaction_ref: string;
  status: string;
  coupon_code: string | null;
  created_at: string;
}

export default function TransactionList() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedMonths, setSelectedMonths] = useState<string>("all")
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [loading, setLoading] = useState(true)
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

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.created_at)
      const monthMatch = selectedMonths === "all" || transactionDate.getMonth().toString() === selectedMonths
      const yearMatch = selectedYear === "all" || transactionDate.getFullYear().toString() === selectedYear
      const statusMatch = selectedStatus === "all" || transaction.status.toLowerCase() === selectedStatus.toLowerCase()
      
      const searchLower = searchQuery.toLowerCase()
      const searchMatch = 
        searchQuery === "" ||
        transaction.subscription_plan_name.toLowerCase().includes(searchLower) ||
        transaction.transaction_ref.toLowerCase().includes(searchLower)

      return monthMatch && yearMatch && statusMatch && searchMatch
    })
  }, [transactions, selectedMonths, selectedYear, selectedStatus, searchQuery])

  const clearMonths = () => setSelectedMonths("all");
  const clearYear = () => setSelectedYear("all");

  if (loading) {
    return <div>Loading transactions...</div>
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
              {YEARS.map((year) => (
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.transaction_ref}</TableCell>
                <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{transaction.subscription_plan_name}</TableCell>
                <TableCell>${transaction.amount}</TableCell>
                <TableCell>
                  <Badge
                    className={`${
                      transaction.status.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        : transaction.status.toLowerCase() === "success"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                    }`}
                  >
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell>{transaction.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

