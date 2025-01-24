"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/dashboard/student/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/dashboard/student/ui/select"
import { Button } from "@/components/dashboard/student/ui/button"
import { useRouter } from "next/navigation"

interface Transaction {
  date: string
  status: string
  package: string
  amount: string 
}

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { date: "2025/11/23", status: "Success", package: "Premium Plan", amount: "$120",},
  { date: "2025/10/15", status: "Pending", package: "Basic Plan", amount: "$60",},
  { date: "2025/09/10", status: "Failed", package: "Standard Plan", amount: "$90",},
  { date: "2025/08/05", status: "Success", package: "Group Sessions", amount: "$40",},
]

export default function TransactionList() {
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const router = useRouter();

  const filteredTransactions = selectedMonths.length
    ? SAMPLE_TRANSACTIONS.filter(transaction => selectedMonths.includes(new Date(transaction.date).getMonth().toString()))
    : SAMPLE_TRANSACTIONS

  const handleTransactionClick = () => {
    router.push(`student/transactiondetails`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Transaction History</h2>
        <p className="text-sm text-muted-foreground">View and filter your transaction history</p>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Select multiple  value={selectedMonths} onValueChange={setSelectedMonths}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={selectedMonths.length ? `${selectedMonths.length} selected` : "Filter by Month"} />
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((transaction, index) => (
              <TableRow key={index} className="hover:bg-slate-100 cursor-pointer"
              onClick={() => handleTransactionClick}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                  <Button 
                    size="sm"
                    className={`${
                      transaction.status === "Pending"
                        ? "bg-yellow-200"
                        : transaction.status === "Success"
                        ? "bg-[#0FFF0378]"
                        : "bg-red-300"
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
